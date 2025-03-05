import { components } from '../../../../lib/components.js';
// const components = new Components();
// import verticalTemplate from '../../templates/vertical.html';
// import horizontalTemplate from '../../templates/horizontal.html';
// eslint-disable-next-line no-unused-vars
import Rangeslider from '../../script.js';
import RangeSliderBase from '../rangesliderBase.js';

const commonStyles = `
.handle-0[active],
.handle-1[active] {
    border-style: solid;
    border-width: 2px;
    border-color: #0085a7;
    z-index: 10;
}`;

const verticalTemplate = `
<style>
${commonStyles}
.guic-vertical-rangeslider-wrapper {
    width: 5vh;
    display: flex;
    height: 40vh;
    margin: 10vh;
    display: flex;
    justify-content: center;
    user-select: none;
}

.guic-vertical-rangeslider {
    position: relative;
    width: 5px;
    height: 100%;
    background-color:rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    flex-direction: column;
}

.guic-vertical-rangeslider-handle {
    position: absolute;
    transform: translateY(-50%);
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background-color: #00ccff;
    cursor: pointer;
    z-index: 2;
}

.guic-vertical-rangeslider-bar {
    position: absolute;
    top: 100%;
    left: 0px;
    height: 50%;
    width: 100%;
    background-color: #0085a7;
    transform: translateY(-100%);
}

.guic-vertical-rangeslider-grid {
    display: flex;
    flex-direction: column-reverse;
    position: absolute;
    left: 100%;
    height: 100%;
    justify-content: space-between;
}

.guic-rangeslider-vertical-grid-pol-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 2px;
}

.guic-rangeslider-vertical-grid-pol {
    width: 10px;
    height: 2px;
    background-color: black;
}

.guic-rangeslider-vertical-grid-text {
    color: black;
    font-size: 0.8rem;
}

.guic-rangeslider-vertical-pol-without-text {
    width: 5px;
}

.guic-vertical-rangeslider-thumb {
    position: absolute;
    right: 300%; /* Since the percent of the left/right property is based on the width of the parent, to position the handle to the left we need 3x the width */
    transform: translateY(-50%);
    background-color: #0085a7;
    padding: 5px;
    border-radius: 5px;
    color: white;
}
</style>
<div class="guic-vertical-rangeslider-wrapper">
    <div class="guic-vertical-rangeslider">
        <div class="guic-vertical-rangeslider-bar"></div>
        <div class="guic-vertical-rangeslider-handle"></div>
    </div>
</div>
`;

const horizontalTemplate = `
<style>
${commonStyles}
.guic-horizontal-rangeslider-wrapper {
    width: 40vh;
    display: flex;
    height: 20px;
    display: flex;
    align-items: center;
    margin: 10vh;
    user-select: none;
}

.guic-horizontal-rangeslider {
    position: relative;
    width: 100%;
    height: 5px;
    background-color:rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
}

.guic-horizontal-rangeslider-handle {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background-color: #00ccff;
    cursor: pointer;
    z-index: 2;
}

.guic-horizontal-rangeslider-bar {
    position: absolute;
    top: 0px;
    left: 0px;
    height: 100%;
    width: 50%;
    background-color: #0085a7;
}

.guic-horizontal-rangeslider-grid {
    display: flex;
    flex-direction: row;
    position: absolute;
    top: 100%;
    width: 100%;
    justify-content: space-between;
}

.guic-rangeslider-horizontal-grid-pol-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 2px;
}

.guic-rangeslider-horizontal-grid-pol {
    height: 10px;
    width: 2px;
    background-color: black;
}

.guic-rangeslider-horizontal-grid-text {
    color: black;
    font-size: 0.8rem;
}

.guic-rangeslider-horizontal-pol-without-text {
    height: 5px;
}

.guic-horizontal-rangeslider-thumb {
    position: absolute;
    top: -800%; /* Since the percent of the top property is based on the height of the parent, to position the handle above we need 8x the height */
    left: 50%;
    transform: translateX(-50%);
    background-color: #0085a7;
    padding: 5px;
    border-radius: 5px;
    color: white;
}
</style>
<div class="guic-horizontal-rangeslider-wrapper">
    <div class="guic-horizontal-rangeslider">
        <div class="guic-horizontal-rangeslider-bar"></div>
        <div class="guic-horizontal-rangeslider-handle"></div>
    </div>
</div>
`;

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
            this.handle = this.rangeslider.shadowRoot.querySelector(`.guic-${this.rangeslider.orientation}-rangeslider-handle`);
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

            this.thumbElement = this.rangeslider.shadowRoot.querySelector(`.guic-${this.rangeslider.orientation}-rangeslider-thumb`);
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
