/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import components from 'coherent-gameface-components';
import template from './template.html';
import style from './style.css';
 
class GamefaceExampleComponent extends HTMLElement {
    constructor() {
        super();
        this.template = template;
        components.importStyleTag('gameface-example-component', style);
        this.url = '/components/gameface-example-component/template.html';
    }
    connectedCallback() {
        components.loadResource(this)
            .then((result) => {
                this.template = result.template;
                components.render(this);
            })
            .catch(err => console.error(err));
    }
}
components.defineCustomElement('gameface-example-component', GamefaceExampleComponent);
export default GamefaceExampleComponent;