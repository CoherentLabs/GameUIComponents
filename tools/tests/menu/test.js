function setupTestPage() {
    document.body.innerHTML = `
    <gameface-base-menu class="gameface-base-menu-component" orientation="horizontal">
    <menu-item id="game" slot="menu-item">Start Game</menu-item>
    <menu-item id="settings" slot="menu-item">
        Settings
        <gameface-left-menu class="nested-menu-settings" orientation="vertical">
            <menu-item slot="menu-item">Keyboard</menu-item>
            <menu-item slot="menu-item"> Mouse</menu-item>
        </gameface-left-menu>
    </menu-item>
    <menu-item slot="menu-item" id="hero_gallery" disabled>Hero Gallery</menu-item>
</gameface-base-menu>
    `;

    return new Promise(resolve => {
        setTimeout(() => {
            console.log('setup')
            resolve();
        }, 1000);
    });
}

describe('Menu Component', () => {
    beforeAll(async function() {
        await setupTestPage();
    }, 3000);

    it('Should be rendered', async function() {
        expect(document.querySelectorAll('menu-item')[0].textContent).toEqual('Start Game');
    });
});


describe('Menu Component', () => {
    beforeAll(async function() {
        await setupTestPage();
    }, 3000);

    it('Should open a nested menu', () => {
        click(document.getElementById("settings"), { bubbles: true });
        expect(document.querySelector('gameface-left-menu').style.display).toEqual('flex');
    });
});

describe('Menu Component', () => {
    beforeAll(async function() {
        await setupTestPage();
    }, 3000);

    it('Should select an element', () => {
        click(document.getElementById("game"), { bubbles: true });
        expect(document.getElementById("game").classList.contains('active')).toBe(true);
    });
});

describe('Menu Component', () => {
    beforeAll(async function() {
        await setupTestPage();
    }, 3000);

    it('Should not select a disabled element', () => {
        click(document.getElementById("hero_gallery"), { bubbles: true });
        expect(document.getElementById("hero_gallery").classList.contains('active')).toBe(false);
    });
});




