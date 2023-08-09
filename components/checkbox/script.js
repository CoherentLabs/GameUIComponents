/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import components from 'coherent-gameface-components';
import template from './template.html';

const CustomElementValidator = components.CustomElementValidator;

/**
 * Class definition of the gameface checkbox custom element
 */
class Checkbox extends CustomElementValidator {
    // eslint-disable-next-line require-jsdoc
    constructor() {
        super();

        this.template = template;

        this.state = {
            checked: false,
        };

        this.toggleChecked = this.toggleChecked.bind(this);

        this.url = '/components/checkbox/template.html';
        this.init = this.init.bind(this);
    }

    // eslint-disable-next-line require-jsdoc
    get value() {
        return this.getAttribute('value') || 'on';
    }

    // eslint-disable-next-line require-jsdoc
    get disabled() {
        return this.hasAttribute('disabled');
    }

    // eslint-disable-next-line require-jsdoc
    set checked(value) {
        value ? this.setAttribute('checked', '') : this.removeAttribute('checked');
        this.state.checked = value && true;// In the input type="checkbox" if you set the checked to a string or something like that it will set it to true, if it's false or an empty string it sets it to false
        this.querySelector('[data-name="check-mark"]').style.display = this.state.checked ? 'block' : 'none';
    }

    // eslint-disable-next-line require-jsdoc
    set disabled(value) {
        if (value) {
            this.firstChild.classList.add('guic-checkbox-disabled');
            this.setAttribute('disabled', '');
            this.setAttribute('tabindex', '-1');
        } else {
            this.firstChild.classList.remove('guic-checkbox-disabled');
            this.removeAttribute('disabled');
            this.setAttribute('tabindex', '0');
        }
    }

    /**
     * Retrieves if the value is missing
     * @returns {boolean}
     */
    valueMissing() {
        return this.hasAttribute('required') && !this.state.checked;
    }

    /**
     * Method that checks if the data from the checkbox should be serialized
     * @returns {boolean}
     */
    willSerialize() {
        if (!this.state.checked || this.nameMissing()) return false;
        return true;
    }

    /**
     * Initialize the custom component.
     * Set template, attach event listeners, setup initial state etc.
     * @param {object} data
    */
    init(data) {
        this.setupTemplate(data, () => {
            components.renderOnce(this);
            this.addEventListener('click', this.toggleChecked);
            this.checked = this.hasAttribute('checked');
            this.disabled = this.disabled ? true : false;
        });
    }

    // eslint-disable-next-line require-jsdoc
    connectedCallback() {
        components.loadResource(this)
            .then(this.init)
            .catch(err => console.error(err));
    }

    /**
     * Toggles the checkbox value. Called on click.
     * Updated the state and the visibility of the check mark.
    */
    toggleChecked() {
        if (this.disabled) return;

        this.checked = !this.state.checked;
    }
}

components.defineCustomElement('gameface-checkbox', Checkbox);

export default Checkbox;
