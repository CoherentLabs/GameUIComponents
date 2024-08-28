/* globals simulateKeyDown, simulateKeyUp */
/* eslint-disable new-cap */
/* eslint-disable max-lines-per-function */
const template = (squares = 6) => {
    const square = i => `<div class="square square-${i}" style="width: 100px; height: 100px; background-color: burlywood; box-sizing: border-box; border:1px solid black;">${i}</div>`;

    return `<div class="square-container" style="width: 305px; display: flex; flex-wrap: wrap;">
       ${Array.from({ length: squares }, (_, i) => square(i + 1)).join('\n')}
    </div>`;
};

let expectedActiveEl = '';

/**
 * @param {string} template
 * @returns {Promise<void>}
 */
async function setupTestPage(template) {
    const el = document.createElement('div');
    el.className = 'test-container';
    el.innerHTML = template;

    cleanTestPage('.test-container');

    document.body.appendChild(el);

    return new Promise((resolve) => {
        waitForStyles(resolve);
    });
}

describe('Spatial navigation', () => {
    beforeEach(async () => {
        await setupTestPage(template());
        interactionManager.spatialNavigation.init([
            { area: 'squares', elements: ['.square'] },
        ]);
        interactionManager.spatialNavigation.focusFirst('squares');
        expectedActiveEl = document.querySelector('.square-1');
    });

    afterEach(() => {
        cleanTestPage('.test-container');
        interactionManager.spatialNavigation.deinit();
    });

    it('Should add new navigation keys', () => {
        interactionManager.spatialNavigation.changeKeys({ up: 'W', down: 'S', left: 'A', right: 'D' });

        // right, right, down, left, left, up => position 1
        ['D', 'D', 'S', 'A', 'A', 'W'].forEach((key) => {
            simulateKeyDown(key.toUpperCase());
            simulateKeyUp(key.toUpperCase());
        });
        assert.strictEqual(document.activeElement, expectedActiveEl, `Expected the active element to be '.square-1' after navigating with custom keys, but found '${document.activeElement.className}' instead.`);
    });

    it('Should add new keys without overwriting the old ones', () => {
        interactionManager.spatialNavigation.changeKeys({ up: 'W', down: 'S', left: 'A', right: 'D' });
        interactionManager.spatialNavigation.changeKeys({ up: 'I', down: 'K', left: 'J', right: 'L' });

        // right, right, down, left, left, up => position 1
        ['L', 'L', 'K', 'J', 'J', 'I'].forEach((key) => {
            simulateKeyDown(key.toUpperCase());
            simulateKeyUp(key.toUpperCase());
        });
        assert.strictEqual(document.activeElement, expectedActiveEl, `Expected the active element to be '.square-1' after navigating with custom keys, but found '${document.activeElement.className}' instead.`);
    });

    it('Should clear all custom keys and reinitiate the default ones', () => {
        interactionManager.spatialNavigation.changeKeys({ up: 'W', down: 'S', left: 'A', right: 'D' });
        interactionManager.spatialNavigation.resetKeys();

        // right, right, down, left, left, up => position 1
        ['arrow_right', 'arrow_right', 'arrow_down', 'arrow_left', 'arrow_left', 'arrow_up'].forEach((key) => {
            simulateKeyDown(key.toUpperCase());
            simulateKeyUp(key.toUpperCase());
        });
        assert.strictEqual(document.activeElement, expectedActiveEl, `Expected the active element to be '.square-1' after navigating with custom keys, but found '${document.activeElement.className}' instead.`);
    });

    it('Should clear all custom keys and reinitiate the default ones', () => {
        interactionManager.spatialNavigation.changeKeys({ down: 'S' }, { clearCurrentActiveKeys: true });

        ['S', 'S', 'arrow_up', 'arrow_right'].forEach((key) => {
            simulateKeyDown(key.toUpperCase());
            simulateKeyUp(key.toUpperCase());
        });
        assert.strictEqual(document.activeElement, expectedActiveEl, `Expected the active element to be '.square-1' after navigating with custom keys, but found '${document.activeElement.className}' instead.`);
    });
});
