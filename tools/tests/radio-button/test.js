/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * @param {string} template
 * @returns {Promise<void>}
 */
function setupRadioButtonTestPage(template) {
    const el = document.createElement('div');
    el.className = 'radio-button-test-wrapper';
    el.innerHTML = template;

    cleanTestPage('.radio-button-test-wrapper');

    document.body.appendChild(el);

    return new Promise((resolve) => {
        waitForStyles(resolve);
    });
}

// eslint-disable-next-line max-lines-per-function
describe('Radio Button Tests', () => {
    afterAll(() => cleanTestPage('.radio-button-test-wrapper'));

    // eslint-disable-next-line max-lines-per-function
    describe('Radio Button Component', () => {
        const template = `
        <gameface-radio-group>
            <radio-button value="one">1</radio-button>
            <radio-button value="two">2</radio-button>
            <radio-button>3</radio-button>
        </gameface-radio-group>`;

        beforeEach(async () => {
            await setupRadioButtonTestPage(template);
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
            const radioButton = document.querySelectorAll('radio-button')[2];
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
            assert.equal(radioButton.checked, true, 'radio-button has not been checked by clicking.');
        });

        it('Radio Button should have been checked by ArrowRight key', () => {
            const radioButtons = document.querySelectorAll('radio-button');
            click(radioButtons[0]);
            radioButtons[0].dispatchEvent(new KeyboardEvent('keydown', { keyCode: 39 })); // ArrowRight

            assert.equal(radioButtons[1].checked, true, 'radio-button has not been checked by using ArrowRight key.');
        });

        it('Radio Button should have been checked by ArrowLeft key', () => {
            const radioButtons = document.querySelectorAll('radio-button');
            click(radioButtons[1]);
            radioButtons[1].dispatchEvent(new KeyboardEvent('keydown', { keyCode: 37 })); // ArrowLeft

            assert.equal(radioButtons[0].checked, true, 'radio-button has not been checked by using ArrowLeft key.');
        });

        it('Should have name attribute changed from property', () => {
            const NAME = 'newName';
            const radioButton = document.querySelector('radio-button');
            radioButton.name = NAME;

            assert.equal(radioButton.getAttribute('name'), NAME, 'radio-button name attribute has not been changed.');
        });

        it('Should select correct button from radio group value', () => {
            const SELECTED_VALUE = 'two';

            const radioGroup = document.querySelector('gameface-radio-group');
            const radioButtons = document.querySelectorAll('radio-button');
            click(radioButtons[0]);
            radioGroup.value = SELECTED_VALUE;

            assert.isTrue(radioButtons[1].checked, 'the second radio button is not checked');
        });

        it('Shouldn\'t select disabled button from radio group value', () => {
            const SELECTED_VALUE = 'two';

            const radioGroup = document.querySelector('gameface-radio-group');
            const radioButtons = document.querySelectorAll('radio-button');
            click(radioButtons[0]);

            radioButtons[1].disabled = true;
            radioGroup.value = SELECTED_VALUE;

            assert.notEqual(radioGroup.value, SELECTED_VALUE, 'the disabled radio button is selected');
        });

        it('Should set correct value on radio group from clicked radio button', () => {
            const radioGroup = document.querySelector('gameface-radio-group');
            const radioButtons = document.querySelectorAll('radio-button');
            click(radioButtons[1]);

            assert.equal(radioGroup.value, radioButtons[1].value, 'radio-group value has not been changed.');
        });
    });

    if (engine?.isAttached) {
        describe('Radio Button Component (Gameface Data Binding Test)', () => {
            const templateName = 'model';

            const template = `
            <div data-bind-for="array:{{${templateName}.array}}">
                <gameface-radio-group>
                    <radio-button>1</radio-button>
                    <radio-button>2</radio-button>
                </gameface-radio-group>
            </div>`;

            beforeEach(async () => {
                await setupDataBindingTest(templateName, template, setupRadioButtonTestPage);
            });

            it(`Should have populated 2 elements`, () => {
                const expectedCount = 2;
                const radioButtonCount = document.querySelectorAll('gameface-radio-group').length;
                assert.equal(radioButtonCount, expectedCount, `Radio Butttons found: ${radioButtonCount}, should have been ${expectedCount}.`);
            });
        });
    }
});
