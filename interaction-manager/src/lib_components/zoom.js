import actions from './actions';

/**
 * Pan and zoom
 */
class Zoom {
    /**
     * @typedef {Object} ZoomOptionsObject
     * @property {string} options.element
     * @property {number} options.minZoom
     * @property {number} options.maxZoom
     * @property {number} options.zoomFactor
     * @property {function} options.onZoom
     */

    /**
     *
     * @param {ZoomOptionsObject} options
     */
    constructor(options) {
        const hash = (Math.random() + 1).toString(36).substring(7);

        this.options = options;
        this.options.maxZoom = this.options.maxZoom || Infinity;
        this.options.minZoom = this.options.minZoom || 0.1;
        this.options.zoomFactor = this.options.zoomFactor || 0.1;

        this.enabled = false;
        this.actionName = `pan-and-zoom-${hash}`;
        this.offset = { x: 0, y: 0 };
        this.transform = {
            x: 0,
            y: 0,
            scale: 1,
        };

        this.onWheel = this.onWheel.bind(this);

        this.init();
    }

    /**
     * Initialize the pan and zoom
     * @returns {void}
     */
    init() {
        if (this.enabled) return;

        this.zoomableElement = document.querySelector(this.options.element);
        if (!this.zoomableElement) return console.error(`${this.options.element} is not a correct element selector`);

        this.zoomableElement.addEventListener('wheel', this.onWheel);

        this.registerActions();

        this.zoomableElement.style.transformOrigin = 'top left';

        this.enabled = true;
    }

    /**
     * Deinitilize the pan and zoom
     * @returns {void}
     */
    deinit() {
        if (!this.enabled) return;

        this.zoomableElement.removeEventListener('wheel', this.onWheel);
        this.removeActions();

        this.enabled = false;
    }

    /**
     * Handles the wheel event
     * @param {MouseEvent} event
     */
    onWheel(event) {
        event.preventDefault();

        actions.execute(this.actionName, {
            x: event.clientX,
            y: event.clientY,
            zoomDirection: Math.sign(event.deltaY),
        });
    }

    /**
     * Registers the actions for the pan and zoom
     */
    registerActions() {
        actions.register(this.actionName, ({ x, y, zoomDirection }) => {
            const offset = this.calculateOffsets(x, y);

            const scale = this.transform.scale - zoomDirection * this.options.zoomFactor;
            if (scale < this.options.minZoom || scale > this.options.maxZoom) return;

            const zoomPoint = {
                x: offset.x / this.transform.scale,
                y: offset.y / this.transform.scale,
            };

            this.transform.x += zoomPoint.x * (this.transform.scale - scale);
            this.transform.y += zoomPoint.y * (this.transform.scale - scale);
            this.transform.scale = scale;

            this.zoomableElement.style.transform = `matrix(${this.transform.scale}, 0, 0, ${this.transform.scale}, ${this.transform.x}, ${this.transform.y})`;
        });
    }

    /**
     * Removes the registered actions
     */
    removeActions() {
        actions.remove(this.actionName);
    }

    /**
     * Calculates the mouse coordinates inside the element
     * @param {number} x
     * @param {number} y
     * @returns {Object}
     */
    calculateOffsets(x, y) {
        const elementRect = this.zoomableElement.getBoundingClientRect();

        return {
            x: x - elementRect.x,
            y: y - elementRect.y,
        };
    }

    /**
     * Gets the margins of the element. This will work only if they are in pixels
     */
    getMargins() {
        const { marginTop, marginLeft } = getComputedStyle(this.zoomableElement);

        this.margins = {
            x: parseFloat(marginLeft),
            y: parseFloat(marginTop),
        };
    }
}

export default Zoom;
