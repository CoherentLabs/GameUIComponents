import { Components } from 'coherent-gameface-components';
const components = new Components();
import { orientationUnitsNames } from '../orientationUnitsNames';
import { validateCustomHandle, valueToPercent } from './rangeSliderUtils';
// eslint-disable-next-line no-unused-vars
import Rangeslider from '../script';

const customHandleVariableNames = {
    SINGLE: 'customHandle',
    LEFT: 'customHandleLeft',
    RIGHT: 'customHandleRight',
};

/**
 * This class holds common methods and data for all the rangesliders with a single handle
 */
export default class RangeSliderBase {
    /**
     * @param {Rangeslider} rangeslider - The gameface-rangeslider custom element
     */
    constructor(rangeslider) {
        if (new.target === RangeSliderBase) {
            throw new TypeError('Cannot construct RangeSliderBase instances directly');
        }
        this.rangeslider = rangeslider;
        this.onMouseUp = this.onMouseUp.bind(this);
        this.init = this.init.bind(this);
    }

    // eslint-disable-next-line require-jsdoc
    set thumb(value) {
        value ? this.rangeslider.setAttribute('thumb', '') : this.rangeslider.removeAttribute('thumb');
    }

    // eslint-disable-next-line require-jsdoc
    get thumb() {
        return this.state.thumb;
    }

    /**
     * Enables the grid of the slider
     * @param {number} value
     */
    set grid(value) {
        value ? this.rangeslider.setAttribute('grid', '') : this.rangeslider.removeAttribute('grid');
    }

    /**
     * Gets if the grid is enabled
     */
    get grid() {
        return this.state.grid;
    }

    /**
     * Sets the minimum value of the slider
     * @param {number} value
     */
    set min(value) {
        value !== null ? this.rangeslider.setAttribute('min', value) : this.rangeslider.removeAttribute('min');
    }

    /**
     * Gets the minimum value of the slider
     * @returns {number}
     */
    get min() {
        return this.state.min;
    }

    /**
     * Sets the maximum value of the slider
     * @param {number} value
     */
    set max(value) {
        value !== null ? this.rangeslider.setAttribute('max', value) : this.rangeslider.removeAttribute('max');
    }

    /**
     * Gets the maximum value of the slider
     * @returns {number}
     */
    get max() {
        return this.state.max;
    }

    // eslint-disable-next-line require-jsdoc
    get value() {
        return this.state.value;
    }

    // eslint-disable-next-line require-jsdoc
    set value(value) {
        this.rangeslider.setAttribute('value', value);
    }

    // eslint-disable-next-line require-jsdoc
    get values() {
        return this.state.values;
    }

    // eslint-disable-next-line require-jsdoc
    set values(value) {
        value !== null ? this.rangeslider.setAttribute('values', value) : this.rangeslider.removeAttribute('values');
    }

    // eslint-disable-next-line require-jsdoc
    get step() {
        return this.state.step;
    }

    // eslint-disable-next-line require-jsdoc
    set step(value) {
        value !== null ? this.rangeslider.setAttribute('step', value) : this.rangeslider.removeAttribute('step');
    }

    // eslint-disable-next-line require-jsdoc
    get customHandle() {
        return this.state.customHandle;
    }

    // eslint-disable-next-line require-jsdoc
    set customHandle(value) {
        value !== null ? this.rangeslider.setAttribute('custom-handle', value) : this.rangeslider.removeAttribute('custom-handle');
    }

    // eslint-disable-next-line require-jsdoc
    get customHandleLeft() {
        return this.state.customHandleLeft;
    }

    // eslint-disable-next-line require-jsdoc
    set customHandleLeft(value) {
        value !== null ? this.rangeslider.setAttribute('custom-handle-left', value) : this.rangeslider.removeAttribute('custom-handle-left');
    }

    // eslint-disable-next-line require-jsdoc
    get customHandleRight() {
        return this.state.customHandleRight;
    }

    // eslint-disable-next-line require-jsdoc
    set customHandleRight(value) {
        value !== null ? this.rangeslider.setAttribute('custom-handle-right', value) : this.rangeslider.removeAttribute('custom-handle-right');
    }

    /**
     * Handler when attribute of rangeslider is changed
     * @param {string} name
     * @param {any} oldValue
     * @param {any} value
     */
    attributeChanged(name, oldValue, value) {
        // We want to update the rangeslider each time value attribute has changed
        // even though the oldValue and value are the same.
        // The case is that I can change the value of the slider by moving it and then I want to change the value
        // via attribute change and if it is the same as the old one the slider UI won't update.
        if (oldValue === value && name !== 'value') return;
        this.updateAttributeState(name, oldValue, value);
    }

