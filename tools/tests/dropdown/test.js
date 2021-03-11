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

const firstValue = 'Cat';
const secondValue = 'Dog';
const changedValue = 'Giraffe';
const lastValue = 'Last Parrot';

function renewDropdown() {
    document.body.innerHTML = '';
    document.body.innerHTML = template;
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
    element.dispatchEvent(new KeyboardEvent('keydown', {keyCode: keyCode}));
}

describe('Dropdown Component', () => {
    beforeEach(async (done) => {
        renewDropdown();
        setTimeout(done, 300);
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

    it('Should toggle the options list on click', () => {
        const dropdown = document.querySelector('gameface-dropdown');
        const selectedElPlaceholder = dropdown.querySelector('.selected');

        click(selectedElPlaceholder);
        expect(dropdown.querySelector('.options-container').classList.contains('hidden')).toBeFalse();
        click(selectedElPlaceholder);
        expect(dropdown.querySelector('.options-container').classList.contains('hidden')).toBeTrue();
    });

    it('Should change the selected option on click', async (done) => {
        const dropdown = document.querySelector('gameface-dropdown');
        const selectedElPlaceholder = dropdown.querySelector('.selected');

        click(selectedElPlaceholder);

        const option = dropdown.allOptions[2];
        click(option);
        setTimeout(() => {
            expect(dropdown.querySelector('.selected').textContent).toEqual(changedValue);
            done();
        }, 300);
    });

    it('Should select using keyboard ARROW_DOWN and ARROW_UP keys', () => {
        const dropdown = document.querySelector('gameface-dropdown');
        dispatchKeyboardEvent(KEY_CODES.ARROW_DOWN, dropdown);
        expect(dropdown.value).toEqual(secondValue);

        dispatchKeyboardEvent(KEY_CODES.ARROW_UP, dropdown);
        expect(dropdown.value).toEqual(firstValue);
    });

    it('Should select using keyboard ARROW_RIGHT and ARROW_LEFT keys', () => {
        const dropdown = document.querySelector('gameface-dropdown');
        dispatchKeyboardEvent(KEY_CODES.ARROW_RIGHT, dropdown);
        expect(dropdown.value).toEqual(secondValue);

        dispatchKeyboardEvent(KEY_CODES.ARROW_LEFT, dropdown);
        expect(dropdown.value).toEqual(firstValue);
    });

    it('Should select using keyboard HOME and END keys', () => {
        const dropdown = document.querySelector('gameface-dropdown');
        dispatchKeyboardEvent(KEY_CODES.END, dropdown);
        expect(dropdown.value).toEqual(lastValue);

        dispatchKeyboardEvent(KEY_CODES.HOME, dropdown);
        expect(dropdown.value).toEqual(firstValue);
    });

    it('Should close the options list using keyboard ENTER key', () => {
        const dropdown = document.querySelector('gameface-dropdown');
        const selectedElPlaceholder = dropdown.querySelector('.selected');
        click(selectedElPlaceholder);

        dispatchKeyboardEvent(KEY_CODES.ARROW_DOWN, dropdown);
        dispatchKeyboardEvent(KEY_CODES.ENTER, dropdown);
        expect(dropdown.value).toEqual(secondValue);
        expect(dropdown.querySelector('.options-container').classList.contains('hidden')).toBeTrue();
    });

    it('Should close the options list using keyboard ESC key', () => {
        const dropdown = document.querySelector('gameface-dropdown');
        const selectedElPlaceholder = dropdown.querySelector('.selected');
        click(selectedElPlaceholder);

        dispatchKeyboardEvent(KEY_CODES.ARROW_DOWN, dropdown);
        dispatchKeyboardEvent(KEY_CODES.ARROW_DOWN, dropdown);
        dispatchKeyboardEvent(KEY_CODES.ESCAPE, dropdown);
        expect(dropdown.value).toEqual(changedValue);
        expect(dropdown.querySelector('.options-container').classList.contains('hidden')).toBeTrue();
    });

    it('Should close the options list on document click', () => {
        const dropdown = document.querySelector('gameface-dropdown');
        const selectedElPlaceholder = dropdown.querySelector('.selected');
        click(selectedElPlaceholder);

        dispatchKeyboardEvent(KEY_CODES.END, dropdown);
        click(document);
        expect(dropdown.value).toEqual(lastValue);
        expect(dropdown.querySelector('.options-container').classList.contains('hidden')).toBeTrue();
    });

    it('Should select the next enabled option', async (done) => {
        const dropdown = document.querySelector('gameface-dropdown');
        const selectedElPlaceholder = dropdown.querySelector('.selected');

        click(selectedElPlaceholder);

        const option = dropdown.allOptions[3];
        click(option);
        setTimeout(() => {
            expect(dropdown.querySelector('.selected').textContent).toEqual('Lion');
            click(selectedElPlaceholder);
            dispatchKeyboardEvent(KEY_CODES.ARROW_RIGHT, dropdown);
            setTimeout(() => {
                expect(dropdown.value).toEqual('Eagle');
                done();
            }, 300);
        }, 300);
    });

    it('Should select the previous enabled option', async (done) => {
        const dropdown = document.querySelector('gameface-dropdown');
        const selectedElPlaceholder = dropdown.querySelector('.selected');

        click(selectedElPlaceholder);

        const option = dropdown.allOptions[5];
        click(option);
        setTimeout(() => {
            expect(dropdown.querySelector('.selected').textContent).toEqual('Eagle');
            click(selectedElPlaceholder);
            dispatchKeyboardEvent(KEY_CODES.ARROW_LEFT, dropdown);
            setTimeout(() => {
                expect(dropdown.value).toEqual('Lion');
                done();
            }, 300);
        }, 300);
    });
});