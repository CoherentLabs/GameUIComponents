/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Components } from 'coherent-gameface-components';
const components = new Components();
import GamefaceMenu from '../menu';

const KEYCODES = components.KEYCODES;

const KEY_MAPPING = {
    FORWARD: KEYCODES.DOWN,
    BACK: KEYCODES.UP,
    OPEN_SUBMENU: KEYCODES.LEFT,
    CLOSE: KEYCODES.ESCAPE,
    SELECT: KEYCODES.ENTER,
};

/**
 * Class definition of the gameface right menu custom element
 */
class GamefaceRightMenu extends GamefaceMenu {
    // eslint-disable-next-line require-jsdoc
    constructor() {
        super();

        this.keyMapping = KEY_MAPPING;
    }

    /**
     * Sets an inline style to properly position the element
     * Different menus have use different properties - top, left, right or bottom
     *
     * @param {HTMLElement} element - the element that needs to be positioned
     * @param {DOMRect} parentPosition - the bounding box of the parent element
    */
    setPosition(element, parentPosition) {
        element.style.right = parentPosition.width + 'px';
        element.style.top = '0px';
    }
}

components.defineCustomElement('gameface-right-menu', GamefaceRightMenu);

export default GamefaceRightMenu;
