/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

const CUSTOM_ELEMENT_TAG = 'gameface-text-field';

/**
 * @param {Object} attributes
 * @param {string} expectedValue
 */
function getInitializationTest(attributes, expectedValue) {
    it('Should render the text field', async () => {
        await renderTextField(attributes);
        assert(document.querySelector(CUSTOM_ELEMENT_TAG) !== null, 'Text field component was not rendered.');
        checkElementAttributes(attributes, expectedValue);
    });
}

/**
 * @param {HTMLElement} input
 * @param {string} value
 */
function sendKeysToInput(input, value) {
    input.dispatchEvent(new Event('focus'));
    input.value = '';

    const onKeyDown = (event) => {
        input.value += event.detail;
        input.dispatchEvent(new Event('input'));
    };

    input.addEventListener('keydown', onKeyDown);

    for (let i = 0; i < value.length; i++) {
        input.dispatchEvent(new CustomEvent('keydown', { detail: value[i] }));
    }

    input.removeEventListener('keydown', onKeyDown);
}

/**
 * @param {string} value
 * @param {string} expectedValue
 * @returns {Function}
 */
function getTypingTest(value, expectedValue) {
    return () => it(`Should type '${value}' to input`, async () => {
        const textField = document.querySelector(CUSTOM_ELEMENT_TAG);
        const input = textField.querySelector('input');

        if (textField.disabled || textField.readonly) return;

        sendKeysToInput(input, value);

        if (expectedValue === undefined) expectedValue = value;
        assert(textField.value === expectedValue, `Expected: ${expectedValue}. Real value: ${textField.value}`);
    });
}

const textFieldComponentPropertiesCases = {
    type: 'password',
    value: 'random',
    placeholder: 'some placeholder',
    label: 'some label',
    disabled: true,
    readonly: true,
    min: 2,
    max: 100,
    minlength: 12,
    maxlength: 203,
    controlDisabled: true,
};

/**
 * @returns {Function}
 */
function changeTextFieldProperty() {
    return () => it(`Should change the text field component properties programmarly`, async () => {
        const textField = document.querySelector(CUSTOM_ELEMENT_TAG);
        for (const prop in textFieldComponentPropertiesCases) {
            const value = textFieldComponentPropertiesCases[prop];
            textField[prop] = value;
            assert(textField[prop] == value, `Expected ${prop} to have value: ${value}. Real value: ${textField[prop]}`);
        }
    });
}

/* eslint-disable max-lines-per-function */

/**
 * @param {string} type
 * @param {string} defaultValue
 * @param {string} typingValue
 * @returns {Object[]}
 */
function getDefaultRenderConfiguraion(type, defaultValue, typingValue) {
    const label = type.toUpperCase() + ':';
    const displayType = type.charAt(0).toUpperCase() + type.slice(1);

    return [
        {
            caseName: `${displayType} field`,
            attributes: { type: type },
            tests: [getTypingTest(typingValue), changeTextFieldProperty()],
        },
        {
            caseName: `${displayType} field with label`,
            attributes: { type: type, label: label },
            tests: [getTypingTest(typingValue), changeTextFieldProperty()],
        },
        {
            caseName: `${displayType} field with default value`,
            attributes: { type: type, value: defaultValue, label: label },
            tests: [getTypingTest(typingValue), changeTextFieldProperty()],
        },
        {
            caseName: `${displayType} field that is disabled`,
            attributes: { type: type, value: defaultValue, disabled: '', label: label },
            tests: [getTypingTest(typingValue, defaultValue), changeTextFieldProperty()],
        },
        {
            caseName: `${displayType} field that is readonly`,
            attributes: { type: type, value: defaultValue, readonly: '', label: label },
            tests: [getTypingTest(typingValue, defaultValue), changeTextFieldProperty()],
        },
        {
            caseName: `${displayType} field that has placeholder`,
            attributes: { type: type, placeholder: 'Type some very very long text here to test overflow and placeholder', label: label },
            tests: [getTypingTest(typingValue), changeTextFieldProperty()],
        },
        {
            caseName: `${displayType} field that is disabled with placeholder`,
            attributes: { type: type, disabled: '', placeholder: 'This input is disabled', label: label },
            tests: [getTypingTest(typingValue, ''), changeTextFieldProperty()],
        },
        {
            caseName: `${displayType} field that is readonly with placeholder`,
            attributes: { type: type, readonly: '', placeholder: 'This input is read only', label: label },
            tests: [getTypingTest(typingValue, ''), changeTextFieldProperty()],
        },
        {
            caseName: `${displayType} field that is disabled with placeholder and has default value`,
            attributes: { type: type, value: defaultValue, disabled: '', placeholder: 'This input is disabled', label: label },
            tests: [getTypingTest(typingValue, defaultValue), changeTextFieldProperty()],
        },
    ];
}

