/* eslint-disable linebreak-style */
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Components } from 'coherent-gameface-components';
const components = new Components();
import template from './template.html';

const BaseComponent = components.BaseComponent;

/**
 * Class definition of the gameface radial menu custom element
 */
class RadialMenu extends BaseComponent {
    // eslint-disable-next-line require-jsdoc
    constructor() {
        super();
        this.template = template;

        this._items = [];

        this.changeItemEvent = {};
        this.selectItemEvent = {};

        this.openKeyCode = 0;
        this.itemsCount = 0;

        this.radialMenuCenter = { x: 0, y: 0 };
        this.itemSelector = {};
        this.segmentDegrees = 0;
        this.currentSegmentId = 0;
        this.radialMenuTemplateWrapper = {};
        this.init = this.init.bind(this);
    }

    // eslint-disable-next-line require-jsdoc
    set items(value) {
        this._items = value;
        this.initRadialMenu();
    }

    // eslint-disable-next-line require-jsdoc
    get items() {
        return this._items;
    }

    /**
     * Initialize the custom component.
     * Set template, attach event listeners, setup initial state etc.
     * @param {object} data
    */
    init(data) {
        this.setupTemplate(data, () => {
            components.renderOnce(this);
        });
    }

    // eslint-disable-next-line require-jsdoc
    connectedCallback() {
        components.loadResource(this)
            .then(this.init)
            .catch(err => console.error(err));
    }

    // eslint-disable-next-line require-jsdoc
    disconnectedCallback() {
        this.removeOpenKeyEvent();
        this.closeAndRemoveEventListeners();
    }

    /**
     * Used to initialize the sector size of the radial menu
     * @returns {void}
     */
    setSelectorSize() {
        // When there are 2 segments, use a rectangle.
        if (this.itemsCount === 2) {
            this.itemSelector.style.clipPath = `polygon(0% 50%, 0% 0%, 100% 0%, 100% 50%)`;
            return;
        }

        const halfSegmentDegrees = this.segmentDegrees / 2;
        const halfSegmentTan = Math.tan(halfSegmentDegrees * Math.PI / 180);
        const halfSegmentProportion = halfSegmentTan / 2 * 100;

        const PolyPoint2XPos = 50 - halfSegmentProportion + 0.00001;
        const PolyPoint3XPos = 50 + halfSegmentProportion + 0.00001;

        this.itemSelector.style.clipPath = `polygon(50% 50%, ${PolyPoint2XPos}% 0%, ${PolyPoint3XPos}% 0%)`;
    }

    /**
     * @param {HTMLElement} element
     * @param {Number} deg
     */
    rotateElement(element, deg) {
        element.style.transform = `rotate(${deg}deg)`;
    }

    /**
     * Add the menu items
     */
    populateItems() {
        const itemsElement = this.getElementsByClassName('guic-radial-menu-items')[0];
        this.segmentDegrees = 360 / this.itemsCount;

        for (let i = 0; i < this.itemsCount; i++) {
            const itemArrayImagePath = this.items[i].imagePath;
            const segmentOffset = this.segmentDegrees * i;

            const itemEl = document.createElement('div');
            this.rotateElement(itemEl, segmentOffset);
            itemEl.className = 'guic-radial-menu-item';

            const itemImage = document.createElement('div');
            this.rotateElement(itemImage, (this.segmentDegrees * -1) * i);
            itemImage.className = 'guic-radial-menu-item-icon';
            itemImage.style.backgroundImage = `url('${itemArrayImagePath}')`;

            itemEl.appendChild(itemImage);
            itemsElement.appendChild(itemEl);
        }
    }

    /**
     * @param {Object} mousePosition
     * @param {Object} centerPosition
     * @param {number} segmentCount
     * @param {number} angleOffset
     * @returns {number}
     */
    getSegment(mousePosition, centerPosition, segmentCount, angleOffset) {
        const directionVector = { x: 0, y: 0 };
        directionVector.x = mousePosition.x - centerPosition.x;
        directionVector.y = mousePosition.y - centerPosition.y;

        let angle = Math.atan2(-directionVector.y, directionVector.x);
        const angleOffsetInRad = angleOffset / 180 * Math.PI;
        angle += angleOffsetInRad;

        if (angle < 0) {
            angle = 2 * Math.PI + angle;
        }

        const segmentAngle = 2 * Math.PI / segmentCount;
        return Math.floor(angle / segmentAngle);
    }

    /**
     * Pass if the highlighted segment has changed.
     * @param {number} offset
     * @returns {boolean}
     *
     * Condition 1: When the offset is 0 (the first segment) and the offset
     * subtracted from the cached segment id is 0.
     * Covers highlighting in case of uneven number of items or the first segment.
     *
     * Condition 2: Since the current segment id is calculated by subtracting
     * the offset from the items count check if they are equivalent.
     *
     * If any of the above conditions are met, the mouse position hasn't
     * entered on a new segment of the radial menu.
     */
    hasHighlightedSegmentChanged(offset) {
        return (offset !== 0 || this.currentSegmentId - offset !== 0) &&
            this.currentSegmentId !== this.itemsCount - offset;
    }

