import components from 'coherent-gameface-components';
import template from './template.html';

/**
 * Class description
 */
class ${this.className} extends HTMLElement {
    /* eslint-disable require-jsdoc */
    constructor() {
        super();
        this.template = template;
    }

    connectedCallback() {
        components.loadResource(this)
            .then((result) => {
                this.template = result.template;
                components.renderOnce(this);
            })
            .catch(err => console.error(err));
    }
    /* eslint-enable require-jsdoc */
}
components.defineCustomElement('${this.componentName}', ${this.className});
export default ${this.className};
