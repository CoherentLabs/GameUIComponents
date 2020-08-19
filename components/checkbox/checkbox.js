class Checkbox extends HTMLElement {
    constructor() {
        super();

        this.state = {
            checked: true
        }

        const STYLE_URL = '/components/checkbox/checkbox.css';
        components.importStyle(STYLE_URL);
    }

    connectedCallback() {
        const VIEW_URL = '/components/checkbox/checkbox.html';
        components.loadResource(VIEW_URL)
            .then((response) => {
                this.template = response[1].cloneNode(true);
                this.render(this);
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

    /**
     * Renders a given content into its slots.
     */
    render(content) {
        const templateRoot = document.createElement('div')
        templateRoot.appendChild(this.template);

        const mySlots = components.findSlots(templateRoot);
        const userSlots = components.findSlots(content);

        // use for...of instead of for...in for better performance
        const userSlotsKeys = Object.keys(userSlots);
        for (let userSlot of userSlotsKeys) {
            components.transferContent(userSlots[userSlot], mySlots[userSlot]);
        }

        components.transferContent(templateRoot, this);
    }
}

components.defineCustomElement('gameface-checkbox', Checkbox);
