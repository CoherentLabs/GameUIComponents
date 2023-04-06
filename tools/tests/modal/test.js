/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * @param {string} template
 * @returns {Promise<void>}
 */
function setupModal(template) {
    const el = document.createElement('div');
    el.className = 'test-wrapper';
    el.innerHTML = template;

    cleanTestPage('.test-wrapper');

    document.body.appendChild(el);

    return new Promise((resolve) => {
        waitForStyles(resolve);
    });
}

describe('Modal Component', () => {
    const template = `<gameface-modal></gameface-modal>`;

    afterAll(() => cleanTestPage('.test-wrapper'));

    beforeEach(async () => {
        await setupModal(template);
    });

    it('Should be rendered', () => {
        assert(document.querySelector('.guic-modal-wrapper') !== null, 'The modal was not rendered.');
    });

    it('Should close when the close button is clicked', () => {
        const modal = document.getElementsByTagName('gameface-modal')[0];
        click(modal.querySelector('.close'));

        assert(modal.style.display === 'none', 'The modal is not hidden.');
    });
});

/* global engine */
/* global setupDataBindingTest */
if (engine?.isAttached) {
    describe('Modal Component (Gameface Data Binding Test)', () => {
        const templateName = 'modal';

        const template = `<div data-bind-for="array:{{${templateName}.array}}"><gameface-modal></gameface-modal></div>`;

        afterAll(() => cleanTestPage('.test-wrapper'));

        beforeEach(async () => {
            await setupDataBindingTest(templateName, template, setupModal);
        });

        it(`Should have populated 2 elements`, () => {
            const expectedCount = 2;
            const modalCount = document.querySelectorAll('gameface-modal').length;
            assert.equal(modalCount, expectedCount, `Progress Bars found: ${modalCount}, should have been ${expectedCount}.`);
        });
    });
}
