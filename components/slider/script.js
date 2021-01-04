import components from 'coherent-gameface-components';
import verticalTemplate from './templates/vertical.html';
import horizontalTemplate from './templates/horizontal.html';
import verticalStyle from './styles/vertical.css';
import horizontalStyle from './styles/horizontal.css';
import { orientationUnitsNames } from './orientationUnitsNames';


/**
 * @class Slider.
 * Slider component; can be independently or as a building block of another
 * component - for example a scrollbar. This is a custom slider control, do not
 * confuse with the standard input type slider HTML element.
*/
class Slider extends HTMLElement {
    /**
     * Set the position of the slider's handler.
     * @param {number} value - the new value in percents.
    */
    set handlePosition (value) {
        this._handlePosition = value;
        // The names of the units vary depending on the orientation
        // of the slider - width for horizontal, height for vertical etc.
        this.handle.style[this.units.position] = value + '%';
    }

    /**
     * Get the current position of the slider's handle in percents.
     * @returns {number} - the value of the position.
    */
    get handlePosition () {
        return this._handlePosition;
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
        requestAnimationFrame(() => this.waitForFrames(callback, count));
    }

    constructor() {
        super();
        // the amount of units that the slider will be updated
        this.step = 10;
        // the initial position of the handle
        this._handlePosition = 0;

        // vertical or horizontal
        this.orientation = this.getAttribute('orientation') || 'vertical';
        // use the template for the current slider orientation
        this.template = (this.orientation === 'vertical') ? verticalTemplate : horizontalTemplate;
        // use the styles for the current slider orientation
        const styles = (this.orientation === 'vertical') ? verticalStyle : horizontalStyle;

        // import the styles
        components.importStyleTag(`gameface-slider-${this.orientation}`, styles);

        /**
         * The names of the units are different for the two slider types.
         * ['clientY', 'height', 'heightPX', 'top', 'scrollHeight] for vertical and
         * ['clientX', 'width', 'widthPX', 'left', 'scrollWidth] for horizontal
        */
        this.units = orientationUnitsNames.get(this.orientation);
    }

    /**
     * Called when the element was attached to the DOM.
    */
    connectedCallback() {
        // Load the template
        components.loadResource(this)
            .then((response) => {
                this.template = response[1].cloneNode(true);
                // render the template
                components.render(this);
                // do the initial setup - add event listeners, assign members
                this.setup();
            })
            .catch(err => console.error(err));
    }

    /**
     * Set the slider and handle members and add event listeners.
    */
    setup() {
        this.slider = this.getElementsByClassName(`${this.orientation}-slider`)[0];
        this.handle = this.getElementsByClassName(`${this.orientation}-handle`)[0];

        this.attachEventListeners();
    }

    /**
     * Gets the size of an element in px.
     * Uses the computed styles which return the size in pixels as a string.
     * @returns {number} - the size in pixels.
    */
    _getPxSizeWithoutUnits(element) {
        const size = getComputedStyle(element)[this.units.sizePX];
        return Number(size.substring(0, size.length - 2));
    }

    /**
     * Update the size of the slider thumb.
    */
    resize(scrollbleContainer) {
        Slider.waitForFrames(() => {
            // get the size of the whole slider element
            const  sliderWrapperSize = this._getPxSizeWithoutUnits(document.querySelector(`.${this.orientation}-slider-wrapper`));
            // get the size of the up or down buttons in px
            const controlsSize = this._getPxSizeWithoutUnits(document.querySelector(`.${this.orientation}-arrow`));
            // get the combined size of the up and down buttons in % of the sliderWrapperSize
            const controlsSizePercent = controlsSize * 2 / sliderWrapperSize * 100;

            // get the size of the slider area
            const sliderSize = this.slider.getBoundingClientRect()[this.units.size];
            // get the size of the handle in percents relative to the current scroll(Height/Width)
            const handleSizePercent = (sliderSize / scrollbleContainer[this.units.scroll]) * 100;
            // get the size of the handle in px; exclude the controlsSizePercent from the whole size
            const handleSize = (sliderSize / (100 - controlsSizePercent)) * handleSizePercent;
            // set the new size of the handle
            this.handle.style[this.units.size] = handleSize + 'px';
        });
    }

    /**
     * Add event listeners to handle user interaction.
    */
    attachEventListeners() {
        // local listeners
        this.slider.addEventListener('click', (e) => this.onClick(e));
        this.slider.addEventListener('wheel', (e) => this.onWheel(e));
        this.handle.addEventListener('mousedown', (e) => this.onMouseDown(e));
        this.querySelector('.up').addEventListener('mousedown', () => this.onSlideWithArrorws(-1));
        this.querySelector('.down').addEventListener('mousedown', () => this.onSlideWithArrorws(1));

        // document listeners
        document.addEventListener('mousemove', (e) => this.onMouseMove(e));
        document.addEventListener('mouseup', (e) => this.onMouseUp(e));
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
     * Called on mousedown.
     * Resets the mousedown, dragging and slidingWithArrows properties
     * and clears intervals.
    */
    onMouseUp() {
        this.mousedown = false;
        this.dragging = false;

        if(this.slidingWithArrows) {
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
        if(!this.mousedown) return
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
        this.interval = setInterval(() => this.scrollTo(this.getNextScrollPosition(direction, 10)), 10);
    }

    /**
     * Scrolls the a given position.
     * @param {number} position
    */
    scrollTo(position){
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

        //dispatch an event in case something needs to be done on scroll
        this.dispatchEvent(new CustomEvent('slider-scroll', { detail: { handlePosition: newPosPercents } }));
    }

    /**
     * Called on wheel event of the mouse.
     * Scrolls the slider in the position of which the wheel is rotated
     * @param {WheelEvent} event
    */
    onWheel(event) {
        let direction = (event.deltaY < 0) ? -1 : 1;
        this.scrollTo(this.getNextScrollPosition(direction, 10));
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