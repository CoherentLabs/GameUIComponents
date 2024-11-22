/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Components } from 'coherent-gameface-components';
const components = new Components();
import template from './template.html';

const { BaseComponent } = components;

/**
 * Class description
 */
class Stepper extends BaseComponent {
    // eslint-disable-next-line require-jsdoc
    static get observedAttributes() { return ['value']; }

    /* eslint-disable require-jsdoc */
    constructor() {
        super();

        this.itemElements = [];
        this._items = [];
        this.selectedIndex = 0;
        this.template = template;

        this.next = this.next.bind(this);
        this.prev = this.prev.bind(this);
        this.init = this.init.bind(this);

        this.stateSchema = { value: { type: ['string'] } };
        this.state = { value: '' };
    }

    get value() {
        return this.state.value;
    }

    set value(value) {
        this.dispatchEvent(new CustomEvent('stepperupdate', { detail: value }));
        this.setAttribute('value', value);
    }

    /**
     * Will set new items array to the stepper component and will verify the array
     * After that will reset the value of the stepper if it does not exist in the new items array
     * @param {Array<string>} value
     */
    set items(value) {
        if (!Array.isArray(value)) {
            console.warn('Can\'t set non array value to gameface-stepper items');
            return;
        }
        if (!value.length) {
            console.warn('Can\'t set an empty array value to gameface-stepper items');
            return;
        }

        const nonStringItems = value.filter(el => typeof el !== 'string');
        if (nonStringItems.length) {
            console.warn(`Can't set an array values that are not strings to gameface-stepper items. [${nonStringItems.join(', ')}]`);
            return;
        }

        this._items = value;

        // If the value does not exists in the new items array then change it to default one
        // and warn the user for this change
        this.selectedIndex = this.getSelectedIndex(this.value);
        if (this.selectedIndex !== -1) return;

        console.warn(`The current value '${this.value}' is not a member of the items. Will set the first item from the items array as value - '${this.items[0]}'`);
        this.value = this.items[0];
    }

    get items() {
        return this._items;
    }

    /**
     * Custom element lifecycle method. Called when an attribute is changed.
     * @param {string} name
     * @param {string} oldValue
     * @param {string|boolean} newValue
     */
    attributeChangedCallback(name, oldValue, newValue) {
        if (!this.isRendered) return;

        if (name === 'value') this.updateValueState(newValue);
    }

    /**
     * Update the stepper's state.
     * @param {string} name - the name of the prop
     * @param {string | boolean} value - the value of the the prop
     * @returns {void}
     */
    updateState(name, value) {
        if (!this.isStatePropValid(name, value)) return false;
        this.state[name] = value;
    }

    /**
     * Will update the value state of the stepper item
     * @param {boolean} value
     * @returns {boolean} - If the value state has been succesfully updated
     */
    updateValueState(value) {
        const newValueIndex = this.getSelectedIndex(value);
        if (newValueIndex === -1) {
            console.warn(`The '${value}' does not exists in the items array of the gameface-stepper component.`);
            return false;
        }

        this.updateState('value', value);
        this.selectedIndex = newValueIndex;
        this.valueElement.textContent = value;
        return true;
    }

    init(data) {
        this.setupTemplate(data, () => {
            components.renderOnce(this);

            this.itemElements.forEach(item => this.appendChild(item));

            this.leftButton = this.querySelector('.guic-stepper-left');
            this.rightButton = this.querySelector('.guic-stepper-right');
            this.valueElement = this.querySelector('.guic-stepper-value');
            const valueAttr = this.getAttribute('value');
            // If there is no `value` attribute then set the stepper value to default
            if (valueAttr === null) this.value = this.items[0];
            // Try to update the state with the passed value and if it is invalid set the stepper value to default
            else if (!this.updateValueState(valueAttr)) {
                console.warn(`Will set the first item from the items array as value - '${this.items[0]}'`);
                this.value = this.items[0];
            }
            this.attachListeners();
        });
    }

    connectedCallback() {
        this.itemElements = Array.from(this.querySelectorAll('gameface-stepper-item'));
        this._items = this.getItems();

        components
            .loadResource(this)
            .then(this.init)
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
     * @param {string} value
     * @returns {Number} Returns the index of the selected item
     */
    valueExists(value) {
        if (!this.items.length) return false;

        const index = this.items.findIndex(item => item === value);

        return index === -1 ? false : true;
    }

    /**
     * Returns the index of the selected item
     * @param {string} value
     * @returns {Number} Returns the index of the selected item
     */
    getSelectedIndex(value) {
        return this.items.findIndex(item => item === value);
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
        this.leftButton && this.leftButton.removeEventListener('click', this.prev);
        this.rightButton && this.rightButton.removeEventListener('click', this.next);
    }

    /**
     * Selects the previous item
     * @returns {void}
     */
    prev() {
        if (this.selectedIndex === 0) return;

        this.value = this.items[this.selectedIndex - 1];
    }

    /**
     * Selects the next item
     * @returns {void}
     */
    next() {
        if (this.selectedIndex === this.items.length - 1) return;

        this.value = this.items[this.selectedIndex + 1];
    }
}
components.defineCustomElement('gameface-stepper', Stepper);
export default Stepper;
