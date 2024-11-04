/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * Global object class
 */
class IM {
    // eslint-disable-next-line require-jsdoc
    constructor() {
        this.actions = [];
        this.keyboardFunctions = [];
        this.gamepadFunctions = [];
    }

    /**
     * Initialize global object
     */
    init() {
        if (!window._IM) window._IM = new IM();
    }

    /**
     *
     * @param {string[]} keys Array of key combinations
     * @returns {string[]} Key combination from the _IM global object
     */
    getKeys(keys) {
        return _IM.keyboardFunctions.filter(keyFunction => keyFunction.keys.every(key => keys.includes(key)));
    }

    /**
     *
     * @param {string[]} keys Array of key combinations
     * @returns {number} Index of key combination in _IM
     */
    getKeysIndex(keys) {
        return _IM.keyboardFunctions.findIndex(keyFunction => keyFunction.keys.every(key => keys.includes(key)));
    }

    /**
     *
     * @param {Array} actions Array of actions
     * @param {string} type Type of action
     * @returns {Object} Action from the _IM global object
     */
    getGamepadAction({ actions, type }) {
        return _IM.gamepadFunctions.find((gpFunc) => {
            return (gpFunc.actions.every(action => actions.includes(action)) && gpFunc.type === type);
        });
    }

    /**
     *
     * @param {Array} actions Array of actions
     * @param {string} type Type of action
     * @returns {Object} Action from the _IM global object
     */
    getGamepadActions(actions) {
        return _IM.gamepadFunctions.filter(gpFunc => gpFunc.actions.every(action => actions.includes(action)));
    }

    /**
     *
     * @param {Array} actions Array of actions
     * @returns {number} Index of an action from the _IM global object
     */
    getGamepadActionIndex(actions) {
        return _IM.gamepadFunctions.findIndex(gpFunc => gpFunc.actions.every(action => actions.includes(action)));
    }

    /**
     *
     * @param {string} action Action to search for
     * @returns {Object}
     */
    getAction(action) {
        return _IM.actions.find(actionObj => actionObj.name === action);
    }

    /**
     *
     * @param {string} action Action to search for
     * @returns {number}
     */
    getActionIndex(action) {
        return _IM.actions.findIndex(actionObj => actionObj.name === action);
    }
}

export default new IM();
