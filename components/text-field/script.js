/* eslint-disable linebreak-style */
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { components } from '../../lib/components.js';
// const components = new Components();
// import template from './template.html';

const TextFieldValidator = components.TextFieldValidator;
const CustomElementValidator = components.CustomElementValidator;

const template = `
<style>
:host {
    --text-field-number-arrow-size: 8px;
    --text-field-number-arrow-color: black;
    --text-field-search-cross-size: 8px;
    --text-field-search-cross-width: 4px;
    --text-field-search-cross-color: black;
    --text-field-font-size: 16px;
    --text-field-font-family: "Droid Sans";
    --text-field-padding-left: 5px;
    --text-field-padding-right: 5px;
}

.guic-text-field-container {
    display: flex;
    align-content: center;
    align-items: center;
    text-align: left;
}

.guic-text-field-label {
    margin-right: 10px;
}

.guic-search-remove,
.guic-number-control {
    position: relative;
    height: 100%;
    display: flex;
    justify-content: center;
    flex-direction: column;
}

.guic-search-remove:hover {
    --text-field-search-cross-color: var(--default-color-blue);
}

.guic-search-remove-right-line,
.guic-search-remove-left-line {
    position: relative;
    border-radius: 20px;
    width: 0px;
    border-left-width: var(--text-field-search-cross-size);
    border-left-color: var(--text-field-search-cross-color);
    border-left-style: solid;

    border-right-width: var(--text-field-search-cross-size);
    border-right-color: var(--text-field-search-cross-color);
    border-right-style: solid;

    border-bottom-width: var(--text-field-search-cross-width);
    border-bottom-color: var(--text-field-search-cross-color);
    border-bottom-style: solid;
}

.guic-search-remove-right-line {
    top: calc(var(--text-field-search-cross-width) /2);
    transform: rotate(45deg);
}

.guic-search-remove-left-line {
    top: calc(var(--text-field-search-cross-width) /-2);
    transform: rotate(-45deg);
}

.guic-text-field-with-controls {
    position: relative;
    flex: 1;
    height: 1.8em;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-style: solid;
    border-top-color: var(--default-color-blue);
    border-right-color: var(--default-color-blue);
    border-bottom-color: var(--default-color-blue);
    border-left-color: var(--default-color-blue);
    background-color: var(--default-color-white);
    overflow-y: hidden;
    overflow-x: hidden;
}

.guic-text-field,
.guic-text-field-placeholder {
    font-size: var(--text-field-font-size);
    font-family: var(--text-field-font-family);
    padding-right: var(--text-field-padding-right);
    padding-left: var(--text-field-padding-left);
    border: none;
    background: transparent;
    padding-top: 0;
    padding-bottom: 0;
}

.guic-text-field {
    flex: 1;
    width: 100%;
    position: relative;
    -webkit-appearance: none;
    outline: none;
}

.guic-text-field-placeholder {
    position: absolute;
    opacity: 0.5;
    width: 98%;
    white-space: pre;
    cursor: text;
    overflow-x: hidden;
}

.guic-hidden {
    display: none;
}

.guic-text-field-disabled {
    pointer-events: none;
    opacity: 0.5;
}

.guic-number-control {
    position: relative;
}

.guic-number-increase,
.guic-number-decrease {
    position: relative;
    width: 0;
    height: 50%;
}

.guic-number-increase {
    border-left-width: var(--text-field-number-arrow-size);
    border-left-color: transparent;
    border-left-style: solid;

    border-right-width: var(--text-field-number-arrow-size);
    border-right-color: transparent;
    border-right-style: solid;

    border-bottom-width: var(--text-field-number-arrow-size);
    border-bottom-color: var(--text-field-number-arrow-color);
    border-bottom-style: solid;
    top: -0.1em;
}

.guic-number-increase:hover {
    border-bottom-color: var(--default-color-blue);
}

.guic-number-decrease {
    border-left-width: var(--text-field-number-arrow-size);
    border-left-color: transparent;
    border-left-style: solid;

    border-right-width: var(--text-field-number-arrow-size);
    border-right-color: transparent;
    border-right-style: solid;

    border-top-width: var(--text-field-number-arrow-size);
    border-top-color: var(--text-field-number-arrow-color);
    border-top-style: solid;

    bottom: -0.1em;
}

.guic-number-decrease:hover {
    border-top-color: var(--default-color-blue);
}
</style>
<div class="guic-text-field-container">
    <span class="guic-text-field-label"></span>
    <div class="guic-text-field-with-controls">
        <input class="guic-text-field" type="text" />
        <div class="guic-text-field-placeholder guic-hidden"></div>
        <div class="guic-search-remove guic-hidden">
            <div class="guic-search-remove-right-line"></div>
            <div class="guic-search-remove-left-line"></div>
        </div>
        <div class="guic-number-control guic-hidden">
            <div class="guic-number-increase"></div>
            <div class="guic-number-decrease"></div>
        </div>
    </div>
</div>
`;
const supportedTextFieldTypes = {
    TEXT: 'text',
    PASSWORD: 'password',
    EMAIL: 'email',
    NUMBER: 'number',
    SEARCH: 'search',
    URL: 'url',
};

