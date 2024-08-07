/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Components } from 'coherent-gameface-components';
import template from './template.html';

const components = new Components();
const BaseComponent = components.BaseComponent;
const TOAST_POSITIONS = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
let containersCreated = false;

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
        this.gravity = this.getAttribute('gravity') || 'top';
        this.position = this.getAttribute('position') || 'left';
        this.init = this.init.bind(this);

        if (!containersCreated) this.createToastContainers();
        this.appendToastToContainer(this.gravity, this.position);

        components.loadResource(this)
            .then(this.init)
            .catch(err => console.error(err));
    }

    attachEventListeners() {
        // TODO
    }
    /* eslint-enable require-jsdoc */

    /**
     * Creates containers for all possible toast positions
    */
    createToastContainers() {
        const body = document.querySelector('body');
        TOAST_POSITIONS.forEach((containerPosition) => {
            const toastContainer = document.createElement('div');
            toastContainer.classList.add('guic-toast-container', containerPosition);
            body.appendChild(toastContainer);
        });

        containersCreated = true;
    }

    /**
     * Appends the toast to one of the containers depending on the gravity and position
     * @param {string} gravity - top, bottom.
     * @param {string} position - left, right, center
    */
    appendToastToContainer(gravity, position) {
        const container = document.querySelector(`.guic-toast-container.${gravity}-${position}`);

        if (container) {
            container.appendChild(this);  // Append the current instance of the component to the container
        } else {
            console.error('No container found for the specified gravity and position');
        }
    }
}
components.defineCustomElement('gameface-toast', GamefaceToast);
export default GamefaceToast;
