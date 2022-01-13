/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

const template = `<gameface-dropdown class="gameface-dropdown-component">
<dropdown-option slot="option">Cat</dropdown-option>
<dropdown-option slot="option">Dog</dropdown-option>
<dropdown-option slot="option">Giraffe</dropdown-option>
<dropdown-option slot="option">Lion</dropdown-option>
<dropdown-option slot="option" disabled="disabled">Pig</dropdown-option>
<dropdown-option slot="option">Eagle</dropdown-option>
<dropdown-option slot="option">Parrot</dropdown-option>
<dropdown-option slot="option">Parrot</dropdown-option>
<dropdown-option slot="option">Parrot</dropdown-option>
<dropdown-option slot="option">Parrot</dropdown-option>
<dropdown-option slot="option">Parrot</dropdown-option>
<dropdown-option slot="option">Parrot</dropdown-option>
<dropdown-option slot="option">Parrot</dropdown-option>
<dropdown-option slot="option">Forty===</dropdown-option>
<dropdown-option slot="option">Parrot</dropdown-option>
<dropdown-option slot="option">Parrot</dropdown-option>
<dropdown-option slot="option">Parrot</dropdown-option>
<dropdown-option slot="option">Fity---</dropdown-option>
<dropdown-option slot="option">Parrot</dropdown-option>
<dropdown-option slot="option">Parrot</dropdown-option>
<dropdown-option slot="option">Parrot</dropdown-option>
<dropdown-option slot="option">Parrot</dropdown-option>
<dropdown-option slot="option">Parrot</dropdown-option>
<dropdown-option slot="option">Parrot</dropdown-option>
<dropdown-option slot="option">Parrot</dropdown-option>
<dropdown-option slot="option">Parrot</dropdown-option>
<dropdown-option slot="option">Parrot</dropdown-option>
<dropdown-option slot="option">Parrot</dropdown-option>
<dropdown-option slot="option">Parrot</dropdown-option>
<dropdown-option slot="option">Parrot</dropdown-option>
<dropdown-option slot="option">Parrot</dropdown-option>
<dropdown-option slot="option">Parrot</dropdown-option>
<dropdown-option slot="option">Parrot</dropdown-option>
<dropdown-option slot="option">Parrot</dropdown-option>
<dropdown-option slot="option">Parrot</dropdown-option>
<dropdown-option slot="option">Parrot</dropdown-option>
<dropdown-option slot="option">Parrot</dropdown-option>
<dropdown-option slot="option">Parrot</dropdown-option>
<dropdown-option slot="option">Parrot</dropdown-option>
<dropdown-option slot="option">Parrot</dropdown-option>
<dropdown-option slot="option">Parrot</dropdown-option>
<dropdown-option slot="option">Parrot</dropdown-option>
<dropdown-option slot="option">Parrot</dropdown-option>
<dropdown-option slot="option">Parrot</dropdown-option>
<dropdown-option slot="option">Parrot</dropdown-option>
<dropdown-option slot="option">Parrot</dropdown-option>
<dropdown-option slot="option">Parrot</dropdown-option>
<dropdown-option slot="option">Parrot</dropdown-option>
<dropdown-option slot="option">Parrot</dropdown-option>
<dropdown-option slot="option">Parrot</dropdown-option>
<dropdown-option slot="option">Parrot</dropdown-option>
<dropdown-option slot="option">Parrot</dropdown-option>
<dropdown-option slot="option">Parrot</dropdown-option>
<dropdown-option slot="option">Parrot</dropdown-option>
<dropdown-option slot="option">Parrot</dropdown-option>
<dropdown-option slot="option">Parrot</dropdown-option>
<dropdown-option slot="option">Parrot</dropdown-option>
<dropdown-option slot="option">Parrot</dropdown-option>
<dropdown-option slot="option">Parrot</dropdown-option>
<dropdown-option slot="option">Parrot</dropdown-option>
<dropdown-option slot="option">Parrot</dropdown-option>
<dropdown-option slot="option">Parrot</dropdown-option>
<dropdown-option slot="option">Parrot</dropdown-option>
<dropdown-option slot="option">Last Parrot</dropdown-option>
<dropdown-option slot="option" disabled="disabled">Disabled Parrot</dropdown-option>
</gameface-dropdown>`;

