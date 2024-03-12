/* eslint-disable max-lines-per-function */
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * @param {string} template
 * @returns {Promise<void>}
 */
function setupTabs(template) {
    const el = document.createElement('div');
    el.className = 'test-wrapper';
    el.innerHTML = template;

    cleanTestPage('.test-wrapper');

    document.body.appendChild(el);

    return new Promise((resolve) => {
        waitForStyles(resolve);
    });
}

describe('Tabs Components', () => {
    const template = `<gameface-tabs></gameface-tabs>`;

    afterAll(() => cleanTestPage('gameface-tabs'));

    beforeEach(async () => {
        await setupTabs(template);
    });

    it('Should be rendered', () => {
        assert(document.querySelector('.guic-tabs-wrapper') !== null, 'Tabs component was not rendered.');
        assert(document.querySelector('.guic-tabs-header') !== null, 'Tabs component header was not rendered.');
        assert(document.querySelector('.guic-tabs-panel') !== null, 'Tabs component panel was not rendered.');
        // If the slots are not filled the default data should be there
        assert(document.querySelector('.guic-tabs-panel component-slot') !== null, 'Tabs component component slot was not rendered.');
    });

    it('Should set tab to active on click', () => {
        const tabs = document.getElementsByTagName('tab-heading');
        const firstTab = tabs[0];
        const secondTab = tabs[1];
        click(firstTab, { bubbles: true });
        assert(document.querySelector('tab-panel[selected="true"]').textContent === `${firstTab.textContent} Content`,
            `First tab's content is not correct`);
        click(secondTab, { bubbles: true });
        assert(document.querySelector('tab-panel[selected="true"]').textContent === `${secondTab.textContent} Content`, `Second tab's content is not correct.`);
    });
});

describe('Nested Tabs Components', () => {
    const template = `
    <gameface-tabs>
        <tab-heading slot="tab">Chapter One</tab-heading>
        <tab-panel slot="panel">
            <gameface-tabs>
                <tab-heading slot="tab">Nested Chapter One</tab-heading>
                <tab-panel slot="panel">Nested Chapter One Content</tab-panel>
                <tab-heading slot="tab">Nested Chapter Two</tab-heading>
                <tab-panel slot="panel">Nested Chapter Two Content</tab-panel>
                <tab-heading slot="tab">Nested Chapter Three</tab-heading>
                <tab-panel slot="panel">Nested Chapter Three Content</tab-panel>
            </gameface-tabs>
        </tab-panel>
        <tab-heading slot="tab">Chapter Two</tab-heading>
        <tab-panel slot="panel">Chapter Two Content</tab-panel>
        <tab-heading slot="tab">Chapter Three</tab-heading>
        <tab-panel slot="panel">Chapter Three Content</tab-panel>
        <tab-heading slot="tab">Chapter Four</tab-heading>
        <tab-panel slot="panel">Chapter Four Content</tab-panel>
    </gameface-tabs>
    `;

    afterAll(() => cleanTestPage('gameface-tabs'));

    beforeEach(async () => {
        await setupTabs(template);
    });

    it('Should be rendered', () => {
        assert(document.querySelector('.guic-tabs-wrapper') !== null, 'Tabs component was not rendered.');
        assert(document.querySelector('.guic-tabs-header') !== null, 'Tabs component header was not rendered.');
        assert(document.querySelector('.guic-tabs-panel') !== null, 'Tabs component panel was not rendered.');
        assert(document.querySelector('.guic-tabs-panel component-slot') === null, 'Tabs component component slot was rendered.');
    });

    it('Should set tab to active on click', async () => {
        const tabs = document.getElementsByTagName('tab-heading');
        const firstTab = tabs[0];
        const secondTab = tabs[4];
        const thirdTab = tabs[5];
        click(firstTab, { bubbles: true });
        assert(document.querySelector('tab-heading[selected="true"]').textContent === 'Chapter One', `First tab's header is not correct`);
        click(secondTab, { bubbles: true });
        assert(document.querySelectorAll('tab-panel[selected="true"]')[1].textContent === `Nested Chapter One Content`, `Second tab's content is not correct.`);
        click(thirdTab, { bubbles: true });
        assert(document.querySelectorAll('tab-panel[selected="true"]')[1].textContent === `Nested Chapter Two Content`, `Third tab's content is not correct.`);
    });
});

if (engine?.isAttached) {
    describe('Tabs Component (Gameface Data Binding Test)', () => {
        const templateName = 'model';

        const template = `<div data-bind-for="array:{{${templateName}.array}}"><gameface-tabs></gameface-tabs></div>`;

        afterAll(() => cleanTestPage('.test-wrapper'));

        beforeEach(async () => {
            await setupDataBindingTest(templateName, template, setupTabs);
        });

        it(`Should have populated 2 elements`, () => {
            const expectedCount = 2;
            const tabsCount = document.querySelectorAll('gameface-tabs').length;
            assert.equal(tabsCount, expectedCount, `Tabs found: ${tabsCount}, should have been ${expectedCount}.`);
        });
    });
}
