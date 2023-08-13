/* eslint-disable linebreak-style */
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Components } from 'coherent-gameface-components';
const components = new Components();
import template from './template.html';

const maxColumns = 12; // Max number of columns as it's based on the grid component
const BaseComponent = components.BaseComponent;

/**
 * Class definition of the gameface automatic grid custom element
 */
class AutomaticGrid extends BaseComponent {
    /**
     * Formats floats to have only 1 decimal integer or if 0 to be parsed into an integer. Then replaces the decimal separator to "_" so it can be used as a css class
     * @param {number} number
     * @returns {string}
     */
    static formatFloat(number) {
        return `${parseFloat(number.toFixed(1))}`.replace('.', '_');
    }

    /**
     * Gets the first empty cell of the cells array
     * @returns {HTMLElement}
     */
    get firstEmptyCell() {
        return this._cells.find(cell => cell.childElementCount === 0);
    }

    /**
     * @constructor
     */
    constructor() {
        super();
        // use the template to create the base grid
        this.template = template;

        this.dragStart = this.dragStart.bind(this);
        this.dragMove = this.dragMove.bind(this);
        this.dragEnd = this.dragEnd.bind(this);
        this.init = this.init.bind(this);
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

            // Get the grid container, where all of the cells will be
            this._gridContainer = this.querySelector('.guic-automatic-grid-container');

            this.buildGrid();
            this.addItemsToCells();
        });
    }

    /**
     * Called when the element was attached to the DOM.
     */
    connectedCallback() {
        // Get the number of columns. Max number of columns is 12
        this._columns = this.setColumns();
        // Get the number of rows. No max number of rows. If no row number is passed it defaults to 5
        this._rows = this.getAttribute('rows') || 5;

        // The number of cells in the grid
        this._numberOfCells = this._rows * this._columns;

        // If the items in the cells can be drag and dropped
        this._draggable = this.hasAttribute('draggable');

        // The array of cells
        this._cells = [];

        // Load the template
        components.loadResource(this)
            .then(this.init)
            .catch(err => console.error(err));
    }

    /**
     * Builds the grid, by adding rows and cells.
     */
    buildGrid() {
        // Loop through all of the cells
        for (let i = 0; i < this._numberOfCells; i++) {
            // Since we are using the grid component, we need to make a row element for each grid row. When the index of the cell is the begining of each column we create a new row.
            if (i % this._columns === 0) {
                const row = document.createElement('div');
                row.classList.add('guic-row');

                this._gridContainer.appendChild(row);
            }
            const element = document.createElement('div');

            element.classList.add('guic-automatic-grid-cell');
            element.classList.add(`guic-col-${AutomaticGrid.formatFloat(maxColumns / this._columns)}`); // We add the grid class to each cell based on the number of columns

            element.dataset.col = (i % this._columns) + 1; // We set the cell column so that it's available if we need it later. +1 so that columns don't start from 0
            element.dataset.row = Math.floor(i / this._columns) + 1; // We set the cell row so that it's available if we need it later. +1 so that rows don't start from 0

            this._cells.push(element);

            // Append the cell to the last created row
            this._gridContainer.lastChild.appendChild(element);
        }
    }

    /**
     * Adds the items to the cells. It's a separate function from the build grid, because if we have data-bind-for the grid will be built before the data-binding is applied.
     * This function can be used later after the engine is ready to add the data-bound items to the grid
     */
    addItemsToCells() {
        // The items we have added to the grid
        const items = Array.from(this.querySelectorAll('component-slot'));

        // We check if an item has data-bind-for and we skip adding the items before the data-binding. After data-binding the attribute is "data-bind-meta-for"
        if (items.findIndex(item => item.hasAttribute('data-bind-for')) >= 0) return;

        // The array of items that have a set position. If an item has only a row or col set, it won't be added here
        const itemsWithPositions = items.filter(item => item.hasAttribute('col') && item.hasAttribute('row'));

        // The array of items without a set position. Items with col or row only will also be added here
        const itemsWithoutPositions = items.filter(item => itemsWithPositions.indexOf(item) < 0);

        // We add the items with set position to their corresponding cell
        itemsWithPositions.forEach((item) => {
            // Get the corresponding cell for that item
            const matchingCell = this.getMatchingCell(item.getAttribute('col'), item.getAttribute('row'));

            // Check if there is already an item added to that cell. If there is move the item to the other array. This way we avoid items with duplicating col and row
            if (!matchingCell || matchingCell.childElementCount > 0) {
                itemsWithoutPositions.push(item);
                return;
            }

            matchingCell.appendChild(item);
        });

        // Append all of the other items to the first available free cell
        itemsWithoutPositions.forEach((item) => {
            this.firstEmptyCell.appendChild(item);
        });

        // If the grid is draggable here we attach the event listener to the items
        if (this._draggable) {
            items.forEach((item) => {
                item.addEventListener('mousedown', this.dragStart);
            });
        }
    }

    /**
     * Sets the number of columns. If we have more than the max number, the columns are set to the max number. If we don't have a column attribute set, the default is 6
     * @returns {number} - the number of columns for the grid
     */
    setColumns() {
        let columns = this.getAttribute('columns') || 6;

        if (columns > maxColumns) columns = maxColumns;

        return columns;
    }

    /**
     * Helper function to find the cell that is on the specified row and column
     * @param {Number} col
     * @param {Number} row
     * @returns {HTMLElement}
     */
    getMatchingCell(col, row) {
        return this._cells.find(cell => cell.dataset.col === col && cell.dataset.row === row);
    }

    /**
     * The function that triggers when we start to drag an item
     * @param {MouseEvent} event
     */
    dragStart(event) {
        // We set the draggedItem to the one we are dragging so it can be used in other functions.
        this._draggedItem = event.currentTarget;

        // Calculate offsetX and offsetY from the top left corner of the dragged item
        const offsetX = event.clientX - this._draggedItem.getBoundingClientRect().x;
        const offsetY = event.clientY - this._draggedItem.getBoundingClientRect().y;

        // Set the registry point for the drag to be the mouse cursor
        this._draggedItem.style.transform = `translateX(-${offsetX}px) translateY(-${offsetY}px)`;

        // Sets the position of the dragged element to be the same as the mouse
        this._draggedItem.style.left = `${event.clientX}px`;
        this._draggedItem.style.top = `${event.clientY}px`;

        // Add a class to make the element have a position absolute and become semi-transparent when dragging
        this._draggedItem.classList.add('guic-dragged');

        document.addEventListener('mousemove', this.dragMove);
        document.addEventListener('mouseup', this.dragEnd);
    }

    /**
     * Handler for dragging mouse
     * @param {HTMLEvent} event
     */
    dragMove(event) {
        // Sets the position of the dragged element to be the same as the mouse
        this._draggedItem.style.left = `${event.clientX}px`;
        this._draggedItem.style.top = `${event.clientY}px`;
    }

    /**
     * Handler when dragging mouse ends
     * @param {HTMLEvent} event
     */
    dragEnd(event) {
        // Removes the class that was added when the drag started
        this._draggedItem.classList.remove('guic-dragged');

        this.dropItem(event.target);

        // Reset the registry point to the top left
        this._draggedItem.style.transform = `translateX(0) translateY(0)`;

        // Removes the dragged item
        this._draggedItem = null;

        document.removeEventListener('mousemove', this.dragMove);
        document.removeEventListener('mouseup', this.dragEnd);
    }

    /**
     * When we stop the drag, we run this function to check if the drop target is a valid target.
     * @param {HTMLElement} target
     */
    dropItem(target) {
        // Check if the target is a cell
        const cell = target.classList.contains('guic-automatic-grid-cell') ?
            target :
            target.closest('.guic-automatic-grid-cell') || null;

        // If it's not, the function will end
        if (!cell) return;

        // Check if the drop target cell is not empty
        if (cell.childElementCount > 0) {
            const dropCellIndex = this._cells.indexOf(cell);

            // Get the closest empty cell distance so we can shift the elements in that direction
            let closestEmptyCellDistance = this._cells.reduce((acc, el, index) => {
                if (el.childElementCount === 0 || el === this._draggedItem.parentNode) {
                    const distance = dropCellIndex - index;
                    return Math.abs(distance) < acc ? distance : acc;
                }
                return acc;
            }, this._cells.length);

            // We set the direction to be the reverse so we can move the items in the correct position
            closestEmptyCellDistance *= -1;

            // Get the direction of which the for loop should go. It's either 1 or -1
            const direction = closestEmptyCellDistance / Math.abs(closestEmptyCellDistance);

            // Shift the cells to the nearest empty one
            for (let i = dropCellIndex; i !== dropCellIndex + closestEmptyCellDistance; i += direction) {
                this._cells[i + direction].appendChild(this._cells[i].firstChild);
            }
        }

        cell.appendChild(this._draggedItem);
    }
}

components.defineCustomElement('gameface-automatic-grid', AutomaticGrid);
export default AutomaticGrid;
