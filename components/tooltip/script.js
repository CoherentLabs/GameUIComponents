/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import components from 'coherent-gameface-components';
import template from './template.html';
const TOOLTIP_MARGIN = 5;

class Tooltip extends HTMLElement {
    constructor() {
        super();
        this.template = template;
        this.visible = false;
        this._targetElement;

        this.fixedSides = [];
    }

    set targetElement(element) {
        this._targetElement = element;
    }

    get targetElement() {
        return this._targetElement;
    }

    connectedCallback() {
        this.position = this.getAttribute('position') || 'top';
        this.showOn = this.getAttribute('on');
        this.hideOn = this.getAttribute('off');
        this.elementSelector = this.getAttribute('target');

        this.triggerElement = this.targetElement || document.querySelector(this.elementSelector);
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
        // reset the current positioning as the page might get
        // resized untill the next time the tooltip is displayed
        this.fixedSides = [];
        this.position = this.getAttribute('position') || 'top';
    }

    show() {
        // use visibility before showing to calculate the size
        this.style.visibility = 'hidden';
        this.style.display = '';

        this.setPosition();

        this.style.visibility = 'visible';
        this.visible = true;
    }

    setPosition(orientation = this.position) {
        const elementSize = this.triggerElement.getBoundingClientRect();
        const tooltipSize = this.getBoundingClientRect();

        let position = {
            top: (elementSize.top + elementSize.height / 2) - tooltipSize.height / 2,
            left: elementSize.left + (elementSize.width / 2) - tooltipSize.width / 2
        }

        const scrollOffsetX = window.scrollX;
        const scrollOffsetY = window.scrollY;

        switch (orientation) {
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
                console.log(`The provided option for position ${orientation} is not valid - using top as a fallback. Possible options are top, bottom, left and right.`);
                orientation = 'top';
                break;
        }

        this.position = orientation;

        this.style.top = scrollOffsetY + position.top + 'px';
        this.style.left = scrollOffsetX + position.left + 'px';

        // check if the tooltip still overflows and re-position it again
        const overflows  = this.overflows();
        if(Object.keys(overflows).length && this.fixedSides.length !== 4) {
            this.setPosition(this.getVisiblePosition(overflows));
        }
    }

    overflows() {
        var rect = this.getBoundingClientRect();
        const overflows = {};

        if (rect.top < 0) overflows.top = true;
        if (rect.left < 0)  overflows.left = true;
        if (rect.right > (window.innerWidth || document.documentElement.clientWidth)) overflows.right = true;
        if (rect.bottom > (window.innerHeight || document.documentElement.clientHeight)) overflows.bottom = true;

        return overflows;
    }

    getVisiblePosition(overflows) {
        const allSides = ['top', 'bottom', 'left', 'right'];

        overflows = overflows || this.overflows();
        let overflowingSides = Object.keys(overflows);

        overflowingSides = overflowingSides.filter(side => this.fixedSides.indexOf(side) == -1);

        let nextIndex = allSides.indexOf(this.position) + 1;
        nextIndex = [(nextIndex + allSides.length) % allSides.length];
        this.position = allSides[nextIndex];
        this.fixedSides.push(this.position);

        return this.position;
    }
}

components.defineCustomElement('gameface-tooltip', Tooltip);

export default Tooltip;