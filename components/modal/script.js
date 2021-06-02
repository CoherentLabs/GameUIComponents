/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import components from 'coherent-gameface-components';
import template from './template.html';

class Modal extends HTMLElement {
    constructor() {
        super();

        this.template = template;

        this.state = {
            display: 'none'
        };

        this.closeBound = e => this.close(e);
        this.url = '/components/modal/template.html';
    }

    connectedCallback() {
        components.loadResource(this)
            .then((result) => {
                this.template = result.template;
                components.renderOnce(this);
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