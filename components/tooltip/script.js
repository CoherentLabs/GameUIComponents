/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import components from 'coherent-gameface-components';
import template from './template.html';
const TOOLTIP_MARGIN = 5;
const TOOLTIP_POSITIONS = ['top', 'bottom', 'left', 'right'];
const NOT_A_PROMISE_ERROR = 'The value in async mode must be a function that returns a promise.';

/**
 * Class definition of the gameface tooltip custom element
 */
class Tooltip extends HTMLElement {
    /* eslint-disable require-jsdoc */
    constructor() {
        super();
        this.template = template;
        this.visible = false;

        this.uncheckedOrientations = TOOLTIP_POSITIONS;
    }

    get message() {
        return this._messageSlot.textContent;
    }

    set targetElement(element) {
        this._targetElement = element;
    }

    get targetElement() {
        return this._targetElement;
    }

    get overflows() {
        const rect = this.getBoundingClientRect();
        const overflows = {};

        if (rect.top < 0) overflows.top = true;
        if (rect.left < 0) overflows.left = true;
        if (rect.right > (window.innerWidth || document.documentElement.clientWidth)) overflows.right = true;
        if (rect.bottom > (window.innerHeight || document.documentElement.clientHeight)) overflows.bottom = true;

        return overflows;
    }

    get async() {
        return this.hasAttribute('async');
    }

    debounce(callback, timeout = 10) {
        return (...args) => {
            clearTimeout(this.debounceTimer);
            this.debounceTimer = setTimeout(() => { callback.apply(this, args); }, timeout);
        };
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

        this.handleDocumentClick = this.handleDocumentClick.bind(this);
        this.resizeDebounced = this.debounce(this.onWindowResize);

        components.loadResource(this)
            .then((result) => {
                this.template = result.template;
                components.renderOnce(this);
                this.attachEventListeners();
                this._messageSlot = this.querySelector('.guic-tooltip').firstElementChild;
            })
            .catch(err => console.error(err));
    }

    onWindowResize() {
        this.setPosition(window.scrollX, window.scrollY);
        this.uncheckedOrientations = [...TOOLTIP_POSITIONS];
    }

    attachEventListeners() {
        if (this.showOn === this.hideOn) {
            this.triggerElement.addEventListener(this.showOn, () => this.toggle());
            return;
        }

        this.triggerElement.addEventListener(this.showOn, () => this.show());
        this.triggerElement.addEventListener(this.hideOn, () => this.hide());
    }

    attachGlobalEventListeners() {
        window.addEventListener('resize', this.resizeDebounced);
        document.addEventListener('click', this.handleDocumentClick);
    }

    removeGlobalEventListeners() {
        window.removeEventListener('resize', this.resizeDebounced);
        document.removeEventListener('click', this.handleDocumentClick);
    }

    /* eslint-enable require-jsdoc */

    /**
     * Sets the textContent of the message slot HTMLElement
     * @param {string | number} content
     * @returns {string}
    */
    setTooltipContent(content) {
        return this._messageSlot.textContent = content;
    }

    /**
     * Checks the validity of a synchronous message.
     * Allowed types are - string | number | Function<string | number>.
     * @param {any} value
     * @returns {boolean} - true if it is valid and false if not.
    */
    isSyncMessageValid(value) {
        const allowedSyncTypes = ['string', 'number', 'function'];
        const type = typeof value;

        if (!allowedSyncTypes.includes(type)) return false;
        if (type === 'function' && (value() instanceof Promise)) return console.error('Using Promise in sync mode is forbidden. Add "async" attribute to the gameface-tooltip element.');
        return true;
    }

    /**
     * Synchronously sets the value of the tooltip.
     * @param {string | number} value
    */
    setSyncMessage(value) {
        if (!this.isSyncMessageValid(value)) return;

        value = (typeof value === 'function') ? value() : value;
        this.setTooltipContent(value);
    }

    /**
     * Asynchronously sets the value of the tooltip.
     * @param {Function<Promise>} value
     * @returns {Promise} - a promise that will resolve with the value that was set.
    */
    setAsyncMessage(value) {
        if (typeof value !== 'function') return console.error(NOT_A_PROMISE_ERROR);
        const valueResult = value();
        if (!(valueResult instanceof Promise)) return console.error(NOT_A_PROMISE_ERROR);

        this.setTooltipContent('Loading...');

        return new Promise((resolve, reject) => {
            valueResult.then(response => resolve(this.setTooltipContent(response))).catch(reject);
        });
    }

    /**
     * Sets the value of the tooltip. Calls the sync/async methods depending on the current mode.
     * Calls the validation methods before setting to make sure the values are correct.
     * @param {any} value
     * @returns {Promise | undefined}
    */
    setMessage(value) {
        if (this.async) return this.setAsyncMessage(value);
        this.setSyncMessage(value);
    }

