import { clamp } from '../utils/utility-functions';
import actions from './actions';

const AXIS = ['x', 'y'];
/**
 * Makes an element draggable
 */
class Draggable {
    /**
     *
     * @param {Object} options
     * @param {string} options.element
     * @param {string} options.restrictTo
     * @param {string} options.dragClass
     * @param {'x'|'y'} options.lockAxis
     * @param {function} options.onDragStart
     * @param {function} options.onDragMove
     * @param {function} options.onDragEnd
     */
    constructor(options) {
        const hash = (Math.random() + 1).toString(36).substring(7);

        this.draggableElements = [];
        this.draggedElement = null;
        this.enabled = false;

        this.actionName = `drag-around-${hash}`;

        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);

        this.restrict = {
            top: 0,
            left: 0,
            right: Infinity,
            bottom: Infinity,
        };

        this.options = options;

        this.init();
    }

    /**
     * Get the index of the dragged item in the draggableElements
     */
    get draggedItemIndex() {
        return [...this.draggableElements].indexOf(this.draggedElement);
    }

    /**
     * Gets the body scroll offset to calculate in the dragging
     */
    get scrollOffset() {
        return {
            x: document.body.scrollLeft,
            y: document.body.scrollTop,
        };
    }

    /**
     * @returns {void}
     */
    init() {
        if (this.enabled) return;

        this.draggableElements = document.querySelectorAll(this.options.element);
        if (this.draggableElements.length === 0) {
            return console.error(`${this.options.element} is not a valid element selector.`);
        }

        this.draggableElements.forEach(element => element.addEventListener('mousedown', this.onMouseDown));

        this.registerDragActions();
        this.enabled = true;
    }

    /**
     * Removes the eventlisteners
     * @returns {void}
     */
    deinit() {
        if (!this.enabled) return;
        this.enabled = false;

        this.draggableElements.forEach(element => element.removeEventListener('mousedown'), this.onMouseDown);
        this.removeDragActions();
    }

    /**
     * mousedown event handler
     * @param {MouseEvent} event
     */
    onMouseDown(event) {
        this.draggedElement = event.currentTarget;

        this.draggedElement.style.position = 'absolute';
        this.elementRect = this.draggedElement.getBoundingClientRect();

        this.setRestriction();

        this.options.dragClass && this.draggedElement.classList.add(this.options.dragClass);
        this.options.onDragStart && this.options.onDragStart(this.draggedElement);

        document.addEventListener('mousemove', this.onMouseMove);
        document.addEventListener('mouseup', this.onMouseUp);
    }

    /**
     * mousemove event handler
     * @param {MouseEvent} event
     */
    onMouseMove(event) {
        actions.execute(this.actionName, {
            x: event.clientX + this.scrollOffset.x,
            y: event.clientY + this.scrollOffset.y,
            index: this.draggedItemIndex,
        });
    }

    /**
     * mouseup event handler
     */
    onMouseUp() {
        document.removeEventListener('mousemove', this.onMouseMove);
        document.removeEventListener('mouseup', this.onMouseUp);

        this.options.onDragEnd && this.options.onDragEnd(this.draggedElement);
        this.options.dragClass && this.draggedElement.classList.remove(this.options.dragClass);

        this.draggedElement = null;
    }

    /**
     * Register dragging as an action to be able to use it externally
     */
    registerDragActions() {
        actions.register(this.actionName, ({ x, y, index }) => {
            if (!this.draggableElements[index]) return console.error(`There is no draggable element at index ${index}`);

            if (this.options.lockAxis && AXIS.includes(this.options.lockAxis)) {
                x = this.options.lockAxis === 'y' ? this.elementRect.x : x;
                y = this.options.lockAxis === 'x' ? this.elementRect.y : y;
            }

            this.draggableElements[index].style.left = `${clamp(x, this.restrict.left, this.restrict.right)}px`;
            this.draggableElements[index].style.top = `${clamp(y, this.restrict.top, this.restrict.bottom)}px`;

            this.options.onDragMove && this.options.onDragMove({ x, y });
        });
    }

    /**
     * Removes the registered action
     */
    removeDragActions() {
        actions.remove(this.actionName);
    }

    /**
     * Sets the bounds if a dragged element has to be restricted
     * @returns {void}
     */
    setRestriction() {
        if (!this.options.restrictTo) return;

        const restrictTo = document.querySelector(this.options.restrictTo);
        if (!restrictTo) {
            return console.error(
                `The element ${this.options.restrictTo} you trying to restrict dragging to is not a valid element`
            );
        }

        const { x, y, height, width } = restrictTo.getBoundingClientRect();
        this.restrict = {
            top: y,
            left: x,
            right: width + x - this.elementRect.width,
            bottom: height + y - this.elementRect.height,
        };
    }
}

export default Draggable;
