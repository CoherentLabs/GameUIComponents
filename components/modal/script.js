import {components} from 'coherent-gameface-components';
import template from './template.html';
import style from './style.css';

class Modal extends HTMLElement {
    constructor() {
        super();

        this.template = template;

        components.importStyleTag('gameface-modal', style);

        this.state = {
            display: 'none'
        };

        this.closeBound = e => this.close(e);
        this.url = '/components/modal/template.html';
    }

    connectedCallback() {
        components.loadResource(this)
            .then((response) => {
                this.template = response[1].cloneNode(true);
                components.render(this);
                this.attachEventListeners();
            })
            .catch(err => console.error(err));
    }

    attachEventListeners() {
        const closeButtons = this.querySelectorAll('.close');
        for (let i = 0; i < closeButtons.length; i++) {
            closeButtons[i].addEventListener('click', this.closeBound);
        }
    }

    close(e) {
        this.style.display = 'none';
    }
}

components.defineCustomElement('gameface-modal', Modal);

export { Modal };