const templateDisabled = `<gameface-dropdown disabled class="gameface-dropdown-component">
<dropdown-option slot="option">Cat</dropdown-option>
</gameface-dropdown>`;


const templatePreselectedOptions = `<gameface-dropdown class="gameface-dropdown-component">
<dropdown-option slot="option">Cat</dropdown-option>
<dropdown-option slot="option" selected>Dog</dropdown-option>
<dropdown-option slot="option" selected>Parrot</dropdown-option>
<dropdown-option slot="option" selected>Last Parrot</dropdown-option>
</gameface-dropdown>`;

function setupDropdownTestPage(templateString) {
    const el = document.createElement('div');
    el.className = 'dropdown-test-wrapper';
    el.innerHTML = templateString;

    cleanTestPage('.dropdown-test-wrapper');

    document.body.appendChild(el);

    return new Promise(resolve => {
        waitForStyles(resolve);
    });
}

const firstValue = 'Cat';
const secondValue = 'Dog';
const changedValue = 'Giraffe';
const lastValue = 'Last Parrot';

const KEY_CODES = {
    'ARROW_UP': 38,
    'ARROW_DOWN': 40,
    'ARROW_RIGHT': 39,
    'ARROW_LEFT': 37,
    'END': 35,
    'HOME': 36,
    'ENTER': 13,
    'ESCAPE': 27,
    'KeyA': 65,
};

function dispatchKeyboardEvent(keyCode, element) {
    element.dispatchEvent(new KeyboardEvent('keydown', { keyCode: keyCode }));
}


