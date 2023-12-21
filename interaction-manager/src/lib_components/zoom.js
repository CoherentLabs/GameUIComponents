/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import actions from './actions';
import touchGestures from './touch-gestures';

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

        this._touchEnabled = false;
        this.touchEvents = null;

        this.init();
    }

    /**
     * Enables or disabled touch events
     * @param {boolean} enabled
     */
    set touchEnabled(enabled) {
        if (this._touchEnabled === enabled) return;
        this._touchEnabled = enabled;
        this._touchEnabled ? this.addTouchEvents() : this.removeTouchEvents();
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

            this.options.onZoom && this.options.onZoom();

            const scale = (this.transform.scale - zoomDirection * this.options.zoomFactor).toFixed(5);
            if (scale < this.options.minZoom || scale > this.options.maxZoom) return;

            const zoomPoint = {
                x: offset.x / this.transform.scale,
                y: offset.y / this.transform.scale,
            };

            const transform = this.transform;

            transform.x += zoomPoint.x * (this.transform.scale - scale);
            transform.y += zoomPoint.y * (this.transform.scale - scale);
            transform.scale = scale;

            this.zoomableElement.style.transform = `matrix(${transform.scale}, 0, 0, ${transform.scale}, ${transform.x}, ${transform.y})`;

            this.transform = transform;
        });
    }

    /**
     * Removes the registered actions
     */
    removeActions() {
        actions.remove(this.actionName);
    }

    /**
     * Add pinch and stretch touch events
     */
    addTouchEvents() {
        this.touchEvents = touchGestures.pinch({
            element: this.zoomableElement,
            callback: ({ pinchDelta, midpoint }) => {
                actions.execute(this.actionName, {
                    x: midpoint.x,
                    y: midpoint.y,
                    zoomDirection: Math.sign(pinchDelta) * -1,
                });
            },
        });
    }

    /**
     * Removes the touch events
     */
    removeTouchEvents() {
        this.touchEvents.remove();
        this.touchEvents = null;
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
}

export default Zoom;
