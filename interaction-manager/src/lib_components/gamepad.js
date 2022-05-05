import mappings from '../utils/gamepad-mappings';
import { getGamepadAction, getGamepadActionIndex } from '../utils/global-object-utility-functions';
import Actions from './Actions';

const AXIS_THRESHOLD = 0.9;
/**
 * Gamepad class that handles all gamepad interactions
 */
class Gamepad {
    // eslint-disable-next-line require-jsdoc
    constructor() {
        this.mappings = mappings;
        this.pollingStarted = false;
        this.gamepadEnabled = false;

        this.onGamepadConnected = this.onGamepadConnected.bind(this);
        this.sanitizeAction = this.sanitizeAction.bind(this);
    }

    /**
     * Allow gamepads to be connected
     * @param {boolean} isEnabled
     */
    set enabled(isEnabled) {
        this.gamepadEnabled = isEnabled;
        this.gamepadEnabled ? this.init() : this.deinit();
    }

    /**
     * Attaches the event listeners for the gamepads
     * @private
     */
    init() {
        window.addEventListener('gamepadconnected', this.onGamepadConnected);
    }

    /**
     * Removes any attached event listeners for gamepads
     * @private
     */
    deinit() {
        window.removeEventListener('gamepadconnected', this.onGamepadConnected);
    }

    /**
     * Starts polling on the first connected
     * @returns {void}
     * @private
     */
    onGamepadConnected() {
        if (this.pollingStarted) return;

        this.pollingStarted = true;
        this.startPolling();
    }

    /**
     *
     * @param {Object} options
     * @param {string} options.actions Action to trigger the callback. Can be name of button or joystick
     * @param {function} options.callback Callback to trigger on the set action
     * @param {number} options.gamepadNumber The number of the gamepad that you want to trigger the callback on. Use -1 for all gamepads
     * @returns {void}
     */
    on(options) {
        options.actions = options.actions.map(this.sanitizeAction);

        const isAxisAlias = this.mappings.axisAliases.some(alias => options.actions.includes(alias));

        if (options.actions.length > 1 && isAxisAlias) return console.error(`You can't use an axis action in a combination with a button action`);

        if (getGamepadAction(options.actions)) {
            return console.error('You have already registered a callback for this action. If you want to overwrite it, remove it first with .off([actions])');
        }

        _IM.gamepadFunctions.push(options);
    }

    /**
     * Removes registered actions
     * @param {Array} actions Array containing the action you want to remove
     * @returns {void}
     */
    off(actions) {
        const actionsIndex = getGamepadActionIndex(actions);

        if (actionsIndex === -1) return console.error('You are trying to remove a non-existent action!');

        _IM.keyboardFunctions.splice(actionsIndex, 1);
    }

    /**
     * Loop that handles button presses and axis movement
     * @returns {void}
     * @private
     */
    startPolling() {
        const gamepads = navigator.getGamepads();

        if (gamepads.length === 0) {
            this.pollingStarted = false;
            return;
        }

        gamepads.forEach((gamepad, index) => {
            if (!gamepad) return;
            this.handleButtons(gamepad.buttons, index);
            this.handleJoysticks(gamepad.axes);
        });

        requestAnimationFrame(() => {
            this.startPolling();
        });
    }

    /**
     *
     * @param {Object[]} buttons
     * @private
     */
    handleButtons(buttons) {
        const pressedButtons = buttons.reduce(
            (acc, el, index) => {
                if (el.pressed) {
                    acc.buttonIndexes.push(index);
                    acc.buttons.push(el);
                }
                return acc;
            },
            { buttonIndexes: [], buttons: [] }
        );

        const gamepadAction = getGamepadAction(pressedButtons.buttonIndexes);

        if (!gamepadAction) return;

        this.executeCallback(gamepadAction, pressedButtons.buttons);
    }

    /**
     *
     * @param {number[]} axes
     * @private
     */
    // eslint-disable-next-line max-lines-per-function, require-jsdoc
    handleJoysticks(axes) {
        const joystickActions = this.getJoystickActions();

        // eslint-disable-next-line max-lines-per-function
        joystickActions.forEach((jAction) => {
            switch (jAction.actions[0]) {
                case 'left.joystick':
                    return this.executeCallback(jAction, [axes[0], axes[1]]);
                case 'right.joystick':
                    return this.executeCallback(jAction, [axes[2], axes[3]]);
                case 'left.joystick.down':
                    if (axes[1] > AXIS_THRESHOLD) return this.executeCallback(jAction, [axes[0], axes[1]]);
                    break;
                case 'left.joystick.up':
                    if (axes[1] < -AXIS_THRESHOLD) return this.executeCallback(jAction, [axes[0], axes[1]]);
                    break;
                case 'left.joystick.left':
                    if (axes[0] < -AXIS_THRESHOLD) return this.executeCallback(jAction, [axes[0], axes[1]]);
                    break;
                case 'left.joystick.right':
                    if (axes[0] > AXIS_THRESHOLD) return this.executeCallback(jAction, [axes[0], axes[1]]);
                    break;
                case 'right.joystick.down':
                    if (axes[3] > AXIS_THRESHOLD) return this.executeCallback(jAction, [axes[2], axes[3]]);
                    break;
                case 'right.joystick.up':
                    if (axes[3] < -AXIS_THRESHOLD) return this.executeCallback(jAction, [axes[2], axes[3]]);
                    break;
                case 'right.joystick.left':
                    if (axes[2] < -AXIS_THRESHOLD) return this.executeCallback(jAction, [axes[2], axes[3]]);
                    break;
                case 'right.joystick.right':
                    if (axes[2] > AXIS_THRESHOLD) return this.executeCallback(jAction, [axes[2], axes[3]]);
                    break;
            }
        });
    }

    /**
     * Convert button aliases to indexes or keep joystick aliases
     * @param {string | number} action Actions to convert
     * @returns {string | number} Converted action strings
     * @private
     */
    sanitizeAction(action) {
        if (typeof action === 'number') return action;

        if (this.mappings.axisAliases.includes(action.toLowerCase())) return action.toLowerCase();

        if (typeof action === 'string') {
            const key = this.mappings.aliases[action.toLowerCase()];
            if (!key) return console.error(`You have entered a non-supported button alias ${action}`);
            return this.mappings[key];
        }

        return action;
    }

    /**
     * Gets all registered Joystick actions
     * @returns {Object[]} Joystick actions
     * @private
     */
    getJoystickActions() {
        return _IM.gamepadFunctions.filter(gpFunc => this.mappings.axisAliases.includes(gpFunc.actions[0]));
    }

    /**
     * Executes the callback from the registered action
     * @param {Object} action
     * @param {any} value
     * @returns {void}
     * @private
     */
    executeCallback(action, value) {
        if (typeof action.callback === 'string') return Actions.execute(action.callback, value);

        action.callback(value);
    }
}

export default new Gamepad();