const DEFAULT_PLACEHOLDER_VALUE = '';
const TEXT_FIELD_ATTRIBUTES = [
    { name: 'type', defaultValue: supportedTextFieldTypes.TEXT, type: ['string'] },
    { name: 'label', defaultValue: '', type: ['string'] },
    { name: 'disabled', defaultValue: false, type: ['boolean'] },
    { name: 'readonly', defaultValue: false, type: ['boolean'] },
    { name: 'pattern', defaultValue: '', type: ['string'] },
    { name: 'control-disabled', defaultValue: false, type: ['boolean'] },
    { name: 'value', defaultValue: '', type: ['string', 'number'] },
    { name: 'name', defaultValue: '', type: ['string'] },
    { name: 'placeholder', defaultValue: DEFAULT_PLACEHOLDER_VALUE, type: ['string'] },
    { name: 'maxlength', defaultValue: undefined, parseMethod: parseInt, isAttrValueValidMethod: isNaN, type: ['string', 'number', 'undefined'] },
    { name: 'minlength', defaultValue: undefined, parseMethod: parseInt, isAttrValueValidMethod: isNaN, type: ['string', 'number', 'undefined'] },
    { name: 'max', defaultValue: undefined, parseMethod: parseFloat, isAttrValueValidMethod: isNaN, type: ['string', 'number', 'undefined'] },
    { name: 'min', defaultValue: undefined, parseMethod: parseFloat, isAttrValueValidMethod: isNaN, type: ['string', 'number', 'undefined'] },
    { name: 'step', defaultValue: 1, parseMethod: parseFloat, isAttrValueValidMethod: isNaN, type: ['string', 'number'] },
];

/**
 * @typedef {object} TextFieldState
 * @property {string} label
 * @property {boolean} disabled
 * @property {boolean} readonly
 * @property {string} pattern
 * @property {boolean} control-disabled
 * @property {string|number} value
 * @property {string} name
 * @property {'text'|'password'|'email'|'number'|'search'|'url'} type
 * @property {string} placeholder
 * @property {number|undefined} maxlength
 * @property {number|undefined} minlength
 * @property {number|undefined} max
 * @property {number|undefined} min
 * @property {number} step
 */
/**
 * Class definition of gameface text field custom element
 */
class TextField extends CustomElementValidator {
    // eslint-disable-next-line require-jsdoc
    static get observedAttributes() { return TEXT_FIELD_ATTRIBUTES.map(attr => attr.name); }

