/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Components } from 'coherent-gameface-components';
import template from './template.html';

const components = new Components();
const BaseComponent = components.BaseComponent;
const POSITIONS = ['left', 'right', 'center'];
const GRAVITY = ['top', 'bottom'];
const CLASS_PREFIX = 'guic-toast-';

/**
 * Class definition of the gameface toast custom element
 */
class GamefaceToast extends BaseComponent {
    // eslint-disable-next-line require-jsdoc
    static get observedAttributes() { return ['position', 'target', 'timeout']; }
    static wrapperContainers = [];
    /* eslint-disable require-jsdoc */
    constructor() {
        super();
        this.template = template;

        this.init = this.init.bind(this);

        this.hide = this.hide.bind(this);
        this.show = this.show.bind(this);
        this.handleAnimationEnd = this.handleAnimationEnd.bind(this);

        this.hideTimeOut = null;

        this.stateSchema = {
            position: { type: ['string'] },
            target: { type: ['string', 'object'] },
            timeout: { type: ['number'] },
            isAppended: { type: ['boolean'] },
        };

        this.state = {
            position: 'top-left',
            target: null,
            timeout: 0,
            isAppended: false,
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

    get timeout() {
        return this.state.timeout;
    }

    set timeout(value) {
        this.setAttribute('timeout', value);
    }

    get visible() {
        return this.classList.contains('guic-toast-show');
    }

    init(data) {
        this.setupTemplate(data, () => {
            components.renderOnce(this);
            if (this.hasAttribute('position')) this.updatePositionState(this.getAttribute('position'));
            if (this.hasAttribute('timeout')) this.updateAttributeState('timeout', parseInt(this.getAttribute('timeout')) || 0);
            if (this.hasAttribute('target')) this.updateAttributeState('target', this.getAttribute('target'));
            if (this.parentElement.classList.contains('guic-toast-container')) this.state.isAppended = true;

            this._messageSlot = this.querySelector('.guic-toast-message').firstElementChild;
            this._closeButton = this.querySelector('.guic-toast-close-btn');

            if (GamefaceToast.wrapperContainers.length === 0) this.createToastContainers();

            // attach event handlers here
            this.attachEventListeners();
            this.isRendered = true;
        });
    }

    connectedCallback() {
        components.loadResource(this)
            .then(this.init)
            .catch(err => console.error(err));
    }

    disconnectedCallback() {
        this.detachListeners();
        this.isRendered = false;
    }

    attachEventListeners() {
        this.addEventListener('animationend', this.handleAnimationEnd);
    }

    detachListeners() {
        this.removeEventListener('animationend', this.handleAnimationEnd);
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

        this.updateAttributeState(name, newValue, oldValue);
    }

    /**
     * Will update the state properties linked with the checkbox attributes
     * @param {string} name
     * @param {string|boolean|array} value
     * @param {string|boolean|array} oldValue
     */
    updateAttributeState(name, value, oldValue) {
        switch (name) {
            case 'position':
                this.updatePositionState(value, oldValue);
                this.appendToastToContainer();
                break;
            case 'timeout':
                this.updateTimeoutState(value);
                break;
            case 'target':
                this.updateTargetState(name, value);
                break;
        }
    }

    /**
     * Will update the toast's timeout state
     * @param {string} value
     * @returns {void}
     */
    updateTimeoutState(value) {
        const newValue = parseInt(value);
        if (isNaN(newValue)) return console.error(`Property timeout can not be of type - NaN. Allowed types are: ${this.stateSchema['timeout'].type.join(',')}`);

        this.updateState('timeout', newValue);
        this.handleTimeOut();
    }

    /**
     * Updates the toast's position state and checks if the position attribute has correct value.
     * @param {string} newValue - Should be some of top-left, top-right, top-center, bottom-left, bottom-right, bottom-center
     * @param {string} oldValue
     * @returns {void}
     */
    updatePositionState(newValue, oldValue) {
        if (newValue === oldValue || !newValue) return;

        const [gravity, position] = newValue.split('-');
        if (!GRAVITY.includes(gravity) || !POSITIONS.includes(position)) {
            return console.warn(`${gravity}-${position} is not valid position property. Use the following syntax - "top/bottom-left/right/center"`);
        }

        this.state.isAppended = false;
        this.updateState('position', newValue);
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

        const newTarget = document.querySelector(value);

        if (!newTarget) return console.error(`Can't find an element with the selector "${value}".`);

        if (this.state.target) this.state.target.removeEventListener('click', this.show);

        this.state.target = newTarget;
        this.state.target.addEventListener('click', this.show);
    }

    /**
     * Creates containers for all possible toast positions
    */
    createToastContainers() {
        const body = document.querySelector('body');
        GRAVITY.forEach((gravity) => {
            POSITIONS.forEach((position) => {
                const toastContainer = document.createElement('div');
                toastContainer.classList.add('guic-toast-container', `${CLASS_PREFIX}${gravity}`, `${CLASS_PREFIX}${position}`);
                body.appendChild(toastContainer);
                GamefaceToast.wrapperContainers.push(toastContainer);
            });
        });
    }

    /**
     * Appends the toast to one of the containers depending on the position
     * @param {string} position - top-left, top-right, top-center, bottom-left, bottom-right, bottom-center
    */
    appendToastToContainer() {
        if (this.state.isAppended) return;

        const [gravity, position] = this.position.split('-');
        const container = document.querySelector(`.guic-toast-container.${CLASS_PREFIX}${gravity}.${CLASS_PREFIX}${position}`);
        if (!container) return;

        container.appendChild(this);
        this.handleCloseButton();
    }

    /**
     * Displays the toast
     */
    show() {
        if (this.visible) this.classList.remove('guic-toast-show');

        this.appendToastToContainer();
        this.classList.add('guic-toast-show');
        this.handleTimeOut();
    }

    /**
     * Hides the toast
     */
    hide() {
        clearTimeout(this.hideTimeOut);
        if (this.isRendered) this.classList.add('guic-toast-hide');
    }

    /**
     * Setups the timeout of the toast
     */
    handleTimeOut() {
        if (!this.visible) return;

        if (this.hideTimeOut) clearTimeout(this.hideTimeOut);

        if (this.state.timeout > 0) {
            this.hideTimeOut = setTimeout(this.hide, this.state.timeout);
        }
    }

    /**
     * Setups the close button of the toast
     */
    async handleCloseButton() {
        await components.waitForFrames(() => {
            const { clientWidth, clientHeight } = this._closeButton.firstElementChild;
            if (clientWidth && clientHeight) this._closeButton.addEventListener('click', this.hide);
        }, 2);
    }

    /**
     * Handles animation event for removing toast from the DOM
     * @param {AnimationEvent} event
     */
    handleAnimationEnd(event) {
        if (event.animationName === 'guic-toast-fade-out') {
            this.classList.remove('guic-toast-show', 'guic-toast-hide');
        }
    }
}
components.defineCustomElement('gameface-toast', GamefaceToast);
export default GamefaceToast;
