/* globals _IM, simulateKeyDown, simulateKeyUp */
/* eslint-disable max-lines-per-function */

const singleKey = ['A'];
const keyCombination = ['B', 'C'];

describe('Keyboard', () => {
    afterAll(() => {
        interactionManager.keyboard.off(singleKey);
    });

    it('Should register key action', () => {
        interactionManager.keyboard.on({
            keys: singleKey,
            callback: () => { },
            type: ['press'],
        });

        const keyAction = _IM.getKeys(singleKey);

        assert.isAbove(keyAction.length, 0);
    });

    it('Should remove key action', () => {
        interactionManager.keyboard.off(singleKey);

        const keyAction = _IM.getKeys(singleKey);

        assert.equal(keyAction.length, 0);
    });

    it('Should execute key action on key down', () => {
        let hasExecuted = false;
        interactionManager.keyboard.on({
            keys: singleKey,
            callback: () => {
                hasExecuted = true;
            },
            type: ['press'],
        });

        singleKey.forEach((key) => {
            simulateKeyDown(key);
        });

        interactionManager.keyboard.off(singleKey);

        assert.isTrue(hasExecuted);
    });

    it('Should execute key action on key combination', () => {
        let hasExecuted = false;
        interactionManager.keyboard.on({
            keys: keyCombination,
            callback: () => {
                hasExecuted = true;
            },
            type: ['press'],
        });

        keyCombination.forEach((key) => {
            simulateKeyDown(key);
        });

        interactionManager.keyboard.off(keyCombination);

        assert.isTrue(hasExecuted);
    });

    it('Should execute one time on key down with type press', () => {
        let counter = 0;

        interactionManager.keyboard.on({
            keys: singleKey,
            callback: () => {
                counter += 1;
            },
            type: ['press'],
        });

        singleKey.forEach((key) => {
            simulateKeyDown(key);
        });

        interactionManager.keyboard.off(singleKey);

        assert.equal(counter, 1);
    });

    it('Should execute multiple times on key down with type hold', () => {
        let counter = 0;
        const count = 10;

        interactionManager.keyboard.on({
            keys: singleKey,
            callback: () => {
                counter += 1;
            },
            type: ['hold'],
        });

        singleKey.forEach((key) => {
            for (let i = 0; i < count; i++) {
                simulateKeyDown(key, true);
            }
        });

        interactionManager.keyboard.off(singleKey);

        assert.equal(counter, count);
    });

    it('Should execute on key up with type lift', () => {
        let counter = 0;

        interactionManager.keyboard.on({
            keys: singleKey,
            callback: () => {
                counter += 1;
            },
            type: ['lift'],
        });

        singleKey.forEach((key) => {
            simulateKeyUp(key);
        });

        interactionManager.keyboard.off(singleKey);

        assert.equal(counter, 1);
    });

    it('Should execute on key up with type lift for two lift events', () => {
        const liftedKeys = [];
        const secondActionKeys = ['B'];

        interactionManager.keyboard.on({
            keys: singleKey,
            callback: () => {
                liftedKeys.push(singleKey[0]);
            },
            type: ['lift'],
        });

        interactionManager.keyboard.on({
            keys: secondActionKeys,
            callback: () => {
                liftedKeys.push(secondActionKeys[0]);
            },
            type: ['lift'],
        });

        singleKey.forEach((key) => {
            simulateKeyUp(key);
        });

        secondActionKeys.forEach((key) => {
            simulateKeyUp(key);
        });

        interactionManager.keyboard.off(singleKey);
        interactionManager.keyboard.off(secondActionKeys);

        assert.equal(JSON.stringify(liftedKeys), '["A","B"]');
    });

    it('Should execute the same action on two or more types', () => {
        let counter = 0;

        interactionManager.keyboard.on({
            keys: singleKey,
            callback: () => {
                counter += 1;
            },
            type: ['press', 'lift'],
        });

        singleKey.forEach((key) => {
            simulateKeyDown(key);
            simulateKeyUp(key);
        });

        interactionManager.keyboard.off(singleKey);

        assert.equal(counter, 2);
    });
});