/* eslint-enable max-lines-per-function */

const testCasesRenderConfiguration = [
    ...getDefaultRenderConfiguraion('text', 'default value', 'different value'),
    {
        caseName: `Text field with min/max length and default value`,
        attributes: { type: 'text', minlength: '3', maxlength: '15', value: 'min-max-test', label: 'TEXT:' },
    },
    ...getDefaultRenderConfiguraion('password', 'default password', 'different password'),
    {
        caseName: `Password field with min/max length and default value`,
        attributes: { type: 'password', minlength: '3', maxlength: '15', value: 'min-max-test', label: 'PASSWORD:' },
    },
    ...getDefaultRenderConfiguraion('search', 'default search', 'different search'),
    {
        caseName: `Search field with min/max length and default value`,
        attributes: { type: 'search', minlength: '3', maxlength: '15', value: 'min-max-test', label: 'SEARCH:' },
    },
    {
        caseName: `Search field that removes the value`,
        attributes: { type: 'search', value: 'search value', label: 'SEARCH:' },
        tests: [() => {
            it('Should click on the cross icon to remove the value', async () => {
                const textField = document.querySelector(CUSTOM_ELEMENT_TAG);
                const crossButton = document.querySelector('.guic-search-remove');
                const input = document.querySelector('.guic-text-field');
                input.dispatchEvent(new Event('focus'));
                crossButton.dispatchEvent(new Event('mousedown'));
                crossButton.dispatchEvent(new Event('mouseup'));
                assert(textField.value === '', 'Input value has not been removed.');
            });
        }],
    },
    {
        caseName: `Search field that has disabled control`,
        attributes: { type: 'search', 'control-disabled': '', value: 'search control is disabled', label: 'SEARCH:' },
    },
    ...getDefaultRenderConfiguraion('number', '7', '5'),
    {
        caseName: `Number field that has string value`,
        attributes: { type: 'number', value: 'string value', label: 'NUMBER:' },
        expectedValue: '',
        tests: [getTypingTest('1423'), getTypingTest('12afe543', '12543'), getTypingTest('12.gfgs4', '12.4')],
    },
    {
        caseName: `Number field that has min/max and correct default value`,
        attributes: { type: 'number', min: '3', max: '15', value: '4', label: 'NUMBER:' },
        tests: [getTypingTest('1423'), getTypingTest('12afe543', '12543'), getTypingTest('12.gfgs4', '12.4')],
    },
    {
        caseName: `Number field that has min/max, step and correct default value`,
        attributes: { type: 'number', min: '3', max: '15', value: '4.5', step: '0.5', label: 'NUMBER:' },
        tests: [getTypingTest('1423'), getTypingTest('12afe543', '12543'), getTypingTest('12.gfgs4', '12.4')],
    },
    {
        caseName: `Number field that has min/max value less than the min`,
        attributes: { type: 'number', min: '3', max: '15', value: '0', label: 'NUMBER:' },
        tests: [getTypingTest('1423'), getTypingTest('12afe543', '12543'), getTypingTest('12.gfgs4', '12.4')],
    },
    {
        caseName: `Number field that has min/max value greater than the max`,
        attributes: { type: 'number', min: '3', max: '15', value: '20', label: 'NUMBER:' },
        tests: [getTypingTest('1423'), getTypingTest('12afe543', '12543'), getTypingTest('12.gfgs4', '12.4')],
    },
    {
        caseName: `Number field that has disabled control`,
        attributes: { type: 'number', 'control-disabled': '', value: '7', label: 'NUMBER:' },
        tests: [getTypingTest('1423'), getTypingTest('12afe543', '12543'), getTypingTest('12.gfgs4', '12.4')],
    },
    {
        caseName: `Number field that increases value with control`,
        attributes: { type: 'number', value: '7', step: '0.5', max: '10', label: 'NUMBER:' },
        tests: [() => {
            it('Should click on the up arrow to increase the number value to max', async () => {
                const textField = document.querySelector(CUSTOM_ELEMENT_TAG);
                const arrow = document.querySelector('.guic-number-increase');
                const input = document.querySelector('.guic-text-field');

                let currentInputValue = 7;

                for (let i = 0; i < 5; i++) {
                    currentInputValue = (parseFloat(currentInputValue) + 0.5) + '';
                    input.dispatchEvent(new Event('focus'));
                    arrow.dispatchEvent(new Event('mousedown'));
                    document.dispatchEvent(new Event('mouseup'));
                    assert(textField.value === currentInputValue, `Unable to increase the input value. Should be ${currentInputValue}. It is ${textField.value}`);
                }

                arrow.dispatchEvent(new Event('mousedown'));
                document.dispatchEvent(new Event('mouseup'));
                assert(textField.value === '10', 'Input value overflowed the maximum value.');
            });
        }],
    },
    {
        caseName: `Number field that decreases value with control`,
        attributes: { type: 'number', value: '7', step: '0.5', min: '4', label: 'NUMBER:' },
        tests: [() => {
            it('Should click on the down arrow to decrease the number value to min', async () => {
                const textField = document.querySelector(CUSTOM_ELEMENT_TAG);
                const arrow = document.querySelector('.guic-number-decrease');
                const input = document.querySelector('.guic-text-field');

                let currentInputValue = 7;

                for (let i = 0; i < 5; i++) {
                    currentInputValue = (parseFloat(currentInputValue) - 0.5) + '';
                    input.dispatchEvent(new Event('focus'));
                    arrow.dispatchEvent(new Event('mousedown'));
                    document.dispatchEvent(new Event('mouseup'));
                    assert(textField.value === currentInputValue, `Unable to decrease the input value. Should be ${currentInputValue}. It is ${textField.value}`);
                }

                arrow.dispatchEvent(new Event('mousedown'));
                document.dispatchEvent(new Event('mouseup'));
                assert(textField.value === '4', 'Input value overflowed the minimum value.');
            });
        }],
    },
];