    /* eslint-disable require-jsdoc */
    constructor() {
        super();
        this.template = template;
        this.showSearchRemoveIconBound = this.showSearchRemoveIcon.bind(this);
        this.hideSearchRemoveIconBound = this.hideSearchRemoveIcon.bind(this);
        this.showNumberControlBound = this.showNumberControl.bind(this);
        this.hideNumberControlBound = this.hideNumberControl.bind(this);
        this.onInputChangedBound = this.onInputChanged.bind(this);
        this.disableInputBound = this.disableInput.bind(this);
        this.stepUpBound = this.onStepUp.bind(this);
        this.stepDownBound = this.onStepDown.bind(this);
        this.clearMousedownIntervalBound = this.clearMousedownInterval.bind(this);
        this.init = this.init.bind(this);
        this.initTextField = this.initTextField.bind(this);

        this.stateSchema = TEXT_FIELD_ATTRIBUTES.reduce((acc, attribute) => {
            acc[attribute.name] = { type: [...attribute.type] };
            return acc;
        }, {});

        /** @type {TextFieldState} */
        this.state = TEXT_FIELD_ATTRIBUTES.reduce((acc, attribute) => {
            acc[attribute.name] = attribute.defaultValue;
            return acc;
        }, {});
    }

    get label() {
        return this.state.label;
    }

    set label(value) {
        value ? this.setAttribute('label', value) : this.removeAttribute('label');
    }

    get value() {
        return this.inputElement.value;
    }

    set value(value) {
        this.setAttribute('value', value);
    }

    get type() {
        return this.state.type;
    }

    set type(value) {
        this.setAttribute('type', value);
    }

    get placeholder() {
        return this.state.placeholder;
    }

    set placeholder(value) {
        this.setAttribute('placeholder', value);
    }

    get disabled() {
        return this.state.disabled;
    }

    set disabled(value) {
        value ? this.setAttribute('disabled', '') : this.removeAttribute('disabled');
    }

    get readonly() {
        return this.state.readonly;
    }

    set readonly(value) {
        value ? this.setAttribute('readonly', '') : this.removeAttribute('readonly');
    }

    get minlength() {
        return this.state.minlength;
    }

    set minlength(value) {
        this.setAttribute('minlength', value);
    }

    get maxlength() {
        return this.state.maxlength;
    }

    set maxlength(value) {
        this.setAttribute('maxlength', value);
    }

    set min(value) {
        this.setAttribute('min', value);
    }

    get min() {
        return this.state.min;
    }

    set max(value) {
        this.setAttribute('max', value);
    }

    get max() {
        return this.state.max;
    }

    get controlDisabled() {
        return this.state['control-disabled'];
    }

    set controlDisabled(value) {
        value ? this.setAttribute('control-disabled', '') : this.removeAttribute('control-disabled');
    }

    set pattern(value) {
        this.setAttribute('pattern', value);
    }

    get pattern() {
        return this.state.pattern;
    }

    set step(value) {
        this.setAttribute('step', value);
    }

    get step() {
        return this.state.step;
    }

    get name() {
        return this.state.name;
    }

