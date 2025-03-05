/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// import { Components } from 'coherent-gameface-components';
// const components = new Components();
// import template from './template.html';
// console.log(template)
import { components } from '../../lib/components.js';
const { BaseComponent } = components;

const template = `
<style>
    gameface-stepper {
        display: flex;
    }

    gameface-stepper-item {
        display: none;
    }

    .guic-stepper {
        display: flex;
        border-width: 1px;
        border-style: solid;
        border-color: lightgray;
        font-size: 16px;
        height: 3vmax;
        overflow: hidden;
    }

    .guic-stepper-button {
        color: var(--default-color-blue);
        position: relative;
        font-size: 1.2rem;
        width: 3vmax;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .guic-stepper-button:hover {
        background-color: var(--default-color-gray);
    }

    .guic-stepper-button:active {
        background-color: var(--default-color-blue);
        color: var(--default-color-white);
    }

    .guic-stepper-left::after {
        content: '<';
        position: absolute;
    }

    .guic-stepper-right::after {
        content: '>';
        position: absolute;
    }

    .guic-stepper-value {
        color: black;
        min-width: 7vmax;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        text-transform: uppercase;
    }
</style>
<div class="guic-stepper">
    <div class="guic-stepper-button guic-stepper-left"></div>
    <div class="guic-stepper-value"></div>
    <div class="guic-stepper-button guic-stepper-right"></div>
</div>
`;
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

    isStatePropValid(name, value) {
        const schemaProperty = this.stateSchema[name];

        if (!schemaProperty) {
            console.error(`A property ${name} does not exist on type ${this.tagName.toLowerCase()}!`);
            return false;
        }

        const type = typeof value;
        if (schemaProperty.type.includes('array')) {
            const isArray = Array.isArray(value);
            if (isArray) return true;
        }

        if (!schemaProperty.type.includes(type)) {
            console.error(`Property ${name} can not be of type - ${type}. Allowed types are: ${schemaProperty.type.join(',')}`);
            return false;
        }

        return true;
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
        // this.setupTemplate(data, () => {
        // components.renderOnce(this);

        this.itemElements.forEach(item => this.shadowRoot.appendChild(item));

        this.leftButton = this.shadowRoot.querySelector('.guic-stepper-left');
        this.rightButton = this.shadowRoot.querySelector('.guic-stepper-right');
        this.valueElement = this.shadowRoot.querySelector('.guic-stepper-value');
        const valueAttr = this.getAttribute('value');
        // If there is no `value` attribute then set the stepper value to default
        if (valueAttr === null) this.value = this.items[0];
        // Try to update the state with the passed value and if it is invalid set the stepper value to default
        else if (!this.updateValueState(valueAttr)) {
            console.warn(`Will set the first item from the items array as value - '${this.items[0]}'`);
            this.value = this.items[0];
        }
        this.attachListeners();
        // });
    }

    connectedCallback() {
        this.itemElements = Array.from(this.querySelectorAll('gameface-stepper-item'));
        this._items = this.getItems();
        const shadow = this.attachShadow({ mode: 'open' });
        shadow.innerHTML = this.template;
        this.isRendered = true;
        this.init();
        // components
        //     .loadResource(this)
        //     .then(this.init)
        //     .catch(err => console.error(err));
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
customElements.define('gameface-stepper', Stepper);
export default Stepper;
