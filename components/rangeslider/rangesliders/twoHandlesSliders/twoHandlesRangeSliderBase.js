import { components } from '../../../../lib/components.js';
// const components = new Components();
// import verticalTemplateTwoHandles from '../../templates/verticalTwoHandles.html';
// import horizontalTemplateTwoHandles from '../../templates/horizontalTwoHandles.html';
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

const verticalTemplateTwoHandles = `
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
        <div class="guic-vertical-rangeslider-handle handle-0"></div>
        <div class="guic-vertical-rangeslider-bar"></div>
        <div class="guic-vertical-rangeslider-handle handle-1"></div>
    </div>
</div>
`;

const horizontalTemplateTwoHandles = `
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
        <div class="guic-horizontal-rangeslider-handle handle-0"></div>
        <div class="guic-horizontal-rangeslider-bar"></div>
        <div class="guic-horizontal-rangeslider-handle handle-1"></div>
    </div>
</div>
`;

/**
 * This class holds common methods and data for all the rangesliders
 */
export default class TwoHandlesRangeSliderBase extends RangeSliderBase {
    /**
     * @param {Rangeslider} rangeslider - The gameface-rangeslider custom element
     */
    constructor(rangeslider) {
        if (new.target === TwoHandlesRangeSliderBase) {
            throw new TypeError('Cannot construct TwoHandlesRangeSliderBase instances directly');
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
            value: [],
            customHandleLeft: null,
            customHandleRight: null,
        };
    }

    // The derived class should override the next methods because they behave differently for basic and values range slider
    // OVERRIDE START
    /**
     * Updates the positions of the handles and the width of the bar
     * @param {number} percent
     * @param {number} index
     */
    updateSliderPosition(percent, index) {
        throw new Error('Method \'updateSliderPosition()\' must be implemented.');
    }
    // OVERRIDE END

    /**
     * Checks if the range slider has value
     * @returns {boolean}
     */
    valueMissing() {
        if (!this.value && !this.value[0]) return true;
        return false;
    }

    /**
     * Gets the correct template to be loaded for the rangeslider
     * @param {string} orientation - the orientation of the slider
     * @returns {string}
     */
    getTemplate(orientation) {
        if (orientation === 'vertical') return verticalTemplateTwoHandles;

        return horizontalTemplateTwoHandles;
    }

    /**
     * Will set the thumb if this option is enabled
     */
    setThumb() {
        // if the thumb attribute is added, the thumbs are created
        if (this.thumb) {
            // creates two thumbs
            this.value.forEach(val => this.buildThumb(val));
            this.thumbElement = this.rangeslider.shadowRoot.querySelectorAll(`.guic-${this.rangeslider.orientation}-rangeslider-thumb`);
        }
    }

    /**
     * Will initialize the custom handles variables
     */
    initCustomHandles() {
        const customHandleSelectors = {
            LEFT: this.rangeslider.getAttribute('custom-handle-left'),
            RIGHT: this.rangeslider.getAttribute('custom-handle-right'),
        };

        this.addCustomHandles(customHandleSelectors);
    }

    /**
     * Sets up the rangeslider, draws the additional things like grid and thumbs, attaches the event listeners
     */
    setup() {
        components.waitForFrames(() => {
            this.handle = this.rangeslider.shadowRoot.querySelectorAll(`.guic-${this.rangeslider.orientation}-rangeslider-handle`);
            this.setupSlider();
        }, 3);
    }

    /**
     * Will update the handles values depending of if they are two or a single one
     * @returns {void}
     */
    updateCustomHandles() {
        if (this.customHandleLeft && this.value[0] !== undefined) {
            this.customHandleLeft.textContent = this.value[0];
        }

        if (this.customHandleRight && this.value[1] !== undefined) {
            this.customHandleRight.textContent = this.value[1];
        }
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
            clampRange = this.rangeslider.orientation === 'vertical' ?
                [0, 100 - parseFloat(handleOnePosition)] :
                [0, parseFloat(handleOnePosition)];
        } else if (index === 1) {
            clampRange = this.rangeslider.orientation === 'vertical' ?
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
        const secondHandlePositionValue = this.handle[1].style[this.units.position];

        return Math.abs(parseFloat(firstHandlePositionValue) - parseFloat(secondHandlePositionValue));
    }

