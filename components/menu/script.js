import components from 'coherent-gameface-components';
import template from './template.html';
import style from './style.css';

class GamefaceMenu extends HTMLElement {
    constructor() {
        super();

        this.template = template;
        this.orientation = this.getAttribute('orientation');

        components.importStyleTag('gameface-menu', style);
        this.url = '/components/menu/template.html';
    }

    connectedCallback() {
        // TODO: fix, this is a hack
        if (this.wasConnected) return;
        this.wasConnected = true;

        components.loadResource(this, this.template)
            .then((response) => {
                this.template = response[1].cloneNode(true);
                components.render(this);
                this.setOrientation();
            })
            .catch(err => {
                console.error(err);
            });
    }

    setOrientation() {
        const menuWrapper = this.querySelector('.menu-wrapper');
        menuWrapper.classList.add(this.orientation);
    }
}

class GamefaceMenuItem extends HTMLElement {
    constructor() {
        super();
        this.submenu = this.dataset.toggle;

        this.addEventListener('click', (e) => {
            if (this.submenu) this.toggleSubmenu(e);
        });
    }

    toggleSubmenu() {
        // todo: more than one submenu
        // todo: check if the submenu exists
        const submenu = this.querySelector(`#${this.submenu}`);
        const display = getComputedStyle(submenu).display === 'flex' ? 'none' : 'flex';
        submenu.style.display = display;
    }
}

components.defineCustomElement('gameface-menu', GamefaceMenu);
components.defineCustomElement('menu-item', GamefaceMenuItem);

export default GamefaceMenu;