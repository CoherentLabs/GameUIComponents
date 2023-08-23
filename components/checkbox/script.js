/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { Components } from 'coherent-gameface-components';
import template from './template.html';

const components = new Components();
const CustomElementValidator = components.CustomElementValidator;

/**
 * Class definition of the gameface checkbox custom data binding attribute
 */
class MyAttributeHandler {
    /**
     * This will be executed only once per element when the attribute attached to it is bound with a model.
     * Set up any initial state, event handlers, etc. here.
     * @param {HTMLElement} element
     * @param {string|boolean} value
     */
    init(element, value) {
        if (value) element.setAttribute('checked', '');
    }

    /**
     * This will be executed every time that the model which the attribute is attached to is synchronized.
     * @param {HTMLElement} element
     * @param {string|boolean} value
     */
    update(element, value) {
        if (!value) element.removeAttribute('checked');
        if (value) element.setAttribute('checked', '');
    }
}

/**
 * Class definition of the gameface checkbox custom element
 */
class Checkbox extends CustomElementValidator {
    // eslint-disable-next-line require-jsdoc
    constructor() {
        super();

        this.template = template;

        this.state = {
            checked: false,
        };

        this.url = '/components/checkbox/template.html';
    }

    // eslint-disable-next-line require-jsdoc
    get value() {
        return this.getAttribute('value') || 'on';
    }

    // eslint-disable-next-line require-jsdoc
    get disabled() {
        return this.hasAttribute('disabled');
    }

    // eslint-disable-next-line require-jsdoc
    set checked(value) {
        value ? this.setAttribute('checked', '') : this.removeAttribute('checked');
        this.updateState(value && true);
    }

    // eslint-disable-next-line require-jsdoc
    set disabled(value) {
        if (value) {
            this.firstChild.classList.add('guic-checkbox-disabled');
            this.setAttribute('disabled', '');
            this.setAttribute('tabindex', '-1');
        } else {
            this.firstChild.classList.remove('guic-checkbox-disabled');
            this.removeAttribute('disabled');
            this.setAttribute('tabindex', '0');
        }
    }

    /**
     * Retrieves if the value is missing
     * @returns {boolean}
     */
    valueMissing() {
        return this.hasAttribute('required') && !this.state.checked;
    }

    /**
     * Method that checks if the data from the checkbox should be serialized
     * @returns {boolean}
     */
    willSerialize() {
        if (!this.state.checked || this.nameMissing()) return false;
        return true;
    }

    /**
     * Initialize the custom component.
     * Set template, attach event listeners, setup initial state etc.
     * @param {object} data
    */
    init(data) {
        this.setupTemplate(data, () => {
            components.renderOnce(this);

            this.addEventListener('click', this.toggleChecked);
            this.checked = this.hasAttribute('checked');
            this.disabled = this.disabled ? true : false;

            const event = new Event('ready');
            const isCohtml = navigator.userAgent.match('cohtml');

            if (isCohtml) {
                window.engine.on('Ready', () => {
                    engine.registerBindingAttribute('model-checked', MyAttributeHandler);
                    this.dispatchEvent(event);
                });
            } else {
                this.dispatchEvent(event);
            }
        });
    }

    // eslint-disable-next-line require-jsdoc
    connectedCallback() {
        this.init = this.init.bind(this);
        this.toggleChecked = this.toggleChecked.bind(this);

        components.loadResource(this)
            .then(this.init)
            .catch(err => console.error(err));
    }

    /**
     * Get an array of observed attributes
     * @returns {Array<string>}
     */
    static get observedAttributes() { return ['checked']; }

    /**
     * Custom element lifecycle method. Called when an attribute is changed.
     * @param {string} name
     * @param {string} oldValue
     * @param {string|boolean} newValue
     */
    attributeChangedCallback(name, oldValue, newValue) {
        if (name !== 'checked') return;
        const checked = newValue !== null;
        this.updateState(checked);
    }

    /**
     * Toggles the checkbox value. Called on click.
     * Updated the state and the visibility of the check mark.
    */
    toggleChecked() {
        if (this.disabled) return;

        this.checked = !this.state.checked;
    }

    /**
     * Update the state of the checkbox and its style
     * @param {boolean} checked - whether the checkbox is checked or not
     */
    updateState(checked) {
        this.state.checked = checked;
        this.querySelector('[data-name="check-mark"]').style.display = checked ? 'block' : 'none';
    }
}

components.defineCustomElement('gameface-checkbox', Checkbox);

export default Checkbox;
