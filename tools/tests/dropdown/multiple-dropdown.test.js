/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { KEY_CODES } from '../keyCodes';
const multipleDropdownTemplate = `<gameface-dropdown multiple class="gameface-dropdown-component">
<dropdown-option slot="option">Cat</dropdown-option>
<dropdown-option slot="option">Parrot</dropdown-option>
<dropdown-option slot="option">Parrot1</dropdown-option>
<dropdown-option slot="option">Parrot</dropdown-option>
</gameface-dropdown>`;

const multipleDropdownCollapsableTemplate = `<gameface-dropdown multiple collapsable class="gameface-dropdown-component">
<dropdown-option slot="option">Cat</dropdown-option>
<dropdown-option slot="option">Parrot</dropdown-option>
<dropdown-option slot="option">Parrot1</dropdown-option>
<dropdown-option slot="option">Parrot</dropdown-option>
</gameface-dropdown>`;

const multipleDropdownPreselectedOptionsTemplate = `<gameface-dropdown multiple class="gameface-dropdown-component">
<dropdown-option slot="option">Cat</dropdown-option>
<dropdown-option slot="option">Parrot</dropdown-option>
<dropdown-option slot="option" selected>Parrot1</dropdown-option>
<dropdown-option slot="option" selected>Parrot</dropdown-option>
</gameface-dropdown>`;

/**
 * Method initializing multiple dropdown test page
 * @param {string} template
 * @returns {Promise<void>}
 */
function setupMultipleDropdownTestPage(template) {
    const el = document.createElement('div');
    el.className = 'multiple-dropdown-test-wrapper';
    el.innerHTML = template;

    cleanTestPage('.multiple-dropdown-test-wrapper');

    document.body.appendChild(el);

    return new Promise((resolve) => {
        waitForStyles(resolve);
    });
}


