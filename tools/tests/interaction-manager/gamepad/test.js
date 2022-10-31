/* eslint-disable max-lines-per-function */
/* global _IM */
const registeredGamepadButtons = [0, 1];

const simulateGamepadButton = () => {
    const gamepadButtons = [{ pressed: true }, { pressed: true }, { pressed: false }, { pressed: false }];

    interactionManager.gamepad.handleButtons(gamepadButtons);
};

const simulateLeftJoystick = () => {
    const axes = [1, 1];

    interactionManager.gamepad.handleJoysticks(axes);
};

describe('Gamepad', () => {
    it('Should register gamepad action', () => {
        interactionManager.gamepad.on({
            actions: registeredGamepadButtons,
            callback: () => {},
        });

        const gamepadAction = _IM.getGamepadAction(registeredGamepadButtons);

        assert.exists(gamepadAction);
    });

    it('Should remove gamepad action', () => {
        interactionManager.gamepad.off(registeredGamepadButtons);

        const keyAction = _IM.getGamepadAction(registeredGamepadButtons);

        assert.notExists(keyAction);
    });

    it('Should execute gamepad action on button down', () => {
        let hasExecuted = false;
        interactionManager.gamepad.on({
            actions: registeredGamepadButtons,
            callback: () => {
                hasExecuted = true;
            },
        });

        simulateGamepadButton();

        interactionManager.gamepad.off(registeredGamepadButtons);

        assert.isTrue(hasExecuted);
    });

    it('Should execute gamepad action on joystick move', () => {
        let hasExecuted = false;
        interactionManager.gamepad.on({
            actions: ['left.joystick'],
            callback: () => {
                hasExecuted = true;
            },
        });

        simulateLeftJoystick();

        interactionManager.gamepad.off(['left.joystick']);

        assert.isTrue(hasExecuted);
    });

    it('Should execute gamepad action on joystick move in direction', () => {
        let hasExecuted = false;
        interactionManager.gamepad.on({
            actions: ['left.joystick.right'],
            callback: () => {
                hasExecuted = true;
            },
        });

        simulateLeftJoystick();

        interactionManager.gamepad.off(['left.joystick.right']);

        assert.isTrue(hasExecuted);
    });
});
