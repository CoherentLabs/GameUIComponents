/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import components from 'coherent-gameface-components';
import template from './template.html';

const supportedTextFieldTypes = {
    TEXT: 'text',
    PASSWORD: 'password',
    EMAIL: 'email',
    NUMBER: 'number',
    SEARCH: 'search',
    URL: 'url'
};

const DEFAULT_PLACEHOLDER_VALUE = '';
const TEXT_FIELD_ATTRIBUTES = [
    { name: 'label', defaultValue: '' },
    { name: 'value', defaultValue: '' },
    { name: 'type', defaultValue: supportedTextFieldTypes.TEXT },
    { name: 'placeholder', defaultValue: DEFAULT_PLACEHOLDER_VALUE },
    { name: 'maxlength', parseMethod: parseInt, isAttrValueValidMethod: isNaN },
    { name: 'minlength', parseMethod: parseInt, isAttrValueValidMethod: isNaN },
    { name: 'max', parseMethod: parseFloat, isAttrValueValidMethod: isNaN },
    { name: 'min', parseMethod: parseFloat, isAttrValueValidMethod: isNaN },
    { name: 'minlength', parseMethod: parseInt, isAttrValueValidMethod: isNaN },
    { name: 'step', defaultValue: 1, parseMethod: parseFloat, isAttrValueValidMethod: isNaN }
];

const TextFieldValidator = components.TextFieldValidator;
const CustomElementValidator = components.CustomElementValidator;

class TextField extends CustomElementValidator {
    constructor() {
        super();
        this.template = template;
        this.inputType = supportedTextFieldTypes.TEXT;
        this.showSearchRemoveIconBound = this.showSearchRemoveIcon.bind(this);
        this.hideSearchRemoveIconBound = this.hideSearchRemoveIcon.bind(this);
        this.showNumberControlBound = this.showNumberControl.bind(this);
        this.hideNumberControlBound = this.hideNumberControl.bind(this);
        this.onNumberInputChangedBound = this.onNumberInputChanged.bind(this);
        this.disableInputBound = this.disableInput.bind(this);
        this.stepUpBound = this.onStepUp.bind(this);
        this.stepDownBound = this.onStepDown.bind(this);
        this.clearMousedownIntervalBound = this.clearMousedownInterval.bind(this);
    }

    get label() {
        return this.labelElement.textContent;
    }

    set label(value) {
        if (value) {
            this.labelElement.classList.remove('guic-hidden');
        } else {
            this.labelElement.classList.add('guic-hidden');
        }

        this.labelElement.textContent = value;
    }

    get value() {
        return this.inputElement.value;
    }

    set value(value) {
        this.inputElement.value = value;
        this.togglePlaceholder(!this.value);
    }

    get type() {
        return this.inputType;
    }

    set type(value) {
        this.clearInputType(value);

        switch (value) {
            case supportedTextFieldTypes.TEXT:
            case supportedTextFieldTypes.EMAIL:
            case supportedTextFieldTypes.URL:
                this.inputElement.type = supportedTextFieldTypes.TEXT;
                break;
            case supportedTextFieldTypes.PASSWORD:
                this.inputElement.type = supportedTextFieldTypes.PASSWORD;
                break;
            case supportedTextFieldTypes.SEARCH:
                this.inputElement.type = supportedTextFieldTypes.TEXT;
                this.setSearchInput();
                break;
            case supportedTextFieldTypes.NUMBER:
                this.inputElement.type = supportedTextFieldTypes.TEXT;
                this.setNumberInput();
                break;
            default: this.inputElement.type = supportedTextFieldTypes.TEXT;
        }

        //Save the real text field type
        this.inputType = value;
    }

    get placeholder() {
        return this.placeholderElement.textContent;
    }

    set placeholder(value) {
        this.placeholderElement.textContent = value || DEFAULT_PLACEHOLDER_VALUE;
        this.togglePlaceholder(!this.value);
    }

    get disabled() {
        return this.inputElement.disabled;
    }

    set disabled(value) {
        const newValue = !!value;

        if (newValue) {
            this.componentContainer.classList.add('guic-text-field-disabled');
        } else {
            this.componentContainer.classList.remove('guic-text-field-disabled');
        }

        this.inputElement.disabled = newValue;
    }

