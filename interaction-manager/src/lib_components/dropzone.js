import DragBase from '../utils/drag-base';
import { createHash } from '../utils/utility-functions';
import actions from './actions';

/**
 * Makes an element draggable
 */
class Dropzone extends DragBase {
    /**
     *
     * @typedef {Object} DropzoneOptions
     * @property {string} element
     * @property {string[]} dropzones
     * @property {string} draggedClass
     * @property {string} dropzoneActiveClass
     * @property {'switch'|'add'|'shift'|'none'} dropType If there is already an element in the dropzone
     * @property {function} onDragStart
     * @property {function} onDragMove
     * @property {function} onDragEnd
     * @property {function} onDropZoneEnter
     * @property {function} onDropZoneLeave
     */

    /**
     *
     * @param {DropzoneOptions} options
     */
    constructor(options) {
        super(options);
        const hash = createHash();

        this.dropzones = [];
        this.draggedOver = null;

        this.actionName = `drag-and-drop-${hash}`;
        this.automaticAction = `move-to-${hash}`;

        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);

        this.init();
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

        this.createDropzones();
        if (this.dropzones.length === 0) return;

        this.dropzones.forEach((dropzone) => {
            dropzone.addEventListener('mouseenter', this.onMouseEnter);
            dropzone.addEventListener('mouseleave', this.onMouseLeave);
        });

        this.registerDragActions();