    /**
     * Handler for changing the active segment of the radial menu
     * @param {HTMLEvent} event
     * @returns {void}
     */
    updateSegmentPosition(event) {
        const mousePosition = { x: 0, y: 0 };
        mousePosition.x = event.clientX;
        mousePosition.y = event.clientY;

        // The offset is returned as a 'counterclockwise' value in respect to
        // the radial menu.
        const newOffset = this.getSegment(mousePosition,
            this.radialMenuCenter,
            this.itemsCount,
            this.segmentDegrees / 2 - 90);

        if (!this.hasHighlightedSegmentChanged(newOffset)) return;

        // Since the newOffset value increases 'counterclockwise', subtract from
        // the items count to mirror that. Now the segment id can be used to
        // access items from the array with the correct array element id.
        this.currentSegmentId = (newOffset === 0) ? 0 : this.itemsCount - newOffset;


        this.dispatchEvent(this.changeItemEvent);

        this.rotateElement(this.itemSelector, newOffset * -this.segmentDegrees);
    }

    /**
     * Will close the radial menu and dispatch custom event for selecting a menu item
     */
    selectAndClose() {
        this.classList.remove('guic-radial-menu-open');
        this.closeAndRemoveEventListeners();
        this.dispatchEvent(this.selectItemEvent);
    }

    /**
     * Handler when the window is resized
     */
    updateRadialMenuCenterXY() {
        const radialMenuBoundingRect = this.radialMenuTemplateWrapper.getBoundingClientRect();
        this.radialMenuCenter.x = radialMenuBoundingRect.left + (radialMenuBoundingRect.width / 2);
        this.radialMenuCenter.y = radialMenuBoundingRect.top + (radialMenuBoundingRect.height / 2);
    }

    /**
     * Remove listeners
     */
    closeAndRemoveEventListeners() {
        window.removeEventListener('mousemove', this.updateSegmentPosition);
        window.removeEventListener('click', this.selectAndClose);
        window.removeEventListener('resize', this.updateRadialMenuCenterXY);
        window.removeEventListener('keyup', this.selectAndClose);
    }

    /**
     * Opens the radial menu and add its related listeners
     */
    openAndAddEventListeners() {
        // Need to wait 2 frames to get the correct getBoundingClientRect() prop values.
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                this.updateRadialMenuCenterXY();
                window.addEventListener('mousemove', this.updateSegmentPosition);
                window.addEventListener('click', this.selectAndClose);
                window.addEventListener('resize', this.updateRadialMenuCenterXY);
                window.addEventListener('keyup', this.selectAndClose);

                this.classList.add('guic-radial-menu-open');
            });
        });
    }

    /**
     * Will set a keycode that will be used to open the radial menu
     */
    assignOpenKey() {
        // Convert to uppercase because of the components.KEYCODES properties names.
        const datasetKeyCode = this.dataset.openKeyCode.toUpperCase();

        if (components.KEYCODES[datasetKeyCode]) {
            this.openKeyCode = components.KEYCODES[datasetKeyCode];
        } else if (Number(datasetKeyCode)) {
            this.openKeyCode = Number(datasetKeyCode);
        } else {
            console.log('Provided key value for opening ' + this.dataset.name +
                ' is not a number and doesn\'t exist in Components library\'s KEYCODES object.');
        }
    }

    /**
     * Handler for keypress that will open the radial menu
     * @param {HTMLEvent} event
     */
    onOpenKeyPressed(event) {
        if (!event.repeat && event.keyCode === this.openKeyCode) {
            this.openAndAddEventListeners();
        }
    }

    /**
     * Add event listener for opening the radial menu
     */
    addOpenKeyEvent() {
        window.addEventListener('keydown', this.onOpenKeyPressed);
    }

    /**
     * Removing the event listener for opening the radial menu
     */
    removeOpenKeyEvent() {
        window.removeEventListener('keydown', this.onOpenKeyPressed);
    }

    /**
     * Init the radial menu
     */
    initRadialMenu() {
        this.openKeyCode = parseInt(this.dataset.openKeyCode);
        // Evaluate the items array referenced in the data-items attribute.

        this.itemsCount = this.items.length;

        this.changeItemEvent = new CustomEvent(this.dataset.changeEventName);
        this.selectItemEvent = new CustomEvent(this.dataset.selectEventName);

        this.onOpenKeyPressed = this.onOpenKeyPressed.bind(this);
        this.updateSegmentPosition = this.updateSegmentPosition.bind(this);
        this.selectAndClose = this.selectAndClose.bind(this);
        this.updateRadialMenuCenterXY = this.updateRadialMenuCenterXY.bind(this);

        this.radialMenuTemplateWrapper = this.querySelector('.guic-radial-menu');
        this.itemSelector = this.querySelector('.guic-radial-menu-selector');

        const centerText = this.querySelector('.guic-radial-menu-center-text');
        if (centerText) centerText.textContent = this.dataset.name;

        this.populateItems();
        this.setSelectorSize();
        this.rotateElement(this.itemSelector, 0);

        this.assignOpenKey();
        this.addOpenKeyEvent();
    }
}

components.defineCustomElement('gameface-radial-menu', RadialMenu);

export default RadialMenu;
