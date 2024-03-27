/* eslint-disable linebreak-style */
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Components } from 'coherent-gameface-components';
const components = new Components();
import verticalTemplate from './templates/vertical.html';
import horizontalTemplate from './templates/horizontal.html';
import { orientationUnitsNames } from './orientationUnitsNames';

const BaseComponent = components.BaseComponent;

/**
 * Slider component; can be independently or as a building block of another
 * component - for example a scrollbar. This is a custom slider control, do not
 * confuse with the standard input type slider HTML element.
*/
class Slider extends BaseComponent {
    // eslint-disable-next-line require-jsdoc
    static get observedAttributes() { return ['step', 'orientation']; }

    /**
     * Set the position of the slider's handler.
     * @param {number} value - the new value in percents.
    */
    set handlePosition(value) {
        this._handlePosition = value;
        // The names of the units vary depending on the orientation
        // of the slider - width for horizontal, height for vertical etc.
        this.handle.style[this.units.position] = value + '%';
    }

    /**
     * Get the current position of the slider's handle in percents.
     * @returns {number} - the value of the position.
    */
    get handlePosition() {
        return this._handlePosition;
    }

    /**
     * Get the current position of the slider's handle in pixels.
     * @returns {number} - the value of the position.
    */
    get handlePositionPx() {
        const sliderSize = this.slider[this.units.offset];
        return this.handlePosition / 100 * sliderSize;
    }

    // eslint-disable-next-line require-jsdoc
    get step() { return this.state.step; }

    // eslint-disable-next-line require-jsdoc
    set step(value) { this.setAttribute('step', value); }

    // eslint-disable-next-line require-jsdoc
    get orientation() { return this.state.orientation; }

    // eslint-disable-next-line require-jsdoc
    set orientation(value) { this.setAttribute('orientation', value); }

    // eslint-disable-next-line require-jsdoc
    constructor() {
        super();

        this.onSlideUp = (e) => { this.onSlideWithArrorws(-1); };
        this.onSlideDown = (e) => { this.onSlideWithArrorws(1); };
        this.onClick = this.onClick.bind(this);
        this.onWheel = this.onWheel.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.init = this.init.bind(this);

        this.state = {
            orientation: 'vertical',
            step: 10,
        };

        this.stateSchema = {
            orientation: { type: ['string'] },
            step: { type: ['number'] },
        };
    }

    /**
     * Custom element lifecycle method. Called when an attribute is changed.
     * @param {string} name
     * @param {string} oldValue
     * @param {string|boolean} newValue
     */
    attributeChangedCallback(name, oldValue, newValue) {
        if (!this.isRendered) return;

        this.updateAttributeState(name, oldValue, newValue);
    }

    /**
     * Will update the state properties
     * @param {string} name
     * @param {string} oldValue
     * @param {string} value
     */
    updateAttributeState(name, oldValue, value) {
        // Prevent state updates if the value is the same especially when orientation is changed because then the whole component will be re-rendered
        if (oldValue === value) return;

        switch (name) {
            case 'step':
                this.updateState('step', parseFloat(value));
                break;
            case 'orientation':
                this.updateOrientationState(value);
                break;
        }
    }

    /**
     * Update the slider's state.
     * @param {string} name - the name of the prop
     * @param {string | boolean} value - the value of the the prop
     * @returns {void}
     */
    updateState(name, value) {
        if (!this.isStatePropValid(name, value)) return;
        this.state[name] = value;
    }

    /**
     * Will update the slider when orientation attribute is changed
     * @param {boolean} value
     */
    updateOrientationState(value) {
        this.checkOrientationValueValidity(value);
        this.reRender();
    }

    /**
     * Will verify that the orientation has valid value and will fallback if not
     * @param {string} value
     */
    checkOrientationValueValidity(value) {
        if (!['vertical', 'horizontal'].includes(value)) {
            console.warn(`'${value}' is not a valid orientation. It should be either 'horizontal' or 'vertical'. Will fallback to 'vertical'`);
        }
    }

    /**
     * Will re-render the component from scratch
     */
    reRender() {
        this.template = undefined;
        this.isRendered = false;
        this.connectedCallback();
    }

    /**
     * Initialize the custom component.
     * Set template, attach event listeners, setup initial state etc.
     * @param {object} data
    */
    init(data) {
        this.setupTemplate(data, () => {
            // render the template
            components.renderOnce(this);
            // do the initial setup - add event listeners, assign members
            this.setup();
        });
    }


