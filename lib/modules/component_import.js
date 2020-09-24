import components from './components';

class ComponentImport extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const url = `/components/${this.dataset.url}/`;
        const componentName = `gameface-${this.dataset.url}`;

        if (components.imported.indexOf(componentName) === -1) {
            components.importComponent(url);
            components.imported.push(componentName);
        }
        this.appendChild(document.createElement(componentName));
    }
}

customElements.define('component-import', ComponentImport);

export default ComponentImport;