import components from 'coherent-gameface-components';
import style from './left.css';
import GamefaceBaseMenu from '../base/base';
import {TAG_NAMES, KEYCODES} from '../../constants';

const KEY_MAPPING = {
    FORWARD: KEYCODES.DOWN,
    BACK: KEYCODES.UP,
    OPEN_SUBMENU: KEYCODES.RIGHT,
    CLOSE: KEYCODES.ESCAPE,
    SELECT: KEYCODES.ENTER,
};

class GamefaceLeftMenu extends GamefaceBaseMenu {
    constructor() {
        super();

        this.keyMapping = KEY_MAPPING;
        components.importStyleTag('gameface-left-menu', style);
    }

    /**
     * Sets the positions of the nested menus; doesn't need to be recursive
     * because each menu calls it for itself
     * @param {boolean} hide - the nested menus need to be hidden, by default the
     * setup function won't hide them, but when the menus are rendered for the
     * first time they'll be hidden
    */
    setupMenuItems(hide = false) {
        const menuItems = this.getAllMenuItems();

        for(let i = 0; i < menuItems.length; i++) {
            const nested = menuItems[i].querySelector(TAG_NAMES);

            if (!nested) continue;

            const parentPosition = menuItems[i].getBoundingClientRect();

            nested.style.left = parentPosition.width + 'px';
            nested.style.top = '0px';

            if (hide) nested.style.display = 'none';
        }
    }
}

components.defineCustomElement('gameface-left-menu', GamefaceLeftMenu);

export default GamefaceLeftMenu;