    /**
     * Called when the element was attached to the DOM.
    */
    connectedCallback() {
        // the amount of units that the slider will be updated
        this.state.step = this.getAttribute('step') || 10;
        // the initial position of the handle
        this._handlePosition = 0;

        // vertical or horizontal
        this.state.orientation = this.getAttribute('orientation');
        if (!['vertical', 'horizontal'].includes(this.orientation)) this.state.orientation = 'vertical';
        // use the template for the current slider orientation
        this.template = (this.orientation === 'vertical') ? verticalTemplate : horizontalTemplate;
        /**
         * The names of the units are different for the two slider types.
         * ['clientY', 'height', 'heightPX', 'top', 'scrollHeight] for vertical and
         * ['clientX', 'width', 'widthPX', 'left', 'scrollWidth] for horizontal
        */
        this.units = orientationUnitsNames.get(this.orientation);

        // Load the template
        components.loadResource(this)
            .then(this.init)
            .catch(err => console.error(err));
    }

    /**
     * Set the slider and handle members and add event listeners.
    */
    setup() {
        this.slider = this.getElementsByClassName(`guic-slider-${this.orientation}-slider`)[0];
        this.handle = this.getElementsByClassName(`guic-slider-${this.orientation}-handle`)[0];

        this.attachEventListeners();
    }

    // eslint-disable-next-line require-jsdoc
    disconnectedCallback() {
        this.removeEventListeners();
    }
    /**
     * Gets the size of an element in px.
     * @param {HTMLElement} element
     * @returns {number} - the size in pixels.
    */
    getElementSize(element) {
        const unitsName = this.units.offset;
        return element[unitsName];
    }

    /**
     * Update the size of the slider thumb.
     * This function is used from within the Scrollable Container Component only.
     * @param {HTMLElement} scrollableContainer
    */
    resize(scrollableContainer) {
        const sliderWrapper = this.querySelector(`.guic-${this.orientation}-slider-wrapper`);
        let scrollableContainerComponent = null;
        // We do it like that because in Gameface such syntax - scrollableContainer?.parentElement?.parentElement; is not woking
        if (scrollableContainer && scrollableContainer.parentElement) {
            scrollableContainerComponent = scrollableContainer.parentElement;
        }
        if (scrollableContainerComponent && scrollableContainerComponent.parentElement) {
            scrollableContainerComponent = scrollableContainerComponent.parentElement;
        }

        const scrollableContainerSize = this.getElementSize(scrollableContainer);
        if (scrollableContainerComponent.tagName === 'GAMEFACE-SCROLLABLE-CONTAINER' && !scrollableContainerComponent.hasAttribute('fixed-slider-height')) {
            // set the slider wrapper to be as big as the scrollable container
            sliderWrapper.style.height = `${scrollableContainerSize}px`;
        } else {
            // remove height property from the slider if the fixed-slider-height attribute is set dynamically
            sliderWrapper.style.height = '';
        }

        // Wait 1 layout frame so the the new slider height has taken effect set from the prev lines
        components.waitForFrames(() => {
            // get the size of the slider area
            const sliderSize = this.slider[this.units.offset];
            // get the size of the handle in percents relative to the current scroll(Height/Width)
            const handleSizePercent = (sliderSize / scrollableContainer[this.units.scroll]) * 100;
            // get the size of the handle in px;
            const handleSize = (scrollableContainerSize / 100) * handleSizePercent;
            // set the new size of the handle
            this.handle.style[this.units.size] = handleSize + 'px';

            this.scrollTo(this.handlePositionPx);
            if (this.style.visibility === 'hidden') this.style.visibility = 'visible';
        });
    }

    /**
     * Remove event listeners.
     */
    removeEventListeners() {
        // document listeners
        document.removeEventListener('mousemove', this.onMouseMove);
        document.removeEventListener('mouseup', this.onMouseUp);
    }

    /**
     * Add event listeners to handle user interaction.
    */
    attachEventListeners() {
        // local listeners
        this.slider.addEventListener('click', this.onClick);
        this.slider.addEventListener('wheel', this.onWheel);
        this.handle.addEventListener('mousedown', this.onMouseDown);
        this.querySelector('.up').addEventListener('mousedown', this.onSlideUp);
        this.querySelector('.down').addEventListener('mousedown', this.onSlideDown);

        // document listeners
        document.addEventListener('mousemove', this.onMouseMove);
        document.addEventListener('mouseup', this.onMouseUp);
    }

