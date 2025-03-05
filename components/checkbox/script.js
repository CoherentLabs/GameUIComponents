/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { components } from '../../lib/components.js';
const { CustomElementValidator } = components;

const template = `
<style>
.guic-checkbox-wrapper {
    position: relative;
    margin-top: 10px;
    display: flex;
    flex-direction: row;
}

.guic-checkbox-wrapper-inner {
    background-color: var(--default-color-white);
}

.guic-checkbox-background {
    box-sizing: border-box;
    top: 0px;
    width: 30px;
    height: 30px;
    border-width: 5px;
    border-style: solid;
    border-top-color: var(--default-color-gray);
    border-right-color: var(--default-color-gray);
    border-bottom-color: var(--default-color-gray);
    border-left-color: var(--default-color-gray);
}

.guic-check-mark {
    position: absolute;
    top: 5px;
    left: 5px;
    width: 20px;
    height: 20px;
    background-color: var(--default-color-blue);
}

.guic-checkbox-label {
    position: relative;
    padding-left: 10px;
    line-height: 30px;
    user-select: none;
}

.guic-checkbox-disabled {
    filter: grayscale(0.2);
    opacity: 0.5;
    pointer-events: none;
}
</style>
<div class="guic-checkbox-wrapper">
    <div class="guic-checkbox-wrapper-inner">
        <slot class="guic-checkbox-background" name="checkbox-background">
            <div></div>
        </slot>
        <slot class="guic-check-mark" name="check-mark" style="display: none;">
            <div></div>
        </slot>
    </div>
    <slot class="guic-checkbox-label" name="checkbox-label"><span>Click me!</span></slot>
</div>
`;

// const components = new Components();
// const CustomElementValidator = components.CustomElementValidator;

/**
 * Class definition of the gameface checkbox custom element
 */
class Checkbox extends CustomElementValidator {
    // eslint-disable-next-line require-jsdoc
    static get observedAttributes() { return ['checked', 'disabled', 'value', 'name']; }

    // eslint-disable-next-line require-jsdoc
    constructor() {
        super();
        this.template = template;

        this.stateSchema = {
            checked: { type: ['boolean'] },
            disabled: { type: ['boolean'] },
            value: { type: ['string'] },
            name: { type: ['string'] },
        };

        this.state = {
            checked: false,
            disabled: false,
            name: '',
            value: 'on',
        };

        this.toggleChecked = this.toggleChecked.bind(this);

        this.url = '/components/checkbox/template.html';
        this.init = this.init.bind(this);
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
            case 'value':
            case 'name':
                this.updateState(name, value);
                break;
        }
    }

    /**
     * Update the state of the checkbox and its style
     * @param {boolean} value - whether the checkbox is checked or not
     */
    updateCheckedState(value) {
        this.updateState('checked', value);
        this.shadowRoot.querySelector('slot[name="check-mark"]').style.display = value ? 'block' : 'none';
    }

    // eslint-disable-next-line require-jsdoc
    get value() {
        return this.state.value;
    }

    // eslint-disable-next-line require-jsdoc
    set value(value) {
        this.setAttribute('value', value);
    }

    // eslint-disable-next-line require-jsdoc
    get name() {
        return this.state.name;
    }

    // eslint-disable-next-line require-jsdoc
    set name(name) {
        this.setAttribute('name', name);
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
    get disabled() {
        return this.state.disabled;
    }

    // eslint-disable-next-line require-jsdoc
    set disabled(value) {
        if (value) {
            this.setAttribute('disabled', '');
        } else {
            this.removeAttribute('disabled');
        }
    }

    /**
     * Update the checkbox's disabled state.
     * Set relevant styles and tabindex.
     * @param {boolean} value
     */
    updateDisabledState(value) {
        this.updateState('disabled', value);

        if (value) {
            this.componentWrapper.classList.add('guic-checkbox-disabled');
            this.setAttribute('tabindex', '-1');
        } else {
            this.componentWrapper.classList.remove('guic-checkbox-disabled');
            this.setAttribute('tabindex', '0');
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
     * Will set the checkbox initial state
     */
    initCheckboxState() {
        if (this.hasAttribute('checked')) this.updateAttributeState('checked', true);
        if (this.hasAttribute('disabled')) this.updateAttributeState('disabled', true);
        if (this.hasAttribute('value')) this.updateAttributeState('value', this.getAttribute('value'));
        if (this.hasAttribute('name')) this.updateAttributeState('name', this.getAttribute('name'));
    }

    /**
     * Initialize the custom component.
     * Set template, attach event listeners, setup initial state etc.
     * @param {object} data
    */
    init(data) {
        // this.setupTemplate(data, () => {
        // components.renderOnce(this);
        const shadow = this.attachShadow({ mode: 'open' });
        shadow.innerHTML = this.template;
        this.isRendered = true;
        this.componentWrapper = this.shadowRoot.querySelector('.guic-checkbox-wrapper');
        this.addEventListener('click', this.toggleChecked);
        this.initCheckboxState();
        // });
    }

    // eslint-disable-next-line require-jsdoc
    connectedCallback() {
        this.init();
        // components.loadResource(this)
        //     .then(this.init)
        //     .catch(err => console.error(err));
    }

    /**
     * Toggles the checkbox value. Called on click.
     * Updated the state and the visibility of the check mark.
    */
    toggleChecked() {
        if (this.disabled) return;

        this.checked = !this.state.checked;
    }
}

components.defineCustomElement('gameface-checkbox', Checkbox);

export default Checkbox;
