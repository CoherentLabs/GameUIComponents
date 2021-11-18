/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

const radioButtonTemplate = `<gameface-radio-group>
<radio-button value="one">1</radio-button>
<radio-button>2</radio-button>
<radio-button>3</radio-button>
</gameface-radio-group>`;

// Since we don't want to replace the whole content of the body using
// innerHtml setter, we query only the current custom element and we replace
// it with a new one; this is needed because the specs are executed in a random
// order and sometimes the component might be left in a state that is not
// ready for testing
function removeTestWrapper() {
    const currentElement = document.querySelector('.radio-button-test-wrapper');

    if (currentElement) {
        currentElement.parentElement.removeChild(currentElement);
    }
}

function setupRadioButtonTestPage() {
    const el = document.createElement('div');
    el.className = 'radio-button-test-wrapper';
    el.innerHTML = radioButtonTemplate;

    removeTestWrapper();

    document.body.appendChild(el);

    return new Promise(resolve => {
        waitForStyles(resolve);
    });
}

describe('Radio Button Tests', () => {
    afterAll(() => { removeTestWrapper() });

    describe('Radio Button Component', () => {
        beforeEach(function (done) {
            setupRadioButtonTestPage().then(done).catch(err => console.error(err));
        });

        it('Radio Group should be rendered', () => {
            assert.exists(document.querySelector('gameface-radio-group'), 'Radio Group element does not exist.');
        });

        it('Radio Button should be rendered and have its user-set value', () => {
            assert.equal(document.querySelector('radio-button').children[0].textContent.trim(), '1', 'radio-button not rendered or does not have a value of 1.');
        });

        it('Radio Button should have been set to checked', () => {
            const radioButton = document.querySelector('radio-button');
            radioButton.checked = true;
            // Checking with 'true' because the attribute value is always a string.
            assert.equal(radioButton.getAttribute('aria-checked'), 'true', 'radio-button has not been checked.');
        });

        it('Radio Button should have be unchecked by checking another radio button', () => {
            const radioButtons = document.querySelectorAll('radio-button');

            radioButtons[0].checked = true;
            radioButtons[1].checked = true;
            assert.equal(radioButtons[0].getAttribute('aria-checked'), 'false', 'First radio-button has not been unchecked after checked.');
        });

        it('Radio Button should have a working "value" getter. The value should be "one"', () => {
            const radioButton = document.querySelector('radio-button');
            assert.equal(radioButton.value, 'one', 'First radio-button has not been unchecked after checked.');
        });

        it('Radio Button should have a working "value" getter. The value should be "on"', () => {
            const radioButton = document.querySelectorAll('radio-button')[1];
            assert.equal(radioButton.value, 'on', 'First radio-button has not been unchecked after checked.');
        });

        it('Radio Button should have a working "value" setter', () => {
            const radioButton = document.querySelector('radio-button');
            radioButton.value = 'newValue';

            assert.equal(radioButton.value, 'newValue', 'radio-button value setter failed.');
        });

        it('Radio Button should have been checked by clicking', () => {
            const radioButton = document.querySelector('radio-button');
            // This is a helper function defined in actions.js
            click(radioButton);
            assert.equal(radioButton.checked, 'true', 'radio-button has not been checked by clicking.');
        });

        it('Radio Button should have been checked by ArrowRight key', () => {
            const radioButtons = document.querySelectorAll('radio-button');
            click(radioButtons[0]);
            radioButtons[0].dispatchEvent(new KeyboardEvent('keydown', { keyCode: 39 })); // ArrowRight

            assert.equal(radioButtons[1].checked, 'true', 'radio-button has not been checked by using ArrowRight key.');
        });

        it('Radio Button should have been checked by ArrowLeft key', () => {
            const radioButtons = document.querySelectorAll('radio-button');
            click(radioButtons[1]);
            radioButtons[1].dispatchEvent(new KeyboardEvent('keydown', { keyCode: 37 })); // ArrowLeft

            assert.equal(radioButtons[0].checked, 'true', 'radio-button has not been checked by using ArrowLeft key.');
        });
    });
});
