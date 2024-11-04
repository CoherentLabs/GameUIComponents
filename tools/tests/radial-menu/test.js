/* eslint-disable linebreak-style */
/* global itemsModel, itemsModel2 */
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * @param {string} template
 * Will setup page for the radial menu
 */
async function setupRadialMenuTestPage(template) {
    const el = document.createElement('div');
    el.className = 'radial-menu-test-wrapper';

    el.innerHTML = template;

    cleanTestPage('.radial-menu-test-wrapper');

    document.body.appendChild(el);

    await createAsyncSpec(() => {
        const radialMenus = document.querySelectorAll('.radial-menu-component');
        // Provide the items.
        radialMenus.forEach(radialMenu => radialMenu.items = itemsModel.items);
    });

    // the .items setter triggers a DOM change, so we wait a bit to make
    // sure the DOM is ready.
    await createAsyncSpec();
}

/**
 * @param {number} keyCode
 * @param {HTMLElement} element
 */
function dispatchKeyboardEventKeyDown(keyCode, element) {
    element.dispatchEvent(new KeyboardEvent('keydown', { keyCode: keyCode }));
}

/**
 * @param {number} keyCode
 * @param {HTMLElement} element
 */
function dispatchKeyboardEventKeyUp(keyCode, element) {
    element.dispatchEvent(new KeyboardEvent('keyup', { keyCode: keyCode }));
}

// eslint-disable-next-line max-lines-per-function
describe('Radial Menu Tests', () => {
    afterAll(() => cleanTestPage('.radial-menu-test-wrapper'));

    // eslint-disable-next-line max-lines-per-function
    describe('Radial Menu', () => {
        const template = `
        <gameface-radial-menu
            data-name="Radial Menu Name Test"
            data-change-event-name="radOneItemChanged"
            data-select-event-name="radOneItemSelected"
            data-open-key-code="16"
            class="radial-menu-component"></gameface-radial-menu>
        `;

        beforeEach(async () => {
            await setupRadialMenuTestPage(template);
        });

        it('Should have the provided name', () => {
            const text = document.querySelector('.guic-radial-menu-center-text').textContent;
            assert(text === 'Radial Menu Name Test', `The textContent of the radial menu is not "Radial Menu Name Test" and is ${text}.`);
        });

        it('Should have items and their count to be 8', () => {
            assert(document.querySelectorAll('.guic-radial-menu-item').length === 8, 'The length of .radial-menu-item elements is not 8.');
        });

        it('Should have background image url on a populated element', () => {
            const backgroundImageUrl = document.querySelectorAll('.guic-radial-menu-item-icon')[2].style.backgroundImage;

            assert(backgroundImageUrl.includes('weapon3') === true, `The background image url is not "url("./images/weapon3.png")".`);
        });

        it('Should have transform rotate on a populated element', () => {
            // remove all numbers after the decimal point (if any)
            const transformValue = document.querySelectorAll('.guic-radial-menu-item-icon')[7].style.transform.replace(/\.\d+/, '');
            assert((transformValue === 'rotate(-315deg)' || transformValue === 'rotateZ(-315deg)'),
                'The transform property of the radial-menu-item-icon is not "rotate(-315deg)" nor "rotateZ(-315deg)".');
        });

        it('Should have opened on keydown', async () => {
            const radialMenu = document.querySelector('gameface-radial-menu');

            dispatchKeyboardEventKeyDown(16, window);

            // The menu is opened 2 frames after the opening function is called.
            return createAsyncSpec(() => {
                assert(radialMenu.classList.contains('guic-radial-menu-open') === true, 'Radial menu did not open.');
            });
        });

        it('Should have closed on keyup after opening', async () => {
            const radialMenu = document.querySelector('gameface-radial-menu');

            dispatchKeyboardEventKeyDown(16, window);

            await createAsyncSpec(() => {
                assert(radialMenu.classList.contains('guic-radial-menu-open') === true, 'Radial menu did not open prior to finishing the test.');
            });

            await createAsyncSpec(() => {
                dispatchKeyboardEventKeyUp(16, window);
            });

            return createAsyncSpec(() => {
                assert(radialMenu.classList.contains('guic-radial-menu-open') === false, 'Radial menu has not closed.');
            });
        });

        it('Should successfully attach to and use custom event', async () => {
            const radialMenu = document.querySelector('gameface-radial-menu');

            let selectedState = false;

            await createAsyncSpec(() => {
                radialMenu.addEventListener('radOneItemSelected', () => {
                    selectedState = true;
                });
            });

            await createAsyncSpec(() => {
                dispatchKeyboardEventKeyDown(16, window);
            });

            await createAsyncSpec(() => {
                dispatchKeyboardEventKeyUp(16, window);
            });

            return createAsyncSpec(() => {
                assert(selectedState === true, 'selectedState is not true.');
            });
        });

        it('Should successfully replace items and remove old ones from DOM', () => {
            const radialMenu = document.querySelector('gameface-radial-menu');
            radialMenu.items = itemsModel2.items;

            return createAsyncSpec(() => {
                assert(document.querySelectorAll('.guic-radial-menu-item').length === 3, 'The length of .radial-menu-item elements is not 3.');
            });
        });
    });

    if (engine?.isAttached) {
        describe('Radial Menu Component (Gameface Data Binding Test)', () => {
            const templateName = 'model';

            const template = `
            <div data-bind-for="array:{{${templateName}.array}}">
                <gameface-radial-menu
                    data-name="Radial Menu Name Test"
                    class="radial-menu-component">
                </gameface-radial-menu>
            </div>
            `;

            beforeEach(async () => {
                await setupDataBindingTest(templateName, template, setupRadialMenuTestPage);
            });

            it(`Should have populated 2 elements`, () => {
                const expectedCount = 2;
                const radialMenuCount = document.querySelectorAll('gameface-radial-menu').length;
                assert.equal(radialMenuCount, expectedCount, `Radial Menus found: ${radialMenuCount}, should have been ${expectedCount}.`);
            });
        });
    }
});