    set name(value) {
        this.setAttribute('name', value);
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
     * Will update the state properties linked with the text-field attributes
     * @param {string} name
     * @param {string|boolean} value
     */
    // eslint-disable-next-line max-lines-per-function
    updateAttributeState(name, value) {
        switch (name) {
            case 'label':
                this.updateLabelState(value);
                break;
            case 'disabled':
                this.updateDisabledState(value !== null);
                break;
            case 'value':
                this.updateValueState(value);
                break;
            case 'type':
                this.updateTypeState(value);
                break;
            case 'placeholder':
                this.updatePlaceholderState(value);
                break;
            case 'readonly':
                this.updateReadonlyState(value !== null);
                break;
            case 'control-disabled':
                this.updateState(name, value !== null);
                break;
            case 'pattern':
            case 'min':
            case 'max':
            case 'name':
                this.updateState(name, value);
                break;
            case 'step':
                this.updateStepState(value);
                break;
            case 'maxlength':
            case 'minlength':
                this.updateMinMaxLengthState(name, value);
                break;
        }
    }

    /**
     * Update the text field's state.
     * @param {string} name - the name of the prop
     * @param {string | boolean} value - the value of the the prop
     * @returns {void}
     */
    updateState(name, value) {
        if (!this.isStatePropValid(name, value)) return;
        this.state[name] = value;
    }

    /**
     * Will update the text field's step state
     * @param {number|string} value
     * @returns {void}
     */
    updateStepState(value) {
        if (typeof value !== 'number') value = parseFloat(value);
        if (isNaN(value)) return;

        this.updateState('step', value);
    }

    /**
     * Will update the text field readonly state
     * @param {string} name
     * @param {boolean} value
     */
    updateMinMaxLengthState(name, value) {
        const parsedValue = parseInt(value);

        if (isNaN(parsedValue)) return;
        this.state[name] = value;
        if (name === 'minlength') this.inputElement.minLength = value;
        else this.inputElement.maxLength = value;
    }

    /**
     * Will update the text field readonly state
     * @param {boolean} value
     */
    updateReadonlyState(value) {
        if (this.readonly === value) return;

        if (this.readonly && !value) {
            this.inputElement.removeEventListener('keypress', this.disableInputBound);
        } else {
            this.inputElement.addEventListener('keypress', this.disableInputBound);
        }

        // Set the value to the input property. Do not use this.readonly = newValue because it will end up in infinite recursion.
        this.state.readonly = this.inputElement.readOnly = value;
    }

    /**
     * Will update the text field placeholder state
     * @param {boolean} value
     */
    updatePlaceholderState(value) {
        this.state.placeholder = this.placeholderElement.textContent = value || DEFAULT_PLACEHOLDER_VALUE;
        this.togglePlaceholder(!this.value);
    }

    /**
     * Will update the text field type state
     * @param {boolean} value
     */
    updateTypeState(value) {
        this.clearInputType(value);

        switch (value) {
            case supportedTextFieldTypes.TEXT:
            case supportedTextFieldTypes.EMAIL:
            case supportedTextFieldTypes.URL:
                this.inputElement.type = supportedTextFieldTypes.TEXT;
                this.state.type = value;
                break;
            case supportedTextFieldTypes.PASSWORD:
                this.state.type = this.inputElement.type = supportedTextFieldTypes.PASSWORD;
                break;
            case supportedTextFieldTypes.SEARCH:
                this.inputElement.type = supportedTextFieldTypes.TEXT;
                this.state.type = supportedTextFieldTypes.SEARCH;
                this.setSearchInput();
                break;
            case supportedTextFieldTypes.NUMBER:
                this.inputElement.type = supportedTextFieldTypes.TEXT;
                this.state.type = supportedTextFieldTypes.NUMBER;
                this.setNumberInput();
                break;
            default: this.state.type = this.inputElement.type = supportedTextFieldTypes.TEXT;
        }
    }

    /**
     * Will process the value if it is set on text field with type number
     * @param {string} value
     * @returns {string}
     */
    getProcessedValue(value) {
        if (this.type === supportedTextFieldTypes.NUMBER) {
            const isNegative = value.length && value[0] === '-';
            const newValue = value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');
            return isNegative ? '-' + newValue : newValue;
        }

        return value;
    }

    /**
     * Will update the text field value state
     * @param {string|number} value
     */
    updateValueState(value) {
        this.inputElement.value = this.getProcessedValue(value);

        this.togglePlaceholder(!this.value);
    }

    /**
     * Will update the text field label state
     * @param {boolean} value
     */
    updateLabelState(value) {
        this.labelElement.classList.toggle('guic-hidden', !value);
        this.state.label = this.labelElement.textContent = value;
    }

    /**
     * Will update the text field disabled state
     * @param {boolean} value
     */
    updateDisabledState(value) {
        this.componentContainer.classList.toggle('guic-text-field-disabled', value);
        this.state.disabled = this.inputElement.disabled = value;
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
     * Initialize the custom component.
     * Set template, attach event listeners, setup initial state etc.
     * @param {object} data
    */
    init(data) {
        // this.setupTemplate(data, () => {
        //     components.renderOnce(this);
        const shadow = this.attachShadow({ mode: 'open' });
        shadow.innerHTML = this.template;
        this.isRendered = true;
        this.initTextField();
        // });
    }

    connectedCallback() {
        this.init();
        // components.loadResource(this)
        //     .then(this.init)
        //     .catch(err => console.error(err));
    }

    /* eslint-enable require-jsdoc */

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
            this.inputElement.removeEventListener('input', this.onInputChangedBound);
            this.inputElement.removeEventListener('focus', this.showNumberControlBound);
            this.inputElement.removeEventListener('blur', this.hideNumberControlBound);
        }
    }

