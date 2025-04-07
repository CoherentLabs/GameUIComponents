/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * @typedef {NavigationObject}
 * @property {HTMLElement} element
 * @property {number} x
 * @property {number} y
 * @property {number} height
 * @property {number} width
 */

import { toDeg } from '../utils/utility-functions';

import actions from './actions';
import keyboard from './keyboard';
import gamepad from './gamepad';

const directions = ['down', 'up', 'left', 'right'];
const defaultKeysState = { up: ['arrow_up'], down: ['arrow_down'], right: ['arrow_right'], left: ['arrow_left'] };
/**
 * Spatial Navigation for keyboard and controller
 */
class SpatialNavigation {
    // eslint-disable-next-line require-jsdoc
    constructor() {
        this.enabled = false;
        this.navigatableElements = { default: { elements: [], distance: 0 } };
        this.registeredKeys = new Set();
        this.clearCurrentActiveKeys = false;
        this.overlapPercentage = 0.5;
        this.lastFocusedElement = null;
        this.overflow = { x: 0, y: 0 };
    }

    /**
     * Initializes the spatial navigation
     * @param {string[]|Object[]} navigatableElements
     * @param {string} navigatableElements[].area
     * @param {string[]} navigatableElements[].elements
     * @param {number} overlap
     * @returns {void}
     */
    init(navigatableElements = [], overlap) {
        if (this.enabled) return;
        this.enabled = true;

        this.add(navigatableElements);
        this.activeKeys = JSON.parse(JSON.stringify(defaultKeysState));
        this.registerKeyActions();

        if (overlap && 0 <= overlap && overlap <= 1) {
            this.overlapPercentage = overlap;
        }
    }

    /**
     * Deinitialize the spatial navigation
     * @returns {void}
     */
    deinit() {
        if (!this.enabled) return;
        this.enabled = false;

        this.navigatableElements = { default: { elements: [], distance: 0 } };
        this.removeKeyActions();
        this.overlapPercentage = 0.5;
        this.lastFocusedElement = null;
    }
    /**
     * Add new elements to area or new area
     * @param {string[]|Object[]} navigatableElements
     * @param {string} navigatableElements[].area
     * @param {string[]} navigatableElements[].elements
     */
    add(navigatableElements) {
        if (!this.enabled) return;

        navigatableElements.forEach((navArea) => {
            typeof navArea === 'string' ? this.handleString(navArea) : this.handleObject(navArea);
        });
    }

    /**
     * Remove an area from the focusable groups
     * @param {string} area area to be removed
     * @returns {void}
     */
    remove(area = 'default') {
        if (!this.enabled) return;

        if (!this.navigatableElements[area]) return console.error(`The area '${area}' you are trying to remove doesn't exist`);

        this.navigatableElements[area].forEach(element => element.removeAttribute('tabindex'));

        this.navigatableElements[area].length = 0;
    }

    /**
     * Get elements from selector and save them to the default group
     * @param {string} navArea
     * @returns {void}
     */
    handleString(navArea) {
        const domElements = document.querySelectorAll(navArea);

        if (domElements.length === 0) return console.error(`${navArea} is either not a correct selector or the element is not present in the DOM.`);

        domElements.forEach(this.makeFocusable);

        this.navigatableElements.default.elements.push(...domElements);
        this.navigatableElements.default.distance = this.getElementsDistance(this.navigatableElements.default.elements);
    }

    /**
     * Gets elements from object and saves them to a focusable group
     * @param {Object} navArea
     * @param {string} navArea.area
     * @param {string[]} navArea.elements
     * @returns {void}
     */
    handleObject(navArea) {
        const domElements = navArea.elements.reduce((acc, el) => {
            const elements = document.querySelectorAll(el);
            elements.forEach(this.makeFocusable);

            acc.push(...elements);
            return acc;
        }, []);

        if (domElements.length === 0) return console.error(`${navArea.elements.join(', ')} are either not a correct selectors or the elements are not present in the DOM.`);

        if (!this.navigatableElements[navArea.area]) {
            this.navigatableElements[navArea.area] = { elements: [], distance: 0 };
        }

        this.navigatableElements[navArea.area].elements.push(...domElements);
        this.navigatableElements[navArea.area].distance = this.getElementsDistance(domElements);
    }

