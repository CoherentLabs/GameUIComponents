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
    document.body.innerHTML = template;

    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, 1000);
    });
}

function createDropdownAsyncSpec(callback, time = 500) {
    return new Promise(resolve => {
        setTimeout(() => {
            callback();
            resolve();
        }, time);
    });
}


const firstValue = 'Cat';
const secondValue = 'Dog';
const changedValue = 'Giraffe';
const lastValue = 'Last Parrot';

function renewDropdown() {
    document.body.innerHTML = '';
}

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

describe('Dropdown Component', () => {
    beforeAll(async () => {
        renewDropdown();
        await setupDropdownTestPage();
    });

    it('Should be rendered', () => {
        expect(document.querySelector('.dropdown')).toBeTruthy();
    });

    it('Should have default value', () => {
        const dropdown = document.querySelector('gameface-dropdown');
        expect(dropdown.value).toEqual(firstValue);
    });

    it('Should have the first option selected by default', () => {
        const dropdown = document.querySelector('gameface-dropdown');
        expect(dropdown.querySelector('.selected').textContent).toEqual(firstValue);
    });
});


describe('Dropdown Component', () => {
    beforeAll(async () => {
        renewDropdown();
        await setupDropdownTestPage();
    });
    it('Should toggle the options list on click', async () => {
        const dropdown = document.querySelector('gameface-dropdown');
        const selectedElPlaceholder = dropdown.querySelector('.selected');

        click(selectedElPlaceholder);
        await createDropdownAsyncSpec(() => {
            expect(dropdown.querySelector('.options-container').classList.contains('hidden')).toBeFalse();
        });
       
        click(selectedElPlaceholder);
        return createDropdownAsyncSpec(() => {
            expect(dropdown.querySelector('.options-container').classList.contains('hidden')).toBeTrue();
        });
    });
});


describe('Dropdown Component', () => {
    beforeAll(async () => {
        renewDropdown();
        await setupDropdownTestPage();
    });
    it('Should change the selected option on click', async () => {
        const dropdown = document.querySelector('gameface-dropdown');
        const selectedElPlaceholder = dropdown.querySelector('.selected');

        click(selectedElPlaceholder);

        const option = dropdown.allOptions[2];
        click(option);
        return createDropdownAsyncSpec(() => {
            expect(dropdown.querySelector('.selected').textContent).toEqual(changedValue);
        });
    });
});


describe('Dropdown Component', () => {
    beforeAll(async () => {
        renewDropdown();
        await setupDropdownTestPage();
    });

    it('Should select using keyboard ARROW_DOWN and ARROW_UP keys', async () => {
        const dropdown = document.querySelector('gameface-dropdown');
        dispatchKeyboardEvent(KEY_CODES.ARROW_DOWN, dropdown);
        await createDropdownAsyncSpec(() => {
            expect(dropdown.value).toEqual(secondValue);
        });

        dispatchKeyboardEvent(KEY_CODES.ARROW_UP, dropdown);

        return createDropdownAsyncSpec(() => {
            expect(dropdown.value).toEqual(firstValue);
        });
    });
});


describe('Dropdown Component', () => {
    beforeAll(async () => {
        renewDropdown();
        await setupDropdownTestPage();
    });

    it('Should select using keyboard ARROW_RIGHT and ARROW_LEFT keys', async () => {
        const dropdown = document.querySelector('gameface-dropdown');
        dispatchKeyboardEvent(KEY_CODES.ARROW_RIGHT, dropdown);

        await createDropdownAsyncSpec(() => {
            expect(dropdown.value).toEqual(secondValue);
        });

        dispatchKeyboardEvent(KEY_CODES.ARROW_LEFT, dropdown);
        return createDropdownAsyncSpec(() => {
            expect(dropdown.value).toEqual(firstValue);
        });
    });
});