    /**
     * Will update the state properties linked with the checkbox attributes
     * @param {string} name
     * @param {string|boolean|array} oldValue
     * @param {string|boolean|array} value
     */
    updateAttributeState(name, oldValue, value) {
        switch (name) {
            case 'values':
                this.updateValuesState(oldValue, value);
                break;
            case 'min':
            case 'max':
                this.updateMinMaxState(name, value);
                break;
            case 'step':
                this.updateStepState(value);
                break;
            case 'value':
                this.updateValueState(value);
                break;
            case 'thumb':
                this.updateThumbState(value !== null);
                break;
            case 'grid':
                this.updateGridState(value !== null);
                break;
            case 'custom-handle':
            case 'custom-handle-right':
            case 'custom-handle-left':
                this.updateCustomHandleState(name, value);
                break;
        }
    }

    /**
     * Will update the target elements of the custom handles
     * @param {string} name
     * @param {string} value
     */
    updateCustomHandleState(name, value) {
        this.initCustomHandles();
    }

    /**
     * Will update the slider when min or max is changed
     * @param {string} name
     * @param {string} value
     */
    updateMinMaxState(name, value) {
        throw new Error('Method \'updateMinMaxState()\' must be implemented.');
    }

    /**
     * Will update UI of the rangeslider with its current value
     * Useful when the step, min, max or thumb are changed
     */
    updateSliderPositionWithCurrentValue() {
        throw new Error('Method \'updateSliderPositionWithCurrentValue()\' must be implemented.');
    }

    /**
     * Will update UI of the rangeslider when its `values` attribute has changed
     * @param {array} oldValue
     * @param {array} newValue
     */
    updateValuesState(oldValue, newValue) {
        throw new Error('Method \'updateValuesState()\' must be implemented.');
    }

    /**
     * Will update UI of the rangeslider when its `value` attribute has changed
     * @param {number|string} value
     */
    updateValueState(value) {
        throw new Error('Method \'updateValueState()\' must be implemented.');
    }

    /**
     * Will update the slider when step is changed
     * @param {number} value
     */
    updateStepState(value) {
        let numericValue = value !== null ? parseFloat(value) : 1;
        numericValue = !isNaN(numericValue) ? numericValue : 1;
        if (!this.rangeslider.isStatePropValid('step', numericValue)) return;
        this.state.step = numericValue;
        this.updateSliderPositionWithCurrentValue();
    }

    /**
     * @param {boolean} value
     */
    updateGridState(value) {
        if (!this.rangeslider.isStatePropValid('grid', value)) return;
        this.toggleGrid(value);
        this.state.grid = value;
    }

    /**
     * @param {boolean} value
     */
    updateThumbState(value) {
        if (!this.rangeslider.isStatePropValid('thumb', value)) return;
        this.state.thumb = value;
        this.toggleThumb(value);
    }

    /**
     * Will toggle thumb
     * @param {boolean} visible
     */
    toggleThumb(visible) {
        if (this.thumbElement) {
            if (this.thumbElement.length && typeof this.thumbElement === 'object') {
                this.thumbElement.forEach(el => this.rangesliderEl.removeChild(el));
            } else {
                this.rangesliderEl.removeChild(this.thumbElement);
            }
            this.thumbElement = null;
        }

        if (visible) {
            this.setThumb();
            this.updateSliderPositionWithCurrentValue();
        }
    }

    /**
     * Will toggle grid
     * @param {boolean} visible
     */
    toggleGrid(visible) {
        if (this.grid) this.rangesliderEl.removeChild(this.rangesliderEl.querySelector(`.guic-${this.rangeslider.orientation}-rangeslider-grid`));

        if (visible) this.buildGrid();
    }

    /**
     * Will load the template of the rageslider
     */
    loadTemplate() {
        // check if component has already been rendered if not
        if (typeof this.rangeslider.template !== 'object') {
            // use the template for the current slider orientation and number of handles
            this.rangeslider.template = this.getTemplate(this.rangeslider.orientation);
        }

        components
            .loadResource(this.rangeslider)
            .then(this.init)
            .catch(err => console.error(JSON.stringify(err)));
    }

    /**
     * Initialize the custom component.
     * Set template, attach event listeners, setup initial state etc.
     * @param {object} data
    */
    init(data) {
        this.rangeslider.setupTemplate(data, () => {
            components.renderOnce(this.rangeslider);
            // do the initial setup - add event listeners, assign members
            this.setup();
        });
    }

