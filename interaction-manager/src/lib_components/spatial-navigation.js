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
        this.navigatableElements = { default: [] };
        this.activeKeys = JSON.parse(JSON.stringify(defaultKeysState));
        this.registeredKeys = new Set();
        this.clearCurrentActiveKeys = false;
    }

    /**
     * Initializes the spatial navigation
     * @param {string[]|Object[]} navigatableElements
     * @param {string} navigatableElements[].area
     * @param {string[]} navigatableElements[].elements
     * @returns {void}
     */
    init(navigatableElements = []) {
        if (this.enabled) return;
        this.enabled = true;

        this.add(navigatableElements);
        this.registerKeyActions();
    }

    /**
     * Deinitialize the spatial navigation
     * @returns {void}
     */
    deinit() {
        if (!this.enabled) return;
        this.enabled = false;

        this.navigatableElements = { default: [] };
        this.removeKeyActions(true);
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

        this.navigatableElements.default.push(...domElements);
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

        if (!this.navigatableElements[navArea.area]) this.navigatableElements[navArea.area] = [];

        this.navigatableElements[navArea.area].push(...domElements);
    }

    /**
     * Sets the tabindex of the element that needs to be focused
     * @param {HTMLElement} element
     */
    makeFocusable(element) {
        element.setAttribute('tabindex', 1);
    }

    /**
     * Checks if the current focused element is within a group and returns the rest of the elements in the group
     * @returns {NavigationObject[]}
     */
    getFocusableGroup() {
        const focusedElement = document.activeElement;

        return Object.values(this.navigatableElements).reduce((acc, el) => {
            if (el.includes(focusedElement)) {
                acc = el.reduce((accumulator, element) => {
                    if (element !== focusedElement && !element.hasAttribute('disabled')) {
                        const { x, y, height, width } = element.getBoundingClientRect();
                        accumulator.push({ element, x, y, height, width });
                    }
                    return accumulator;
                }, []);
            }
            return acc;
        }, []);
    }

    /**
     * Gets the element closest to the opposite edge of the navigation direction
     * @param {string} direction
     * @param {NavigationObject[]} elements
     * @param {Object} focusedElement
     * @param {number} focusedElement.x
     * @param {number} focusedElement.y
     * @returns {NavigationObject}
     */
    getClosestToEdge(direction, elements, focusedElement) {
        let newDistance, oldDistance;
        return elements.reduce((acc, el) => {
            switch (direction) {
                case 'down':
                    newDistance = Math.hypot(el.x - focusedElement.x, el.y);
                    oldDistance = Math.hypot(acc.x - focusedElement.x, acc.y);
                    break;
                case 'up':
                    newDistance = Math.hypot(el.x - focusedElement.x, window.innerHeight - el.y);
                    oldDistance = Math.hypot(acc.x - focusedElement.x, window.innerHeight - acc.y);
                    break;
                case 'right':
                    newDistance = Math.hypot(el.x, el.y - focusedElement.y);
                    oldDistance = Math.hypot(acc.x, acc.y - focusedElement.y);
                    break;
                case 'left':
                    newDistance = Math.hypot(window.innerWidth - el.x, el.y - focusedElement.y);
                    oldDistance = Math.hypot(window.innerWidth - acc.x, acc.y - focusedElement.y);
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

        const focusableGroup = this.getFocusableGroup();
        const { x, y } = document.activeElement.getBoundingClientRect();

        if (focusableGroup.length === 0) return;

        let nextFocusableElement = focusableGroup.reduce((acc, el) => {
            const deltaX = el.x - x;
            const deltaY = el.y - y;
            const angle = toDeg(Math.atan2(deltaY, deltaX));

            if (this.getDirectionAngle(direction, angle)) {
                if (!acc) acc = el;

                const newDistance = Math.hypot(deltaX, deltaY);
                const oldDistance = Math.hypot(acc.y - y, acc.x - x);
                acc = newDistance < oldDistance ? el : acc;
            }

            return acc;
        }, null);

        if (!nextFocusableElement) nextFocusableElement = this.getClosestToEdge(direction, focusableGroup, { x, y });

        nextFocusableElement.element.focus();
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

            const keys = this.activeKeys[direction].map(key => [key]);

            for (const key of keys) {
                keyboard.on({
                    keys: key,
                    callback: `move-focus-${direction}`,
                    type: 'press',
                });
                this.registeredKeys.add(key[0]);
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
        this.registeredKeys.clear();
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

            if (newKey && !this.activeKeys[direction].includes(newKey)) {
                this.activeKeys[direction].push(newKey);
            }
        }

        this.registerKeyActions();
    }

    /**
     * Removes the added actions
     */
    removeKeyActions() {
        this.registeredKeys.forEach(key => keyboard.off([key]));
        directions.forEach((direction) => {
            actions.remove(`move-focus-${direction}`);
            gamepad.off([`playstation.d-pad-${direction}`]);
            if (this.clearCurrentActiveKeys ) {
                this.activeKeys[direction] = [];
                this.registeredKeys.clear();
            }
        });
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
        navigatableElements[0].focus();
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
        navigatableElements.slice(-1)[0].focus();
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
        return Object.values(this.navigatableElements).some(group => group.includes(document.activeElement));
    }

    /**
     * Removes the focus from a focused element in a group
     */
    clearFocus() {
        if (this.isActiveElementInGroup()) document.activeElement.blur();
    }
}

export default new SpatialNavigation();
