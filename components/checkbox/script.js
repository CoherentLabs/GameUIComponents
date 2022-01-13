/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import components from 'coherent-gameface-components';
import template from './template.html';

const CustomElementValidator = components.CustomElementValidator;

class Checkbox extends CustomElementValidator {
    constructor() {
        super();

        this.template = template;

        this.state = {
            checked: true
        };

        this.toggleChecked = this.toggleChecked.bind(this);

        this.url = '/components/checkbox/template.html';
    }

    get value() {
        return this.getAttribute('value') || 'on';
    }

    get disabled() {
        return this.hasAttribute('disabled');
    }

    set disabled(value) {
        if (value) {
            this.firstChild.classList.add('checkbox-disabled');
            this.setAttribute('disabled', '');
            this.setAttribute('tabindex', '-1');
        } else {
            this.firstChild.classList.remove('checkbox-disabled');
            this.removeAttribute('disabled');
            this.setAttribute('tabindex', '0');
        }
    }

    valueMissing() {
        return this.hasAttribute('required') && !this.state.checked;
    }

    willSerialize() {
        if (!this.state.checked || this.nameMissing()) return false;
        return true;
    }

    connectedCallback() {
        components.loadResource(this)
            .then((result) => {
                this.template = result.template;
                components.renderOnce(this);
                this.addEventListener('click', this.toggleChecked);
                this.disabled = (this.disabled) ? true : false;
            })
            .catch(err => console.error(err));
    }

    /**
     * Toggles the checkbox value. Called on click.
     * Updated the state and the visibility of the check mark.
    */
    toggleChecked() {
        if (this.disabled) return;

        this.state.checked = !this.state.checked;
        this.querySelector('[data-name="check-mark"]').style.display = this.state.checked ? 'block' : 'none';
    }
}

components.defineCustomElement('gameface-checkbox', Checkbox);

export { Checkbox };