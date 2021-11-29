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

        this.visible = false;
    }

    connectedCallback() {
        this.position = this.getAttribute('position') || 'top';
        this.showOn = this.getAttribute('on') || 'click';
        this.hideOn = this.getAttribute('off') || 'click';
        this.elementSelector = this.getAttribute('target');

        this.triggerElement = document.querySelector(this.elementSelector);
        if (!this.triggerElement) {
            console.error(`An element with selector ${this.elementSelector} does not exit. Please make sure the selector is correct and the element exists.`);
            return;
        }

        components.loadResource(this)
            .then((result) => {
                this.template = result.template;
                components.renderOnce(this);
                this.attachEventListeners();
            })
            .catch(err => console.error(err));
    }

    attachEventListeners() {
        if (this.showOn === this.hideOn) {
            this.triggerElement.addEventListener(this.showOn, () => this.toggle());
            return;
        }

        this.triggerElement.addEventListener(this.showOn, () => this.show());
        this.triggerElement.addEventListener(this.hideOn, () => this.hide());
    }

    toggle() {
        this.visible ? this.hide() : this.show();
    }

    hide () {
        this.style.display = 'none';
        this.visible = false;
    }

    show() {
        // use visibility before showing to calculate the size
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
            default:
                position.top = elementSize.top - TOOLTIP_MARGIN - tooltipSize.height;
                console.log(`The provided option for position ${this.position} is not valid - using top as a fallback. Possible options are top, bottom, left and right.`);
                this.position = 'top';
                break;
        }

        this.style.top = position.top + 'px';
        this.style.left = position.left + 'px';
        this.style.visibility = 'visible';
        this.visible = true;
    }
}

components.defineCustomElement('gameface-tooltip', Tooltip);

export { Tooltip };