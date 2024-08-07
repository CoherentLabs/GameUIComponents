/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Components } from 'coherent-gameface-components';
import template from './template.html';

const components = new Components();
const BaseComponent = components.BaseComponent;

/**
 * Class definition of the gameface toast custom element
 */
class GamefaceToast extends BaseComponent {
    /* eslint-disable require-jsdoc */
    constructor() {
        super();
        this.template = template;
        this.init = this.init.bind(this);
    }

    get message() {
        return this._messageSlot.textContent;
    }

    set targetElement(element) {
        this._targetElement = element;
    }

    get targetElement() {
        return this._targetElement;
    }

    init(data) {
        this.setupTemplate(data, () => {
            components.renderOnce(this);
            // attach event handlers here
            this.attachEventListeners();
            this._messageSlot = this.querySelector('.guic-toast').firstElementChild;
        });
    }

    connectedCallback() {
        components.loadResource(this)
            .then(this.init)
            .catch(err => console.error(err));
    }

    attachEventListeners() {
        // TODO
    }
    /* eslint-enable require-jsdoc */
}
components.defineCustomElement('gameface-toast', GamefaceToast);
export default GamefaceToast;
