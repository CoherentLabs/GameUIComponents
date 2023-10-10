/* eslint-disable linebreak-style */
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

const targetValue = 75;
const animationTime = 100;

const templateNoAnimation = `<gameface-progress-bar></gameface-progress-bar>`;

const templateAnimation100ms = `<gameface-progress-bar data-animation-duration="${animationTime}"></gameface-progress-bar>`;

/**
 * @param {string} template
 * @returns {Promise<void>}
 */
function setupProgressBar(template) {
    const el = document.createElement('div');
    el.className = 'guic-progress-bar-wrapper';
    el.innerHTML = template;

    cleanTestPage('.guic-progress-bar-wrapper');

    document.body.appendChild(el);

    return new Promise((resolve) => {
        waitForStyles(resolve);
    });
}

// eslint-disable-next-line max-lines-per-function
describe('Progress Bar Tests', () => {
    afterAll(() => cleanTestPage('.guic-progress-bar-wrapper'));

    describe('Progress Bar Component', () => {
        beforeEach(async () => {
            await setupProgressBar(templateNoAnimation);
        });

        it(`Should have rendered`, () => {
            assert(document.querySelector('gameface-progress-bar') !== null, `Progress Bar element is not rendered.`);
        });

        it(`Should have been set to ${targetValue}% width.`, () => {
            document.querySelector('gameface-progress-bar').setProgress(targetValue);
            assert(parseInt(document.querySelector('.guic-progress-bar-filler').style.width) === targetValue, `Progress bar has not been set to ${targetValue}% width.`);
        });

        it(`Should have been set to 0% width when a value lower than 0 is passed.`, () => {
            document.querySelector('gameface-progress-bar').setProgress(-50);
            assert(parseInt(document.querySelector('.guic-progress-bar-filler').style.width) === 0, `Progress bar has not been set to 0% width.`);
        });

        it(`Should have been set to 100% width when a value higher than the maximum is passed.`, () => {
            document.querySelector('gameface-progress-bar').setProgress(200);
            assert(parseInt(document.querySelector('.guic-progress-bar-filler').style.width) === 100, `Progress bar has not been set to 100% width.`);
        });
    });

    describe('Progress Bar Component', () => {
        beforeEach(async () => {
            await setupProgressBar(templateAnimation100ms);
        });

        it(`Should have an animation running.`, async () => {
            const progressBarFiller = document.querySelector('.guic-progress-bar-filler');
            let intermediateWidthValue = 0;

            document.querySelector('gameface-progress-bar').setProgress(targetValue);

            setTimeout(() => {
                return createAsyncSpec(() => {
                    intermediateWidthValue = parseInt(progressBarFiller.style.width);

                    assert(intermediateWidthValue > 0 && intermediateWidthValue < targetValue, `Progress bar has not started an animation.`);
                });
            }, animationTime / 4); // Get the value and validate while still running the animation.
        });
    });

    /* global engine */
    /* global setupDataBindingTest */
    if (engine?.isAttached) {
        describe('Progress Bar Component (Gameface Data Binding Test)', () => {
            const templateName = 'model';

            const template = `<div data-bind-for="array:{{${templateName}.array}}"><gameface-progress-bar></gameface-progress-bar></div>`;

            beforeEach(async () => {
                await setupDataBindingTest(templateName, template, setupProgressBar);
            });

            it(`Should have populated 2 elements`, () => {
                const expectedCount = 2;
                const progressBarCount = document.querySelectorAll('gameface-progress-bar').length;
                assert.equal(progressBarCount, expectedCount, `Progress Bars found: ${progressBarCount}, should have been ${expectedCount}.`);
            });
        });
    }
});
