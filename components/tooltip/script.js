/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import components from 'coherent-gameface-components';
import template from './template.html';
const TOOLTIP_MARGIN = 10;

class Tooltip extends HTMLElement {
    constructor() {
        super();
        this.template = template;

        this.state = {
            visible: false
        };
    }

    connectedCallback() {
        this.position = this.getAttribute('at') || 'top';
        this.showOn = this.getAttribute('on') || 'click';
        this.hideOn = this.getAttribute('off') || 'click';
        this.elementSelector = this.getAttribute('for');
        // TODO: check if this.elementSelector is valid and attached to DOM
        this.triggerElement = document.querySelector(this.elementSelector);

        components.loadResource(this)
            .then((result) => {
                this.template = result.template;
                components.renderOnce(this);

                this.attachEventListeners();
            })
            .catch(err => console.error(err));
    }

    attachEventListeners() {
        // TODO: validate if showOn is a valid onEvent handler
        this.triggerElement.addEventListener(this.showOn, (e) => this.show(e));
        this.triggerElement.addEventListener(this.hideOn, (e) => this.hide(e));
    }

    toggle() {
        this.state.visible = !this.state.visible;
        if (this.state.visible) return this.classList.add('hidden-tooltip')
        this.classList.remove('hidden-tooltip');
    }

    hide () {
        this.style.display = 'none';
    }

    show() {
        this.style.visibility = 'hidden';
        this.style.display = '';
        const elementSize = this.triggerElement.getBoundingClientRect();
        const tooltipSize = this.getBoundingClientRect();

        let position = {
            top: (elementSize.top + elementSize.height / 2) - tooltipSize.height / 2,
            left: elementSize.left + (elementSize.width / 2) - tooltipSize.width / 2
        }

        switch (this.position) {
            case 'top':
                position.top = elementSize.top - TOOLTIP_MARGIN - tooltipSize.height;
                break;
            case 'bottom':
                position.top = elementSize.top + elementSize.height + TOOLTIP_MARGIN;
                break;
            case 'left':
                position.left = elementSize.left - tooltipSize.width - TOOLTIP_MARGIN;
                break;
            case 'right':
                position.left = elementSize.left + elementSize.width + TOOLTIP_MARGIN;
                break;
        }

        this.style.top = position.top + 'px';
        this.style.left = position.left + 'px';
        this.classList.remove('hidden-tooltip');
        this.style.visibility = 'visible';
    }
}

components.defineCustomElement('gameface-tooltip', Tooltip);

export { Tooltip };