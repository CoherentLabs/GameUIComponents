/* globals simulateKeyDown, simulateKeyUp */
/* eslint-disable new-cap */
/* eslint-disable max-lines-per-function */
const template = `
<div class="square-container" style="width: 305px; display: flex; flex-wrap: wrap;">
  <div class="square square-1" style="width: 100px; height: 100px; background-color: burlywood; box-sizing: border-box; border:1px solid black;">1</div>
  <div class="square square-2" style="width: 100px; height: 100px; background-color: burlywood; box-sizing: border-box; border:1px solid black;">2</div>
  <div class="square square-3" style="width: 100px; height: 100px; background-color: burlywood; box-sizing: border-box; border:1px solid black;">3</div>
  <div class="square square-4" style="width: 100px; height: 100px; background-color: burlywood; box-sizing: border-box; border:1px solid black;">4</div>
  <div class="square square-5" style="width: 100px; height: 100px; background-color: burlywood; box-sizing: border-box; border:1px solid black;">5</div>
  <div class="square square-6" style="width: 100px; height: 100px; background-color: burlywood; box-sizing: border-box; border:1px solid black;">6</div>
</div>`;

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
        await setupTestPage(template);
        interactionManager.spatialNavigation.init([
            { area: 'squares', elements: ['.square'] },
        ]);
    });

    afterEach(() => {
        cleanTestPage('.test-container');
    });

    it('Should add new navigation keys', () => {
        interactionManager.spatialNavigation.changeKeys({ up: 'W', down: 'S', left: 'A', right: 'D' });
        interactionManager.spatialNavigation.focusFirst('squares');
        const expectedActiveEl = document.querySelector('.square-1');

        ['D', 'D', 'S', 'A', 'A', 'W'].forEach((key) => {
            simulateKeyDown(key.toUpperCase());
            simulateKeyUp(key.toUpperCase());
        });
        assert.strictEqual(document.activeElement, expectedActiveEl, `Expected the active element to be '.square-1' after navigating with custom keys, but found '${document.activeElement.className}' instead.`);
    });
});
