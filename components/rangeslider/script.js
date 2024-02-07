/* eslint-disable linebreak-style */
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Components } from 'coherent-gameface-components';
const components = new Components();
import BasicRangeSlider from './rangesliders/singleHandleSliders/basicRangeslider';
import ValuesRangeSlider from './rangesliders/singleHandleSliders/valuesRangeslider';
import BasicTwoHandlesRangeSlider from './rangesliders/twoHandlesSliders/basicTwoHandlesRangeSlider';
import { checkOrientation } from './rangesliders/rangeSliderUtils';

const RANGE_SLIDERS_TYPES = {
    BASIC: 'basic',
    VALUES: 'values',
    BASIC_TWO_HANDLES: 'basic_two_handles',
};
const CustomElementValidator = components.CustomElementValidator;
const stateSchema = {
    min: { type: ['number'] },
    max: { type: ['number'] },
    value: { type: ['number', 'string'] },
    values: { type: ['array'] },
    ['two-handles']: { type: ['boolean'] },
    grid: { type: ['boolean'] },
    thumb: { type: ['boolean'] },
    step: { type: ['number'] },
    orientation: { type: ['string'] },
    ['custom-handle']: { type: ['string'] },
    ['custom-handle-left']: { type: ['string'] },
    ['custom-handle-right']: { type: ['string'] },
    ['pols-number']: { type: ['number'] },
};

/**
 * Rangeslider component, allows you to specify a numeric value by using a slider.
 * It must be no less than a given value, and no more than another given value.
 */
class Rangeslider extends CustomElementValidator {
    // eslint-disable-next-line require-jsdoc
    static get observedAttributes() { return Object.keys(stateSchema); }

    // eslint-disable-next-line require-jsdoc
    constructor() {
        super();
        this.rangesliderObject = null;
        this.stateSchema = stateSchema;
        this.state = {
            orientation: 'horizontal',
            ['two-handles']: false,
            ['pol-number']: 4,
        };
    }

    /**
     * Custom element lifecycle method. Called when an attribute is changed.
     * @param {string} name
     * @param {string} oldValue
     * @param {string|boolean|array} newValue
     */
    attributeChangedCallback(name, oldValue, newValue) {
        if (!this.isRendered) return;

        this.updateAttributeState(name, oldValue, newValue);
    }

