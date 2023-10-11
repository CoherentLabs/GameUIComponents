/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * @param {string} template
 * @returns {string}
 */
function setupMenuTestPage(template) {
    const el = document.createElement('div');
    el.innerHTML = template;
    el.className = 'menu-test-wrapper';

    cleanTestPage('.menu-test-wrapper');

    document.body.appendChild(el);

    return new Promise((resolve) => {
        waitForStyles(resolve);
    });
}

/* eslint-disable max-lines-per-function */
describe('Menu Component Tests', () => {
    afterAll(() => cleanTestPage('.menu-test-wrapper'));

    describe('Menu Component', () => {
        const template = `
        <gameface-menu orientation="horizontal">
            <menu-item id="game" slot="menu-item">Start Game</menu-item>
            <menu-item id="settings" slot="menu-item">
                Settings
                <gameface-left-menu class="nested-menu-settings" orientation="vertical">
                    <menu-item slot="menu-item">Keyboard</menu-item>
                    <menu-item slot="menu-item"> Mouse</menu-item>
                </gameface-left-menu>
            </menu-item>
            <menu-item slot="menu-item" id="hero_gallery" disabled>Hero Gallery</menu-item>
        </gameface-menu>
        `;

        beforeEach(async () => {
            await setupMenuTestPage(template);
        });

        it('Should be rendered', () => {
            assert(document.querySelectorAll('menu-item')[0].textContent === 'Start Game', 'The textContent of the menu is not Start Game');
        });

        it('Should open a nested menu', () => {
            click(document.getElementById('settings'), { bubbles: true });
            assert(document.querySelector('gameface-left-menu').style.display === 'flex', 'The display style of the menu is not flex.');
        });

        it('Should select an element', () => {
            click(document.getElementById('game'), { bubbles: true });
            assert(document.getElementById('game').classList.contains('guic-menu-active-menu-item') === true, 'The selected menu element is does not have value = game');
        });

        it('Should not select a disabled element', () => {
            const heroGallery = document.getElementById('hero_gallery');

            click(heroGallery, { bubbles: true });
            assert(heroGallery.classList.contains('active-menu-item') === false, 'Selected menu element is hero_gallery, but it should not be it.');
        });
    });

    if (engine?.isAttached) {
        describe('Menu Component (Gameface Data Binding Test)', () => {
            const templateName = 'model';

            const template = `
            <div data-bind-for="array:{{${templateName}.array}}">
                <gameface-menu orientation="horizontal">
                    <menu-item id="game" slot="menu-item">Start Game</menu-item>
                    <menu-item id="settings" slot="menu-item">
                        Settings
                        <gameface-left-menu class="nested-menu-settings" orientation="vertical">
                            <menu-item slot="menu-item">Keyboard</menu-item>
                            <menu-item slot="menu-item"> Mouse</menu-item>
                        </gameface-left-menu>
                    </menu-item>
                    <menu-item slot="menu-item" id="hero_gallery" disabled>Hero Gallery</menu-item>
                </gameface-menu>
            </div>
            `;

            beforeEach(async () => {
                await setupDataBindingTest(templateName, template, setupMenuTestPage);
            });

            it(`Should have populated 2 elements`, () => {
                const expectedCount = 2;
                const menuCount = document.querySelectorAll('gameface-menu').length;
                assert.equal(menuCount, expectedCount, `Menus found: ${menuCount}, should have been ${expectedCount}.`);
            });
        });
    }
});
