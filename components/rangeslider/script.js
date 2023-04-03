/* eslint-disable linebreak-style */
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import components from 'coherent-gameface-components';
import verticalTemplate from './templates/vertical.html';
import verticalTemplateTwoHandles from './templates/verticalTwoHandles.html';
import horizontalTemplate from './templates/horizontal.html';
import horizontalTemplateTwoHandles from './templates/horizontalTwoHandles.html';
import { orientationUnitsNames } from './orientationUnitsNames';

const ORIENTATIONS = ['vertical', 'horizontal'];
const SPACE_BETWEEN_GRID_POLS = 10;
const CustomElementValidator = components.CustomElementValidator;
const customHandleVariableNames = {
    SINGLE: 'customHandle',
    LEFT: 'customHandleLeft',
    RIGHT: 'customHandleRight',
};

/**
 * Rangeslider component, allows you to specify a numeric value by using a slider.
 * It must be no less than a given value, and no more than another given value.
 */
class Rangeslider extends CustomElementValidator {
    /**
     * Sets the minimum value of the slider
     * @param {number} value
     */
    set min(value) {
        this._min = value;
    }

    /**
     * Gets the minimum value of the slider
     * @returns {number}
     */
    get min() {
        return this._min;
    }

    /**
     * Sets the maximum value of the slider
     * @param {number} value
     */
    set max(value) {
        this._max = value;
    }

    /**
     * Gets the maximum value of the slider
     * @returns {number}
     */
    get max() {
        return this._max;
    }

    // eslint-disable-next-line require-jsdoc
    get value() {
        return this._value[0];
    }

    // eslint-disable-next-line require-jsdoc
    set value(value) {
        this._value = value;
    }

    /**
     * Converts a value to percent in a range
     * @param {number} value - the value to be converted
     * @param {number} min - the minimum value of the range
     * @param {number} max - the maximum number of the range
     * @returns {number} - returns the value in percent
     */
    static valueToPercent(value, min, max) {
        return (value * 100) / (max - min);
    }

    /**
     * Restricts a given value in a range
     * @param {number} val - the value to be restricted
     * @param {number} min - the minimum value of the range
     * @param {number} max - the maximum number of the range
     * @returns {number}
     */
    static clamp(val, min, max) {
        return Math.min(Math.max(val, min), max);
    }

