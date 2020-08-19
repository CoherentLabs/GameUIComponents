class Modal extends HTMLElement {
    constructor() {
        super();
        this.element = document.createElement('div');

        this.state = {
            display: 'none'
        };

        this.style.display = 'none';
        this.closeBound = e => this.close(e);

        const STYLE_URL = '/components/modal/style.css';
        components.importStyle(STYLE_URL);
    }

    connectedCallback() {
        const VIEW_URL = '/components/modal/template.html';
        components.loadResource(VIEW_URL)
        .then((response) => {
            this.template = response[1].cloneNode(true);
            this.render(this.parentNode);
            this.attachEventListeners();
        })
        .catch(err => console.error(err));
    }

    attachEventListeners() {
        const closeButtons = this.querySelectorAll('.close');
        for (let i = 0; i < closeButtons.length; i++) {
            closeButtons[i].addEventListener('click', this.closeBound);
        }
    }

    close(e) {
        this.style.display = 'none';
    }

    /**
    * Renders a given content into its slots.
    * @param {HTMLElement} content - the content which should be rendered.
    * @returns {HTMLElement} - the rendered element.
    */
    render(content) {
        const templateRoot = document.createElement('div')
        templateRoot.appendChild(this.template);

        const templateSlots = components.findSlots(templateRoot);
        const userSlots = components.findSlots(content);

        // use for...of instead of for...in for better performance
        const userSlotsKeys = Object.keys(userSlots);
        for (let userSlot of userSlotsKeys) {
            components.transferContent(userSlots[userSlot], templateSlots[userSlot]);
        }

        components.transferContent(templateRoot, this);

        return this.element;
    }
}

components.defineCustomElement('gameface-modal', Modal);