        this.enabled = true;
    }

    /**
     * Deinitializes the dragging
     * @returns {void}
     */
    deinit() {
        if (!this.enabled) return;

        this.draggableElements.forEach(element => element.removeEventListener('mousedown', this.onMouseDown));
        this.dropzones.forEach((dropzone) => {
            dropzone.removeEventListener('mouseenter', this.onMouseEnter);
            dropzone.removeEventListener('mouseleave', this.onMouseLeave);
        });

        this.removeActions();

        this.enabled = false;
    }

    /**
     * mousedown event handler
     * @param {MouseEvent} event
     */
    onMouseDown(event) {
        this.draggedElement = event.currentTarget;

        this.draggedElement.style.position = 'absolute';
        this.draggedElement.style.pointerEvents = 'none';

        this.setPointerOffset(event.clientX, event.clientY, this.draggedElement);
        actions.execute(this.actionName, {
            x: event.clientX + this.bodyScrollOffset.x - this.offset.x,
            y: event.clientY + this.bodyScrollOffset.y - this.offset.y,
            index: this.draggedItemIndex,
        });

        this.options.dragStyle && this.draggedElement.classList.add(this.options.dragStyle);
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
            x: event.clientX + this.bodyScrollOffset.x - this.offset.x,
            y: event.clientY + this.bodyScrollOffset.y - this.offset.y,
            index: this.draggedItemIndex,
        });
    }

    /**
     * mouseup event handler
     */
    onMouseUp() {
        document.removeEventListener('mousemove', this.onMouseMove);
        document.removeEventListener('mouseup', this.onMouseUp);

        this.draggedElement.style.position = '';
        this.draggedElement.style.pointerEvents = '';
        this.draggedElement.style.left = '';
        this.draggedElement.style.top = '';

        this.options.onDragEnd && this.options.onDragEnd(this.draggedElement);
        this.options.dragStyle && this.draggedElement.classList.remove(this.options.dragStyle);

        this.draggedOver && this.handleDrop();

        this.draggedElement = null;
    }

    /**
     * Handler for the mouseenter event
     * @param {MouseEvent} event
     * @returns {void}
     */
    onMouseEnter(event) {
        if (!this.draggedElement) return;
        this.draggedOver = event.currentTarget;

        this.options.dropzoneActiveClass && this.draggedOver.classList.add(this.options.dropzoneActiveClass);
    }

    /**
     * Handler for the mouseleave event
     * @returns {void}
     */
    onMouseLeave() {
        if (!this.draggedElement) return;

        if (this.options.dropzoneActiveClass && this.draggedOver) {
            this.draggedOver.classList.remove(this.options.dropzoneActiveClass);
        }

        this.draggedOver = null;
    }

    /**
     * Register dragging as an action to be able to use it externally
     */
    registerDragActions() {
        actions.register(this.actionName, ({ x, y, index }) => {
            if (!this.draggableElements[index]) return console.error(`There is no draggable element at index ${index}`);

            this.draggableElements[index].style.left = `${x}px`;
            this.draggableElements[index].style.top = `${y}px`;

            this.options.onDragMove && this.options.onDragMove({ x, y });
        });

        actions.register(this.automaticAction, this.automaticMove.bind(this));

        this.actionsRegistered = true;
    }

    /**
     * Removes the registered actions
     */
    removeActions() {
        actions.remove(this.actionName);
        actions.remove(this.automaticAction);
    }

    /**
     * Automatically drags an element to a dropzone
     * @param {Object} options
     * @param {number} options.elementIndex The index of the element you want to move
     * @param {number} options.dropzoneIndex The index of the dropzone you want to move the element to
     */
    automaticMove({ elementIndex, dropzoneIndex }) {
        const { x, y } = this.dropzones[dropzoneIndex].getBoundingClientRect();
        const { x: elementX, y: elementY } = this.draggableElements[elementIndex].getBoundingClientRect();

        const direction = {
            x: Math.sign(x - elementX),
            y: Math.sign(y - elementY),
        };

        this.draggableElements[elementIndex].style.position = 'absolute';

        const loop = (newX, newY) => {
            if (newX === x && newY === y) {
                this.dropzones[dropzoneIndex].appendChild(this.draggableElements[elementIndex]);
                this.draggableElements[elementIndex].style.position = '';
                return;
            }

            newX = newX !== x ? direction.x + newX : newX;
            newY = newY !== y ? direction.y + newY : newY;

            this.draggableElements[elementIndex].style.left = `${newX}px`;
            this.draggableElements[elementIndex].style.top = `${newY}px`;

            if (newX !== x || newY !== y) requestAnimationFrame(() => loop(newX, newY));
        };

        loop(elementX, elementY);
    }

    /**
     * Saves the dropzones
     */
    createDropzones() {
        this.dropzones = this.options.dropzones.reduce((acc, dropzone) => {
            const dropzoneElements = [...document.querySelectorAll(dropzone)];
            if (dropzoneElements.length === 0) {
                console.error(`${dropzone} is not a valid html element to be used as a dropzone`);
            }

            return acc.concat(dropzoneElements);
        }, []);
    }

    /**
     * Handler when you drop the dragged item
     */
    handleDrop() {
        let dropType = this.options.dropType;

        if (this.draggedOver.children.length === 0) dropType = 'add';

        switch (dropType) {
            case 'add':
                this.draggedOver.appendChild(this.draggedElement);
                break;
            case 'shift':
                this.shiftElements();
                break;
            case 'switch':
                this.draggedElement.parentNode.appendChild(this.draggedOver.children[0]);
                this.draggedOver.appendChild(this.draggedElement);
                break;
            case 'none':
                break;
            default:
                break;
        }

        this.onMouseLeave();
    }

    /**
     * Shifts the element to the nearest empty space
     */
    shiftElements() {
        const dropzoneIndex = this.dropzones.findIndex(dropzone => dropzone === this.draggedOver);
        const dropzoneChildren = this.dropzones.map((dropzone) => {
            if (dropzone.children[0] === this.draggedElement) return [];
            return [...dropzone.children];
        });

        const closestEmptyIndex = dropzoneChildren.reduce((acc, el, index) => {
            if (el.length === 0) acc = Math.abs(dropzoneIndex - index) < Math.abs(dropzoneIndex - acc) ? index : acc;
            return acc;
        }, 100000);

        const directionEmpty = Math.sign(dropzoneIndex - closestEmptyIndex) > 0 ? 0 : 1;
        const directionDropzone = Math.sign(dropzoneIndex - closestEmptyIndex) < 0 ? 0 : 1;

        dropzoneChildren.splice(dropzoneIndex + directionDropzone, 0, [this.draggedElement]);
        dropzoneChildren.splice(closestEmptyIndex + directionEmpty, 1);

        dropzoneChildren.forEach((children, index) => {
            children.forEach(child => this.dropzones[index].appendChild(child));
        });
    }
}

export default Dropzone;
