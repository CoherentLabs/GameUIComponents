/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { components } from '../../lib/components.js';
// const components = new Components();
// import template from './template.html';
const template = `
<style>
:host {
    position: relative;
    padding-left: 20px;
    cursor: pointer;
}

:host + :host {
    margin-left: 16px;
}

.before,
.after {
    position: absolute;
    top: 50%;
    left: 7px;
    transform: translate(-50%, -50%);
}

.before {
    width: 14px;
    height: 14px;
    border: 1px solid #25a5d6;
    border-radius: 100%;
    background-image: linear-gradient(to bottom, #e6e6e6, #fff 60%);
}

:host([checked]) .before {
    background: #fff;
}

:host([checked]) .after {
    display: block;
    border: 4px solid #25a5d6;
    border-radius: 100%;
}

:host([aria-checked="mixed"]:active) .before,
:host([aria-checked="true"]:active) .before {
    background-image: linear-gradient(to bottom, #3a80e9, #25a5d6 60%);
}

:host(:hover) .before {
    border-color: #25a5d6;
}

:host(:focus) {
    outline: none;
}

:host(:focus) .before {
    width: 16px;
    height: 16px;
    box-sizing: content-box;
    border-color: #25a5d6;
    border-width: 2px;
    border-radius: 100%;
    box-shadow: inset 0 0 0 1px #3a80e9;
}

.guic-radio-button-disabled {
    opacity: 0.5;
    pointer-events: none;
}

:host([controls-disabled] .before,
:host([controls-disabled]) .after {
    display: none;
}
</style>
<div class="radio-button">
    <slot name="radio-button-content"></slot>
    <div class="radio-button-text"></div>
    <div class="before"></div>
    <div class="after"></div>
</div>

`;

const KEYCODES = components.KEYCODES;
const BaseComponent = components.BaseComponent;

/**
 * Class definition of the gameface radio group custom element
 */
class GamefaceRadioGroup extends HTMLElement {
    // eslint-disable-next-line require-jsdoc
    constructor() {
        super();
        this.previouslyCheckedElement = null;
    }

    // eslint-disable-next-line require-jsdoc
    get allButtons() {
        return Array.from(this.querySelectorAll('radio-button'));
    }

    // eslint-disable-next-line require-jsdoc
    get value() {
        if (this.previouslyCheckedElement && !this.previouslyCheckedElement.disabled) {
            return this.previouslyCheckedElement.value;
        }
        // will return null if it is disabled
        return null;
    }

    /**
     * @param {string} value - the value of the radio button
     */
    set value(value) {
        let isFound = false;
        this.allButtons.forEach((button) => {
            if (button.value === value && !button.disabled) {
                isFound = true;
                this.checkButton(button);
            }
        });

        if (!isFound) console.warn(`No radio button with value ${value} found or the button is disabled.`);
    }

    // eslint-disable-next-line require-jsdoc
    get disabled() {
        return this.hasAttribute('disabled');
    }

    // eslint-disable-next-line require-jsdoc
    set disabled(value) {
        if (value) {
            this.classList.add('guic-radio-button-disabled');
            this.setAttribute('disabled', '');
        } else {
            this.classList.remove('guic-radio-button-disabled');
            this.removeAttribute('disabled');
        }
    }

    /**
     * Gets if the value is missing when radio group is used inside a gameface-form-control
     * @returns {boolean}
     */
    valueMissing() {
        const checkedButton = this.previouslyCheckedElement;
        if (!checkedButton || !this.hasAttribute('name')) return true;
        return false;
    }

    /**
     * Sets the currently checked button to the previous one if it exists
     * @param {HTMLElement} button
     * @returns {void}
     */
    setCheckedToPreviousItem(button) {
        if (this.disabled) return;

        const prevSibling = button.previousElementSibling;

        if (!prevSibling) return;

        if (prevSibling.disabled) return this.setCheckedToPreviousItem(prevSibling);
        prevSibling.checked = true;
        prevSibling.focus();
    }

