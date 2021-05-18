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


function setupDropdownTestPage() {
    const el = document.createElement('div');
    el.innerHTML = template;

    let dropdown = document.querySelector('gameface-dropdown');

    if (dropdown) {
        dropdown.parentElement.removeChild(dropdown);
    }

    document.body.appendChild(el);

    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, 1000);
    });
}

const firstValue = 'Cat';
const secondValue = 'Dog';
const changedValue = 'Giraffe';
const lastValue = 'Last Parrot';

function createDropdownAsyncSpec(callback, time = 1000) {
    return new Promise(resolve => {
        setTimeout(() => {
            callback();
            resolve();
        }, time);
    });
}

const KEY_CODES = {
    'ARROW_UP': 38,
    'ARROW_DOWN': 40,
    'ARROW_RIGHT': 39,
    'ARROW_LEFT': 37,
    'END': 35,
    'HOME': 36,
    'ENTER': 13,
    'ESCAPE': 27
};

function dispatchKeyboardEvent(keyCode, element) {
    element.dispatchEvent(new KeyboardEvent('keydown', { keyCode: keyCode }));
}


describe('Dropdown Tests', () => {
    after(() => {
        let dropdown = document.querySelector('gameface-dropdown');

        if (dropdown) {
            dropdown.parentElement.removeChild(dropdown);
        }
    });

    describe('Dropdown Component', () => {
        beforeEach(async () => {
            await setupDropdownTestPage();
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
    });


    describe('Dropdown Component', () => {
        beforeEach(async () => {
            await setupDropdownTestPage();
        });

        it('Should toggle the options list on click', async () => {
            const dropdown = document.querySelector('gameface-dropdown');
            const selectedElPlaceholder = dropdown.querySelector('.selected');

            click(selectedElPlaceholder);
            await createDropdownAsyncSpec(() => {
                assert(dropdown.querySelector('.options-container').classList.contains('hidden') === false, 'Dropdown has class hidden.');
            });

            click(selectedElPlaceholder);
            return createDropdownAsyncSpec(() => {
                assert(dropdown.querySelector('.options-container').classList.contains('hidden') === true, 'Dropdown does not have class hidden.');
            });
        });
    });


    describe('Dropdown Component', () => {
        beforeEach(async () => {
            await setupDropdownTestPage();
        });
        it('Should change the selected option on click', async () => {
            const dropdown = document.querySelector('gameface-dropdown');
            const selectedElPlaceholder = dropdown.querySelector('.selected');

            click(selectedElPlaceholder);

            const option = dropdown.allOptions[2];
            click(option);
            return createDropdownAsyncSpec(() => {
                assert(dropdown.querySelector('.selected').textContent === changedValue, `Changed value is not ${changedValue}`);
            });
        });
    });


    describe('Dropdown Component', () => {
        beforeEach(async () => {
            await setupDropdownTestPage();
        });

        it('Should select using keyboard ARROW_DOWN and ARROW_UP keys', async () => {
            const dropdown = document.querySelector('gameface-dropdown');
            const selectedElPlaceholder = dropdown.querySelector('.selected');

            await createDropdownAsyncSpec(() => {
                click(selectedElPlaceholder);
            });

            await createDropdownAsyncSpec(() => {
                dispatchKeyboardEvent(KEY_CODES.ARROW_DOWN, dropdown);
            });

            await createDropdownAsyncSpec(() => {
                assert(dropdown.value === secondValue, `Dropdown value is not ${secondValue}`);
            });

            dispatchKeyboardEvent(KEY_CODES.ARROW_UP, dropdown);

            return createDropdownAsyncSpec(() => {
                assert(dropdown.value === firstValue, `Dropdown value is not ${firstValue}`);
            });
        });
    });


    describe('Dropdown Component', () => {
        beforeEach(async () => {
            await setupDropdownTestPage();
        });

        it('Should select using keyboard ARROW_RIGHT and ARROW_LEFT keys', async () => {
            const dropdown = document.querySelector('gameface-dropdown');
            const selectedElPlaceholder = dropdown.querySelector('.selected');

            await createDropdownAsyncSpec(() => {
                click(selectedElPlaceholder);
            });

            await createDropdownAsyncSpec(() => {
                dispatchKeyboardEvent(KEY_CODES.ARROW_RIGHT, dropdown);
            });

            await createDropdownAsyncSpec(() => {
                assert(dropdown.value === secondValue, `Dropdown value is not ${secondValue}`);
            });

            dispatchKeyboardEvent(KEY_CODES.ARROW_LEFT, dropdown);
            return createDropdownAsyncSpec(() => {
                assert(dropdown.value === firstValue, `Dropdown value is not ${firstValue}`);
            });
        });
    });


    describe('Dropdown Component', () => {
        beforeEach(async () => {
            await setupDropdownTestPage();
        });

        it('Should select using keyboard HOME and END keys', async () => {
            const dropdown = document.querySelector('gameface-dropdown');
            const selectedElPlaceholder = dropdown.querySelector('.selected');

            await createDropdownAsyncSpec(() => {
                click(selectedElPlaceholder);
            });

            await createDropdownAsyncSpec(() => {
                dispatchKeyboardEvent(KEY_CODES.END, dropdown);
            });

            await createDropdownAsyncSpec(() => {
                assert(dropdown.value === lastValue, `Dropdown value is not ${lastValue}`);
            });

            dispatchKeyboardEvent(KEY_CODES.HOME, dropdown);
            return createDropdownAsyncSpec(() => {
                assert(dropdown.value === firstValue, `Dropdown value is not ${firstValue}`);
            });
        });
    });

    describe('Dropdown Component', () => {
        beforeEach(async () => {
            await setupDropdownTestPage();
        });

        it('Should close the options list using keyboard ENTER key', async () => {
            const dropdown = document.querySelector('gameface-dropdown');
            const selectedElPlaceholder = dropdown.querySelector('.selected');

            await createDropdownAsyncSpec(() => {
                click(selectedElPlaceholder);
            });

            await createDropdownAsyncSpec(() => {
                dispatchKeyboardEvent(KEY_CODES.ENTER, dropdown);
            });
            return createDropdownAsyncSpec(() => {
                assert(dropdown.querySelector('.options-container').classList.contains('hidden') === true, 'Dropdown does not contain class hidden.');
            });
        });
    });


    describe('Dropdown Component', () => {
        beforeEach(async () => {
            await setupDropdownTestPage();
        });

        it('Should close the options list using keyboard ESC key', async () => {
            const dropdown = document.querySelector('gameface-dropdown');
            const selectedElPlaceholder = dropdown.querySelector('.selected');

            await createDropdownAsyncSpec(() => {
                click(selectedElPlaceholder);
            });

            await createDropdownAsyncSpec(() => {
                dispatchKeyboardEvent(KEY_CODES.ESCAPE, dropdown);
            });

            return createDropdownAsyncSpec(() => {
                assert(dropdown.querySelector('.options-container').classList.contains('hidden') === true, 'Dropdown does not contain class hidden.');
            });
        });
    });


    describe('Dropdown Component', () => {
        beforeEach(async () => {
            await setupDropdownTestPage();
        });

        it('Should close the options list on document click', async () => {
            const dropdown = document.querySelector('gameface-dropdown');
            const selectedElPlaceholder = dropdown.querySelector('.selected');
            click(selectedElPlaceholder);
            dispatchKeyboardEvent(KEY_CODES.END, dropdown);

            await createDropdownAsyncSpec(() => { click(document) });
            return createDropdownAsyncSpec(() => {
                assert(dropdown.value === lastValue, `Dropdown value is not ${lastValue}`);
                assert(dropdown.querySelector('.options-container').classList.contains('hidden') === true, 'Dropdown does not have class hidden.');
            }, 2000);
        });
    });

    //--------

    describe('Dropdown Component', () => {
        beforeEach(async () => {
            await setupDropdownTestPage();
        });

        it('Should select the next enabled option', async () => {
            const dropdown = document.querySelector('gameface-dropdown');
            const selectedElPlaceholder = dropdown.querySelector('.selected');

            click(selectedElPlaceholder);

            await createDropdownAsyncSpec(() => {
                const option = dropdown.allOptions[3];
                click(option);
            }, 100);
            await createDropdownAsyncSpec(() => {
                assert(dropdown.querySelector('.selected').textContent === 'Lion', 'Dropdown value is not Lion.');
                click(selectedElPlaceholder);
                dispatchKeyboardEvent(KEY_CODES.ARROW_RIGHT, dropdown);
            }, 100);
            return createDropdownAsyncSpec(() => {
                assert(dropdown.value === 'Eagle', 'Dropdown value is not Eagle.');
            }, 100);
        });
    });


    describe('Dropdown Component', () => {
        beforeEach(async () => {
            await setupDropdownTestPage();
        });

        it('Should select the previous enabled option', async () => {
            const dropdown = document.querySelector('gameface-dropdown');
            const selectedElPlaceholder = dropdown.querySelector('.selected');

            click(selectedElPlaceholder);

            await createDropdownAsyncSpec(() => {
                const option = dropdown.allOptions[5];
                click(option);
            });
            await createDropdownAsyncSpec(() => {
                assert(dropdown.querySelector('.selected').textContent === 'Eagle', 'Dropdown value is not equal to Eagle.');
                click(selectedElPlaceholder);
                dispatchKeyboardEvent(KEY_CODES.ARROW_LEFT, dropdown);
            });
            await createDropdownAsyncSpec(() => {
                assert(dropdown.value === 'Lion', 'Dropdown value is not equal to Lion.');
            });
        });
    });
});