    /**
     * Executed on mousedown. Moves the handle towards the position of the mouse
     * with one step.
     * @param {MouseEvent} event
    */
    onMouseDown(event) {
        // set a flag to help the detection of drag
        this.mousedown = true;
        // get the bounding rectangles of the slider area and the handle
        const handleRect = this.handle.getBoundingClientRect();
        const sliderRect = this.slider.getBoundingClientRect();

        // get the current position of the slider (top or left)
        const sliderY = sliderRect[this.units.position];
        // get the handle position within the slider's coordinates
        const handleY = handleRect[this.units.position] - sliderY;
        const mouseY = event[this.units.mouseAxisCoords] - sliderY;

        // set the difference between the mouse click and the handle position
        // used for better looking drag
        this.delta = mouseY - handleY;
    }

    /**
     * Called on mouseup.
     * Resets the mousedown, dragging and slidingWithArrows properties
     * and clears intervals.
    */
    onMouseUp() {
        this.mousedown = false;
        this.dragging = false;

        if (this.slidingWithArrows) {
            this.slidingWithArrows = false;
            clearInterval(this.interval);
        }
    }

    /**
     * Called on mousemove.
     * Detects dragging and scrolls to the current position of the mouse.
     * @param {MouseEvent} event
    */
    onMouseMove(event) {
        if (!this.mousedown) return;
        this.dragging = true;
        const sliderRect = this.slider.getBoundingClientRect();
        // get the mouse position within the slider coordinates
        const mouseY = event[this.units.mouseAxisCoords] - sliderRect[this.units.position];
        this.scrollTo(mouseY - this.delta);
    }

    /**
     * Called when the arrow controls are used for sliding.
     * Starts an interval and updates the slider position until mouseup occurs.
     * @param {number} direction - 1 for down, -1 for up
    */
    onSlideWithArrorws(direction) {
        this.slidingWithArrows = true;
        this.interval = setInterval(() => this.scrollTo(this.getNextScrollPosition(direction, this.step)), 10);
    }

    /**
     * Scrolls the a given position in percents.
     * Used from the scrollable container
     * @param {number} position
    */
    scrollToPercents(position) {
        const handleRect = this.handle.getBoundingClientRect();
        const sliderRect = this.slider.getBoundingClientRect();
        const handleSizePercent = (handleRect[this.units.size] / sliderRect[this.units.size]) * 100;

        // the slider range in percents is [0 - 100 - handleSizePercent]
        // if the new position is outside of this range - snap the handle and
        // scroll to the top or to the bottom
        if (position < 0) position = 0;
        if (position + handleSizePercent > 100) position = 100 - handleSizePercent;
        this.handlePosition = position;
    }

    /**
     * Scrolls the a given position.
     * @param {number} position
    */
    scrollTo(position) {
        const handleRect = this.handle.getBoundingClientRect();
        const sliderRect = this.slider.getBoundingClientRect();

        const handleSizePercent = (handleRect[this.units.size] / sliderRect[this.units.size]) * 100;
        // new position in %
        let newPosPercents = (position / sliderRect[this.units.size]) * 100;

        // the slider range in percents is [0 - 100 - handleSizePercent]
        // if the new position is outside of this range - snap the handle and
        // scroll to the top or to the bottom
        if (newPosPercents < 0) newPosPercents = 0;
        if (newPosPercents + handleSizePercent > 100) newPosPercents = 100 - handleSizePercent;
        this.handlePosition = newPosPercents;

        // dispatch an event in case something needs to be done on scroll
        this.dispatchEvent(new CustomEvent('slider-scroll', { detail: { handlePosition: newPosPercents } }));
    }

    /**
     * Called on wheel event of the mouse.
     * Scrolls the slider in the position of which the wheel is rotated
     * @param {WheelEvent} event
    */
    onWheel(event) {
        const direction = (event.deltaY < 0) ? -1 : 1;
        this.scrollTo(this.getNextScrollPosition(direction, this.step));
    }

    /**
     * Called on click of the mouse.
     * Updated the handle's position with one step towards the position of the
     * mouse click.
     * @param {MouseEvent} event
    */
    onClick(event) {
        if (event.target.classList.contains('handle')) return;
        let direction = -1;
        if (this.handle.getBoundingClientRect()[this.units.position] < event[this.units.mouseAxisCoords]) direction = 1;
        this.scrollTo(this.getNextScrollPosition(direction, this.step));
    }

    /**
     * Gets the next value of the scroll.
     * @param {number} direction
     * @param {number} step
     * @returns {number} - the new scroll position
    */
    getNextScrollPosition(direction, step = this.step) {
        // get the current scroll postition in px
        const scrollTop = this.handlePosition * this.slider.getBoundingClientRect()[this.units.size] / 100;
        return scrollTop + (direction * step);
    }
}

components.defineCustomElement('gameface-slider', Slider);
export default Slider;
