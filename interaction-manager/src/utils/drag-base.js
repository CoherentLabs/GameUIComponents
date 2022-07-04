/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * Makes an element draggable
 */
class DragBase {
    /**
     *
     * @param {Object} options
     */
    constructor(options) {
        this.draggableElements = [];
        this.draggedElement = null;
        this.enabled = false;

        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);

        this.options = options;
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
    get bodyScrollOffset() {
        return {
            x: document.body.scrollLeft,
            y: document.body.scrollTop,
        };
    }

    /**
     *
     * @param {number} clientX
     * @param {number} clientY
     * @param {HTMLElement} target
     */
    setPointerOffset(clientX, clientY, target) {
        const { x, y } = target.getBoundingClientRect();
        this.offset = {
            x: clientX - x,
            y: clientY - y,
        };
    }
}

export default DragBase;
