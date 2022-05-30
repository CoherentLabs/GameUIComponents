import { toDeg } from '../utils/utility-functions';
import actions from './actions';

/**
 * Allows for an element to be rotated
 */
class Rotate {
    /**
     *
     * @param {Object} options
     * @param {string} options.element
     * @param {number} options.snapAngle
     * @param {function} options.onRotation
     */
    constructor(options) {
        const hash = (Math.random() + 1).toString(36).substring(7);

        this.options = options;

        this.rotatingElement = null;
        this.elementPosition = { x: 0, y: 0 };
        this.angle = 0;
        this.enabled = false;
        this.actionName = `rotate-${hash}`;

        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);

        this.init();
    }

    /**
     * Initializes the rotation
     * @returns {void}
     */
    init() {
        if (this.enabled) return;

        this.rotatingElement = this.rotatingElement || document.querySelector(this.options.element);

        if (!this.rotatingElement) return console.error(`${this.options.element} is not a valid element selector`);
        this.rotatingElement.addEventListener('mousedown', this.onMouseDown);

        this.registerAction();

        this.enabled = true;
    }

    /**
     * Deinitilizes the rotation
     * @returns {void}
     */
    deinit() {
        if (!this.enabled) return;

        this.rotatingElement.removeEventListener('mousedown', this.onMouseDown);
        this.removeActions();

        this.enabled = false;
    }

    /**
     * Handles the mousedown event
     * @param {MouseEvent} event
     */
    onMouseDown(event) {
        document.addEventListener('mousemove', this.onMouseMove);
        document.addEventListener('mouseup', this.onMouseUp);

        const { x, y, height, width } = this.rotatingElement.getBoundingClientRect();
        this.elementPosition = { x: x + width / 2, y: y + height / 2 };

        const angle = this.getAngle(event.clientX, event.clientY);
        this.initalAngle = angle - this.angle;
    }

    /**
     * Handles the mousemove event
     * @param {MouseEvent} event
     */
    onMouseMove(event) {
        this.angle = this.getAngle(event.clientX, event.clientY) - this.initalAngle;

        if (this.options.snapAngle) {
            this.angle = Math.floor(this.angle / this.options.snapAngle) * this.options.snapAngle;
        }

        actions.execute(this.actionName, this.angle);

        this.options.onRotation && this.options.onRotation(this.angle < 0 ? 360 + this.angle : this.angle);
    }

    /**
     * Handles the mouseup event
     */
    onMouseUp() {
        document.removeEventListener('mousemove', this.onMouseMove);
        document.removeEventListener('mouseup', this.onMouseUp);
    }

    /**
     * Registers the actions
     */
    registerAction() {
        actions.register(this.actionName, (angle) => {
            this.rotatingElement.style.transform = `rotate(${angle}deg)`;
        });
    }

    /**
     * Removes the action
     */
    removeActions() {
        actions.remove(this.actionName);
    }

    /**
     * Finds the angle from the mouse coordinates based on the center of the element that is rotating
     * @param {number} x
     * @param {number} y
     * @returns {number} Angle in degrees
     */
    getAngle(x, y) {
        const offsetX = x - this.elementPosition.x;
        const offsetY = y - this.elementPosition.y;
        return (toDeg(Math.atan2(offsetY, offsetX)) + 450) % 360;
    }
}

export default Rotate;
