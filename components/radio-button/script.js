/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Components } from 'coherent-gameface-components';
const components = new Components();
import template from './template.html';

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
        if (this.previouslyCheckedElement) return this.previouslyCheckedElement.value;
        // will return null if it is disabled
        return null;
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

        if (nextSibling.disabled) return this.setCheckedToPreviousItem(nextSibling);
        nextSibling.checked = true;
        nextSibling.focus();
    }

    /**
     * Will check the passed button inside the radio group
     * @param {HTMLElement} button
     * @returns {void}
     */
    checkButton(button) {
        if (this.disabled) return;
        if (button.disabled) return;

        if (this.previouslyCheckedElement) this.setButtonAttributes(this.previouslyCheckedElement, false);
        this.previouslyCheckedElement = null;

        this.setButtonAttributes(button, true);
        this.previouslyCheckedElement = button;
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
    constructor() {
        super();

        this.template = template;
        this.textElement = null;
        this.init = this.init.bind(this);
    }

    // eslint-disable-next-line require-jsdoc
    get checked() {
        return this.getAttribute('aria-checked');
    }

    // eslint-disable-next-line require-jsdoc
    set checked(value) {
        this.radioGroup.checkButton(this);
    }

    // eslint-disable-next-line require-jsdoc
    get value() {
        return this.getAttribute('value') || 'on';
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
        return this.hasAttribute('disabled');
    }

    // eslint-disable-next-line require-jsdoc
    set disabled(value) {
        if (value) {
            this.firstChild.classList.add('guic-radio-button-disabled');
            this.setAttribute('disabled', '');
        } else {
            this.firstChild.classList.remove('guic-radio-button-disabled');
            this.removeAttribute('disabled');
        }
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

        this.setupTemplate(data, () => {
            components.renderOnce(this);
            this.textElement = this.querySelector('.radio-button-text');
            if (!hasSlots) this.textElement.textContent = radioButtonText;
            // Apply the user set text
            if (this.disabled) this.firstChild.classList.add('guic-radio-button-disabled');
        });
    }

    // eslint-disable-next-line require-jsdoc
    connectedCallback() {
        // Get the text set from the user before applying the template.
        this.radioGroup = this.parentElement;

        components.loadResource(this)
            .then(this.init)
            .catch(err => console.error(err));
    }
}

components.defineCustomElement('radio-button', RadioButton);
components.defineCustomElement('gameface-radio-group', GamefaceRadioGroup);

export default GamefaceRadioGroup;
