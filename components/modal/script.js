/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import components from 'coherent-gameface-components';
import template from './template.html';

/**
 * Class definition of the gameface modal custom element
 */
class Modal extends HTMLElement {
    // eslint-disable-next-line require-jsdoc
    constructor() {
        super();

        this.template = template;

        this.state = { display: 'none' };

        this.closeBound = e => this.close(e);
        this.url = '/components/modal/template.html';
    }

    // eslint-disable-next-line require-jsdoc
    connectedCallback() {
        components.loadResource(this)
            .then((result) => {
                this.template = result.template;
                components.renderOnce(this);
                this.attachEventListeners();
            })
            .catch(err => console.error(err));
    }

    /**
     * Method that will attach click event listeners to all close buttons
     */
    attachEventListeners() {
        const closeButtons = this.querySelectorAll('.close');
        for (let i = 0; i < closeButtons.length; i++) {
            closeButtons[i].addEventListener('click', this.closeBound);
        }
    }

    /**
     * Handler for closing the modal
     */
    close() {
        this.style.display = 'none';
    }
}

components.defineCustomElement('gameface-modal', Modal);

export { Modal };
