/* eslint-disable require-jsdoc */
/* eslint-disable linebreak-style */
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/


import { components } from '../../lib/components.js';
// const components = new Components();

// import textInside from './templates/text-inside-template.html';
// import textOutside from './templates/text-outside-template.html';
const CustomElementValidator = components.CustomElementValidator;

const styles = `
gameface-switch {
    display: flex;
}

.guic-switch-toggle-container {
    display: flex;
    align-items: center;
}

.guic-switch-toggle-disabled {
    filter: grayscale(0.2);
    opacity: 0.5;
    pointer-events: none;
}

.guic-switch-toggle-false {
    margin-right: 10px;
    opacity: 1;
    transition: opacity 0.2s;
    ponter-events: none;
}

.guic-switch-toggle-true {
    margin-left: 10px;
    opacity: 1;
    transition: opacity 0.2s;
    ponter-events: none;
}

.guic-switch-toggle {
    width: 30px;
    height: 16px;
    position: relative;
    display: flex;
    align-items: center;
    background-color: rgb(180, 180, 180);
    border-radius: 15px;
    transition-property: background-color;
    transition-duration: 0.4s;
    box-sizing: border-box;
}

.guic-switch-toggle-inset {
    height: 20px;
    width: 35px;
    border-radius: 15px;
    border-right: 3px solid transparent;
}

.guic-switch-toggle-text-inside {
    height: 22px;
    border-radius: 10px;
    width: auto;
    border-right: 3px solid transparent;
}

.guic-switch-toggle-handle {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: white;
    position: absolute;
    left: 6%;
    transition-property: left, background-color, transform;
    transition-duration: 0.2s;
}

.guic-switch-toggle-handle-default {
    left: 0%;
    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.3);
}

.guic-switch-toggle-checked {
    background-color: rgba(36, 163, 214, 0.5);
}


.guic-switch-toggle-handle-checked {
    background-color: rgb(36, 163, 214);
    left: 100%;
    transform: translateX(-100%);
}

.guic-switch-text-hidden {
    opacity: 0;
}
`;

const textInsideTemplate = `<style>${styles}</style>
<div class="guic-switch-toggle-container">
    <div class="guic-switch-toggle guic-switch-toggle-text-inside">
        <div class="guic-switch-toggle-true guic-switch-text-hidden">
            <slot name="switch-checked"></slot>
        </div>
        <div class="guic-switch-toggle-false">
            <slot name="switch-unchecked"></slot>
        </div>
        <div class="guic-switch-toggle-handle"></div>
    </div>
</div>
`;

const textOutsideTemplate = `<style>${styles}</style>
<div class="guic-switch-toggle-container">
    <div class="guic-switch-toggle-false">
        <slot name="switch-unchecked"></slot>
    </div>
    <div class="guic-switch-toggle">
        <div class="guic-switch-toggle-handle"></div>
    </div>
    <div class="guic-switch-toggle-true">
        <slot name="switch-checked"></slot>
    </div>
</div>
`;
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
        // this.setupTemplate(data, () => {
        // Render the template
        // components.renderOnce(this);

        // Set the elements of the switch we'll be changing depending if it's checked or not
        this._switch = this.shadowRoot.querySelector('.guic-switch-toggle');
        this._handle = this.shadowRoot.querySelector('.guic-switch-toggle-handle');
        this._textChecked = this.shadowRoot.querySelector('.guic-switch-toggle-true');
        this._textUnchecked = this.shadowRoot.querySelector('.guic-switch-toggle-false');
        this._container = this.shadowRoot.querySelector('.guic-switch-toggle-container');
        this.setup();
        // });
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
        this.template = this._isTextInside ? textInsideTemplate : textOutsideTemplate;
        const shadow = this.attachShadow({ mode: 'open' });
        shadow.innerHTML = this.template;
        this.isRendered = true;
        this.init();
        // Load the template
        // components
        //     .loadResource(this)
        //     .then(this.init)
        //     .catch(err => console.error(err));
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
        this._container.addEventListener('mousedown', this.onClick);
    }


    isStatePropValid(name, value) {
        const schemaProperty = this.stateSchema[name];

        if (!schemaProperty) {
            console.error(`A property ${name} does not exist on type ${this.tagName.toLowerCase()}!`);
            return false;
        }

        const type = typeof value;
        if (schemaProperty.type.includes('array')) {
            const isArray = Array.isArray(value);
            if (isArray) return true;
        }

        if (!schemaProperty.type.includes(type)) {
            console.error(`Property ${name} can not be of type - ${type}. Allowed types are: ${schemaProperty.type.join(',')}`);
            return false;
        }

        return true;
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
        this._container.classList.toggle('guic-switch-toggle-disabled', disabled);
    }
}
customElements.define('gameface-switch', Switch);
export default Switch;