    /**
     * Calculates the distance between the provided elements and return the max distance
     * @param {HTMLElement[]} elements
     * @returns {number} - The max distance between the elements
     */
    getElementsDistance(elements) {
        const distances = elements.map((el) => {
            const { x, y } = el.getBoundingClientRect();
            return Math.hypot(x, y);
        });

        this.setOverflowValues(elements[0].parentElement);

        return Math.max(...distances);
    }

    /**
     * Recursively checks for overflow in the parent elements and sets the global overflow values
     * @param {HTMLElement} element - The element to check for overflow
     * @returns {HTMLElement|null} - Next element to check for overflow
     */
    setOverflowValues(element) {
        if (!element) return null; // Base case: reached the root

        const { scrollWidth, scrollHeight } = element;
        const overflowX = Math.max(0, scrollWidth - window.innerWidth);
        const overflowY = Math.max(0, scrollHeight - window.innerHeight);

        if (overflowX > 0 || overflowY > 0) {
            this.overflow = { x: overflowX, y: overflowY };
            return;
        }

        // Recursively check the parent element
        return this.setOverflowValues(element.parentElement);
    }

    /**
     * Sets the tabindex of the element that needs to be focused
     * @param {HTMLElement} element
     */
    makeFocusable(element) {
        element.setAttribute('tabindex', 1);
    }

    /**
     * Returns the valid focusable elements in the navigatable area
     * @param {HTMLElement} targetElement
     * @param {HTMLElement[]} elements
     * @param {number} distance
     * @returns {NavigationObject[]}
     */
    getFocusableGroup(targetElement, elements, distance) {
        return elements.reduce((accumulator, element) => {
            if (element !== targetElement && !element.hasAttribute('disabled')) {
                const { x, y, height, width } = element.getBoundingClientRect();
                accumulator.push({
                    element,
                    x: x + distance,
                    y: y + distance,
                    height,
                    width,
                });
            }
            return accumulator;
        }, []);
    }

    /**
     * Checks if the passed element is within a group and returns the rest of the elements in the group
     * @param {HTMLElement} targetElement
     * @returns {NavigationObject[]}
     */
    getCurrentArea(targetElement) {
        return Object.values(this.navigatableElements).find((area) => {
            if (area.elements.includes(targetElement)) return true;
        });
    }

    /**
     * Gets the element closest to the opposite edge of the navigation direction
     * @param {string} direction
     * @param {NavigationObject[]} elements
     * @param {Object} focusedElement
     * @param {number} focusedElement.x
     * @param {number} focusedElement.y
     * @param {number} distance
     * @returns {NavigationObject}
     */
    getClosestToEdge(direction, elements, focusedElement, distance) {
        let newDistance, oldDistance;
        const bottomEdge = window.innerHeight + distance + this.overflow.y;
        const rightEdge = window.innerWidth + distance + this.overflow.x;

        return elements.reduce((acc, el) => {
            switch (direction) {
                case 'down':
                    newDistance = Math.hypot(el.x - focusedElement.x, el.y);
                    oldDistance = Math.hypot(acc.x - focusedElement.x, acc.y);
                    break;
                case 'up':
                    newDistance = Math.hypot(el.x - focusedElement.x, bottomEdge - el.y);
                    oldDistance = Math.hypot(acc.x - focusedElement.x, bottomEdge - acc.y);
                    break;
                case 'right':
                    newDistance = Math.hypot(el.x, el.y - focusedElement.y);
                    oldDistance = Math.hypot(acc.x, acc.y - focusedElement.y);
                    break;
                case 'left':
                    newDistance = Math.hypot(rightEdge - el.x, el.y - focusedElement.y);
                    oldDistance = Math.hypot(rightEdge - acc.x, acc.y - focusedElement.y);
                    break;
            }
            acc = newDistance < oldDistance ? el : acc;

            return acc;
        });
    }

