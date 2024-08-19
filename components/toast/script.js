/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Components } from 'coherent-gameface-components';
import template from './template.html';

const components = new Components();
const BaseComponent = components.BaseComponent;
const TOAST_POSITIONS = ['top left', 'top right', 'bottom left', 'bottom right', 'top center', 'bottom center'];
const CLASS_PREFIX = 'guic-toast-';
let containersCreated = false;
let animationEventAttached = false;

/**
 * Class definition of the gameface toast custom element
 */
class GamefaceToast extends BaseComponent {
    // eslint-disable-next-line require-jsdoc
    static get observedAttributes() { return ['gravity', 'position', 'target', 'timeout']; }
    /* eslint-disable require-jsdoc */
    constructor() {
        super();
        this.template = template;

        this.init = this.init.bind(this);

        this.hide = this.hide.bind(this);
        this.show = this.show.bind(this);

        this.hideTimeOut = null;

        this.stateSchema = {
            gravity: { type: ['string'] },
            position: { type: ['string'] },
            target: { type: ['string', 'object'] },
            timeout: { type: ['number'] },
        };

        this.state = {
            gravity: 'top',
            position: 'left',
            target: null,
            timeout: 0,
        };
    }

    get message() {
        return this._messageSlot.textContent;
    }

    set message(value) {
        this._messageSlot.innerHTML = value;
    }

    get target() {
        return this.state.target;
    }

    set target(element) {
        this.setAttribute('target', element);
    }

    get position() {
        return this.state.position;
    }

    set position(value) {
        this.setAttribute('position', value);
    }

    get gravity() {
        return this.state.gravity;
    }

    set gravity(value) {
        this.setAttribute('gravity', value);
    }

    init(data) {
        this.setupTemplate(data, () => {
            components.renderOnce(this);
            if (this.hasAttribute('gravity')) this.updateAttributeState('gravity', this.getAttribute('gravity'));
            if (this.hasAttribute('position')) this.updateAttributeState('position', this.getAttribute('position'));
            if (this.hasAttribute('timeout')) this.updateAttributeState('timeout', parseInt(this.getAttribute('timeout')) || 0);
            if (this.hasAttribute('target')) this.updateAttributeState('target', this.getAttribute('target'));

            this._messageSlot = this.querySelector('.guic-toast-message').firstElementChild;

            if (!containersCreated) this.createToastContainers();
            // attach event handlers here
            this.attachEventListeners();
        });
    }

    connectedCallback() {
        components.loadResource(this)
            .then(this.init)
            .catch(err => console.error(err));
    }

    attachEventListeners() {
        if (!animationEventAttached) {
            document.addEventListener('animationend', (event) => {
                if (event.animationName === 'guic-toast-fade-out') event.target.parentElement.removeChild(event.target);
            });
            animationEventAttached = true;
        }
    }
    /* eslint-enable require-jsdoc */

    /**
     * Custom element lifecycle method. Called when an attribute is changed.
     * @param {string} name
     * @param {string} oldValue
     * @param {string|boolean|array} newValue
     */
    attributeChangedCallback(name, oldValue, newValue) {
        if (!this.isRendered) return;

        this.updateAttributeState(name, newValue);
    }

    /**
     * Will update the state properties linked with the checkbox attributes
     * @param {string} name
     * @param {string|boolean|array} value
     */
    updateAttributeState(name, value) {
        switch (name) {
            case 'position':
            case 'gravity':
            case 'timeout':
                this.updateState(name, value);
                break;
            case 'target':
                this.updateTargetState(name, value);
                break;
        }
    }

    /**
     * Update the toasts's state.
     * @param {string} name - the name of the prop
     * @param {string | boolean} value - the value of the the prop
     * @returns {void}
     */
    updateState(name, value) {
        if (!this.isStatePropValid(name, value)) return;
        this.state[name] = value;
    }

    /**
     * Update the toasts's state.
     * @param {string} name - the name of the prop
     * @param {string | boolean} value - the value of the the prop
     * @returns {void}
     */
    updateTargetState(name, value) {
        if (!this.isStatePropValid(name, value)) return;

        if (value instanceof HTMLElement === false) {
            this.state.target = document.querySelector(value);
        }
        this.state.target.addEventListener('click', this.show);
    }

    /**
     * Creates containers for all possible toast positions
    */
    createToastContainers() {
        const body = document.querySelector('body');
        TOAST_POSITIONS.forEach((containerPosition) => {
            const [vertical, horizontal] = containerPosition.split(' ');
            const toastContainer = document.createElement('div');
            toastContainer.classList.add('guic-toast-container', `${CLASS_PREFIX}${vertical}`, `${CLASS_PREFIX}${horizontal}`);
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
        const container = document.querySelector(`.guic-toast-container.${CLASS_PREFIX}${gravity}.${CLASS_PREFIX}${position}`);

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
        this.appendToastToContainer(this.state.gravity, this.state.position);
        this.handleTimeOut();
        this.handleCloseButton();
        this.classList.add('guic-toast-show');
        this.classList.remove('guic-toast-hide');
    }

    /**
     * Hides the toast
     */
    hide() {
        if (this.isRendered) this.classList.add('guic-toast-hide');
    }

    /**
     * Setups the timeout of the toast
     */
    handleTimeOut() {
        if (this.hideTimeOut) clearTimeout(this.hideTimeOut);

        if (this.state.timeout > 0) {
            this.hideTimeOut = setTimeout(this.hide, this.state.timeout);
        }
    }

    /**
     * Setups the close button of the toast
     */
    handleCloseButton() {
        const closeButton = this.querySelector('.guic-toast-close-btn');
        if (closeButton.firstElementChild.clientWidth && closeButton.firstElementChild.clientHeight) {
            closeButton.addEventListener('click', this.hide);
        }
    }
}
components.defineCustomElement('gameface-toast', GamefaceToast);
export default GamefaceToast;