/**
 * @param {Object} attributes
 */
async function renderTextField(attributes) {
    const el = document.createElement(CUSTOM_ELEMENT_TAG);
    for (const attributeName in attributes) {
        el.setAttribute(attributeName, attributes[attributeName]);
    }

    document.body.appendChild(el);

    await waitForStyles();
}

/**
 * @param {Object} attributes
 * @param {string} expectedValue
 * @returns {void}
 */
function checkElementAttributes(attributes, expectedValue) {
    const textFieldElement = document.querySelector(CUSTOM_ELEMENT_TAG);

    for (const attributeName in attributes) {
        const attributeNameCamelCase = attributeName.replace(/-./g, match => match[1].toUpperCase());
        let attributeValueFromCustomElement = textFieldElement[attributeNameCamelCase];
        if (!isNaN(attributeValueFromCustomElement)) {
            attributeValueFromCustomElement = attributeValueFromCustomElement + '';
        }

        if (attributeName === 'value' && expectedValue !== undefined) {
            assert(attributeValueFromCustomElement === expectedValue, `${attributeNameCamelCase} had different value from the original set. ${attributeValueFromCustomElement} !== ${expectedValue}`);
            return;
        }

        const originalAttributeValue = attributes[attributeName];

        if (originalAttributeValue === '') {
            assert(attributeValueFromCustomElement === 'true', `${attributeNameCamelCase} had different value from the original set. ${attributeValueFromCustomElement} !== true`);
        } else {
            assert(attributeValueFromCustomElement === originalAttributeValue, `${attributeNameCamelCase} had different value from the original set. ${attributeValueFromCustomElement} !== ${originalAttributeValue}`);
        }
    }
}