    // eslint-disable-next-line require-jsdoc
    constructor() {
        super();

        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.init = this.init.bind(this);
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
     * Checks if the range slider has value
     * @returns {boolean}
     */
    valueMissing() {
        if (!this._value && !this._value[0]) return true;
        return false;
    }

    /**
     * Initialize the custom component.
     * Set template, attach event listeners, setup initial state etc.
     * @param {object} data
    */
    init(data) {
        this.setupTemplate(data, () => {
            components.renderOnce(this);
            // do the initial setup - add event listeners, assign members
            this.setup();
        });
    }

    /**
     * Called when the element was attached to the DOM.
     */
    connectedCallback() {
        // if an array is passed these are the values of the array
        this._values = this.hasAttribute('values') ? JSON.parse(this.getAttribute('values')) : null;

        // if an array is passed
        this.hasValuesArray = Array.isArray(this._values) && this._values.length > 0;

        // the step of the slider
        this.step = this.getAttribute('step') || 1;

        this._min;
        this._max;
        this._value = [];

        // the slider orientation, can be 'vertical' or 'horizontal'
        this.orientation = this.checkOrientation(this.getAttribute('orientation'));
        // if there will be two handles
        this.twoHandles = !this.hasValuesArray && this.hasAttribute('two-handles');

        // if there is a grid
        this.grid = this.hasAttribute('grid');
        // if there are thumbs
        this.thumb = this.hasAttribute('thumb');

        // check if component has already been rendered if not
        if (typeof this.template !== 'object') {
            // use the template for the current slider orientation and number of handles
            this.template = this.getTemplate(this.orientation, this.twoHandles);
        }

        /**
         * The names of the units are different for the two slider types.
         * ['clientY', 'height', 'top', 'y'] for vertical and
         * ['clientX', 'width', 'left', 'x'] for horizontal
         */
        this.units = orientationUnitsNames.get(this.orientation);

        // Load the template
        components
            .loadResource(this)
            .then(this.init)
            .catch(err => console.error(JSON.stringify(err)));
    }

    /**
     * Checks if the orientation passed is vertical or horizontal, if it's neither it's set to horizontal
     * @param {string} orientation - the orientation string
     * @returns {string} - horizontal or vertical;
     */
    checkOrientation(orientation) {
        return ORIENTATIONS.includes(orientation) ? orientation : 'horizontal';
    }

    /**
     * Gets the correct template to be loaded for the rangeslider
     * @param {string} orientation - the orientation of the slider
     * @param {boolean} twoHandles - if there are two handles
     * @returns {string}
     */
    getTemplate(orientation, twoHandles) {
        if (orientation === 'vertical') {
            return twoHandles ? verticalTemplateTwoHandles : verticalTemplate;
        }

        return twoHandles ? horizontalTemplateTwoHandles : horizontalTemplate;
    }

    /**
     * Will validate the custom handle selector and if element with that selector exists.
     * @param {string} customHandleSelector
     * @param {HTMLElement} customHandleElement
     */
    validateCustomHandle(customHandleSelector, customHandleElement) {
        if (customHandleSelector && !customHandleElement) {
            console.warn(`Unable to find element with selector - "${customHandleSelector}" that will be used for displaying the range slider value.`);
        }
    }

    /**
     * Will set the thumb if this option is enabled
     */
    setThumb() {
        // if the thumb attribute is added, the thumbs are created
        if (this.thumb) {
            // creates two thumbs
            this.twoHandles ? this._value.forEach(val => this.buildThumb(val)) : this.buildThumb(this.value);

            this.thumbElement = !this.twoHandles ?
                [this.querySelector(`.guic-${this.orientation}-rangeslider-thumb`)] :
                this.querySelectorAll(`.guic-${this.orientation}-rangeslider-thumb`);
        }
    }

    /**
     * Will initialize the custom handles variables
     */
    initCustomhandles() {
        const customHandleSelectors = {
            SINGLE: this.getAttribute('custom-handle'),
            LEFT: this.getAttribute('custom-handle-left'),
            RIGHT: this.getAttribute('custom-handle-right'),
        };

        for (const key of Object.keys(customHandleSelectors)) {
            const customHandleVariableName = customHandleVariableNames[key];
            const customHandleSelector = customHandleSelectors[key];

            this[customHandleVariableName] = customHandleSelector ? document.querySelector(customHandleSelector) : null;
            this.validateCustomHandle(customHandleSelector, this[customHandleVariableName]);
        }
    }

    /**
     * Sets up the rangeslider, draws the additional things like grid and thumbs, attaches the event listeners
     */
    setup() {
        components.waitForFrames(() => {
            // saves the size of the rangeslider so we don't have to request it on every action
            this.sizes = this.getRangeSliderSize();

            this.rangeslider = this.querySelector(`.guic-${this.orientation}-rangeslider`);
            this.handle = !this.twoHandles ?
                [this.querySelector(`.guic-${this.orientation}-rangeslider-handle`)] :
                this.querySelectorAll(`.guic-${this.orientation}-rangeslider-handle`);

            this.bar = this.querySelector(`.guic-${this.orientation}-rangeslider-bar`);

            this.setMinAndMax();
            this.setHandleValues();

            // if the grid attribute is added, the grid is created
            if (this.grid) {
                this.hasValuesArray ? this.buildArrayGrid() : this.buildGrid();
            }

            this.setThumb();

            // sets the initial percent of the handles
            let percent = this.twoHandles ? [0, 100] : [Rangeslider.valueToPercent(this.value, this.min, this.max)];

            // if an array is passed the percent changes
            if (this.hasValuesArray) {
                percent = this._values.findIndex(el => el == this._value) * (100 / this._values.length);
            }

            this.twoHandles ?
                percent.forEach((p, i) => this.updateSliderPosition(p, i)) :
                this.updateSliderPosition(percent, 0);

            this.initCustomhandles();
            this.updateCustomHandles();
            this.attachEventListener();
        }, 3);
    }

    /**
     * Builds the grid
     */
    buildGrid() {
        // calculates the number of pols the grid will have based on the size of the slider
        const numberOfPols = Math.round(this.sizes[this.units.size] / SPACE_BETWEEN_GRID_POLS / 4) * 4; // here we round to a number that is divisible by 4 and to make sure, the last pol has a number
        const grid = document.createElement('div');
        grid.classList.add(`guic-${this.orientation}-rangeslider-grid`);
        for (let i = 0; i <= numberOfPols; i++) {
            // each forth poll will be larger with a value added
            if (i % (numberOfPols / 4) === 0) {
                grid.appendChild(
                    this.createGridPol(
                        parseFloat((parseInt(this.min) + (this.max - this.min) * (i / numberOfPols)).toFixed(2))
                    )
                );
                continue;
            }
            grid.appendChild(this.createGridPol());
        }

        this.rangeslider.appendChild(grid);
    }

    /**
     * Builds a different grid if an array is passed
     */
    buildArrayGrid() {
        const grid = document.createElement('div');
        grid.classList.add(`guic-${this.orientation}-rangeslider-grid`);
        // builds only pols for the values of the array
        for (let i = 0; i < this._values.length; i++) {
            const entry = this._values[i];
            grid.appendChild(this.createGridPol(entry));
        }

        this.rangeslider.appendChild(grid);
    }

    /**
     * Creates a grid pol
     * @param {number} value - value of the grid pol
     * @returns {HTMLDivElement}
     */
    createGridPol(value) {
        const polContainer = document.createElement('div');
        polContainer.classList.add(`guic-rangeslider-${this.orientation}-grid-pol-container`);

        polContainer.innerHTML = `
            <div class="guic-rangeslider-${this.orientation}-grid-pol guic-rangeslider-${this.orientation}-pol-without-text"></div>
        `;

        // checks if the passed value is a string or number and then makes a pol with value
        if (typeof value === 'number' || typeof value === 'string') {
            polContainer.innerHTML = `
                <div class="guic-rangeslider-${this.orientation}-grid-pol"></div>
                <div class="guic-rangeslider-${this.orientation}-grid-text">${value}</div>
            `;
        }

        return polContainer;
    }

    /**
     * Creates the thumb element
     * @param {number | string} value - the initial value of the thumb
     */
    buildThumb(value) {
        const thumb = document.createElement('div');
        thumb.classList.add(`guic-${this.orientation}-rangeslider-thumb`);
        thumb.textContent = value;
        this.rangeslider.appendChild(thumb);
    }

    /**
     * Gets the rangeslider dimensions
     * @returns {DOMRect}
     */
    getRangeSliderSize() {
        return this.querySelector(`.guic-${this.orientation}-rangeslider-wrapper`).getBoundingClientRect();
    }

    /**
     * Sets the min and max value of the rangeslider
     */
    setMinAndMax() {
        // if we have an array we set the min and max values to the first and last entry of the array
        if (this.hasValuesArray) {
            this.min = this._values[0];
            this.max = this._values[this._values.length - 1];
            return;
        }

        this.min = this.getAttribute('min') || 0;
        this.max = this.getAttribute('max') || 100;
    }

    /**
     * Sets the value of the handles
     */
    setHandleValues() {
        // if there are two handles we set their values to the min and max
        if (this.twoHandles) {
            this.value = [this.min, this.max];
            return;
        }

        this.value = [this.getAttribute('value')] || [this.min];
        // checks if the value provided is less than the min or more than the max and sets it to the minimum value
        this.value = this.min <= this.value && this.max >= this.value ? [this.value] : [this.min];
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
        this.querySelector(`.guic-${this.orientation}-rangeslider-wrapper`).addEventListener('mousedown', this.onMouseDown);
    }

    /**
     * Will update the handles values depending of if they are two or a single one
     * @returns {void}
     */
    updateCustomHandles() {
        if (this.twoHandles) {
            if (this.customHandleLeft && this._value[0] !== undefined) {
                this.customHandleLeft.textContent = this._value[0];
            }

            if (this.customHandleRight && this._value[1] !== undefined) {
                this.customHandleRight.textContent = this._value[1];
            }

            return;
        }

        if (this.customHandle && this._value[0] !== undefined) this.customHandle.textContent = this._value[0];
    }

    /**
     * If we have two handles we need to clamp each so that it doesn't pass beyond the other handle
     * @param {number[]} clampRange
     * @param {number} index
     * @returns {number[]}
     */
    clampTwoHandles(clampRange, index) {
        const handleZeroPosition = this.handle[0].style[this.units.position];
        const handleOnePosition = this.handle[1].style[this.units.position];

        if (index === 0) {
            clampRange = this.orientation === 'vertical' ?
                [0, 100 - parseFloat(handleOnePosition)] :
                [0, parseFloat(handleOnePosition)];
        } else if (index === 1) {
            clampRange = this.orientation === 'vertical' ?
                [100 - parseFloat(handleZeroPosition), 100] :
                [parseFloat(handleZeroPosition), 100];
        }

        return clampRange;
    }

    /**
     * Returns the disance between the two handles
     * @returns {number}
     */
    getDistanceBetweenTwoHandles() {
        const firstHandlePositionValue = this.handle[0].style[this.units.position];
        const secondHandlePositionValue = this.handle[0].style[this.units.position];

        return this.twoHandles ?
            Math.abs(parseFloat(firstHandlePositionValue) - parseFloat(secondHandlePositionValue)) :
            0;
    }

    /**
     * Will set the bar styles
     * @param {number} index
     * @param {number} percent
     */
    setBarStyles(index, percent) {
        // we get the distance between two handles to set the width of the bar to
        const distanceBetweenHandles = this.getDistanceBetweenTwoHandles();

        this.bar.style[this.units.size] = this.twoHandles ? `${distanceBetweenHandles}%` : `${percent}%`;

        if (this.twoHandles && index === 0) {
            this.bar.style[this.units.position] = `${this.orientation === 'vertical' ? 100 - percent : percent}%`;
        }
    }

    /**
     * Updates the positions of the handles and the width of the bar
     * @param {number} percent
     * @param {number} index - the index of the handle we want to update
     */
    updateSliderPosition(percent, index) {
        // The percent of the step that is set, if the values are an array, the step is between each array value
        const percentStep = this.hasValuesArray ?
            100 / (this._values.length - 1) :
            Rangeslider.valueToPercent(this.step, this.min, this.max);

        // the range which should be clamped
        let clampRange = [0, 100];

        if (this.twoHandles && this.handle[1].style[this.units.position]) {
            clampRange = this.clampTwoHandles(clampRange, index);
        }

        // the provided percent is clamped
        percent = Rangeslider.clamp(Math.round(percent / percentStep) * percentStep, ...clampRange);
        this.handle[index].style[this.units.position] = `${this.orientation === 'vertical' ? 100 - percent : percent}%`;

        this.setBarStyles(index, percent);

        this._value[index] = this.hasValuesArray ?
            this._values[percent / percentStep] :
            parseFloat(this.calculateHandleValue(percent).toFixed(2));

        if (this.thumb) {
            this.thumbElement[index].innerHTML = this._value[index];
            this.thumbElement[index].style[this.units.position] =
                `${this.orientation === 'vertical' ? 100 - percent : percent}%`;
        }

        this.updateCustomHandles();

        // dispatching a custom event with the rangeslider values
        this.dispatchEvent(new CustomEvent('sliderupdate', { detail: this._value }));
    }

    /**
     * Calculates the position of the slider in percent based on the mouse coordinates
     * @param {MouseEvent} e
     * @returns {Number} Position in percent
     */
    getHandlePercent(e) {
        // we calculate the offsetX or offsetY of the click event
        const size = this.sizes[this.units.coordinate];
        const mouseCoords = e[this.units.mouseAxisCoords];

        let offset = document.body.scrollLeft + mouseCoords - size;
        if (this.orientation === 'vertical') {
            offset = size + this.sizes[this.units.size] - (document.body.scrollTop + mouseCoords);
        }

        return Rangeslider.valueToPercent(offset, 0, this.sizes[this.units.size]);
    }

    /**
     * Executed on mousedown. Sets the handle to the clicked coordinates and attaches event listeners to the document
     * @param {MouseEvent} e
     */
    onMouseDown(e) {
        // creates the active handle
        this.activeHandle = 0;

        const percent = this.getHandlePercent(e);

        // get the closest handle to the click if we have two handles
        if (this.twoHandles) {
            const distance = [];

            for (let i = 0; i < this.handle.length; i++) {
                const pos = parseInt(this.handle[i].style[this.units.position]);
                distance.push(Math.abs(pos - percent));
            }

            this.activeHandle =
                this.orientation === 'vertical' ?
                    distance.reverse().indexOf(Math.min(...distance)) :
                    distance.indexOf(Math.min(...distance));
        }

        this.updateSliderPosition(percent, this.activeHandle);

        // attaching event listeners on mousedown so we don't have them attached all the time
        document.addEventListener('mousemove', this.onMouseMove);
        document.addEventListener('mouseup', this.onMouseUp);
    }

    /**
     * Moving the handle with the mouse
     * @param {MouseEvent} e
     */
    onMouseMove(e) {
        const percent = this.getHandlePercent(e);

        this.updateSliderPosition(percent, this.activeHandle);
    }

    /**
     * Removes the event listeners that we attach in onMouseDown
     */
    onMouseUp() {
        document.removeEventListener('mousemove', this.onMouseMove);
        document.removeEventListener('mouseup', this.onMouseUp);
    }
}

components.defineCustomElement('gameface-rangeslider', Rangeslider);
export default Rangeslider;
