import { clamp } from '../utils/utility-functions';
import actions from './actions';

const hash = (Math.random() + 1).toString(36).substring(7);

/**
 * Allows you to resize elements on the screen
 */
class Resize {
    /**
     *
     * @param {Object} options
     * @param {string} options.element
     * @param {number} options.edgeWidth
     * @param {function} options.onWidthChange
     * @param {function} options.onHeightChange
     * @param {number} options.widthMin
     * @param {number} options.widthMax
     * @param {number} options.heightMin
     * @param {number} options.heightMax
     */
    constructor(options) {
        this.options = options;
        this.options.edgeWidth = options.edgeWidth || 5;
        this.options.heightMin = this.options.heightMin || 50;
        this.options.heightMax = this.options.heightMax || window.innerHeight;
        this.options.widthMin = this.options.widthMin || 50;
        this.options.widthMax = this.options.widthMax || window.innerWidth;

        this.resizableElement = null;
        this.enabled = false;
        this.activeEdge = null;
        this.edges = {
            bottom: null,
            right: null,
            bottomRight: null,
        };

        this.actionHeight = `resize-height-${hash}`;
        this.actionWidth = `resize-width-${hash}`;

        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);

        this.init();
    }

    /**
     * Initializes the resizing
     * @returns {void}
     */
    init() {
        if (this.enabled) return;

        this.resizableElement = document.querySelector(this.options.element);

        if (!this.resizableElement) return console.error(`${this.options.element} is not a correct selector`);
        this.resizableElement.addEventListener('mousedown', this.onMouseDown);

        this.addEdges();
        this.registerActions();

        this.enabled = true;
    }

    /**
     * Deinitilazes the resizing
     * @returns {void}
     */
    deinit() {
        if (!this.enabled) return;

        this.resizableElement.removeEventListener('mousedown', this.onMouseDown);

        this.removeEdges();
        this.removeActions();

        this.enabled = false;
    }

    /**
     * Handles the mousedown event
     * @param {MouseEvent} event
     * @returns {void}
     */
    onMouseDown(event) {
        this.activeEdge = this.setEdge(event.target);

        if (!this.activeEdge) return;

        const { x, y } = this.resizableElement.getBoundingClientRect();
        this.elementRect = { x, y };

        document.addEventListener('mousemove', this.onMouseMove);
        document.addEventListener('mouseup', this.onMouseUp);
    }

    /**
     * Handles the mousemove event
     * @param {MouseEvent} event
     */
    onMouseMove(event) {
        const offsetX = event.clientX - this.elementRect.x;
        const offsetY = event.clientY - this.elementRect.y;

        switch (this.activeEdge) {
            case 'bottom':
                actions.execute(this.actionHeight, offsetY);
                this.options.onHeightChange && this.options.onHeightChange(offsetY);
                break;
            case 'right':
                actions.execute(this.actionWidth, offsetX);
                this.options.onWidthChange && this.options.onWidthChange(offsetX);
                break;
            case 'bottomRight':
                actions.execute(this.actionHeight, offsetY);
                actions.execute(this.actionWidth, offsetX);
                this.options.onWidthChange && this.options.onWidthChange(offsetX);
                this.options.onHeightChange && this.options.onHeightChange(offsetY);
                break;
        }
    }

    /**
     * Handles the mouseup event
     */
    onMouseUp() {
        this.activeEdge = null;

        document.removeEventListener('mousemove', this.onMouseMove);
        document.removeEventListener('mouseup', this.onMouseUp);
    }

    /**
     * Sets the active adge when resizing. If there is no edge it returns null
     * @param {HTMLElement} element
     * @returns {string|null}
     */
    setEdge(element) {
        if (element.dataset.edge) return element.dataset.edge;
        return null;
    }

    /**
     * Checks if the element you are trying to resize has already position relative or absolute set, so it doesn't overwrite them
     * @returns {void}
     */
    checkPosition() {
        const { position } = getComputedStyle(this.resizableElement);

        if (position === 'absolute' || position === 'relative') return;
        this.resizableElement.style.position = 'relative';
    }

    /**
     * Creates the edge elements and appends them to the resizable element
     */
    addEdges() {
        this.checkPosition();

        const { width, height } = this.resizableElement.getBoundingClientRect();

        Object.entries(this.edges).forEach(([edge, element]) => {
            element = document.createElement('DIV');
            element.dataset.edge = edge;
            element.style.position = 'absolute';

            switch (edge) {
                case 'bottom':
                    element.style.width = `${width - this.options.edgeWidth}px`;
                    element.style.height = `${this.options.edgeWidth}px`;
                    element.style.bottom = `-${this.options.edgeWidth}px`;
                    break;
                case 'bottomRight':
                    element.style.width = `${this.options.edgeWidth}px`;
                    element.style.height = `${this.options.edgeWidth}px`;
                    element.style.bottom = `-${this.options.edgeWidth}px`;
                    element.style.right = `-${this.options.edgeWidth}px`;
                    break;
                case 'right':
                    element.style.width = `${this.options.edgeWidth}px`;
                    element.style.height = `${height - this.options.edgeWidth}px`;
                    element.style.right = `-${this.options.edgeWidth}px`;
                    break;
            }

            this.edges[edge] = element;
            this.resizableElement.appendChild(element);
        });
    }

    /**
     * Removes the edge elements
     */
    removeEdges() {
        Object.values(this.edges).forEach((edge) => {
            this.resizableElement.removeChild(edge);
        });
    }

    /**
     * Registers actions
     */
    registerActions() {
        actions.register(this.actionHeight, (height) => {
            this.resizableElement.style.height = `${clamp(height, this.options.heightMin, this.options.heightMax)}px`;
            this.edges.right.style.height = `${
                clamp(height, this.options.heightMin, this.options.heightMax) - this.options.edgeWidth
            }px`;
        });

        actions.register(this.actionWidth, (width) => {
            this.resizableElement.style.width = `${clamp(width, this.options.widthMin, this.options.widthMax)}px`;
            this.edges.bottom.style.width = `${
                clamp(width, this.options.widthMin, this.options.widthMax) - this.options.edgeWidth
            }px`;
        });
    }

    /**
     * Removes the registered actions
     */
    removeActions() {
        actions.remove(this.actionHeight);
        actions.remove(this.actionWidth);
    }
}

export default Resize;