describe('Text field component', () => {
    afterAll(() => cleanTestPage(CUSTOM_ELEMENT_TAG));

    for (const testCase of testCasesRenderConfiguration) {
        describe(testCase.caseName, () => {
            afterAll(() => cleanTestPage(CUSTOM_ELEMENT_TAG));

            getInitializationTest(testCase.attributes, testCase.expectedValue);

            if (!testCase.tests) return;

            for (const test of testCase.tests) {
                test();
            }
        });
    }
});

if (engine?.isAttached) {
    // eslint-disable-next-line max-lines-per-function
    describe('Text Field Component (Gameface Data Binding Test)', () => {
        /**
         * @param {string} template
         * @returns {Promise<void>}
         */
        function setupTextField(template) {
            const el = document.createElement('div');
            el.className = 'test-wrapper';
            el.innerHTML = template;

            cleanTestPage('.test-wrapper');

            document.body.appendChild(el);

            return new Promise((resolve) => {
                waitForStyles(resolve);
            });
        }

        afterAll(() => cleanTestPage('.test-wrapper'));

        it(`Should have populated 2 elements`, async () => {
            const templateName = 'model';

            const template = `
            <div data-bind-for="array:{{${templateName}.array}}">
                <gameface-text-field id="test1" type="text" label="Text:"></gameface-text-field>
            </div>
            `;
            await setupDataBindingTest(templateName, template, setupTextField);
            const expectedCount = 2;
            const textFieldCount = document.querySelectorAll('gameface-text-field').length;
            assert.equal(textFieldCount, expectedCount, `Text Fields found: ${textFieldCount}, should have been ${expectedCount}.`);
        });

        it(`Should test text field with data-binding attributes`, async () => {
            const template = `<gameface-text-field id="test1" type="text" label="Text:" data-bind-custom-attribute-text-field="{{model}}"></gameface-text-field>`;
            // eslint-disable-next-line require-jsdoc
            class CustomAttribute {
                // eslint-disable-next-line require-jsdoc
                init(element, model) {
                    Object.keys(model).forEach(attrName => element[attrName] = model[attrName]);
                }
                // eslint-disable-next-line require-jsdoc
                update(element, model) {
                    Object.keys(model).forEach(attrName => element[attrName] = model[attrName]);
                }
            }

            engine.registerBindingAttribute('custom-attribute-text-field', CustomAttribute);
            const model = { value: 10, type: 'number', placeholder: 'Type a number', label: 'Number input' };
            await setupDataBindingTest('model', template, setupTextField, model);
            const textField = document.querySelector('gameface-text-field');
            Object.keys(window.model).forEach(attrName => assert.equal(textField[attrName], window.model[attrName], `The text-field has a different ${attrName}. Received ${textField[attrName]}. Expected ${window.model[attrName]}`));
            window.model.value = 75;
            window.model.label = 'Test label';
            engine.updateWholeModel(window.model);
            engine.synchronizeModels();
            Object.keys(window.model).forEach(attrName => assert.equal(textField[attrName], window.model[attrName], `The text-field has a different ${attrName}. Received ${textField[attrName]}. Expected ${window.model[attrName]}`));
        });
    });
}
