import {components} from 'coherent-gameface-components';
import template from './template.html';
import style from './style.css';

class Checkbox extends HTMLElement {
    constructor() {
        super();

        this.template = template;

        components.importStyeTag('gameface-checkbox', style);

        this.state = {
            checked: true
        }

        this.url = '/components/checkbox/template.html';
    }

    connectedCallback() {
        components.loadResource(this)
            .then((response) => {
                this.template = response[1].cloneNode(true);
                components.render(this);
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
        this.querySelector('[data-name="check-mark"]').style.display = this.state.checked ? '' : 'none';
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