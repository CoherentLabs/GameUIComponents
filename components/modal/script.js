/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { components } from '../../lib/components.js';
// const components = new Components();
// import template from './template.html';
const template = `
<style>
.guic-modal-backdrop {
    width: 100vw;
    height: 100vh;
    background-color: #000000;
    opacity: .4;
    user-select: none;
    z-index: 1;
    position: absolute;
    top: 0px;
    left: 0px;
}

.guic-modal-close-x {
    width: 30px;
    height: 30px;
    position: absolute;
    right: 0px;
    top: 0px;
    cursor: pointer;
    text-align: center;
    z-index: 2;
    line-height: 30px;
    background-color: var(--default-color-blue);
    color: var(--default-color-gray);
}

.guic-modal-close-x:hover {
    background-color: var(--default-color-gray);
    color: var(--default-color-blue);
}

.guic-modal {
    width: 500px;
    height: 500px;
    z-index: 2;
    position: absolute;
    border-width: 3px;
    border-style: solid;
    box-sizing: border-box;
    border-top-color: var(--default-color-blue);
    border-right-color: var(--default-color-blue);
    border-bottom-color: var(--default-color-blue);
    border-left-color: var(--default-color-blue);
    background-color: var(--default-color-white);
}

.guic-modal-wrapper {
    position: absolute;
    top: 0px;
    left: 0px;
    justify-content: center;
    display: flex;
    align-items: center;
    width: 100vw;
    height: 100vh;
}

.guic-modal-header {
    position: relative;
    top: 0px;
    height: 50px;
    margin-bottom: 20px;
    border-bottom-width: 2px;
    border-bottom-style: solid;
    border-bottom-color: var(--default-color-blue);
    line-height: 50px;
    padding: 0px 10px;
    box-sizing: border-box;
}

.guic-modal-body, .guic-modal-footer {
    position: absolute;
    justify-content: center;
    display: flex;
    align-items: center;
}

.guic-modal-body {
    position: relative;
    height: 100px;
}

.guic-modal-footer {
    height: 100px;
    width: 500px;
    position: absolute;
    bottom: 0px;
}

</style>
<div class="guic-modal-wrapper">
    <div class="guic-modal-backdrop"></div>
    <div class="guic-modal">
        <div class="close guic-modal-close-x">x</div>
        <div class="guic-modal-header">
            <slot name="header">Put your title here.</slot>
        </div>
        <div class="guic-modal-body">
            <slot name="body">Put the content here.</slot>
        </div>
        <div class="guic-modal-footer">
            <slot name="footer">Put your actions here.</slot>
        </div>
    </div>
</div>
`;
const BaseComponent = components.BaseComponent;

/**
 * Class definition of the gameface modal custom element
 */
class Modal extends BaseComponent {
    // eslint-disable-next-line require-jsdoc
    constructor() {
        super();

        this.template = template;

        this.state = { display: 'none' };

        this.closeBound = e => this.close(e);
        // this.url = '/components/modal/template.html';
        this.init = this.init.bind(this);
    }

    /**
     * Initialize the custom component.
     * Set template, attach event listeners, setup initial state etc.
     * @param {object} data
    */
    init(data) {
        // this.setupTemplate(data, () => {
        //     components.renderOnce(this);
        const shadow = this.attachShadow({ mode: 'open' });
        shadow.innerHTML = this.template;
        this.isRendered = true;
        this.attachEventListeners();
        // });
    }

    // eslint-disable-next-line require-jsdoc
    connectedCallback() {
        this.init();
        // components.loadResource(this)
        //     .then(this.init)
        //     .catch(err => console.error(err));
    }

    /**
     * Method that will attach click event listeners to all close buttons
     */
    attachEventListeners() {
        const closeButtons = this.shadowRoot.querySelectorAll('.close');
        for (let i = 0; i < closeButtons.length; i++) {
            closeButtons[i].addEventListener('click', this.closeBound);
        }
    }

    /**
     * Handler for closing the modal
     */
    close() {
        this.style.display = 'none';
    }
}

components.defineCustomElement('gameface-modal', Modal);

export { Modal };