    /**
     * Will setup the slider
     */
    setupSlider() {
        this.wrapper = this.rangeslider.querySelector(`.guic-${this.rangeslider.orientation}-rangeslider-wrapper`);
        this.rangesliderEl = this.rangeslider.querySelector(`.guic-${this.rangeslider.orientation}-rangeslider`);
        this.bar = this.rangeslider.querySelector(`.guic-${this.rangeslider.orientation}-rangeslider-bar`);

        this.setMinAndMax();
        this.setHandleValues();

        // if the grid attribute is added, the grid is created
        if (this.grid) this.buildGrid();

        this.setThumb();

        // sets the initial percent of the handles
        this.updateSliderPositionWithCurrentValue();
        this.initCustomHandles();
        this.updateCustomHandles();
        this.attachEventListener();
    }

    /**
    * Set the initial slider state
    */
    initSliderState() {
        // the step of the slider
        this.state.step = parseFloat(this.rangeslider.getAttribute('step')) || 1;

        // if there is a grid
        this.state.grid = this.rangeslider.hasAttribute('grid');
        // if there are thumbs
        this.state.thumb = this.rangeslider.hasAttribute('thumb');

        /**
         * The names of the units are different for the two slider types.
         * ['clientY', 'height', 'top', 'y'] for vertical and
         * ['clientX', 'width', 'left', 'x'] for horizontal
         */
        this.units = orientationUnitsNames.get(this.rangeslider.orientation);
    }

    /**
     * Calculates the position of the slider in percent based on the mouse coordinates
     * @param {MouseEvent} e
     * @returns {Number} Position in percent
     */
    getHandlePercent(e) {
        // we calculate the offsetX or offsetY of the click event
        const rangesliderRect = this.getRangeSliderSize();
        const size = rangesliderRect[this.units.size];
        const coordinate = rangesliderRect[this.units.coordinate];

        const mouseCoords = e[this.units.mouseAxisCoords];

        let offset = mouseCoords - coordinate;
        if (this.rangeslider.orientation === 'vertical') {
            offset = coordinate + size - mouseCoords;
        }

        return valueToPercent(offset, 0, size);
    }

    /**
     * Creates a grid pol
     * @param {number} value - value of the grid pol
     * @returns {HTMLDivElement}
     */
    createGridPol(value) {
        const polContainer = document.createElement('div');
        polContainer.classList.add(`guic-rangeslider-${this.rangeslider.orientation}-grid-pol-container`);

        polContainer.innerHTML = `
                <div class="guic-rangeslider-${this.rangeslider.orientation}-grid-pol guic-rangeslider-${this.rangeslider.orientation}-pol-without-text"></div>
            `;

        // checks if the passed value is a string or number and then makes a pol with value
        if (typeof value === 'number' || typeof value === 'string') {
            polContainer.innerHTML = `
                    <div class="guic-rangeslider-${this.rangeslider.orientation}-grid-pol"></div>
                    <div class="guic-rangeslider-${this.rangeslider.orientation}-grid-text">${value}</div>
                `;
        }

        return polContainer;
    }

    /**
     * Will add custom handle selectors to the rangeslider
     * @param {Object} customHandleSelectors
     */
    addCustomHandles(customHandleSelectors) {
        for (const key of Object.keys(customHandleSelectors)) {
            const customHandleVariableName = customHandleVariableNames[key];
            const customHandleSelector = customHandleSelectors[key];

            this.state[customHandleVariableName] = customHandleSelector ?
                document.querySelector(customHandleSelector) :
                null;
            validateCustomHandle(customHandleSelector, this[customHandleVariableName]);
        }
    }

    /**
     * Creates the thumb element
     * @param {number | string} value - the initial value of the thumb
     */
    buildThumb(value) {
        const thumb = document.createElement('div');
        thumb.classList.add(`guic-${this.rangeslider.orientation}-rangeslider-thumb`);
        thumb.textContent = value;
        this.rangesliderEl.appendChild(thumb);
    }

    /**
     * Gets the rangeslider dimensions
     * @returns {DOMRect}
     */
    getRangeSliderSize() {
        return this.wrapper.getBoundingClientRect();
    }

    /**
     * Calculates the value of the handle based on the position of the handle
     * @param {number} percent - the percent position
     * @returns {number} - the value of the handle
     */
    calculateHandleValue(percent) {
        return parseFloat(parseInt(this.min) + (this.max - this.min) * (percent / 100));
    }

    /**
     * Attaches the event listener
     */
    attachEventListener() {
        this.rangeslider.querySelector(`.guic-${this.rangeslider.orientation}-rangeslider-wrapper`).addEventListener('mousedown', this.onMouseDown);
    }

    /**
     * Removes the event listeners that we attach in onMouseDown
     */
    onMouseUp() {
        document.removeEventListener('mousemove', this.onMouseMove);
        document.removeEventListener('mouseup', this.onMouseUp);
    }
}
