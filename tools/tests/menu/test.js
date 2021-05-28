/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

function setupMenuTestPage() {
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

    const el = document.createElement('div');
    el.innerHTML = template;
    el.className = 'menu-test-wrapper';

    // Since we don't want to replace the whole content of the body using
    // innerHtml setter, we query only the current custom element and we replace
    // it with a new one; this is needed because the specs are executed in a random
    // order and sometimes the component might be left in a state that is not
    // ready for testing
    let currentElement = document.querySelector('.menu-test-wrapper');

    if (currentElement) {
        currentElement.parentElement.removeChild(currentElement);
    }

    document.body.appendChild(el);

    return new Promise(resolve => {
        setTimeout(resolve, 1000);
    });
}

describe('Menu Component Tests', () => {
    afterAll(() => {

        let currentElement = document.querySelector('.menu-test-wrapper');

        if (currentElement) {
            currentElement.parentElement.removeChild(currentElement);
        }

    });

    describe('Menu Component', () => {
        beforeEach(function (done) {
            setupMenuTestPage().then(done);
        });

        it('Should be rendered', function () {
            assert(document.querySelectorAll('menu-item')[0].textContent === 'Start Game', 'The textContent of the menu is not Start Game');
        });
    });


    describe('Menu Component', () => {
        beforeEach(function (done) {
            setupMenuTestPage().then(done);
        });

        it('Should open a nested menu', () => {
            click(document.getElementById("settings"), { bubbles: true });
            assert(document.querySelector('gameface-left-menu').style.display === 'flex', 'The display style of the menu is not flex.');
        });
    });

    describe('Menu Component', () => {
        beforeEach(function (done) {
            setupMenuTestPage().then(done);
        }, 3000);

        it('Should select an element', () => {
            click(document.getElementById("game"), { bubbles: true });
            assert(document.getElementById("game").classList.contains('active-menu-item') === true, 'The selected menu element is does not have value = game');
        });
    });

    describe('Menu Component', () => {
        beforeEach(function (done) {
            setupMenuTestPage().then(done);
        }, 3000);

        it('Should not select a disabled element', () => {
            click(document.getElementById("hero_gallery"), { bubbles: true });
            assert(document.getElementById("hero_gallery").classList.contains('active-menu-item') === false, 'Selected menu element is hero_gallery, but it should not be it.');
        });
    });
});
