import components from 'coherent-gameface-components';
import template from './template.html';
import style from './style.css';

const KEYCODE = {
    DOWN: 40,
    LEFT: 37,
    RIGHT: 39,
    UP: 38,
    HOME: 36,
    END: 35,
    ENTER: 13,
};

class GamefaceMenu extends HTMLElement {
    constructor() {
        super();

        this.template = template;
        this.orientation = this.getAttribute('orientation');

        this.onKeyDown = this.onKeyDown.bind(this);
        this.onClick = this.onClick.bind(this);

        components.importStyleTag('gameface-menu', style);
        this.url = '/components/menu/template.html';
    }

    connectedCallback() {
        // TODO: fix, this is a hack
        if (this.wasConnected) return;
        this.wasConnected = true;

        components.loadResource(this, this.template)
            .then((response) => {
                this.template = response[1].cloneNode(true);
                components.render(this);

                this.addEventListener('keydown', this.onKeyDown);
                this.addEventListener('click', this.onClick);

                this.setOrientation();
            })
            .catch(err => {
                console.error(err);
            });
    }

    /**
     * Sets all tabs and panels in an inactive state.
     * No tab is selected and no panel is visible.
    */
    reset() {
        const menuItems = this.getAllMenuItems();
        menuItems.forEach(menuItem => menuItem.selected = false);
    }

    /**
     * Gets all MenuItem child elements of the current Menu component.
     * @returns {Array<MenuItem>} - the tabs of the tab component.
    */
    getAllMenuItems() {
        return Array.from(this.children);
    }

    /**
     * Gets the previous menu Item in the items list.
     * If the current mnu item is the first one - returns the last one.
     * @returns {MenuItem} - the previous menu item.
    */
    getPrevMenuItem() {
        const menuItems = this.getAllMenuItems();

        let newIdx = menuItems.findIndex(menuItem => menuItem.selected) - 1;
        // Add `tabs.length` to make sure the index is a positive number
        // and get the modulus to wrap around if necessary.
        return menuItems[(newIdx + menuItems.length) % menuItems.length];
    }

    /**
     * Gets the first menuItem in the menu items list.
     * @returns {MenuItem} - the first menu item.
    */
    getFirstMenuItem() {
        return this.getAllMenuItems()[0];
    }

    /**
     * Gets the next menu item in the menu items list.
     * If the current item is the last one - returns the first one.
     * @returns {MenuItem} - the next menu item.
    */
    getNextMenuItem() {
        const menuItems = this.getAllMenuItems();
        let newIdx = menuItems.findIndex(menuItems => menuItems.selected) + 1;
        return menuItems[newIdx % menuItems.length];
    }

    /**
     * Gets the last item.
     * @returns {MeuItem}
    */
    getLastMenuItem() {
        const menuItems = this.getAllMenuItems();
        return menuItems[menuItems.length - 1];
    }

    /**
    * Sets a menuItem in an active state.
    * The menuItem is highlighted.
    * @param {MenuItem} newMenuItem - the menuItem which has been clicked on.
    */
    selectMenuItem(newMenuItem) {
        // Deselect all tabs and hide all panels.
        this.reset();
        newMenuItem.selected = true;
        newMenuItem.focus();
    }

    onClick(event) {
        // avoid all cases except when the target is a tab heading.
        if (event.target.tagName === 'MENU-ITEM' || event.target.tagName === 'menu-item') {
            this.selectMenuItem(event.target);
        }
    }

    isNested() {
        return this.parentElement.tagName.toLowerCase() === 'menu-item';
    }

    getNextMenuItemOnEnter(event) {
        const submenu = event.target.querySelector('gameface-menu');
        if (submenu) submenu.show();

        return null;
        // newTab = event.target;
    }

    getNextMenuItemOnArrowDown(event) {
        const submenu = event.target.querySelector('gameface-menu');
        // go on with the nest menu-item
        if (!submenu) return this.getNextMenuItem();

        // show the submenu
        submenu.show();
        const firstOption = submenu.querySelectorAll('menu-item')[0];
        // focus the first ENABLED option
        firstOption.selected = true;
        firstOption.focus();
        return null;
    }

    getNextMenuItemOnArrowUpOrLeft(event) {
        const target = event.target;

        if (!this.isNested() || target.parentElement.firstChild !== target) return this.getPrevMenuItem()
        // this.style.display = 'none';
        return this.parentElement;;
    }

    getNextMenuItemFromKey(event) {
        // The switch-case will determine which tab should be marked as active
        // depending on the key that was pressed.
        switch (event.keyCode) {
            case KEYCODE.ENTER:
                return this.getNextMenuItemOnEnter(event);
            case KEYCODE.DOWN:
                return this.getNextMenuItemOnArrowDown(event);
            case KEYCODE.LEFT:
            case KEYCODE.UP:
                return this.getNextMenuItemOnArrowUpOrLeft(event)
            case KEYCODE.RIGHT:
            case KEYCODE.DOWN:
                return this.getNextMenuItem();
            case KEYCODE.HOME:
                return this.getFirstMenuItem();
            case KEYCODE.END:
                return this.getLastMenuItem();
            default:
                return null;
        }
    }

    onKeyDown(event) {
        event.stopPropagation();
        event.preventDefault();

        if (event.target.tagName.toLowerCase() !== 'menu-item' || event.altKey) return;
        const nextItem = this.getNextMenuItemFromKey(event);
        if(nextItem) this.selectMenuItem(nextItem);
    }

    show() {
       this.style.display = 'flex';
    }

    hide() {
       this.style.display = 'none';
    }

    setOrientation() {
        // const menuWrapper = this.querySelector('.menu-wrapper');
        this.classList.add('menu-wrapper');
        this.classList.add(this.orientation);
    }
}

class MenuItem extends HTMLElement {
    static get observedAttributes() {
        return ['selected'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        const value = this.hasAttribute('selected');
        this.setAttribute('tabindex', value ? 0 : -1);
    }

    constructor() {
        super();
        this.submenu = this.dataset.toggle;

        this.addEventListener('click', (e) => {
            if (this.submenu) this.toggleSubmenu(e);
        });
    }

    get selected() {
        return this.getAttribute('selected');
    }

    set selected(value) {
        if (value) {
            this.setAttribute('selected', value);
            this.classList.add('active');
        } else {
            this.classList.remove('active');
            this.removeAttribute('selected');
            this.reset();
        }
    }

    reset() {
        const nestedMenus = this.querySelectorAll('gameface-menu');
        nestedMenus.forEach(nestedMenu => {
            nestedMenu.style.display = 'none'
            nestedMenu.reset();
        });
    }
}

components.defineCustomElement('gameface-menu', GamefaceMenu);
components.defineCustomElement('menu-item', MenuItem);

export default GamefaceMenu;