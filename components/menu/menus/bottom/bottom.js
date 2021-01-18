import components from 'coherent-gameface-components';
import style from './bottom.css';
import GamefaceBaseMenu from '../base/base';
import {TAG_NAMES, KEYCODES} from '../../constants';

const KEY_MAPPING = {
    FORWARD: KEYCODES.RIGHT,
    BACK: KEYCODES.LEFT,
    OPEN_SUBMENU: KEYCODES.UP,
    CLOSE: KEYCODES.ESCAPE,
    SELECT: KEYCODES.ENTER,
};

class GamefaceBottomMenu extends GamefaceBaseMenu {
    constructor() {
        super();

        this.keyMapping = KEY_MAPPING;
        components.importStyleTag('gameface-bottom-menu', style);
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

            nested.style.left = parentPosition.x + 'px';
            nested.style.bottom = parentPosition.height + 'px';

            if (hide) nested.style.display = 'none';
        }
    }
}

components.defineCustomElement('gameface-bottom-menu', GamefaceBottomMenu);

export default GamefaceBottomMenu;