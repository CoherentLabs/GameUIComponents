import { Components } from 'coherent-gameface-components';
const components = new Components();
import verticalTemplate from '../../templates/vertical.html';
import horizontalTemplate from '../../templates/horizontal.html';
// eslint-disable-next-line no-unused-vars
import Rangeslider from '../../script';
import RangeSliderBase from '../rangesliderBase';

/**
 * This class holds common methods and data for all the rangesliders with a single handle
 */
export default class SingleHandleRangeSliderBase extends RangeSliderBase {
    /**
     * @param {Rangeslider} rangeslider - The gameface-rangeslider custom element
     */
    constructor(rangeslider) {
        if (new.target === SingleHandleRangeSliderBase) {
            throw new TypeError('Cannot construct SingleHandleRangeSliderBase instances directly');
        }
        super(rangeslider);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);

        this.onTouchDown = this.onTouchDown.bind(this);
        this.onTouchMove = this.onTouchMove.bind(this);

        this.state = {
            min: 0,
            max: 100,
            grid: false,
            thumb: false,
            step: 1,
            value: undefined,
            customHandle: null,
        };
    }

    // The derived class should override the next methods because they behave differently for basic and values range slider
    // OVERRIDE START
    /**
     * Will get the percentage of the current value
     * @returns {number}
     */
    getCurrentValuePercent() { return 0; }
    /**
     * Updates the positions of the handles and the width of the bar
     * @param {number} percent
     */
    updateSliderPosition(percent) {
        throw new Error('Method \'updateSliderPosition()\' must be implemented.');
    }
    // OVERRIDE END

    /**
     * Checks if the range slider has value
     * @returns {boolean}
     */
    valueMissing() {
        if (!this.value) return true;
        return false;
    }

    /**
     * Gets the correct template to be loaded for the rangeslider
     * @param {string} orientation - the orientation of the slider
     * @returns {string}
     */
    getTemplate(orientation) {
        if (orientation === 'vertical') return verticalTemplate;

        return horizontalTemplate;
    }

    /**
     * Sets up the rangeslider, draws the additional things like grid and thumbs, attaches the event listeners
     */
    setup() {
        components.waitForFrames(() => {
            this.handle = this.rangeslider.querySelector(`.guic-${this.rangeslider.orientation}-rangeslider-handle`);
            this.setupSlider();
        }, 3);
    }

    /**
     * Will set the thumb if this option is enabled
     */
    setThumb() {
        // if the thumb attribute is added, the thumbs are created
        if (this.thumb) {
            this.buildThumb(this.value);

            this.thumbElement = this.rangeslider.querySelector(`.guic-${this.rangeslider.orientation}-rangeslider-thumb`);
        }
    }

    /**
    * Will initialize the custom handles variables
    */
    initCustomHandles() {
        const customHandleSelectors = {
            SINGLE: this.rangeslider.getAttribute('custom-handle'),
        };

        this.addCustomHandles(customHandleSelectors);
    }

    /**
     * Will update the handles values depending of if they are two or a single one
     * @returns {void}
     */
    updateCustomHandles() {
        if (this.customHandle && this.value !== undefined) this.customHandle.textContent = this.value;
    }

    /**
     * Will set the bar styles
     * @param {number} percent
     */
    setBarStyles(percent) {
        if (this.handle) this.handle.style[this.units.position] = `${this.rangeslider.orientation === 'vertical' ? 100 - percent : percent}%`;

        if (this.bar) this.bar.style[this.units.size] = `${percent}%`;
    }

    /**
     * Will change the thumb position
     * @param {number} percent
     */
    setThumbPosition(percent) {
        if (this.thumb) {
            this.thumbElement.innerHTML = this.value;
            this.thumbElement.style[this.units.position] = `${this.rangeslider.orientation === 'vertical' ? 100 - percent : percent}%`;
        }
    }

    /**
     * Executed on mousedown. Sets the handle to the clicked coordinates and attaches event listeners to the document
     * @param {MouseEvent} e
     */
    onMouseDown(e) {
        const percent = this.getHandlePercent(e);
        this.updateSliderPosition(percent);

        // attaching event listeners on mousedown so we don't have them attached all the time
        document.addEventListener('mousemove', this.onMouseMove);
        document.addEventListener('mouseup', this.onMouseUp);
    }

    /**
     * Executed on touchdown. Sets the handle to the touched coordinates and attaches event listeners to the document
     * @param {TouchEvent} e
     */
    onTouchDown(e) {
        if (e.touches.length > 1) return;

        const percent = this.getHandlePercent(e.touches[0]);
        this.updateSliderPosition(percent);

        // attaching event listeners on mousedown so we don't have them attached all the time
        document.addEventListener('touchmove', this.onTouchMove);
        document.addEventListener('touchend', this.onTouchEnd);
    }

    /**
     * Moving the handle with the mouse
     * @param {MouseEvent} e
     */
    onMouseMove(e) {
        const percent = this.getHandlePercent(e);

        this.updateSliderPosition(percent);
    }

    /**
     * Moving the handle with the finger
     * @param {TouchEvent} e
     */
    onTouchMove(e) {
        e.preventDefault();
        this.onMouseMove(e.touches[0]);
    }
}
