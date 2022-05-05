import IM from '../utils/global-object';

/**
 * Register and trigger actions to be used in project
 */
class Actions {
    /**
     * Register an action
     * @param {string} action - Function alias that allows you to save functions and reuse them
     * @param {function} callback
     * @returns {void}
     */
    register(action, callback) {
        if (IM.getAction(action)) return console.error(`The following action "${action}" is already registered!`);

        _IM.actions.push({ name: action, callback });
    }

    /**
     * Remove a registered action
     * @param {string} action - Name of action you want to remove
     * @returns {void}
     */
    remove(action) {
        const actionIndex = IM.getActionIndex(action);
        if (actionIndex === -1) return console.error(`${action} is not a registered action!`);

        _IM.actions.splice(actionIndex, 1);
    }

    /**
     * Trigger an action
     * @param {string} action - Name of action you want to execute
     * @param {any} value - Value that is passed to the callback
     * @returns {void}
     */
    execute(action, value) {
        const actionObject = IM.getAction(action);
        if (!actionObject) return console.error(`${action} is not a registered action!`);

        actionObject.callback(value);
    }
}

export default new Actions();