// eslint-disable-next-line max-lines-per-function
describe('Multiple Dropdown Test', () => {
    afterAll(() => {
        // Reset .guic-dropdown-options to avoid mixing the options re-added by the caching feature which messes up the tests.
        document.querySelector('.multiple-dropdown-test-wrapper').querySelector('.guic-dropdown-options').innerHTML = '';
        cleanTestPage('.multiple-dropdown-test-wrapper');
    });

    /**
     * Will dispatch keydown event
     * @param {HTMLElement} element
     * @param {Object} optionsObject
     */
    function dispatchKeyboardEvent(element, optionsObject) {
        element.dispatchEvent(new KeyboardEvent('keydown', optionsObject));
    }

    // eslint-disable-next-line max-lines-per-function
    describe('Multiple Dropdown Component', () => {
        beforeEach(function (done) {
            setupMultipleDropdownTestPage(multipleDropdownTemplate).then(done).catch(err => console.error(err));
        });

        it('Should select multiple elements with HOME button', async () => {
            const dropdownWrapper = document.querySelector('.multiple-dropdown-test-wrapper');
            const dropdown = dropdownWrapper.querySelector('gameface-dropdown');
            const options = dropdown.querySelectorAll('dropdown-option');
            const optionsCount = options.length;

            click(options[optionsCount - 2], { bubbles: true });

            await createAsyncSpec(() => {
                dispatchKeyboardEvent(dropdown, { keyCode: KEY_CODES.HOME, shiftKey: true });
            });

            const targetSelectedCount = optionsCount - 1;
            const actualSelectedCount = dropdown.selectedOptions.length;

            assert.equal(actualSelectedCount, targetSelectedCount,
                `Expected selected options length to be ${targetSelectedCount}, got ${actualSelectedCount}.`);
        });

        it('Should select multiple elements with END button', async () => {
            const dropdown = document.querySelector('gameface-dropdown');
            const options = dropdown.querySelectorAll('dropdown-option');
            const optionsCount = options.length;

            click(options[1], { bubbles: true });

            await createAsyncSpec(() => {
                dispatchKeyboardEvent(dropdown, { keyCode: KEY_CODES.END, shiftKey: true });
            });

            const targetSelectedCount = optionsCount - 1;
            const actualSelectedCount = dropdown.selectedOptions.length;

            assert.equal(actualSelectedCount, targetSelectedCount,
                `Expected selected options length to be ${targetSelectedCount}, got ${actualSelectedCount}.`);
        });

        it('Should select multiple elements with Shift + Up Arrow', async () => {
            const dropdown = document.querySelector('gameface-dropdown');
            const options = dropdown.querySelectorAll('dropdown-option');

            click(options[1], { bubbles: true });

            await createAsyncSpec(() => {
                dispatchKeyboardEvent(dropdown, { keyCode: KEY_CODES.ARROW_UP, shiftKey: true });
            });

            const targetSelectedCount = 2;
            const actualSelectedCount = dropdown.selectedOptions.length;

            assert.equal(actualSelectedCount, targetSelectedCount,
                `Expected selected options length to be ${targetSelectedCount}, got ${actualSelectedCount}.`);
        });

        it('Should select multiple elements with Shift + Down Arrow', async () => {
            const dropdown = document.querySelector('gameface-dropdown');

            await createAsyncSpec(() => {
                dispatchKeyboardEvent(dropdown, { keyCode: KEY_CODES.ARROW_DOWN, shiftKey: true });
            });

            const targetSelectedCount = 2;
            const actualSelectedCount = dropdown.selectedOptions.length;

            assert.equal(actualSelectedCount, targetSelectedCount,
                `Expected selected options length to be ${targetSelectedCount}, got ${actualSelectedCount}.`);
        });

        it('Should select all elements with Ctrl + A', async () => {
            const dropdown = document.querySelector('gameface-dropdown');
            const options = dropdown.querySelectorAll('dropdown-option');
            const optionsCount = options.length;

            await createAsyncSpec(() => {
                dispatchKeyboardEvent(dropdown, { keyCode: KEY_CODES.KeyA, ctrlKey: true });
            });

            const actualSelectedCount = dropdown.selectedOptions.length;

            assert.equal(actualSelectedCount, optionsCount,
                `Expected selected options length to be ${optionsCount}, got ${actualSelectedCount}.`);
        });

        it('Should reset selected elements after using Ctrl + End then Ctrl + Home', async () => {
            const dropdown = document.querySelector('gameface-dropdown');
            const options = dropdown.querySelectorAll('dropdown-option');

            click(options[1], { bubbles: true });

            await createAsyncSpec(() => {
                dispatchKeyboardEvent(dropdown, { keyCode: KEY_CODES.END, shiftKey: true });
            });

            await createAsyncSpec(() => {
                dispatchKeyboardEvent(dropdown, { keyCode: KEY_CODES.HOME, shiftKey: true });
            });

            const targetSelectedCount = 2;
            const actualSelectedCount = dropdown.selectedOptions.length;

            assert.equal(actualSelectedCount, targetSelectedCount,
                `Expected selected options length to be ${targetSelectedCount}, got ${actualSelectedCount}.`);
        });

        it('Should have its options list expanded', async () => {
            // Wait 6 frames because the multiple (and not collapsable) dropdown opens after 6 frames.
            return createAsyncSpec(() => {
                assert(document.querySelector('.guic-dropdown-options-container').classList.contains('guic-dropdown-hidden') === false,
                    'Options container is hidden.');
            }, 6);
        });

        it('Should select multiple elements', () => {
            const dropdownWrapper = document.querySelector('.multiple-dropdown-test-wrapper');
            const dropdown = dropdownWrapper.querySelector('gameface-dropdown');
            const options = dropdown.querySelectorAll('dropdown-option');

            dropdown.onClickOption(mockEventObject(options[1], true, true));
            dropdown.onClickOption(mockEventObject(options[2], true, true));

            assert(dropdown.selectedOptions.length === 2,
                `Expected selected options length to be 2, got ${dropdown.selectedOptions.length}.`);
        });

        it('Should deselect multiple elements', () => {
            const dropdownWrapper = document.querySelector('.multiple-dropdown-test-wrapper');
            const dropdown = dropdownWrapper.querySelector('gameface-dropdown');
            const options = dropdown.querySelectorAll('dropdown-option');

            dropdown.onClickOption(mockEventObject(options[1], true, true));
            dropdown.onClickOption(mockEventObject(options[2], true, true));

            dropdown.onClickOption(mockEventObject(options[1], true, true));
            dropdown.onClickOption(mockEventObject(options[2], true, true));

            assert(dropdown.selectedOptions.length === 0,
                `It didn't select only one element. Expected selected options length to be 1, got ${dropdown.selectedOptions.length}.`);
        });

        it('Should select multiple elements and then select 1', () => {
            const dropdownWrapper = document.querySelector('.multiple-dropdown-test-wrapper');
            const dropdown = dropdownWrapper.querySelector('gameface-dropdown');
            const options = dropdown.querySelectorAll('dropdown-option');

            dropdown.onClickOption(mockEventObject(options[1], true, true));
            dropdown.onClickOption(mockEventObject(options[2], true, true));
            dropdown.onClickOption(mockEventObject(options[3], true, true));
            click(options[0], { bubbles: true });

            assert(dropdown.selectedOptions.length === 1,
                `It didn't select only one element. Expected selected options length to be 1, got ${dropdown.selectedOptions.length}.`);
        });
    });

    describe('Multiple Dropdown Component Collapsable', () => {
        beforeEach(function (done) {
            setupMultipleDropdownTestPage(multipleDropdownCollapsableTemplate)
                .then(done)
                .catch(err => console.error(err));
        });

        it('Should hide the options list if it is collapsable', function () {
            const dropdownWrapper = document.querySelector('.multiple-dropdown-test-wrapper');
            const dropdown = dropdownWrapper.querySelector('gameface-dropdown');
            const options = dropdown.querySelectorAll('dropdown-option');

            click(options[1], { bubbles: true });

            click(document.body);
            assert(dropdown.querySelector('.guic-dropdown-options-container').classList.contains('guic-dropdown-hidden') === true,
                `Options container is not hidden.`);
        });
    });

    describe('Multiple Dropdown Component (Pre-selected Options)', () => {
        beforeEach(function (done) {
            setupMultipleDropdownTestPage(multipleDropdownPreselectedOptionsTemplate)
                .then(done)
                .catch(err => console.error(err));
        });

        it('Two options should be (pre)selected.', async () => {
            const dropdown = document.querySelector('gameface-dropdown');
            const selectedOptions = dropdown.selectedOptions;

            await createAsyncSpec(() => {
                assert.equal(selectedOptions.length, 2, 'The (pre)selected options are not 2.');
            });
        });
    });
});
