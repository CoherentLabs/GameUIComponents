/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Components } from 'coherent-gameface-components';
import template from './template.html';

const components = new Components();
const BaseComponent = components.BaseComponent;

/**
 * Class description
 */
class GamefaceToast extends BaseComponent {
    /* eslint-disable require-jsdoc */
    constructor() {
        super();
        this.template = template;
        this.init = this.init.bind(this);
    }

    init(data) {
        this.setupTemplate(data, () => {
            components.renderOnce(this);
            // attach event handlers here
        });
    }

    connectedCallback() {
        components.loadResource(this)
            .then(this.init)
            .catch(err => console.error(err));
    }
    /* eslint-enable require-jsdoc */
}
components.defineCustomElement('gameface-toast', GamefaceToast);
export default GamefaceToast;
