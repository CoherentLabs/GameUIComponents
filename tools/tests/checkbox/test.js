/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

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
        const checkbox = document.getElementsByTagName('gameface-checkbox')[0];
        click(checkbox);
        const checkMark = checkbox.querySelector('[data-name="check-mark"]');
        assert(checkMark.style.display === 'block', 'Check mark is not hidden when the checkbox is not selected.');
        click(checkbox);
        assert(checkMark.style.display === 'none', 'Check mark is not visible when the checkbox is selected.');
    });
});

/* global engine */
/* global setupDataBindingTest */
if (engine?.isAttached) {
    describe('Checkbox Component (Gameface Data Binding Test)', () => {
        const templateName = 'checkbox';

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