describe('Dropdown Component', () => {
    beforeAll(async () => {
        renewDropdown();
        await setupDropdownTestPage();
    });

    it('Should select using keyboard HOME and END keys', async () => {
        const dropdown = document.querySelector('gameface-dropdown');
        dispatchKeyboardEvent(KEY_CODES.END, dropdown);
        await createDropdownAsyncSpec(() => {
            expect(dropdown.value).toEqual(lastValue);
        });

        dispatchKeyboardEvent(KEY_CODES.HOME, dropdown);
        return createDropdownAsyncSpec(() => {
            expect(dropdown.value).toEqual(firstValue);
        });
    });
});


describe('Dropdown Component', () => {
    beforeAll(async () => {
        renewDropdown();
        await setupDropdownTestPage();
    });

    it('Should close the options list using keyboard ENTER key', async () => {
        const dropdown = document.querySelector('gameface-dropdown');
        const selectedElPlaceholder = dropdown.querySelector('.selected');
        click(selectedElPlaceholder);

        await createDropdownAsyncSpec(() => {
            dispatchKeyboardEvent(KEY_CODES.ENTER, dropdown);
        });
        return createDropdownAsyncSpec(() => {
            expect(dropdown.querySelector('.options-container').classList.contains('hidden')).toBeTrue();
        });
    });
});


describe('Dropdown Component', () => {
    beforeAll(async () => {
        renewDropdown();
        await setupDropdownTestPage();
    });

    it('Should close the options list using keyboard ESC key', async () => {
        const dropdown = document.querySelector('gameface-dropdown');
        const selectedElPlaceholder = dropdown.querySelector('.selected');
        click(selectedElPlaceholder);
        await createDropdownAsyncSpec(() => {
            dispatchKeyboardEvent(KEY_CODES.ESCAPE, dropdown);
        });

        return createDropdownAsyncSpec(() => {
            expect(dropdown.querySelector('.options-container').classList.contains('hidden')).toBeTrue();
        });
    });
});


describe('Dropdown Component', () => {
    beforeAll(async () => {
        renewDropdown();
        await setupDropdownTestPage();
    });

    it('Should close the options list on document click', async () => {
        const dropdown = document.querySelector('gameface-dropdown');
        const selectedElPlaceholder = dropdown.querySelector('.selected');
        click(selectedElPlaceholder);
        dispatchKeyboardEvent(KEY_CODES.END, dropdown);

        await createDropdownAsyncSpec(() => { click(document) });
        return createDropdownAsyncSpec(() => {
            expect(dropdown.value).toEqual(lastValue);
            expect(dropdown.querySelector('.options-container').classList.contains('hidden')).toBeTrue();
        }, 2000);
    });
});


describe('Dropdown Component', () => {
    beforeAll(async () => {
        renewDropdown();
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
            expect(dropdown.querySelector('.selected').textContent).toEqual('Lion');
            click(selectedElPlaceholder);
            dispatchKeyboardEvent(KEY_CODES.ARROW_RIGHT, dropdown);
        }, 100);
        return createDropdownAsyncSpec(() => {
            expect(dropdown.value).toEqual('Eagle');
        }, 100);
    });
});


describe('Dropdown Component', () => {
    beforeAll(async () => {
        renewDropdown();
        await setupDropdownTestPage();
    });

    it('Should select the previous enabled option', async () => {
        const dropdown = document.querySelector('gameface-dropdown');
        const selectedElPlaceholder = dropdown.querySelector('.selected');

        click(selectedElPlaceholder);

        await createDropdownAsyncSpec(() => {
            const option = dropdown.allOptions[5];
            click(option);
        }, 100);
        await createDropdownAsyncSpec(() => {
            expect(dropdown.querySelector('.selected').textContent).toEqual('Eagle');
            click(selectedElPlaceholder);
            dispatchKeyboardEvent(KEY_CODES.ARROW_LEFT, dropdown);
        }, 100);
        await createDropdownAsyncSpec(() => {
            expect(dropdown.value).toEqual('Lion');
        }, 100);
    });
});