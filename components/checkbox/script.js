/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import components from 'coherent-gameface-components';
import template from './template.html';

class Checkbox extends HTMLElement {
    constructor() {
        super();

        this.template = template;

        this.state = {
            checked: true
        }

        this.url = '/components/checkbox/template.html';
    }

    connectedCallback() {
        components.loadResource(this)
            .then((result) => {
                this.template = result.template;
                components.renderOnce(this);
                this.attachEventListeners();
            })
            .catch(err => console.error(err));
    }

    /**
     * Toggles the checkbox value. Called on click.
     * Updated the state and the visibility of the check mark.
    */
    toggleChecked() {
        this.state.checked = !this.state.checked;
        this.querySelector('[data-name="check-mark"]').style.display = this.state.checked ? 'block' : 'none';
    }

    /**
     * Adds event listeners to the checkbox.
     * Attached click handler.
    */
    attachEventListeners() {
        this.addEventListener('click', () => this.toggleChecked());
    }
}

components.defineCustomElement('gameface-checkbox', Checkbox);

export { Checkbox };