    /**
     * Will update the state properties linked with the checkbox attributes
     * @param {string} name
     * @param {string|boolean|array} oldValue
     * @param {string|boolean|array} value
     */
    updateAttributeState(name, oldValue, value) {
        switch (name) {
            case 'two-handles':
                this.updateTwoHandlesState(value !== null);
                break;
            case 'orientation':
                this.updateOrientationState(value);
                break;
            case 'values':
                this.updateValuesState(oldValue, value);
                break;
            case 'min':
            case 'max':
            case 'value':
            case 'thumb':
            case 'grid':
            case 'step':
            case 'custom-handle':
            case 'custom-handle-right':
            case 'custom-handle-left':
            case 'pols-number':
                this.rangesliderObject.attributeChanged(name, oldValue, value);
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
     * Will update the rangeslider when orientation attribute is changed
     * @param {string} value
     */
    updateOrientationState(value) {
        const orientation = checkOrientation(value);
        this.updateState('orientation', orientation);
        this.reRender();
    }

    /**
     * Will update the rangeslider when two-handles attribute is changed
     * @param {boolean} value
     */
    updateTwoHandlesState(value) {
        this.updateState('two-handles', value);
        this.reRender();
    }

    /**
     * Will update the rangeslider when values attribute is changed
     * @param {array} oldValue
     * @param {array} value
     * @returns {void}
     */
    updateValuesState(oldValue, value) {
        value = JSON.parse(value);
        if (oldValue !== null && value === null) return this.reRender();

        if (!this.isStatePropValid('values', value)) return;
        if (oldValue === null && value !== null) return this.reRender();
        if (oldValue !== null && value !== null) return this.rangesliderObject.attributeChanged('values', oldValue, value);
    }

    // eslint-disable-next-line require-jsdoc
    get twoHandles() {
        return this.state['two-handles'];
    }

    // eslint-disable-next-line require-jsdoc
    set twoHandles(value) {
        value ? this.setAttribute('two-handles', '') : this.removeAttribute('two-handles');
    }

    // eslint-disable-next-line require-jsdoc
    get orientation() {
        return this.state.orientation;
    }

    // eslint-disable-next-line require-jsdoc
    set orientation(value) {
        value !== null ? this.setAttribute('orientation', value) : this.removeAttribute('orientation');
    }

    // eslint-disable-next-line require-jsdoc
    get values() {
        return this.rangesliderObject.values;
    }

    // eslint-disable-next-line require-jsdoc
    set values(value) {
        value !== null ? this.setAttribute('values', JSON.stringify(value)) : this.removeAttribute('values');
    }

    // eslint-disable-next-line require-jsdoc
    get grid() {
        return this.rangesliderObject.grid;
    }

    // eslint-disable-next-line require-jsdoc
    set grid(value) {
        this.rangesliderObject.grid = value;
    }

    // eslint-disable-next-line require-jsdoc
    get thumb() {
        return this.rangesliderObject.thumb;
    }

    // eslint-disable-next-line require-jsdoc
    set thumb(value) {
        this.rangesliderObject.thumb = value;
    }

    /**
     * Sets the minimum value of the slider
     * @param {number} value
     */
    set min(value) {
        this.rangesliderObject.min = value;
    }

    /**
     * Gets the minimum value of the slider
     * @returns {number}
     */
    get min() {
        return this.rangesliderObject.min;
    }

    /**
     * Sets the maximum value of the slider
     * @param {number} value
     */
    set max(value) {
        this.rangesliderObject.max = value;
    }

    /**
     * Gets the maximum value of the slider
     * @returns {number}
     */
    get max() {
        return this.rangesliderObject.max;
    }

    // eslint-disable-next-line require-jsdoc
    get value() {
        return this.rangesliderObject.value;
    }

    // eslint-disable-next-line require-jsdoc
    set value(value) {
        this.rangesliderObject.value = value;
    }

    // eslint-disable-next-line require-jsdoc
    get step() {
        return this.rangesliderObject.step;
    }

    // eslint-disable-next-line require-jsdoc
    set step(value) {
        this.rangesliderObject.step = value;
    }

    // eslint-disable-next-line require-jsdoc
    get customHandle() {
        return this.rangesliderObject.customHandle;
    }

    // eslint-disable-next-line require-jsdoc
    set customHandle(value) {
        this.rangesliderObject.customHandle = value;
    }

    // eslint-disable-next-line require-jsdoc
    get customHandleLeft() {
        return this.rangesliderObject.customHandleLeft;
    }

    // eslint-disable-next-line require-jsdoc
    set customHandleLeft(value) {
        this.rangesliderObject.customHandleLeft = value;
    }

    // eslint-disable-next-line require-jsdoc
    get customHandleRight() {
        return this.rangesliderObject.customHandleRight;
    }

    // eslint-disable-next-line require-jsdoc
    set customHandleRight(value) {
        this.rangesliderObject.customHandleRight = value;
    }

    // eslint-disable-next-line require-jsdoc
    get polsNumber() {
        return this.rangesliderObject.polsNumber;
    }

    // eslint-disable-next-line require-jsdoc
    set polsNumber(value) {
        this.rangesliderObject.polsNumber = value;
    }

    /**
     * Will display a custom error if the slider has two handles and it is wrapped inside a gameface form control element
     * @returns {boolean}
     */
    customError() {
        if (this.hasAttribute('two-handles')) {
            console.warn('gameface-rangeslider component does not support form data when "two-handles" attribute is used!');
            return true;
        }

        return false;
    }

    /**
     * Will change the thumb position of the slider
     * This method is used from tests
     * @param {number} percent
     * @param {number} index - thumb index
     */
    updateSliderPosition(percent, index) {
        this.rangesliderObject.updateSliderPosition(percent, index);
    }

    /**
     * Used for testing purposes
     * @param {Event} e
     */
    onMouseDown(e) {
        this.rangesliderObject.onMouseDown(e);
    }

    /**
     * Used for testing purposes
     */
    onMouseUp() {
        this.rangesliderObject.onMouseUp();
    }

    /**
     * Used for testing purposes
     * @param {Event} e
     */
    onMouseMove(e) {
        this.rangesliderObject.onMouseMove(e);
    }

    /**
     * Checks if the range slider has value
     * @returns {boolean}
     */
    valueMissing() {
        return this.rangesliderObject.valueMissing();
    }

    /**
     * Will get the type of the rangeslider
     * @returns {RANGE_SLIDERS_TYPES}
     */
    getRangeSliderType() {
        if (this.twoHandles) return RANGE_SLIDERS_TYPES.BASIC_TWO_HANDLES;
        if (this.hasAttribute('values')) return RANGE_SLIDERS_TYPES.VALUES;

        return RANGE_SLIDERS_TYPES.BASIC;
    }

    /**
     * Factory for getting the rangeslider object based on its type
     * @returns {BasicRangeSlider|ValuesRangeSlider|BasicTwoHandlesRangeSlider}
     */
    getRangeSlider() {
        const type = this.getRangeSliderType();

        switch (type) {
            case RANGE_SLIDERS_TYPES.BASIC: return new BasicRangeSlider(this);
            case RANGE_SLIDERS_TYPES.VALUES: return new ValuesRangeSlider(this);
            case RANGE_SLIDERS_TYPES.BASIC_TWO_HANDLES: return new BasicTwoHandlesRangeSlider(this);
            default: {
                console.warn(`Unknown rangeslider type - ${type}. Will fallback to basic rangeslider.`);
                return new BasicRangeSlider(this);
            }
        }
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
     * Will init the state based on the initial attribute values
     */
    initState() {
        if (this.hasAttribute('orientation')) {
            const orientation = checkOrientation(this.getAttribute('orientation'));
            this.updateState('orientation', orientation);
        }
        this.updateState('two-handles', this.hasAttribute('two-handles'));
    }

    /**
     * Called when the element was attached to the DOM.
     */
    connectedCallback() {
        this.initState();
        if (this.rangesliderObject) {
            delete this.rangesliderObject;
            this.rangesliderObject = null;
        }

        this.rangesliderObject = this.getRangeSlider();
        this.rangesliderObject.connectedCallback();
    }
}

components.defineCustomElement('gameface-rangeslider', Rangeslider);
export default Rangeslider;
