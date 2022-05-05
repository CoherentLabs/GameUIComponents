import IM from '../utils/global-object';
import mappings from '../utils/keyboard-mappings';
import Actions from './actions';
/**
 * Keyboard class that handles all keyboard interactions
 */
class Keyboard {
    /* eslint-disable-next-line require-jsdoc */
    constructor() {
        this.mappings = mappings;
        this.eventListenerAttached = false;

        this.keysPressed = new Set();

        this.onKeyDown = this.onKeyDown.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
    }

    /**
     * @param {Object} options
     * @param {string[]} options.keys - Array of keys you want to use, allows only combination of modifier and regular keys
     * @param {function | string} options.callback - Function or action to be executed on the key combination
     * @param {('press'|'hold'|'lift')} options.type - Type of key action you want to use.
     * @returns {void}
     */
    on(options) {
        // Remove duplicate keys. For example if someone write keys: ['A', 'A'] we'll treat it like ['A']
        options.keys = [...new Set(options.keys.map(key => key.toUpperCase()))];

        if (!this.eventListenerAttached) {
            document.addEventListener('keydown', this.onKeyDown);
            document.addEventListener('keyup', this.onKeyUp);
            this.eventListenerAttached = true;
        }

        const registeredKeys = IM.getKeys(options.keys);

        if (registeredKeys.length > 0 && registeredKeys.some(key => key.type === options.type)) {
            return console.error('You are trying to overwrite an existing key combination! To do that, first remove it with .off([keys]) then add it again');
        }

        if (options.type === 'lift' && options.keys.length > 1) return console.error('You can only have a single key trigger an action on lift');

        _IM.keyboardFunctions.push(options);
    }

    /**
     *
     * @param {string[]} keys - Key combination you want to remove from the listener
     * @returns {void}
     */
    off(keys) {
        const keyCombinationIndex = IM.getKeysIndex(keys);

        if (keyCombinationIndex === -1) return console.error('You are trying to remove a non-existent key combination!');

        _IM.keyboardFunctions.splice(keyCombinationIndex, 1);

        if (_IM.keyboardFunctions.length === 0) {
            document.removeEventListener('keydown', this.onKeyDown);
            document.removeEventListener('keyup', this.onKeyUp);
            this.eventListenerAttached = false;
        }
    }

    /**
     * Handles when key is pressed
     * @param {KeyboardEvent} event
     * @returns {void}
     * @private
     */
    onKeyDown(event) {
        const keyPressed = this.keyCodeToString(event.keyCode);
        this.keysPressed.add(keyPressed);

        const registeredKeys = IM.getKeys([...this.keysPressed]);
        if (registeredKeys.length === 0) return;

        registeredKeys.forEach((key) => {
            if (key.type === 'press' && event.repeat) return;

            if (key.type !== 'press' && key.type !== 'hold') return;

            if (key.type === 'hold' && !event.repeat) return;

            this.executeCallback(event, key);
        });
    }

    /**
     * Handles when key is released
     * @param {KeyboardEvent} event
     * @returns {void}
     * @private
     */
    onKeyUp(event) {
        const keyPressed = this.keyCodeToString(event.keyCode);
        this.keysPressed.delete(keyPressed);

        const registeredKeys = IM.getKeys(keyPressed);
        if (registeredKeys.length === 0) return;

        const registeredKey = registeredKeys.find(key => key.type === 'lift');
        if (!registeredKey) return;

        this.executeCallback(event, registeredKey);
    }

    /**
     * Convert keyCode to string representing key
     * @param {number} code
     * @returns {string}
     * @private
     */
    keyCodeToString(code) {
        return Object.keys(this.mappings).find(key => this.mappings[key] === code);
    }

    /**
     * Executes the registered callbacks. Has to be invoked from the onKeyDown and onKeyUp functions
     * @param {KeyboardEvent} event
     * @param {Object} registeredKeys
     * @param {string[]} registeredKeys.keys - Array of keys you want to use, allows only combination of modifier and regular keys
     * @param {function | string} registeredKeys.callback - Function or action to be executed on the key combination
     * @param {('press'|'hold'|'lift')} registeredKeys.type - Type of key action you want to use.
     * @return {void}
     * @private
     */
    executeCallback(event, registeredKeys) {
        if (typeof registeredKeys.callback === 'string') return Actions.execute(registeredKeys.callback, event);

        registeredKeys.callback(event);
    }
}

export default new Keyboard();