    get readonly() {
        return this.inputElement.readOnly;
    }

    set readonly(value) {
        //Normalize the value to boolean value because the user can pass string for example that is not empty and the value will be true.
        const newValue = !!value;

        if (this.readonly === newValue) return;

        if (this.readonly && !newValue) {
            this.inputElement.removeEventListener('keypress', this.disableInputBound);
        } else {
            this.inputElement.addEventListener('keypress', this.disableInputBound);
        }

        //Set the value to the input property. Do not use this.readonly = newValue because it will end up in infinite recursion.
        this.inputElement.readOnly = newValue;
    }

    get minlength() {
        return this.inputElement.minLength;
    }

    set minlength(value) {
        const parsedValue = parseInt(value);

        if (isNaN(parsedValue)) return;
        this.inputElement.minLength = value;
    }

    get maxlength() {
        return this.inputElement.maxLength;
    }

    set maxlength(value) {
        const parsedValue = parseInt(value);

        if (isNaN(parsedValue)) return;
        this.inputElement.maxLength = value;
    }

    get textFieldControlDisabled() {
        return this.hasAttribute('text-field-control-disabled');
    }

    set textFieldControlDisabled(value) {
        if (value) {
            this.setAttribute('text-field-control-disabled', '');
        } else {
            this.removeAttribute('text-field-control-disabled');
        }
    }

    set pattern(value) {
        this.setAttribute('pattern', pattern);
    }

    get pattern() {
        return this.getAttribute('pattern');
    }

    isBadURL() {
        return TextFieldValidator.isBadURL(this);
    }

    isBadEmail() {
        return TextFieldValidator.isBadEmail(this);
    }

    tooLong() {
        return TextFieldValidator.tooLong(this);
    }

    tooShort() {
        return TextFieldValidator.tooShort(this);
    }

    rangeOverflow() {
        if (this.type === supportedTextFieldTypes.NUMBER) return TextFieldValidator.rangeOverflow(this);
        return false;
    }

    rangeUnderflow() {
        if (this.type === supportedTextFieldTypes.NUMBER) return TextFieldValidator.rangeUnderflow(this);
        return false;
    }

    isBadURL() {
        if (this.type !== supportedTextFieldTypes.URL) return false;
        return TextFieldValidator.isBadURL(this);
    }

    isBadEmail() {
        if (this.type !== supportedTextFieldTypes.EMAIL) return false;
        return TextFieldValidator.isBadEmail(this);
    }

    /**
     * Prevent any keypress events when the input is read only
     * @param {Event} event
     */
    disableInput(event) {
        event.preventDefault();
        event.stopPropagation();
    }

    /**
     * Clears the events and hides controls for the search and number type when the new type has no input control
     * @param {string} newInputType
     */
    clearInputType(newInputType) {
        if (this.type === supportedTextFieldTypes.SEARCH && newInputType !== supportedTextFieldTypes.SEARCH) {
            this.hideSearchRemoveIcon();
            this.inputElement.removeEventListener('focus', this.showSearchRemoveIconBound);
            this.inputElement.removeEventListener('blur', this.hideSearchRemoveIconBound);
        }

        if (this.type === supportedTextFieldTypes.NUMBER && newInputType !== supportedTextFieldTypes.NUMBER) {
            this.hideNumberControl();
            this.inputElement.removeEventListener('input', this.onNumberInputChangedBound);
            this.inputElement.removeEventListener('focus', this.showNumberControlBound);
            this.inputElement.removeEventListener('blur', this.hideNumberControlBound);
        }
    }

    /**
     * Displays the remove search icon if input control is enabled
     */
    showSearchRemoveIcon() {
        if (this.textFieldControlDisabled || this.readonly) return;

        this.searchRemoveElement.classList.remove('guic-hidden');
    }

    /**
     * Hides the remove search icon
     */
    hideSearchRemoveIcon() {
        this.searchRemoveElement.classList.add('guic-hidden');
    }

