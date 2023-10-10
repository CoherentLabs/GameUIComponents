/* eslint-disable linebreak-style */
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/


import { Components } from 'coherent-gameface-components';
const components = new Components();

import textInside from './templates/text-inside-template.html';
import textOutside from './templates/text-outside-template.html';
const CustomElementValidator = components.CustomElementValidator;

/**
 * Switch component, that allows you to switch between true and false
 */
class Switch extends CustomElementValidator {
    // eslint-disable-next-line require-jsdoc
    static get observedAttributes() { return ['checked', 'disabled', 'type']; }

    // eslint-disable-next-line require-jsdoc
    get value() {
        const value = this.getAttribute('value');
        if (this.isFormElement(this)) return value || 'on';
        return value;
    }

    // eslint-disable-next-line require-jsdoc
    set value(value) {
        this.setAttribute('value', value);
    }

    // eslint-disable-next-line require-jsdoc
    get name() {
        return this.getAttribute('name');
    }

    // eslint-disable-next-line require-jsdoc
    set name(value) {
        this.setAttribute('name', value);
    }

    // eslint-disable-next-line require-jsdoc
    get type() {
        return this.state.type;
    }

    // eslint-disable-next-line require-jsdoc
    set type(value) {
        this.setAttribute('type', value);
    }

    // eslint-disable-next-line require-jsdoc
    get disabled() {
        return this.state.disabled;
    }

    // eslint-disable-next-line require-jsdoc
    set disabled(value) {
        value ? this.setAttribute('disabled', '') : this.removeAttribute('disabled');
    }

    // eslint-disable-next-line require-jsdoc
    get checked() {
        return this.state.checked;
    }

    // eslint-disable-next-line require-jsdoc
    set checked(value) {
        value ? this.setAttribute('checked', '') : this.removeAttribute('checked');
    }

    // eslint-disable-next-line require-jsdoc
    constructor() {
        super();

        this.onClick = this.onClick.bind(this);
        this.init = this.init.bind(this);

        this.stateSchema = {
            checked: { type: ['boolean'] },
            disabled: { type: ['boolean'] },
            type: { type: ['string'] },
        };

        this.state = {
            type: '',
            checked: false,
            disabled: false,
        };
    }

    /**
     * Custom element lifecycle method. Called when an attribute is changed.
     * @param {string} name
     * @param {string} oldValue
     * @param {string|boolean} newValue
     */
    attributeChangedCallback(name, oldValue, newValue) {
        if (!this.isRendered) return;

        this.updateAttributeState(name, newValue);
    }

    /**
     * Will update the state properties linked with the checkbox attributes
     * @param {string} name
     * @param {string|boolean} value
     */
    updateAttributeState(name, value) {
        switch (name) {
            case 'checked':
                this.updateCheckedState(value !== null);
                break;
            case 'disabled':
                this.updateDisabledState(value !== null);
                break;
            case 'type':
                this.reRender();
                break;
        }
    }

    /**
     * Update the checkbox's state.
     * @param {string} name - the name of the prop
     * @param {string | boolean} value - the value of the the prop
     * @returns {void}
     */
    updateState(name, value) {
        if (!this.isStatePropValid(name, value)) return;
        this.state[name] = value;
    }

    /**
     * Update the switch's disabled state.
     * Set relevant styles and tabindex.
     * @param {boolean} value
     */
    updateDisabledState(value) {
        this.updateState('disabled', value);
        this.toggleDisabled(value);
    }

    /**
     * Update the state of the switch and its style
     * @param {boolean} value - whether the switch is checked or not
     */
    updateCheckedState(value) {
        this.updateState('checked', value);
        this.dispatchEvent(new CustomEvent('switch_toggle', { detail: value }));
        this.toggleClasses(value);
    }

    /**
     * Initialize the custom component.
     * Set template, attach event listeners, setup initial state etc.
     * @param {object} data
    */
    init(data) {
        this.setupTemplate(data, () => {
            // Render the template
            components.renderOnce(this);

            // Set the elements of the switch we'll be changing depending if it's checked or not
            this._switch = this.querySelector('.guic-switch-toggle');
            this._handle = this.querySelector('.guic-switch-toggle-handle');
            this._textChecked = this.querySelector('.guic-switch-toggle-true');
            this._textUnchecked = this.querySelector('.guic-switch-toggle-false');

            this.setup();
        });
    }

    /**
     * Called when the element is attached to the DOM
     */
    connectedCallback() {
        this.state.disabled = this.hasAttribute('disabled');
        this.state.checked = this.hasAttribute('checked');

        // The type of the switch. There are currently 3 possible - default, inset and text-inside
        this.state.type = this.getAttribute('type');

        // Helpers for easy readability
        this._isDefault = this.state.type !== 'inset' && this.state.type !== 'text-inside';
        this._isInset = this.state.type === 'inset';
        this._isTextInside = this.state.type === 'text-inside';

        // Set the template based if the text is inside or outside
        this.template = this._isTextInside ? textInside : textOutside;

        // Load the template
        components
            .loadResource(this)
            .then(this.init)
            .catch(err => console.error(err));
    }

    /**
     * Will re-render the rangeslider from scratch
     */
    reRender() {
        this.template = undefined;
        this.isRendered = false;
        this.connectedCallback();
    }

    /**
     * Checks if the switch value is missing
     * @returns {boolean}
     */
    valueMissing() {
        if (this.isRequired() && !this.checked) return true;
        return false;
    }

    /**
     * Checks if the switch should be serialized when it is set inside a gameface form control element
     * @returns {boolean}
     */
    willSerialize() {
        if (!this.checked || this.nameMissing()) return false;
        return true;
    }

    /**
     * Sets up the switch based on the attributes it has and attaches the event listeners
     */
    setup() {
        if (this._isDefault) this._handle.classList.add('guic-switch-toggle-handle-default');
        if (this._isInset) this._switch.classList.add('guic-switch-toggle-inset');
        this.toggleClasses(this.checked);
        this.toggleDisabled(this.disabled);

        this.attachEventListeners();
    }

    // eslint-disable-next-line require-jsdoc
    attachEventListeners() {
        this.firstChild.addEventListener('mousedown', this.onClick);
    }

    /**
     * Changes the styles of the switch and if it's checked
     */
    onClick() {
        this.checked = !this.checked;
    }

    /**
     * Changes the classes of the switch elements
     * @param {boolean} checked
     */
    toggleClasses(checked = false) {
        this._handle.classList.toggle('guic-switch-toggle-handle-checked', checked);
        this._switch.classList.toggle('guic-switch-toggle-checked', checked);

        if (this._isTextInside) {
            this._textChecked.classList.toggle('guic-switch-text-hidden', checked ? false : true);
            this._textUnchecked.classList.toggle('guic-switch-text-hidden', checked ? true : false);
        }
    }

    /**
     * Toggles the disabled state of the switch. Can be used externaly to enable or disabled the switch
     * @param {boolean} disabled
     */
    toggleDisabled(disabled = false) {
        this.firstChild.classList.toggle('guic-switch-toggle-disabled', disabled);
    }
}
components.defineCustomElement('gameface-switch', Switch);
export default Switch;
