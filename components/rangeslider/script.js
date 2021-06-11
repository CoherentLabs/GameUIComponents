import components from 'coherent-gameface-components';
import verticalTemplate from './templates/vertical.html';
import verticalTemplateTwoHandles from './templates/verticalTwoHandles.html';
import horizontalTemplate from './templates/horizontal.html';
import horizontalTemplateTwoHandles from './templates/horizontalTwoHandles.html';
import verticalStyle from './styles/vertical.css';
import horizontalStyle from './styles/horizontal.css';
import { orientationUnitsNames } from './orientationUnitsNames';

const ORIENTATIONS = ['vertical', 'horizontal'];
const SPACE_BETWEEN_GRID_POLS = 10;

/**
 * @class Rangeslider.
 * Rangeslider component, allows you to specify a numeric value by using a slider.
 * It must be no less than a given value, and no more than another given value.
 */
class Rangeslider extends HTMLElement {
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

    /**
     * Delay the execution of a callback function by n amount of frames.
     * Used to retrieve the computed styles of elements.
     * @param {Function} callback - the function that will be executed.
     * @param {number} count - the amount of frames that the callback execution
     * should be delayed by.
     */
    static waitForFrames(callback = () => {}, count = 3) {
        if (count === 0) return callback();
        count--;
        window.requestAnimationFrame(() => this.waitForFrames(callback, count));
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

    constructor() {
        super();

        //if an array is passed the values of the array
        this._values = this.getAttribute('values') ? JSON.parse(this.getAttribute('values')) : null;

        //if an array is passed
        this.isArray = Array.isArray(this._values) && this._values.length > 0;

        //the step of the slider
        this.step = this.getAttribute('step') || 1;

        this._min;
        this._max;
        this._value = [];

        //the slider orientation, can be 'vertical' or 'horizontal'
        this.orientation = this.checkOrientation(this.getAttribute('orientation'));
        //if there will be two handles
        this.twoHandles = !this.isArray && typeof this.getAttribute('two-handles') === 'string';

        //if there is a grid
        this.grid = typeof this.getAttribute('grid') === 'string';
        //if there are thumbs
        this.thumb = typeof this.getAttribute('thumb') === 'string';

        // use the template for the current slider orientation and number of handles
        this.template = this.getTemplate(this.orientation, this.twoHandles);
        // use the styles for the current slider orientation
        const styles = this.orientation === 'horizontal' ? horizontalStyle : verticalStyle;

        // import the styles
        components.importStyleTag(`gameface-slider-${this.orientation}`, styles);

        /**
         * The names of the units are different for the two slider types.
         * ['clientY', 'height', 'top', 'y'] for vertical and
         * ['clientX', 'width', 'left', 'x'] for horizontal
         */
        this.units = orientationUnitsNames.get(this.orientation);

        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
    }

    /**
     * Called when the element was attached to the DOM.
     */
    connectedCallback() {
        // Load the template
        components
            .loadResource(this)
            .then((result) => {
                this.template = result.template;
                // render the template
                components.renderOnce(this);
                // do the initial setup - add event listeners, assign members
                this.setup();
            })
            .catch((err) => console.error(err));
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
     * @returns
     */
    getTemplate(orientation, twoHandles) {
        if (orientation === 'vertical') {
            return twoHandles ? verticalTemplateTwoHandles : verticalTemplate;
        }

        return twoHandles ? horizontalTemplateTwoHandles : horizontalTemplate;
    }

    /**
     * Sets up the rangeslider, draws the additional things like grid and thumbs, attaches the event listeners
     */

    setup() {
        Rangeslider.waitForFrames(() => {
            //saves the size of the rangeslider so we don't have to request it on every action
            this.sizes = this.getRangeSliderSize();

            this.rangeslider = this.querySelector(`.${this.orientation}-rangeslider`);
            this.handle = !this.twoHandles
                ? [this.querySelector(`.${this.orientation}-rangeslider-handle`)]
                : this.querySelectorAll(`.${this.orientation}-rangeslider-handle`);
            this.bar = this.querySelector(`.${this.orientation}-rangeslider-bar`);

            this.setMinAndMax();
            this.setHandleValues();

            //if the grid attribute is added, the grid is created
            if (this.grid) {
                this.isArray ? this.buildArrayGrid() : this.buildGrid();
            }

            //if the thumb attribute is added, the thumbs are created
            if (this.thumb) {
                //creates two thumbs
                this.twoHandles ? this.value.forEach((val) => this.buildThumb(val)) : this.buildThumb(this.value);

                this.thumbElement = !this.twoHandles
                    ? [this.querySelector(`.${this.orientation}-rangeslider-thumb`)]
                    : this.querySelectorAll(`.${this.orientation}-rangeslider-thumb`);
            }

            //sets the initial percent of the handles
            let percent = this.twoHandles ? [0, 100] : [Rangeslider.valueToPercent(this.value, this.min, this.max)];

            //if an array is passed the percent changes
            if (this.isArray) {
                percent = this._values.findIndex((el) => el == this._value) * (100 / this._values.length);
            }

            this.twoHandles
                ? percent.forEach((p, i) => this.updateSliderPosition(p, i))
                : this.updateSliderPosition(percent, 0);

            this.removeEventListeners();
            this.attachEventListeners();
        }, 3);
    }

    /**
     * Builds the grid
     */
    buildGrid() {
        //calculates the number of pols the grid will have based on the size of the slider
        const numberOfPols = Math.round(this.sizes[this.units.size] / SPACE_BETWEEN_GRID_POLS / 4) * 4;
        const grid = document.createElement('div');
        grid.classList.add(`${this.orientation}-rangeslider-grid`);
        for (let i = 0; i <= numberOfPols; i++) {
            //each forth poll will be larger with a value added
            if (i % (numberOfPols / 4) === 0) {
                grid.appendChild(
                    this.createGridPoll(
                        parseFloat((parseInt(this.min) + (this.max - this.min) * (i / numberOfPols)).toFixed(2))
                    )
                );
                continue;
            }
            grid.appendChild(this.createGridPoll());
        }

        this.rangeslider.appendChild(grid);
    }

    /**
     * Builds a different grid if an array is passed
     */
    buildArrayGrid() {
        const grid = document.createElement('div');
        grid.classList.add(`${this.orientation}-rangeslider-grid`);
        //builds only pols for the values of the array
        for (let i = 0; i < this._values.length; i++) {
            const entry = this._values[i];
            grid.appendChild(this.createGridPoll(entry));
        }

        this.rangeslider.appendChild(grid);
    }

    /**
     * Creates a grid poll
     * @param {number} value - value of the grid poll
     * @returns {HTMLDivElement}
     */
    createGridPoll(value) {
        const polContainer = document.createElement('div');
        polContainer.classList.add(`${this.orientation}-grid-pol-container`);

        polContainer.innerHTML = `
            <div class="${this.orientation}-grid-pol ${this.orientation}-pol-without-text"></div>
        `;

        //checks if the passed value is a string or number and then makes a pol with value
        if (typeof value === 'number' || typeof value === 'string') {
            polContainer.innerHTML = `
                <div class="${this.orientation}-grid-pol"></div>
                <div class="${this.orientation}-grid-text">${value}</div>
            `;
        }

        return polContainer;
    }

    /**
     * Creates the thumb element
     * @param {number || string} value - the initial value of the thumb
     */
    buildThumb(value) {
        const thumb = document.createElement('div');
        thumb.classList.add(`${this.orientation}-rangeslider-thumb`);
        thumb.textContent = value;
        this.rangeslider.appendChild(thumb);
    }

    /**
     * Gets the rangeslider dimensions
     * @returns {DOMRect}
     */
    getRangeSliderSize() {
        return this.querySelector(`.${this.orientation}-rangeslider-wrapper`).getBoundingClientRect();
    }

    /**
     * Sets the min and max value of the rangeslider
     */
    setMinAndMax() {
        //if we have an array we set the min and max values to the first and last entry of the array
        if (this.isArray) {
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
        //if there are two handles we set their values to the min and max
        if (this.twoHandles) {
            this.value = [this.min, this.max];
            return;
        }

        this.value = [this.getAttribute('value')] || [this.min];
        //checks if the value provided is less than the min or more than the max and sets it to the minimum value
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
    attachEventListeners() {
        this.querySelector(`.${this.orientation}-rangeslider-wrapper`).addEventListener('mousedown', this.onMouseDown);
    }

    /**
     * Removes the event listener
     */
    removeEventListeners() {
        this.querySelector(`.${this.orientation}-rangeslider-wrapper`).removeEventListener(
            'mousedown',
            this.onMouseDown
        );
    }

    /**
     * Updates the positions of the handles and the width of the bar
     * @param {number} percent 
     * @param {number} index - the index of the handle we want to update
     */

    updateSliderPosition(percent, index) {
        //The percent of the step that is set, if the values are an array, the step is between each array value
        const percentStep = this.isArray
            ? 100 / (this._values.length - 1)
            : Rangeslider.valueToPercent(this.step, this.min, this.max);

        //the range which should be clamped
        let clampRange = [0, 100];
        //if we have two handles we need to clamp each so that it doesn't pass beyond the other handle
        if (this.twoHandles && this.handle[1].style[this.units.position]) {
            if (index === 0) {
                clampRange =
                    this.orientation === 'vertical'
                        ? [0, 100 - parseFloat(this.handle[1].style[this.units.position])]
                        : [0, parseFloat(this.handle[1].style[this.units.position])];
            }
            if (index === 1) {
                clampRange =
                    this.orientation === 'vertical'
                        ? [100 - parseFloat(this.handle[0].style[this.units.position]), 100]
                        : [parseFloat(this.handle[0].style[this.units.position]), 100];
            }
        }
        //the provided percent is clamped 
        percent = Rangeslider.clamp(Math.round(percent / percentStep) * percentStep, ...clampRange);
        this.handle[index].style[this.units.position] = `${this.orientation === 'vertical' ? 100 - percent : percent}%`;

        //we get the distance between two handles to set the width of the bar to
        const distanceBetweenHandles =
            this.twoHandles &&
            Math.abs(
                parseFloat(this.handle[0].style[this.units.position]) -
                    parseFloat(this.handle[1].style[this.units.position])
            );

        this.bar.style[this.units.size] = this.twoHandles ? `${distanceBetweenHandles}%` : `${percent}%`;

        if (this.twoHandles && index === 0) {
            this.bar.style[this.units.position] = `${this.orientation === 'vertical' ? 100 - percent : percent}%`;
        }
        
        this._value[index] = this.isArray
            ? this._values[percent / percentStep]
            : parseFloat(this.calculateHandleValue(percent).toFixed(2));

        if (this.thumb) {
            this.thumbElement[index].innerHTML = this._value[index];
            this.thumbElement[index].style[this.units.position] = `${
                this.orientation === 'vertical' ? 100 - percent : percent
            }%`;
        }
    }

    /**
     * Executed on mousedown. Sets the handle to the clicked coordinates and attaches event listeners to the document
     * @param {MouseEvent} e 
     */
    onMouseDown(e) {
        //creates the active handle
        this.activeHandle = 0;

        //we calculate the offsetX or offsetY of the click event
        const offset =
            this.orientation === 'vertical'
                ? this.sizes[this.units.coordinate] +
                  this.sizes[this.units.size] -
                  (document.body.scrollTop + e[this.units.mouseAxisCoords])
                : document.body.scrollLeft + e[this.units.mouseAxisCoords] - this.sizes[this.units.coordinate];

        const percent = Rangeslider.valueToPercent(offset, 0, this.sizes[this.units.size]);

        //get the closes handle to the click if we have two handles
        if (this.twoHandles) {
            const distance = [];

            for (let i = 0; i < this.handle.length; i++) {
                const pos = parseInt(this.handle[i].style[this.units.position]);
                distance.push(Math.abs(pos - percent));
            }

            this.activeHandle =
                this.orientation === 'vertical'
                    ? distance.reverse().indexOf(Math.min(...distance))
                    : distance.indexOf(Math.min(...distance));
        }

        this.updateSliderPosition(percent, this.activeHandle);

        //dispatching a custom event with the rangeslider values
        this.dispatchEvent(new CustomEvent('sliderupdate', { detail: this._value }));

        //attaching event listeners on mousedown so we don't have them attached all the time
        document.addEventListener('mousemove', this.onMouseMove);
        document.addEventListener('mouseup', this.onMouseUp);
    }

    /**
     * Moving the handle with the mouse
     * @param {MouseEvent} e 
     */
    onMouseMove(e) {
        const offset =
            this.orientation === 'vertical'
                ? this.sizes[this.units.coordinate] +
                  this.sizes[this.units.size] -
                  (document.body.scrollTop + e[this.units.mouseAxisCoords])
                : document.body.scrollLeft + e[this.units.mouseAxisCoords] - this.sizes[this.units.coordinate];

        const percent = Rangeslider.valueToPercent(offset, 0, this.sizes[this.units.size]);

        this.updateSliderPosition(percent, this.activeHandle);

        this.dispatchEvent(new CustomEvent('sliderupdate', { detail: this._value }));
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