    /**
     * Displays the arrow icons if input control is enabled
     */
    showNumberControl() {
        if (this.textFieldControlDisabled || this.readonly) return;

        this.numberControlElement.classList.remove('guic-hidden');
        this.increaseInputValueElement.addEventListener('mousedown', this.stepUpBound);
        this.decreaseInputValueElement.addEventListener('mousedown', this.stepDownBound);
    }

    /**
     * Hides the arrow icons
     */
    hideNumberControl() {
        this.numberControlElement.classList.add('guic-hidden');
        this.increaseInputValueElement.removeEventListener('mousedown', this.stepUpBound);
        this.decreaseInputValueElement.removeEventListener('mousedown', this.stepDownBound);
    }

    /**
     * Sets events related to the input with type search
     */
    setSearchInput() {
        this.inputElement.addEventListener('focus', this.showSearchRemoveIconBound);
        this.inputElement.addEventListener('blur', this.hideSearchRemoveIconBound);
    }

    setDefaultInputNumberValue() {
        if (this.value === '') return;

        const parsedValue = parseFloat(this.value);
        if (isNaN(parsedValue)) this.value = '';
    }

    /**
     * Sets events related to the input with type number
     */
    setNumberInput() {
        this.setDefaultInputNumberValue();
        this.inputElement.addEventListener('focus', this.showNumberControlBound);
        this.inputElement.addEventListener('blur', this.hideNumberControlBound);
        this.inputElement.addEventListener('input', this.onNumberInputChangedBound);
    }

    /**
     * Filter the input value and replace all characters that are not number or '.'
     * @param {Event} event
     */
    onNumberInputChanged(event) {
        const value = event.target.value;
        const isNegative = value.length && value[0] === '-';
        let newValue = event.target.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');
        event.target.value = isNegative ? '-' + newValue : newValue;
    }

    /**
     * Will show/hide the placeholder of the input
     * @param {boolean} visible
     */
    togglePlaceholder(visible) {
        if (!this.placeholder) return;

        if (visible) {
            this.placeholderElement.classList.remove('guic-hidden');
        } else {
            this.placeholderElement.classList.add('guic-hidden');
        }
    }

    /**
     * Will clear interval and timeout that are set when the arrow from input number control is pressed
     */
    clearMousedownInterval() {
        document.removeEventListener('mouseup', this.clearMousedownIntervalBound);

        if (this.mousedownTimeout) {
            clearTimeout(this.mousedownTimeout);
            this.mousedownTimeout = null;
        }

        if (this.mousedownInterval) {
            clearInterval(this.mousedownInterval);
            this.mousedownInterval = null;
        }
    }

    /**
     * Adds an interval after a small timeout that will constantly bump up or down the number input value until the mouse is released
     * from the arrow of the input control
     * @param {Function} stepCallback - Should be some of stepUp or stepDown functions.
     */
    addAutoStepInterval(stepCallback) {
        document.addEventListener('mouseup', this.clearMousedownIntervalBound);

        if (!this.mousedownTimeout) {
            this.mousedownTimeout = setTimeout(() => {
                if (!this.mousedownInterval) {
                    this.mousedownInterval = setInterval(stepCallback.bind(this), 50);
                }
            }, 200)
        }
    }

    /**
     * Will set the auto step interval and bump up the input value
     * @param {Event} event
     */
    onStepUp(event) {
        this.addAutoStepInterval(this.stepUp);
        this.stepUp();
        event.preventDefault();
    }

    /**
     * Will set the auto step interval and bump down the input value
     * @param {Event} event
     */
    onStepDown(event) {
        this.addAutoStepInterval(this.stepDown);
        this.stepDown();
        event.preventDefault();
    }

    /**
     * Will change the input value if it meets the conditions
     * @param {number} nextStep
     */
    setNewStep(nextStep) {
        if (this.max !== undefined && nextStep > this.max) nextStep = this.max;
        if (this.min !== undefined && nextStep < this.min) nextStep = this.min;

        this.value = nextStep;
    }

    /**
     * Will bump up the input value based on the min and max restrinctions
     */
    stepUp() {
        if (this.type !== supportedTextFieldTypes.NUMBER) return;

        const currentValue = this.value === '' ? 0 : parseFloat(this.value);

        if (isNaN(currentValue)) return;

        const nextStep = this.step + currentValue;

        this.setNewStep(nextStep);
    }