    /**
     * Moves the focus in the desired direction
     * @param {string} direction
     * @returns {void}
     */
    moveFocus(direction) {
        if (!this.enabled) return;

        const activeElement = this.checkActiveElementInGroup();

        const currentArea = this.getCurrentArea(activeElement);
        if (!currentArea) return console.error('The active element is not in a focusable area!');

        const { elements, distance } = currentArea;
        const focusableGroup = this.getFocusableGroup(activeElement, elements, distance);

        const { x, y, width, height } = activeElement.getBoundingClientRect();

        const adjustedDimensions = {
            x: x + distance,
            y: y + distance,
            width,
            height,
        };

        if (focusableGroup.length === 0) return;

        const currentAxisGroup = this.filterGroupByCurrentAxis(direction, focusableGroup, adjustedDimensions);

        if (!currentAxisGroup.length) return;

        let nextFocusableElement = this.findNextElement(
            direction, currentAxisGroup, adjustedDimensions.x, adjustedDimensions.y);

        if (!nextFocusableElement) {
            nextFocusableElement = this.getClosestToEdge(direction, currentAxisGroup, adjustedDimensions, distance);
        }

        if (nextFocusableElement) {
            nextFocusableElement.element.focus();
            this.lastFocusedElement = nextFocusableElement.element;
        }
    }

    /** Filters the focusable group by the relevant axis by chacking for same axis overlap
    * @param {string} direction
    * @param {Array} focusableGroup
    * @param {Object} currentElement
    * @returns {Array}
    */
    filterGroupByCurrentAxis(direction, focusableGroup, currentElement) {
        return focusableGroup.filter((element) => {
            if (direction === 'left' || direction === 'right') return this.isOverlappingX(currentElement, element);

            return this.isOverlappingY(currentElement, element);
        });
    }

    /** Compares the Y coordinates of two elements and checks for overlap by the specified overlap value
    * @param {Object} currentElement
    * @param {Object} nextElement
    * @returns {boolean}
    */
    isOverlappingX(currentElement, nextElement) {
        const lowerBoundary = Math.min(currentElement.y + currentElement.height, nextElement.y + nextElement.height);
        const topBoundary = Math.max(currentElement.y, nextElement.y);

        const verticalOverlap = Math.max(0, (lowerBoundary - topBoundary));
        const minHeight = Math.min(currentElement.height, nextElement.height);
        const overlapPercentage = verticalOverlap / minHeight;

        return overlapPercentage >= this.overlapPercentage;
    }

    /** Compares the X coordinates of two elements and checks for overlap by the specified overlap value
    * @param {Object} currentElement
    * @param {Object} nextElement
    * @returns {boolean}
    */
    isOverlappingY(currentElement, nextElement) {
        const rightBoundary = Math.min(currentElement.x + currentElement.width, nextElement.x + nextElement.width);
        const leftBoundary = Math.max(currentElement.x, nextElement.x);

        const horizontalOverlap = Math.max(0, rightBoundary - leftBoundary);
        const minWidth = Math.min(currentElement.width, nextElement.width);
        const overlapPercentage = horizontalOverlap / minWidth;

        return overlapPercentage >= this.overlapPercentage;
    }

    /** Returns the next element to focus within the group
    * @param {string} direction
    * @param {Array} focusableGroup
    * @param {number} x
    * @param {number} y
    * @returns {Object}
    */
    findNextElement(direction, focusableGroup, x, y) {
        return focusableGroup.reduce((acc, el) => {
            const deltaX = el.x - x;
            const deltaY = el.y - y;
            const angle = toDeg(Math.atan2(deltaY, deltaX));

            if (this.getDirectionAngle(direction, angle)) {
                if (!acc) acc = el;

                const newDistance = Math.hypot(deltaX, deltaY);
                const oldDistance = Math.hypot(acc.x - x, acc.y - y);
                acc = newDistance < oldDistance ? el : acc;
            }

            return acc;
        }, null);
    }

    /**
     * Get the angle range for the direction
     * @param {string} direction
     * @param {number} angle
     * @returns {boolean}
     */
    getDirectionAngle(direction, angle) {
        switch (direction) {
            case 'down':
                return angle > 0 && angle < 180;
            case 'up':
                return angle > -180 && angle < 0;
            case 'left':
                return angle < -90 || angle > 90;
            case 'right':
                return angle > -90 && angle < 90;
        }
    }

