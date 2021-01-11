const KEYCODE = {
    DOWN: 40,
    LEFT: 37,
    RIGHT: 39,
    UP: 38,
    HOME: 36,
    END: 35,
};

class Keyboard {
    constructor() {
        // no need to keep a big collection of HTML elements
        // the selector for the next element should be
        // `[tab-index="${current +|- 1}"]`
        // we can store first and last for quick access when using HOME/END
        // but we need to store selectors/indexes, not HTML elements!
        this.tabSequence = [/* first */, /* current */, /* last */];
    }

    get next() {
        return this.tabSequence['current'] + 1;
    }

    get prev() {
        return this.tabSequence['current'] - 1;
    }

    get first() {
        return this.tabSequence['first'];
    }

    get last() {
        return this.tabSequence['last'];
    }

    /**
     * Called on keydown.
     * Gets the currently pressed key from the event and calls a function based
     * on the key code.
     * @param {KeyboardEvent} event - the event object
    */
    onKeyDown(event) {
        if (event.target.tagName !== 'MENU_ITEM' || event.altKey) return;

        // The switch-case will determine which tab should be marked as active
        // depending on the key that was pressed.
        let newMenuItem;

        switch (event.keyCode) {
            case KEYCODE.LEFT:
            case KEYCODE.UP:
                newMenuItem = this.getPrevMenuItem();
                break;

            case KEYCODE.RIGHT:
            case KEYCODE.DOWN:
                newMenuItem = this.getNextMenuItem();
                break;

            case KEYCODE.HOME:
                newMenuItem = this.getFirstMenuItem();
                break;

            case KEYCODE.END:
                newMenuItem = this.getLastMenuItem();
                break;
            default:
                return;
        }

        event.preventDefault();
        this.selectMenuItem(newMenuItem);
    }
}