    /**
     * Will bump down the input value based on the min and max restrinctions
     */
    stepDown() {
        if (this.type !== supportedTextFieldTypes.NUMBER) return;

        const currentValue = this.value === '' ? 0 : parseFloat(this.value);

        if (isNaN(currentValue)) return;

        const nextStep = currentValue - this.step;

        this.setNewStep(nextStep);
    }

    /**
     * Will migrate the attributes from the component element to the this context
     * @param {string} attrName
     * @param {any} defaultValue
     * @param {Function} parseValueMethod
     * @param {Function} isAttrValueValid
     */
    initTextFieldAttribute(attrName, defaultValue, parseValueMethod, isAttrValueValid) {
        if (!this.hasAttribute(attrName)) {
            this[attrName] = defaultValue;
            return;
        }

        const attrValue = parseValueMethod ? parseValueMethod(this.getAttribute(attrName)) : this.getAttribute(attrName);
        if (isAttrValueValid) {
            this[attrName] = !isAttrValueValid(attrValue) ? attrValue : defaultValue;
        } else {
            this[attrName] = attrValue !== undefined ? attrValue : defaultValue;
        }
    }

    /**
     * Will init the text field attributes and migrate their values to the this context
     */
    initTextFieldAttributes() {
        //we need to set default readOnly to the input element because the readonly getter here is working with it
        this.inputElement.readOnly = false;
        this.readonly = this.hasAttribute('readonly');
        this.disabled = this.hasAttribute('disabled');

        for (const attribute of TEXT_FIELD_ATTRIBUTES) {
            const { name, defaultValue, parseMethod, isAttrValueValidMethod } = attribute;
            this.initTextFieldAttribute(name, defaultValue, parseMethod, isAttrValueValidMethod);
        }
    }

    /**
     * Will propagate passed system event to the component element. For example blur and focus events from the
     * input inside the template are not propagated up so we do this trick.
     * @param {Event} event
     */
    propagateEventFromInputToTextField(event) {
        const newEvent = new Event(event.type, event);
        this.dispatchEvent(newEvent);
    }

    /**
     * Add listeners to the component elements
     */
    addTextFieldListeners() {
        this.searchRemoveElement.addEventListener('mousedown', (event) => {
            this.value = '';
            event.preventDefault();
            event.stopPropagation();
        });

        this.inputElement.addEventListener('blur', (event) => {
            if (!this.value) this.togglePlaceholder(true);
            this.propagateEventFromInputToTextField(event);
        });

        this.inputElement.addEventListener('focus', (event) => {
            if (!this.readonly) this.togglePlaceholder(false);
            this.propagateEventFromInputToTextField(event);
        });

        this.placeholderElement.addEventListener('click', (event) => {
            this.inputElement.focus();
        });
    }

    /**
     * Cache the component elements
     */
    initTextFieldElements() {
        this.componentContainer = this.querySelector('.guic-text-field-container');
        this.inputElement = this.querySelector('.guic-text-field');
        this.labelElement = this.querySelector('.guic-text-field-label');
        this.searchRemoveElement = this.querySelector('.guic-search-remove');
        this.numberControlElement = this.querySelector('.guic-number-control');
        this.placeholderElement = this.querySelector('.guic-text-field-placeholder');
        this.increaseInputValueElement = this.querySelector('.guic-number-increase');
        this.decreaseInputValueElement = this.querySelector('.guic-number-decrease');
    }

    /**
     * Initialize the text field component
     */
    initTextField() {
        //this should be always first because we cache the textfield inner elements in this method!
        this.initTextFieldElements();
        this.addTextFieldListeners();
        this.initTextFieldAttributes();

        if (!this.value) {
            this.togglePlaceholder(true);
        }
    }

    connectedCallback() {
        components.loadResource(this)
            .then((result) => {
                this.template = result.template;
                components.renderOnce(this);

                this.initTextField();
            })
            .catch(err => console.error(err));
    }
}
components.defineCustomElement('gameface-text-field', TextField);
export default TextField;