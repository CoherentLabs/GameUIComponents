/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/* eslint-disable max-lines-per-function */
/**
 * @param {string} template
 * @returns {Promise<void>}
 */
function setupCheckbox(template) {
    const el = document.createElement('div');
    el.className = 'test-wrapper';
    el.innerHTML = template;

    cleanTestPage('.test-wrapper');

    document.body.appendChild(el);

    return new Promise((resolve) => {
        waitForStyles(resolve);
    });
}

/**
 * Will test the checkbox attribute state
 * @param {HTMLElement} checkbox
 * @param {string} attributeName
 * @param {any} attributeValue
 */
function assertCheckboxAttribute(checkbox, attributeName, attributeValue) {
    assert(checkbox[attributeName] === attributeValue, `Checkbox should have property ${attributeName} equal to ${attributeValue}.`);
    assert(checkbox.hasAttribute(attributeName) === attributeValue, `Checkbox should have ${attributeName} property checked.`);
}

describe('Checkbox component', () => {
    const template = `<gameface-checkbox></gameface-checkbox>`;

    afterAll(() => cleanTestPage('.test-wrapper'));

    beforeEach(async () => {
        await setupCheckbox(template);
    });

    it('Should be rendered', () => {
        assert(document.querySelector('gameface-checkbox') !== null, 'Checkbox was not rendered.');
    });

    it('Should toggle state when it\'s clicked', () => {
        const checkbox = document.querySelector('gameface-checkbox');
        click(checkbox);
        const checkMark = checkbox.querySelector('[data-name="check-mark"]');
        assert(checkMark.style.display === 'block', 'Check mark is not hidden when the checkbox is not selected.');
        click(checkbox);
        assert(checkMark.style.display === 'none', 'Check mark is not visible when the checkbox is selected.');
    });

    it('Should update it\'s state if the checked attribute gets changed', () => {
        const checkbox = document.querySelector('gameface-checkbox');
        assert(checkbox.checked === false, 'Checkbox is checked by default.');

        checkbox.setAttribute('checked', '');
        assertCheckboxAttribute(checkbox, 'checked', true);
    });

    it('Should update it\'s state if the checked property gets changed', () => {
        const checkbox = document.querySelector('gameface-checkbox');
        assert(checkbox.checked === false, 'Checkbox is checked by default.');

        checkbox.checked = true;
        assertCheckboxAttribute(checkbox, 'checked', true);
    });

    it('Should update it\'s state if the disabled attribute gets changed', () => {
        const checkbox = document.querySelector('gameface-checkbox');
        assert(checkbox.disabled === false, 'Checkbox is disabled by default.');

        checkbox.setAttribute('disabled', '');

        assertCheckboxAttribute(checkbox, 'disabled', true);
    });

    it('Should update it\'s state if the disabled property gets changed', () => {
        const checkbox = document.querySelector('gameface-checkbox');
        assert(checkbox.disabled === false, 'Checkbox is disabled by default.');

        checkbox.disabled = true;
        assertCheckboxAttribute(checkbox, 'disabled', true);
    });
});

describe('Checkbox component with attributes', () => {
    afterAll(() => cleanTestPage('.test-wrapper'));

    it('Should be rendered checked checkbox', async () => {
        await setupCheckbox(`<gameface-checkbox checked></gameface-checkbox>`);
        const checkbox = document.querySelector('gameface-checkbox');
        assertCheckboxAttribute(checkbox, 'checked', true);
        assertCheckboxAttribute(checkbox, 'disabled', false);
    });

    it('Should be rendered disabled checkbox', async () => {
        await setupCheckbox(`<gameface-checkbox disabled></gameface-checkbox>`);
        const checkbox = document.querySelector('gameface-checkbox');
        assertCheckboxAttribute(checkbox, 'checked', false);
        assertCheckboxAttribute(checkbox, 'disabled', true);
    });

    it('Should be rendered checked and disabled checkbox', async () => {
        await setupCheckbox(`<gameface-checkbox checked disabled></gameface-checkbox>`);
        const checkbox = document.querySelector('gameface-checkbox');
        assertCheckboxAttribute(checkbox, 'checked', true);
        assertCheckboxAttribute(checkbox, 'disabled', true);
    });

    it('Should be rendered checked and disabled checkbox with name and value', async () => {
        await setupCheckbox(`<gameface-checkbox checked disabled name="test" value="1"></gameface-checkbox>`);
        const checkbox = document.querySelector('gameface-checkbox');
        assertCheckboxAttribute(checkbox, 'checked', true);
        assertCheckboxAttribute(checkbox, 'disabled', true);
        assert(checkbox['name'] === 'test', `Checkbox should have property name equal to 'test'.`);
        assert(checkbox['value'] === '1', `Checkbox should have property value equal to '1'.`);
    });
});

/* global engine */
/* global setupDataBindingTest */
if (engine?.isAttached) {
    describe('Checkbox Component (Gameface Data Binding Test)', () => {
        const templateName = 'model';

        const template = `<div data-bind-for="array:{{${templateName}.array}}"><gameface-checkbox></gameface-checkbox></div>`;

        afterAll(() => cleanTestPage('.test-wrapper'));

        beforeEach(async () => {
            await setupDataBindingTest(templateName, template, setupCheckbox);
        });

        it(`Should have populated 2 elements`, () => {
            const expectedCount = 2;
            const checkboxCount = document.querySelectorAll('gameface-checkbox').length;
            assert.equal(checkboxCount, expectedCount, `Checkboxes found: ${checkboxCount}, should have been ${expectedCount}.`);
        });
    });
}
