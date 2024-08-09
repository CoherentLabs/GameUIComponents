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
        this.hide = this.hide.bind(this);
        this.show = this.show.bind(this);
        this.hideTimeOut = null;
        this._gravity = 'top';
        this._position = 'left';
    }

    get message() {
        return this._messageSlot.textContent;
    }

    set message(value) {
        this._messageSlot.innerHTML = value;
    }

    get targetElement() {
        return this._targetElement;
    }

    set targetElement(element) {
        this._targetElement = element;
    }

    get position() {
        return this._position;
    }

    set position(value) {
        this._position = value;
    }

    get gravity() {
        return this._gravity;
    }

    set gravity(value) {
        this._gravity = value;
    }

    init(data) {
        this.setupTemplate(data, () => {
            components.renderOnce(this);
            // attach event handlers here
            this.attachEventListeners();
            this._messageSlot = this.querySelector('.guic-toast-message').firstElementChild;
        });
    }

    connectedCallback() {
        this._gravity = this.getAttribute('gravity') || 'top';
        this._position = this.getAttribute('position') || 'left';
        this.timeout = this.getAttribute('timeout') || 0;
        this.elementSelector = this.getAttribute('target');
        this.triggerElement = this.targetElement || document.querySelector(this.elementSelector);

        if (!containersCreated) this.createToastContainers();

        components.loadResource(this)
            .then(this.init)
            .catch(err => console.error(err));
    }

    attachEventListeners() {
        const closeButton = this.querySelector('.guic-toast-close-btn');
        if (closeButton) closeButton.addEventListener('click', this.hide);

        if (this.triggerElement) {
            this.triggerElement.addEventListener('click', this.show);
        }
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
            container.appendChild(this);
            return;
        } else {
            console.error('No container found for the specified gravity and position');
        }
    }

    /**
     * Displays the toast
     */
    show() {
        this.appendToastToContainer(this.gravity, this.position);
        this.handleTimeOut();
        this.style.position = 'relative';
        this.style.display = 'block';
    }

    /**
     * Hides the toast
     */
    hide() {
        this.style.display = 'none';
        this.parentElement.removeChild(this);
    }

    /**
     * Setups the timeout of the toast, if missing attaches a close button
     */
    handleTimeOut() {
        if (this.hideTimeOut) clearTimeout(this.hideTimeOut);

        if (this.timeout > 0) {
            this.hideTimeOut = setTimeout(this.hide, this.timeout);
        }
    }
}
components.defineCustomElement('gameface-toast', GamefaceToast);
export default GamefaceToast;
