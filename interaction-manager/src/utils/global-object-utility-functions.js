/**
 *
 * @param {string[]} keys Array of key combinations
 * @returns {string[]} Key combination from the _IM global object
 */
export function getKeys(keys) {
    return _IM.keyboardFunctions.filter(keyFunction => keyFunction.keys.every(key => keys.includes(key)));
}

/**
 *
 * @param {string[]} keys Array of key combinations
 * @returns {number} Index of key combination in _IM
 */
export function getKeysIndex(keys) {
    return _IM.keyboardFunctions.findIndex(keyFunction => keyFunction.keys.every(key => keys.includes(key)));
}

/**
 *
 * @param {Array} actions Array of actions
 * @returns {Object} Action from the _IM global object
 */
export function getGamepadAction(actions) {
    return _IM.gamepadFunctions.find(gpFunc => gpFunc.actions.every(action => actions.includes(action)));
}

/**
 *
 * @param {Array} actions Array of actions
 * @returns {number} Index of an action from the _IM global object
 */
export function getGamepadActionIndex(actions) {
    return _IM.gamepadFunctions.findIndex(gpFunc => gpFunc.actions.every(action => actions.includes(action)));
}

/**
 *
 * @param {string} action Action to search for
 * @returns {Object}
 */
export function getAction(action) {
    return _IM.actions.find(actionObj => actionObj.name === action);
}

/**
 *
 * @param {string} action Action to search for
 * @returns {number}
 */
export function getActionIndex(action) {
    return _IM.actions.findIndex(actionObj => actionObj.name === action);
}
