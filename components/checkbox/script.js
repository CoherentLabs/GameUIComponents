class Checkbox extends HTMLElement {
    constructor() {
        super();

        this.state = {
            checked: true
        }

        const STYLE_URL = '/components/checkbox/style.css';
        components.importStyle(STYLE_URL);
    }

    connectedCallback() {
        const VIEW_URL = '/components/checkbox/template.html';
        components.loadResource(VIEW_URL)
            .then((response) => {
                this.template = response[1].cloneNode(true);
                components.render(this.parentNode, this);
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