    /**
     * Will set the bar styles
     * @param {number} index
     * @param {number} percent
     */
    setBarStyles(index, percent) {
        this.handle[index].style[this.units.position] = `${this.rangeslider.orientation === 'vertical' ? 100 - percent : percent}%`;

        // we get the distance between two handles to set the width of the bar to
        const distanceBetweenHandles = this.getDistanceBetweenTwoHandles();

        this.bar.style[this.units.size] = `${distanceBetweenHandles}%`;

        if (index === 0) {
            this.bar.style[this.units.position] = `${this.rangeslider.orientation === 'vertical' ? 100 - percent : percent}%`;
        }
    }

    /**
     * Will change the thumb position
     * @param {number} percent
     * @param {number} index - the index of the handle we want to update
     */
    setThumbPosition(percent, index) {
        if (this.thumb) {
            this.thumbElement[index].innerHTML = this.value[index];
            this.thumbElement[index].style[this.units.position] = `${this.rangeslider.orientation === 'vertical' ? 100 - percent : percent}%`;
        }
    }

    /**
     * Will get the closest handle to the mouse position in percent
     * @param {number} percent
     * @returns {number}
     */
    getClosestHandleToMousePosition(percent) {
        const distance = [];

        for (let i = 0; i < this.handle.length; i++) {
            const pos = parseInt(this.handle[i].style[this.units.position]);
            distance.push(Math.abs(pos - percent));
        }

        return this.rangeslider.orientation === 'vertical' ?
            distance.reverse().indexOf(Math.min(...distance)) :
            distance.indexOf(Math.min(...distance));
    }

    /**
     * Make a handle active by setting the correct class names
     * @param {HTMLElement} handle
     */
    setActiveHandle(handle) {
        handle.setAttribute('active', '');
    }

    /**
     * Make a handle inactive by setting the correct class names
     * @param {HTMLElement} handle
     */
    setInactiveHandle(handle) {
        handle.removeAttribute('active');
    }

    /**
     * Executed on mousedown. Sets the handle to the clicked coordinates and attaches event listeners to the document
     * @param {MouseEvent} e
     */
    onMouseDown(e) {
        const percent = this.getHandlePercent(e);

        const currentActiveHandle = this.handle[this.activeHandle];
        if (currentActiveHandle) this.setInactiveHandle(currentActiveHandle);

        const targetClassList = e.target?.classList;
        if (targetClassList && (targetClassList.contains('guic-horizontal-rangeslider-handle') ||
            targetClassList.contains('guic-vertical-rangeslider-handle')) ) {
            targetClassList.contains('handle-1') ? this.activeHandle = 1 : this.activeHandle = 0;
        } else {
            this.activeHandle = this.getClosestHandleToMousePosition(percent);
        }

        this.setActiveHandle(this.handle[this.activeHandle]);

        this.updateSliderPosition(percent, this.activeHandle);

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

        const currentActiveHandle = this.handle[this.activeHandle];
        if (currentActiveHandle) this.setInactiveHandle(currentActiveHandle);

        const targetClassList = e.target?.classList;
        if (targetClassList && (targetClassList.contains('guic-horizontal-rangeslider-handle') ||
            targetClassList.contains('guic-vertical-rangeslider-handle')) ) {
            targetClassList.contains('handle-1') ? this.activeHandle = 1 : this.activeHandle = 0;
        } else {
            this.activeHandle = this.getClosestHandleToMousePosition(percent);
        }

        this.setActiveHandle(this.handle[this.activeHandle]);

        this.updateSliderPosition(percent, this.activeHandle);

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

        this.updateSliderPosition(percent, this.activeHandle);
    }

    /**
     * Moving the handle with the touch
     * @param {TouchEvent} e
     */
    onTouchMove(e) {
        e.preventDefault();
        this.onMouseMove(e.touches[0]);
    }
}