    /**
     * Displays the remove search icon if input control is enabled
     */
    showSearchRemoveIcon() {
        if (this.controlDisabled || this.readonly) return;

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
        if (this.controlDisabled || this.readonly) return;

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
        this.inputElement.addEventListener('input', this.onInputChangedBound);
    }

    /**
     * Will set the default number value
     * @returns {void}
     */
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
        this.inputElement.addEventListener('input', this.onInputChangedBound);
    }

    /**
     * Filter the input value and replace all characters that are not number or '.'
     * @param {Event} event
     */
    onInputChanged(event) {
        this.updateValueState(event.target.value);
    }

    /**
     * Will show/hide the placeholder of the input
     * @param {boolean} visible
     */
    togglePlaceholder(visible) {
        if (!this.placeholder) return;
        this.placeholderElement.classList.toggle('guic-hidden', !visible);
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
            }, 200);
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
     * @param {Array<string>} type
     * @param {Function} parseValueMethod
     * @param {Function} isAttrValueValid
     */
    initTextFieldAttribute(attrName, defaultValue, type, parseValueMethod, isAttrValueValid) {
        if (type.includes('boolean')) {
            this.updateAttributeState(attrName, this.hasAttribute(attrName) ? true : null);
            return;
        }

        if (!this.hasAttribute(attrName)) {
            this.updateAttributeState(attrName, defaultValue);
            return;
        }

        const attrValue = parseValueMethod ?
            parseValueMethod(this.getAttribute(attrName)) :
            this.getAttribute(attrName);

        if (isAttrValueValid) {
            this.updateAttributeState(attrName, !isAttrValueValid(attrValue) ? attrValue : defaultValue);
        } else {
            this.updateAttributeState(attrName, attrValue !== undefined ? attrValue : defaultValue);
        }
    }

    /**
     * Will init the text field attributes and migrate their values to the this context
     */
    initTextFieldAttributes() {
        // we need to set default readOnly to the input element because the readonly getter here is working with it
        this.inputElement.readOnly = false;

        for (const attribute of TEXT_FIELD_ATTRIBUTES) {
            const { name, defaultValue, type, parseMethod, isAttrValueValidMethod } = attribute;
            this.initTextFieldAttribute(name, defaultValue, type, parseMethod, isAttrValueValidMethod);
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
            this.updateValueState('');
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
        this.componentContainer = this.shadowRoot.querySelector('.guic-text-field-container');
        this.inputElement = this.shadowRoot.querySelector('.guic-text-field');
        this.labelElement = this.shadowRoot.querySelector('.guic-text-field-label');
        this.searchRemoveElement = this.shadowRoot.querySelector('.guic-search-remove');
        this.numberControlElement = this.shadowRoot.querySelector('.guic-number-control');
        this.placeholderElement = this.shadowRoot.querySelector('.guic-text-field-placeholder');
        this.increaseInputValueElement = this.shadowRoot.querySelector('.guic-number-increase');
        this.decreaseInputValueElement = this.shadowRoot.querySelector('.guic-number-decrease');
    }

    /**
     * Initialize the text field component
     */
    initTextField() {
        // this should be always first because we cache the textfield inner elements in this method!
        this.initTextFieldElements();
        this.addTextFieldListeners();
        this.initTextFieldAttributes();

        if (!this.value) {
            this.togglePlaceholder(true);
        }
    }
}
customElements.define('gameface-text-field', TextField);
// export default TextField;