describe('Dropdown Tests', () => {
    afterAll(() => {
        // Reset .options to avoid mixing the options re-added by the caching feature which messes up the tests.
        document.querySelector('.dropdown-test-wrapper').querySelector('.options').innerHTML = '';
        cleanTestPage('.dropdown-test-wrapper');
    });

    describe('Dropdown Component', () => {
        beforeEach(function (done) {
            setupDropdownTestPage(template).then(done).catch(err => console.error(err));
        });

        it('Should be rendered', () => {
            assert(document.querySelector('.dropdown') !== null, 'Dropdown element is null');
        });

        it('Should have default value', () => {
            const dropdown = document.querySelector('gameface-dropdown');
            assert(dropdown.value === firstValue, 'Selected value is not the default value.');
        });

        it('Should have the first option selected by default', () => {
            const dropdown = document.querySelector('gameface-dropdown');
            assert(dropdown.querySelector('.selected').textContent === firstValue, 'Selected value is not the first value.');
        });

        it('Should toggle the options list on click', async () => {
            const dropdown = document.querySelector('gameface-dropdown');
            const selectedElPlaceholder = dropdown.querySelector('.selected');

            click(selectedElPlaceholder);

            await createAsyncSpec(() => {
                assert(dropdown.querySelector('.options-container').classList.contains('hidden') === false, 'Dropdown has class hidden.');
            });

            click(selectedElPlaceholder);

            return createAsyncSpec(() => {
                assert(dropdown.querySelector('.options-container').classList.contains('hidden') === true, 'Dropdown does not have class hidden.');
            });
        });

        it('Should change the selected option on click', async () => {
            const dropdown = document.querySelector('gameface-dropdown');
            const selectedElPlaceholder = dropdown.querySelector('.selected');

            click(selectedElPlaceholder);

            const option = dropdown.allOptions[2];
            click(option);

            return createAsyncSpec(() => {
                assert(dropdown.querySelector('.selected').textContent === changedValue, `Changed value is not ${changedValue}`);
            });
        });

        it('Should select using keyboard ARROW_DOWN and ARROW_UP keys', async () => {
            const dropdown = document.querySelector('gameface-dropdown');
            const selectedElPlaceholder = dropdown.querySelector('.selected');

            await createAsyncSpec(() => {
                click(selectedElPlaceholder);
            });

            await createAsyncSpec(() => {
                dispatchKeyboardEvent(KEY_CODES.ARROW_DOWN, dropdown);
            });

            await createAsyncSpec(() => {
                assert(dropdown.value === secondValue, `Dropdown value is not ${secondValue}`);
            });

            dispatchKeyboardEvent(KEY_CODES.ARROW_UP, dropdown);

            return createAsyncSpec(() => {
                assert(dropdown.value === firstValue, `Dropdown value is not ${firstValue}`);
            });
        });

        it('Should select using keyboard ARROW_RIGHT and ARROW_LEFT keys', async () => {
            const dropdown = document.querySelector('gameface-dropdown');
            const selectedElPlaceholder = dropdown.querySelector('.selected');

            await createAsyncSpec(() => {
                click(selectedElPlaceholder);
            });

            await createAsyncSpec(() => {
                dispatchKeyboardEvent(KEY_CODES.ARROW_RIGHT, dropdown);
            });

            await createAsyncSpec(() => {
                assert(dropdown.value === secondValue, `Dropdown value is not ${secondValue}`);
            });

            dispatchKeyboardEvent(KEY_CODES.ARROW_LEFT, dropdown);

            return createAsyncSpec(() => {
                assert(dropdown.value === firstValue, `Dropdown value is not ${firstValue}`);
            });
        });

        it('Should select using keyboard HOME and END keys', async () => {
            const dropdown = document.querySelector('gameface-dropdown');
            const selectedElPlaceholder = dropdown.querySelector('.selected');

            // The reset of the .options is needed because of the caching feature of the dropdown.
            const options = dropdown.querySelector('.options');
            options.innerHTML = `<dropdown-option slot="option">${firstValue}</dropdown-option>
<dropdown-option slot="option">${lastValue}</dropdown-option>
<dropdown-option slot="option" disabled="disabled">Disabled Parrot</dropdown-option>`;

            click(selectedElPlaceholder);
            dropdown.dispatchEvent(new KeyboardEvent('keydown', { keyCode: KEY_CODES.END }));

            assert(dropdown.value === lastValue, `Dropdown value is not ${lastValue}`);

            dropdown.dispatchEvent(new KeyboardEvent('keydown', { keyCode: KEY_CODES.HOME }));

            assert(dropdown.value === firstValue, `Dropdown value is not ${firstValue}`);
        });

        it('Should close the options list using keyboard ENTER key', async () => {
            const dropdown = document.querySelector('gameface-dropdown');
            const selectedElPlaceholder = dropdown.querySelector('.selected');

            await createAsyncSpec(() => {
                click(selectedElPlaceholder);
            });

            await createAsyncSpec(() => {
                dispatchKeyboardEvent(KEY_CODES.ENTER, dropdown);
            });

            return createAsyncSpec(() => {
                assert(dropdown.querySelector('.options-container').classList.contains('hidden') === true, 'Dropdown does not contain class hidden.');
            });
        });

        it('Should close the options list using keyboard ESC key', async () => {
            const dropdown = document.querySelector('gameface-dropdown');
            const selectedElPlaceholder = dropdown.querySelector('.selected');

            await createAsyncSpec(() => {
                click(selectedElPlaceholder);
            });

            await createAsyncSpec(() => {
                dispatchKeyboardEvent(KEY_CODES.ESCAPE, dropdown);
            });

            return createAsyncSpec(() => {
                assert(dropdown.querySelector('.options-container').classList.contains('hidden') === true, 'Dropdown does not contain class hidden.');
            });
        });

        it('Should close the options list on clicking outside of the dropdown', function (done) {
            const dropdown = document.querySelector('gameface-dropdown');

            click(document.querySelector('.dropdown-test-wrapper'));

            createAsyncSpec(() => {
                assert(dropdown.querySelector('.options-container').classList.contains('hidden') === true, 'Dropdown does not have class hidden.');
                done();
            });
        });

        it('Should select the next enabled option', async () => {
            const dropdown = document.querySelector('gameface-dropdown');
            const selectedElPlaceholder = dropdown.querySelector('.selected');

            click(selectedElPlaceholder);

            await createAsyncSpec(() => {
                const option = dropdown.allOptions[3];
                click(option);
            });

            await createAsyncSpec(() => {
                assert(document.querySelector('gameface-dropdown').querySelector('.selected').textContent === 'Lion', 'Dropdown value is not Lion.');
                click(selectedElPlaceholder);
                dispatchKeyboardEvent(KEY_CODES.ARROW_RIGHT, dropdown);
            });

            return createAsyncSpec(() => {
                assert(document.querySelector('gameface-dropdown').value === 'Eagle', 'Dropdown value is not Eagle.');
            });
        });

        it('Should select the previous enabled option', async () => {
            const dropdown = document.querySelector('gameface-dropdown');
            const selectedElPlaceholder = dropdown.querySelector('.selected');

            click(selectedElPlaceholder);

            await createAsyncSpec(() => {
                const option = dropdown.allOptions[5];
                click(option);
            });

            await createAsyncSpec(() => {
                assert(document.querySelector('gameface-dropdown').querySelector('.selected').textContent === 'Eagle', 'Dropdown value is not equal to Eagle.');
                click(selectedElPlaceholder);
                dispatchKeyboardEvent(KEY_CODES.ARROW_LEFT, dropdown);
            });

            return createAsyncSpec(() => {
                assert(document.querySelector('gameface-dropdown').value === 'Lion', 'Dropdown value is not equal to Lion.');
            });
        });

        it('Should have only 1 option selected.', async () => {
            const dropdown = document.querySelector('gameface-dropdown');
            const selectedElPlaceholder = dropdown.querySelector('.selected');

            click(selectedElPlaceholder);
            await createAsyncSpec(() => {
                click(dropdown.allOptions[5]);
            });

            click(selectedElPlaceholder);
            await createAsyncSpec(() => {
                click(dropdown.allOptions[0]);
            });

            click(selectedElPlaceholder);
            await createAsyncSpec(() => {
                click(dropdown.allOptions[3]);
            });

            const expectedSelectedCount = 1;
            const selectedOptionsCount = dropdown.selectedOptions.length;
            const selectedListCount = dropdown.selectedList.length;

            return createAsyncSpec(() => {
                assert.equal(selectedOptionsCount, expectedSelectedCount,
                      `Expected selected options length to be ${expectedSelectedCount}, got ${selectedOptionsCount}.`);
                assert.equal(selectedListCount, expectedSelectedCount,
                  `Expected selected options length to be ${expectedSelectedCount}, got ${selectedListCount}.`);
            });
        });
    });

    describe('Dropdown Component (Disabled)', () => {
        beforeEach(function (done) {
            setupDropdownTestPage(templateDisabled).then(done).catch(err => console.error(err));
        });

        it('Should be disabled and not clickable.', async () => {
            const dropdown = document.querySelector('gameface-dropdown');
            const selectedElPlaceholder = dropdown.querySelector('.selected');

            click(selectedElPlaceholder);

            return createAsyncSpec(() => {
                assert.isNotTrue(dropdown.isOpened,
                  `Dropdown should not have opened.`);
            });
        });
    });

    describe('Dropdown Component (Pre-selected Options)', () => {
        beforeEach(function (done) {
            setupDropdownTestPage(templatePreselectedOptions).then(done).catch(err => console.error(err));
        });

        it('Last option should be (pre)selected.', async () => {
            const dropdown = document.querySelector('gameface-dropdown');
            const selectedOptions = dropdown.selectedOptions;
            const allPreselectedOptions = dropdown.querySelectorAll('[selected]');
            const lastSelectedValue = allPreselectedOptions[allPreselectedOptions.length - 1].textContent;

            await createAsyncSpec(() => {
                assert.equal(selectedOptions.length, 1, 'There should not be multiple (pre)selected options.');
            });

            return createAsyncSpec(() => {
                assert.equal(selectedOptions[0].textContent, lastSelectedValue,
                  `The last option value has not been selected.`);
            });
        });
    });
});
