import components from 'coherent-gameface-components';
import template from './template.html';
import theme from '../../theme/components-theme.css';
import style from './style.css';
 
class ${this.className} extends HTMLElement {
    constructor() {
        super();
        this.template = template;
        components.importStyleTag('gameface-checkbox-theme', theme);
        components.importStyleTag('gameface-checkbox', style);
        this.url = '/components/${this.componentName}/template.html';
    }
    connectedCallback() {
        components.loadResource(this)
            .then((response) => {
                this.template = response[1].cloneNode(true);
                components.render(this);
            })
            .catch(err => console.error(err));
    }
}
components.defineCustomElement('${this.componentName}', ${this.className});
export default ${this.className};