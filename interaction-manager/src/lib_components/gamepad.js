/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import mappings from '../utils/gamepad-mappings';
import IM from '../utils/global-object';
import Actions from './actions';

const AXIS_THRESHOLD = 0.9;
const ACTION_TYPES = ['press', 'hold'];

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

        this.pollingInterval = 200;

        this._pressedAction = null;
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
     * @param {string[] | number[]} options.actions - Action to trigger the callback. Can be name of button or joystick
     * @param {'press' | 'hold'} options.type - The type of action to trigger the callback. The available options are hold and press.
     * @param {function} options.callback - Callback to trigger on the set action
     * @param {number} options.gamepadNumber - The number of the gamepad that you want to trigger the callback on. Use -1 for all gamepads
     * @returns {void}
     */
    on(options) {
        options.actions = options.actions.map(this.sanitizeAction);

        const isAxisAlias = this.mappings.axisAliases.some(alias => options.actions.includes(alias));

        if (!options.type || !ACTION_TYPES.includes(options.type)) options.type = 'hold';

        if (options.type === 'press' && isAxisAlias) {
            return console.error(`You can't use an axis action with a 'press' type!`);
        }

        if (options.actions.length > 1 && isAxisAlias) {
            return console.error(`You can't use an axis action in a combination with a button action`);
        }

        if (IM.getGamepadAction(options)) {
            return console.error(
                'You have already registered a callback for this action. If you want to overwrite it, remove it first with .off([actions])'
            );
        }

        _IM.gamepadFunctions.push(options);
    }

    /**
     * Removes registered actions
     * @param {Array} actions - Array containing the action you want to remove
     * @returns {void}
     */
    off(actions) {
        const actionsIndex = IM.getGamepadActionIndex(actions.map(this.sanitizeAction));

        if (actionsIndex === -1) return console.error('You are trying to remove a non-existent action!');

        _IM.gamepadFunctions.splice(actionsIndex, 1);
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

        setTimeout(this.startPolling.bind(this), this.pollingInterval);
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

        const gamepadActions = IM.getGamepadActions(pressedButtons.buttonIndexes);
        if (!gamepadActions.length === 0) return;

        if (this._pressedAction) {
            if (!gamepadActions.includes(this._pressedAction)) {
                this.executeCallback(this._pressedAction, this._pressedAction.actions);
            }
            this._pressedAction = null;
        }

        gamepadActions.forEach((gamepadAction) => {
            if (gamepadAction.type === 'press') {
                this._pressedAction = gamepadAction;
                return;
            }

            this.executeCallback(gamepadAction, pressedButtons.buttons);
        });
    }

    /* eslint-disable max-lines-per-function */
    /**
     *
     * @param {number[]} axes
     * @private
     */
    handleJoysticks(axes) {
        const joystickActions = this.getJoystickActions();

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
    /* eslint-enable max-lines-per-function */

    /**
     * Convert button aliases to indexes or keep joystick aliases
     * @param {string | number} action - Actions to convert
     * @returns {string | number} - Converted action strings
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
     * @returns {Object[]} - Joystick actions
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