    /**
     * Registers actions and adds them to the keyboard and gamepad objects
    */
    registerKeyActions() {
        directions.forEach((direction) => {
            const callback = () => {
                this.moveFocus(direction);
            };
            actions.register(`move-focus-${direction}`, callback);

            const keys = this.activeKeys[direction];

            for (const key of keys) {
                keyboard.on({
                    keys: [key],
                    callback: `move-focus-${direction}`,
                    type: ['press', 'hold'],
                });
                this.registeredKeys.add(key);
            }

            gamepad.on({
                actions: [`playstation.d-pad-${direction}`],
                callback: `move-focus-${direction}`,
            });
        });
    }

    /**
     * Resets to the original keys state
     */
    resetKeys() {
        this.removeKeyActions();
        this.activeKeys = JSON.parse(JSON.stringify(defaultKeysState));
        this.registerKeyActions();
    }

    /**
     * Adds or override default direction keys with the specified ones
     * @param {Object} customDirections - { up: 'W', left: 'A', right: 'D', down: 'S' }
     * @param {Object} options - Optional settings.
     * @param {Boolean} options.clearCurrentActiveKeys - If true, overrides all keys. Defaults to false.
     * @returns {void}
     */
    changeKeys(customDirections, options = { clearCurrentActiveKeys: false }) {
        const customKeysDirections = Object.keys(customDirections);
        if (customKeysDirections.length === 0) return;

        const incorrectDirections = customKeysDirections.filter(direction => !directions.includes(direction));
        if (incorrectDirections.length > 0) return console.error(`The following directions: [${incorrectDirections.join(', ')}] you have entered are incorrect! `);

        this.clearCurrentActiveKeys = options.clearCurrentActiveKeys;

        this.removeKeyActions();

        for (const direction in this.activeKeys) {
            const newKey = customDirections[direction];

            if (typeof newKey === 'string' && !this.activeKeys[direction].includes(newKey)) {
                this.activeKeys[direction].push(newKey.toUpperCase());
            }
        }

        this.registerKeyActions();
    }

    /**
     * Removes the added actions
     */
    removeKeyActions() {
        if (this.registeredKeys.size !== 0) {
            this.registeredKeys.forEach(key => keyboard.off([key]));
            this.registeredKeys.clear();

            directions.forEach((direction) => {
                actions.remove(`move-focus-${direction}`);
                gamepad.off([`playstation.d-pad-${direction}`]);
                if (this.clearCurrentActiveKeys ) this.activeKeys[direction] = [];
            });
        }
    }

    /**
     * Focuses on the first element in a focusable area
     * @param {string} area
     * @returns {void}
     */
    focusFirst(area = 'default') {
        const navigatableElements = this.navigatableElements[area];
        if (!navigatableElements || navigatableElements.length === 0) {
            return console.error(`The area '${area}' you are trying to focus doesn't exist or the spatial navigation hasn't been initialized`);
        }

        this.lastFocusedElement = navigatableElements.elements[0];
        this.lastFocusedElement.focus();
    }

    /**
     * Focuses on the last element in a focusable area
     * @param {string} area
     * @returns {void}
     */
    focusLast(area = 'default') {
        if (!this.enabled) return;

        const navigatableElements = this.navigatableElements[area];
        if (!navigatableElements || navigatableElements.length === 0) {
            return console.error(`The area '${area}' you are trying to focus doesn't exist or the spatial navigation hasn't been initialized`);
        }

        this.lastFocusedElement = navigatableElements.elements.slice(-1)[0];
        this.lastFocusedElement.focus();
    }

    /**
     * Changes focus to another area
     * @param {string} area
     */
    switchArea(area) {
        this.focusFirst(area);
    }

    /**
     * Checks if a given element is a focusable area
     * @returns {boolean}
     */
    isActiveElementInGroup() {
        return Object.values(this.navigatableElements).some(group => group.elements.includes(document.activeElement));
    }

    /**
     * Checks if the active element is within a group and returns the last focused element if it isn't.
     * @returns {HTMLElement}
     */
    checkActiveElementInGroup() {
        return this.isActiveElementInGroup(document.activeElement) ? document.activeElement : this.lastFocusedElement;
    }

    /**
     * Removes the focus from a focused element in a group
     */
    clearFocus() {
        if (this.isActiveElementInGroup()) document.activeElement.blur();
    }
}

export default new SpatialNavigation();
