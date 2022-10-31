/* global _IM */
let actionWorking = false;
const actionName = 'registered-action';

describe('Actions', () => {
    it('Should register an action', () => {
        interactionManager.actions.register(actionName, () => actionWorking = true);

        const registeredAction = _IM.actions.find(action => action.name === actionName);

        assert.exists(registeredAction);
    });

    it('Should execute registered action', () => {
        interactionManager.actions.execute(actionName);

        assert.isTrue(actionWorking);
    });

    it('Should remove action', () => {
        interactionManager.actions.remove(actionName);

        const registeredAction = _IM.actions.find(action => action.name === actionName);

        assert.notExists(registeredAction);
    });
});
