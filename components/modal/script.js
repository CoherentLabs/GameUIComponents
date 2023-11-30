/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Components } from 'coherent-gameface-components';
const components = new Components();
import template from './template.html';
import './cohtml.js';

window.engine.createJSModel('MyModel', {
    visible: true,
});

window.toggleModelState = function () {
    MyModel.visible = !MyModel.visible;
    global.engine.updateWholeModel(MyModel);
    global.engine.synchronizeModels();
};

const BaseComponent = components.BaseComponent;

/**
 * Class definition of the gameface modal custom element
 */
class Modal extends BaseComponent {
    // eslint-disable-next-line require-jsdoc
    constructor() {
        super();

        this.template = template;

        this.state = { display: 'none' };

        this.closeBound = e => this.close(e);
        this.url = '/components/modal/template.html';
        this.init = this.init.bind(this);
    }

    /**
     * Initialize the custom component.
     * Set template, attach event listeners, setup initial state etc.
     * @param {object} data
    */
    init(data) {
        this.setupTemplate(data, () => {
            debugger
            components.renderOnce(this);
            this.attachEventListeners();
        });
    }

    // eslint-disable-next-line require-jsdoc
    connectedCallback() {
        components.loadResource(this)
            .then(this.init)
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
