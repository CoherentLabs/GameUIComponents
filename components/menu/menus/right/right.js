import components from 'coherent-gameface-components';
import style from './right.css';
import GamefaceMenu from '../menu';

const KEYCODES = components.KEYCODES;

const KEY_MAPPING = {
    FORWARD: KEYCODES.DOWN,
    BACK: KEYCODES.UP,
    OPEN_SUBMENU: KEYCODES.LEFT,
    CLOSE: KEYCODES.ESCAPE,
    SELECT: KEYCODES.ENTER,
};

class GamefaceRightMenu extends GamefaceMenu {
    constructor() {
        super();

        this.keyMapping = KEY_MAPPING;
        components.importStyleTag('gameface-right-menu', style);
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