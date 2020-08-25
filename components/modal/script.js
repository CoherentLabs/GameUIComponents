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
                components.render(this.parentNode, this);
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
}

components.defineCustomElement('gameface-modal', Modal);

