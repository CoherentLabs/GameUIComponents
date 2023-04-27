/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import components from 'coherent-gameface-components';
import template from './template.html';

/**
 * Class description
 */
class Stepper extends HTMLElement {
    /**
     * Returns the currently selected item
     */
    get value() {
        return this.items[this.selectedIndex];
    }
    /* eslint-disable require-jsdoc */
    constructor() {
        super();

        this.itemElements = [];
        this.items = [];
        this.selectedIndex = 0;
        this.template = template;

        this.next = this.next.bind(this);
        this.prev = this.prev.bind(this);
    }

    connectedCallback() {
        this.itemElements = Array.from(this.querySelectorAll('gameface-stepper-item'));
        this.items = this.getItems();
        this.selectedIndex = this.getSelectedIndex();

        this.selectedIndex;

        components
            .loadResource(this)
            .then((result) => {
                this.template = result.template;
                components.renderOnce(this);

                this.leftButton = this.querySelector('.guic-stepper-left');
                this.rightButton = this.querySelector('.guic-stepper-right');
                this.valueElement = this.querySelector('.guic-stepper-value');

                this.valueElement.textContent = this.value;

                this.attachListeners();
            })
            .catch(err => console.error(err));
    }

    disconnectedCallback() {
        this.detachListeners();
    }

    /* eslint-enable require-jsdoc */

    /**
     * Returns an array of stepper items
     * @returns {Array} Array of stepper items
     */
    getItems() {
        let items = this.itemElements.map(item => item.textContent);

        if (items.length === 0) {
            items = ['true', 'false'];
        }

        return items;
    }

    /**
     * Returns the index of the selected item
     * @returns {Number} Returns the index of the selected item
     */
    getSelectedIndex() {
        const index = this.itemElements.findIndex(item => item.hasAttribute('selected'));

        return index === -1 ? 0 : index;
    }

    /**
     * Attaches event listeners to the buttons
     */
    attachListeners() {
        this.leftButton.addEventListener('click', this.prev);
        this.rightButton.addEventListener('click', this.next);
    }

    /**
     * Detaches event listeners from the buttons
     */
    detachListeners() {
        this.leftButton.removeEventListener('click', this.prev);
        this.rightButton.removeEventListener('click', this.next);
    }

    /**
     * Selects the previous item
     * @returns {void}
     */
    prev() {
        if (this.selectedIndex === 0) return;

        this.selectedIndex -= 1;
        this.valueElement.textContent = this.value;
    }

    /**
     * Selects the next item
     * @returns {void}
     */
    next() {
        if (this.selectedIndex === this.items.length - 1) return;

        this.selectedIndex += 1;
        this.valueElement.textContent = this.value;
    }
}
components.defineCustomElement('gameface-stepper', Stepper);
export default Stepper;