    /**
     * Sets the currently checked button to the next one if it exists
     * @param {HTMLElement} button
     * @returns {void}
     */
    setCheckedToNextItem(button) {
        if (this.disabled) return;

        const nextSibling = button.nextElementSibling;

        if (!nextSibling) return;

        if (nextSibling.disabled) return this.setCheckedToNextItem(nextSibling);
        nextSibling.checked = true;
        nextSibling.focus();
    }

    /**
     * Sets the currently checked button to the previous one if it exists
     * @returns {void}
     */
    checkPrev() {
        this.setCheckedToPreviousItem(this.previouslyCheckedElement);
    }

    /**
     * Sets the currently checked button to the previous one if it exists
     * @returns {void}
     */
    checkNext() {
        this.setCheckedToNextItem(this.previouslyCheckedElement);
    }

    /**
     * Will check the passed button inside the radio group
     * @param {HTMLElement} button
     * @returns {void}
     */
    checkButton(button) {
        if (this.previouslyCheckedElement === button) return;
        if (this.previouslyCheckedElement) {
            // If the button is not rendered yet then removing the 'checked' attribute will not trigger attributeChangedCallback of the radio button.
            // And it is not enough for updating the button state.
            // Here we are making sure the button state is updated correctly when the button is not rendered yet.
            if (!this.previouslyCheckedElement.isRendered) {
                this.previouslyCheckedElement.removeAttribute('checked');
                this.unCheckButtonState(this.previouslyCheckedElement);
            } else {
                // If the button is rendered we need just ot remove the checked attribute that will trigger attributeChangedCallback and
                // update the state of the button from there.
                this.previouslyCheckedElement.removeAttribute('checked');
            }
        }
        this.setButtonAttributes(button, true);
        this.previouslyCheckedElement = button;
    }

    /**
     * Will check the passed button inside the radio group
     * @param {HTMLElement} button
     * @returns {void}
    */
    unCheckButtonState(button) {
        if (button) this.setButtonAttributes(button, false);
        if (button === this.previouslyCheckedElement) this.previouslyCheckedElement = null;
    }

    /**
     * Will focus the group when it is clicked
     * @returns {void}
     */
    handleClick() {
        if (this.disabled) return;
        if (this.radioGroup && this.radioGroup.disabled) return;

        this.checked = true;
        this.focus();
    }

    /**
     * Handler for key down event
     * @param {HTMLEvent} event
     */
    handleKeydown(event) {
        switch (event.keyCode) {
            case KEYCODES.UP:
            case KEYCODES.LEFT:
                this.radioGroup.setCheckedToPreviousItem(this);
                break;
            case KEYCODES.DOWN:
            case KEYCODES.RIGHT:
                this.radioGroup.setCheckedToNextItem(this);
                break;
            default:
                break;
        }
    }

    /**
     * @param {HTMLElement} button
     */
    setButtonRoleAttribute(button) {
        button.setAttribute('role', 'radio');
    }

    /**
     * @param {HTMLElement} button
     */
    attachButtonEventListeners(button) {
        button.addEventListener('click', this.handleClick.bind(button));
        button.addEventListener('keydown', this.handleKeydown.bind(button));
    }

    /**
     * @param {HTMLElement} button
     * @param {boolean} checked
     */
    setButtonAttributes(button, checked) {
        button.setAttribute('tabindex', checked ? '0' : '-1');
        button.setAttribute('aria-checked', checked ? 'true' : 'false');
        button.updateState('checked', checked ? true : false);
    }

    /**
     * Initialize the buttons
     */
    setupButtons() {
        for (const button of this.allButtons) {
            this.setButtonRoleAttribute(button);
            this.attachButtonEventListeners(button);
            this.setButtonAttributes(button);

            if (button.hasAttribute('checked')) {
                this.checkButton(button);
            }
        }
    }

    // eslint-disable-next-line require-jsdoc
    connectedCallback() {
        // Handle some configuration here so the user doesn't have to manually
        // do it and possibly forget it.
        this.setAttribute('role', 'radiogroup');
        this.setupButtons();
        if (this.disabled) this.classList.add('guic-radio-button-disabled');
        this.previouslyCheckedElement = this.querySelector('[aria-checked="true"]');
    }
}

/**
 * Class definition of the gameface radio button custom element
 */
