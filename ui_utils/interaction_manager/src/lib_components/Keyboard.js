import { getKeys, getKeysIndex, getRegisteredKey } from '../utils/global-object-utility-functions';
import mappings from '../utils/keyboard-mappings';
import { getModifiers, isCombinationCorrect } from '../utils/utility-functions';
/**
 * Keyboard class that handles all keyboard interactions
 */
class Keyboard {
    /* eslint-disable-next-line require-jsdoc */
    constructor() {
        this.mappings = mappings;
        this.eventListenerAttached = false;

        this.onKeyDown = this.onKeyDown.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
    }

    /**
     * @param {Object} options
     * @param {string[]} options.keys Array of keys you want to use, allows only combination of modifier and regular keys
     * @param {function | string} options.callback Function or action to be executed on the key combination
     * @param {('press'|'hold'|'lift')} options.type Type of key action you want to use.
     * @returns {void}
     */
    on(options) {
        options.keys = options.keys.map(key => key.toUpperCase());

        if (!this.eventListenerAttached) {
            document.addEventListener('keydown', this.onKeyDown);
            document.addEventListener('keyup', this.onKeyUp);
            this.eventListenerAttached = true;
        }

        if (options.keys.length > 1 && !isCombinationCorrect(options.keys)) {
            return console.error('You need to provide a correct key combination! Correct key combinations consist of modifier keys (CTRL, SHIFT, ALT) and a key.');
        }

        if (getKeys(options.keys)) {
            return console.error('You are trying to overwrite an existing key combination! To do that, first remove it with .off([keys]) then add it again');
        }

        _IM.keyboardFunctions.push(options);
    }

    /**
     *
     * @param {string[]} keys Key combination you want to remove from the listener
     * @returns {void}
     */
    off(keys) {
        const keyCombinationIndex = getKeysIndex(keys);

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

        const registeredKeys = getRegisteredKey(keyPressed);

        if (!registeredKeys) return;

        if (registeredKeys.type !== 'press' && registeredKeys.type !== 'hold') return;

        if (this.mappings.MODIFIERS.includes(keyPressed) && registeredKeys.keys.length > 1) return;

        if (registeredKeys.type === 'hold' && !event.repeat) return;

        this.executeCallback(event, registeredKeys, { CTRL: event.ctrlKey, ALT: event.altKey, SHIFT: event.shiftKey });
    }

    /**
     * Handles when key is released
     * @param {KeyboardEvent} event
     * @returns {void}
     * @private
     */
    onKeyUp(event) {
        const keyPressed = this.keyCodeToString(event.keyCode);

        const registeredKeys = getRegisteredKey(keyPressed);

        if (!registeredKeys || registeredKeys.type !== 'lift') return;

        this.executeCallback(event, registeredKeys, { CTRL: event.ctrlKey, ALT: event.altKey, SHIFT: event.shiftKey });
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
     * @param {string[]} registeredKeys.keys Array of keys you want to use, allows only combination of modifier and regular keys
     * @param {function | string} registeredKeys.callback Function or action to be executed on the key combination
     * @param {('press'|'hold'|'lift')} registeredKeys.type Type of key action you want to use.
     * @param {Object} modifiers
     * @param {boolean} modifiers.CTRL If ctrl key is pressed
     * @param {boolean} modifiers.ALT If alt key is pressed
     * @param {boolean} modifiers.SHIFT If shift key is pressed
     * @private
     */
    executeCallback(event, registeredKeys, modifiers) {
        const regModifiers = getModifiers(registeredKeys.keys);

        const modifierPressed = JSON.stringify(regModifiers) === JSON.stringify(modifiers);

        if (modifierPressed) registeredKeys.callback(event);
    }
}

export default new Keyboard();