    /**
     * If the target doesn't contain the gameface-tooltip element
     * then it means the click is on some of its children.
     * @param {Event} event
     */
    handleDocumentClick(event) {
        if (event.target.contains(this)) this.hide();
    }

    /**
     * Displays/Hides the tooltip
     */
    toggle() {
        this.visible ? this.hide() : this.show();
    }

    /**
     * Hides the tooltip
     */
    hide() {
        this.style.display = 'none';
        this.removeGlobalEventListeners();
        this.visible = false;
        // reset the current positioning as the page might get
        // resized until the next time the tooltip is displayed
        this.uncheckedOrientations = TOOLTIP_POSITIONS;
        this.position = this.getAttribute('position') || 'top';
    }

    /**
     * Displays the tooltip
     */
    async show() {
        // use visibility before showing to calculate the size
        this.style.visibility = 'hidden';
        this.style.display = '';

        await this.setPosition(window.scrollX, window.scrollY);
        this.attachGlobalEventListeners();

        this.style.visibility = 'visible';
        this.visible = true;
        this.classList.add('guic-tooltip-show-animation');
    }

    /**
     * Calculates the new position of the tooltip based on the given orientation.
     * @param {string} orientation - top, left, right or bottom.
     * @param {object} elementSize - the bounding rect of the element that triggered the tooltip show.
     * @returns {Array<string|object>} - the orientation as a string and the position as an object in an array so that we can
     * easily deconstruct the value like this: let [orientation, position] = getPositionCoords(...).
    */
    getPositionCoords(orientation, elementSize) {
        const tooltipSize = this.getBoundingClientRect();

        const elementPosition = {
            top: (elementSize.top + elementSize.height / 2) - tooltipSize.height / 2,
            left: elementSize.left + (elementSize.width / 2) - tooltipSize.width / 2,
        };

        switch (orientation) {
            case 'top':
                elementPosition.top = elementSize.top - TOOLTIP_MARGIN - tooltipSize.height;
                break;
            case 'bottom':
                elementPosition.top = elementSize.top + elementSize.height + TOOLTIP_MARGIN;
                break;
            case 'left':
                elementPosition.left = elementSize.left - tooltipSize.width - TOOLTIP_MARGIN;
                break;
            case 'right':
                elementPosition.left = elementSize.left + elementSize.width + TOOLTIP_MARGIN;
                break;
            default:
                elementPosition.top = elementSize.top - TOOLTIP_MARGIN - tooltipSize.height;
                console.log(`The provided option for position ${orientation} is not valid - using top as a fallback. Possible options are top, bottom, left and right.`);
                orientation = 'top';
                break;
        }

        return [orientation, elementPosition];
    }

    /**
     * Sets the new position of the tooltip. Waits 2 frames for the tooltip to be fully rendered
     * and checks if the tooltip is visible on the new position. If it is not - calls setPosition
     * recursively until a suitable position is found or we've ran out of possibilities.
     * @param {number} scrollOffsetX - the offset of the scroll on the X axis.
     * @param {number} scrollOffsetY - the offset of the scroll on the Y axis.
     * @param {string} orientation - the current position of the tooltip - top, left, right or bottom.
     * @returns {promise}
    */
    async setPosition(scrollOffsetX, scrollOffsetY, orientation = this.position) {
        const elementSize = this.triggerElement.getBoundingClientRect();

        const [updatedOrientation, elementPosition] = this.getPositionCoords(orientation, elementSize);

        this.position = updatedOrientation;
        this.style.top = scrollOffsetY + elementPosition.top + 'px';
        this.style.left = scrollOffsetX + elementPosition.left + 'px';

        await this.waitForFrames(2);
        const overflowingSides = Object.keys(this.overflows);
        if (overflowingSides.length && this.uncheckedOrientations.length !== 0) {
            return await this.setPosition(scrollOffsetX, scrollOffsetY, this.getVisiblePosition(overflowingSides));
        }
    }

    /**
     * An asynchronous method that waits for given amount of frames before it resolves;
     * useful in cases where we need to wait for styles to be computed.
     * @param {number} count - the number of frames it should wait for before resolving.
     * @returns {promise}
     */
    async waitForFrames(count) {
        while (count--) {
            await new Promise(resolve => requestAnimationFrame(resolve));
        }
    }

    /**
     * Gets the next value of a list of possible positions for the tooltip.
     * The possible positions is the difference between the overflowing positions and the
     * positions that haven't been tried yet.
     * @param {Array<string>} overflowingSides - an array of the sides of which the tooltip is hidden.
     * @returns {string} position - the new position.
     */
    getVisiblePosition(overflowingSides) {
        this.uncheckedOrientations = this.uncheckedOrientations.filter(side => !overflowingSides.includes(side));
        // the new position is the first element if the uncheckedOrientations array
        // return the first element and remove it from the array because it is now
        // part of the "checked" positions
        return this.uncheckedOrientations.shift();
    }
}

components.defineCustomElement('gameface-tooltip', Tooltip);

export default Tooltip;