class RadioButton extends BaseComponent {
    // eslint-disable-next-line require-jsdoc
    static get observedAttributes() { return ['checked', 'disabled', 'value', 'name']; }

    // eslint-disable-next-line require-jsdoc
    constructor() {
        super();

        this.template = template;
        this.textElement = null;
        this.init = this.init.bind(this);

        this.stateSchema = {
            checked: { type: ['boolean'] },
            disabled: { type: ['boolean'] },
            value: { type: ['string'] },
            name: { type: ['string'] },
        };

        this.state = {
            checked: false,
            disabled: false,
            value: 'on',
            name: '',
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
     * Update the radio button's state.
     * @param {string} name - the name of the prop
     * @param {string | boolean} value - the value of the the prop
     * @returns {void}
     */
    updateState(name, value) {
        if (!this.isStatePropValid(name, value)) return;
        this.state[name] = value;
    }

    /**
     * Will update the state properties linked with the checkbox attributes
     * @param {string} name
     * @param {string|boolean} value
     */
    updateAttributeState(name, value) {
        switch (name) {
            case 'checked':
                if (value !== null) this.radioGroup.checkButton(this);
                else this.radioGroup.unCheckButtonState(this);
                break;
            case 'disabled':
                this.updateDisabledState(value !== null);
                break;
            case 'name':
            case 'value':
                this.updateState(name, value);
                break;
        }
    }

    /**
     * Update the radio buttons's disabled state.
     * Set relevant styles and tabindex.
     * @param {boolean} value
     */
    updateDisabledState(value) {
        this.updateState('disabled', value);

        if (value) {
            this.buttonContainer.classList.add('guic-radio-button-disabled');
            this.setAttribute('tabindex', '-1');
        } else {
            this.buttonContainer.classList.remove('guic-radio-button-disabled');
            this.setAttribute('tabindex', '0');
        }
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
    get value() {
        return this.state.value;
    }

    // eslint-disable-next-line require-jsdoc
    set value(value) {
        this.setAttribute('value', value);
    }

    // eslint-disable-next-line require-jsdoc
    get text() {
        return this.textElement.textContent;
    }

    // eslint-disable-next-line require-jsdoc
    set text(value) {
        this.textElement.textContent = value;
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

    // eslint-disable-next-line require-jsdoc
    get name() {
        return this.state.name;
    }

    // eslint-disable-next-line require-jsdoc
    set name(value) {
        const trimmed = value.trim();
        trimmed ? this.setAttribute('name', trimmed) : this.removeAttribute('name');
    }

    /**
     * Initialize the custom component.
     * Set template, attach event listeners, setup initial state etc.
     * @param {object} data
    */
    init(data) {
        let radioButtonText;
        const hasSlots = this.querySelectorAll('[slot="radio-button-content"]').length;
        // use text content if there is no slot
        if (!hasSlots) radioButtonText = this.textContent;

        const shadow = this.attachShadow({ mode: 'open' });
        shadow.innerHTML = this.template;
        this.isRendered = true;
        this.buttonContainer = this.shadowRoot.querySelector('.radio-button');
        // this.setupTemplate(data, () => {
        //     components.renderOnce(this);
        components.waitForFrames(() => {
            this.textElement = this.shadowRoot.querySelector('.radio-button-text');
            if (!hasSlots) this.textElement.textContent = radioButtonText;
            // Apply the user set text
            if (this.hasAttribute('checked')) this.updateAttributeState('checked', true);
            if (this.hasAttribute('disabled')) this.updateAttributeState('disabled', true);
            if (this.hasAttribute('value')) this.updateAttributeState('value', this.getAttribute('value'));
        });
        // });
    }

    // eslint-disable-next-line require-jsdoc
    connectedCallback() {
        // Get the text set from the user before applying the template.
        this.radioGroup = this.parentElement;
        this.init();
        // components.loadResource(this)
        //     .then(this.init)
        //     .catch(err => console.error(err));
    }
}

components.defineCustomElement('radio-button', RadioButton);
components.defineCustomElement('gameface-radio-group', GamefaceRadioGroup);

export default GamefaceRadioGroup;
