import components from 'coherent-gameface-components';
import ScrollableContainer from 'gameface-scrollable-container';
import template from './template.html';
import theme from '../../theme/components-theme.css';
import style from './style.css';

const KEYCODES = components.KEYCODES;

/**
 * Checks if an element is descendant of another.
 * @param {HTMLElement} parent
 * @param {HTMLElement} child
 * @returns {boolean}
*/
function isDescendant(parent, child) {
    var node = child.parentNode;
    while (node != null) {
        if (node == parent) {
            return true;
        }
        node = node.parentNode;
    }
    return false;
}

class GamefaceDropdown extends HTMLElement {
    constructor() {
        super();

        this.selectedOption = null;
        this.isOpened = false;
        // the index of the currently selected option element
        this._selected = 0;
        this._hovered = this._selected;
        this.template = template;
        this.onDocumentClick = this.onDocumentClick.bind(this);
        this.onClickOption = this.onClickOption.bind(this);

        components.importStyleTag('gameface-dropdown-theme', theme);
        components.importStyleTag('gameface-dropdown', style);
    }

    /**
     * Returns the text content of the selected dropdown-option.
     * @returns {String}
    */
    get value() {
        if (this.selected) return this.selected.textContent;
        return '';
    }

    /**
     * Returns all dropdown-option elements.
     * @returns {Array<HTMLElement>}
    */
    get allOptions() {
        return Array.from(this.querySelectorAll('dropdown-option'));
    }

    /**
     * Returns all dropdown-option elements that don't have attribute disabled.
     * @returns {Array<HTMLElement>}
    */
    get enabledOptions() {
        return this.allOptions.filter(option => !option.hasAttribute('disabled'));
    }

    /**
     * Sets the currently selected option.
     * Updates the class names of the current and the previously active options.
     * Dispatches a change event to notify that the active option has been changed.
    */
    set selected(option) {
        if (this.allOptions[this._selected]) {
            this.allOptions[this._selected].classList.remove('active');
        }

        option.classList.add('active');
        // get the index of the current option
        this._selected = this.allOptions.indexOf(option);
        this.hoveredElIndex = this._selected;

        components.transferContent(option.cloneNode(true), this.querySelector('.selected'));

        // dispatch a change event
        this.dispatchEvent(new CustomEvent('change', {
            detail: {
                target: option
            }
        }));
    }

    /**
     * Sets the currently hovered element's index.
     * @param {Number} value
    */
    set hoveredElIndex(value) {
        if (!this.allOptions[value]) return;
        return this._hovered = value;
    }

     /**
     * Returns the currently hovered element's index.
     * @returns {Number}
    */
    get hoveredElIndex() {
        return this._hovered;
    }

    /**
     * Returns the currently selected option element.
     * @returns {HTMLElement}
    */
    get selected() {
        return this.allOptions[this._selected];
    }

    connectedCallback() {
        components.loadResource(this)
            .then(([loadedTemplate]) => {
                this.template = loadedTemplate;
                components.renderOnce(this);
                // make this element focusable
                this.setAttribute('tabindex', '1');
                // select the default element
                this.selected = this.enabledOptions[this._selected];
                this.attachEventListeners();
            })
            .catch(err => console.error(err));
    }

    /**
     * Called on document click.
     * Closes the options panel if it's opened.
     * @param {MouseEvent} event - the current event object.
    */
    onDocumentClick(event) {
        if (event.target === this || isDescendant(this, event.target)) return;
        if (this.isOpened) this.closeOptionsPanel();
    }

    /**
     * Focuses a option from the enabledOptions list.
     * Uses the index of the enabled option to find the index of the same option
     * in the full list.
     * @param {number} newIndex - the index of the enabled option.
    */
    focusEnabledOption(newIndex) {
        const nextOptionIdx = this.allOptions.indexOf(this.enabledOptions[newIndex]);
        this.focusOption(nextOptionIdx);
    }

    /**
     * Focuses an option by index. Updates the index of the hovered element.
     * @param {number} nextOptionIdx - the index of the option that has to be focused.
    */
    focusOption(nextOptionIdx) {
        this.allOptions[this.hoveredElIndex].classList.remove('active');

        this.selected = this.allOptions[nextOptionIdx];
        this.hoveredElIndex = nextOptionIdx;
    }

    /**
     * Returns the index of the next option element.
     * Wraps around if it reaches the end of the list.
     * @param {Number} currentOptionIndx - the index of the currently active option
     * @returns {Number} - the index of the next enabled option
    */
    getNextOptionIndex(currentOptionIndx) {
        return (currentOptionIndx + 1) % this.enabledOptions.length;
    }

    /**
     * Returns the index of the previous option element.
     * Wraps around if it reaches the start of the list.
     * @param {Number} currentOptionIndx - the index of the currently active option
     * @returns {Number} - the index of the previous enabled option
    */
    getPreviousOptionIndex(currentOptionIndx) {
        const enabledOptionLength = this.enabledOptions.length;
        return ((currentOptionIndx - 1) + enabledOptionLength) % enabledOptionLength;
    }

    /**
     * Called on keydown. Used to handle option selection via the keyboard.
     * @param {KeyboardEvent} event - the current event object
    */
    onKeydown(event) {
        const currentOptionIndex = this.enabledOptions.indexOf(this.allOptions[this.hoveredElIndex]);

        switch (event.keyCode) {
            case KEYCODES.ENTER:
                this.focusOption(this.hoveredElIndex);
                this.closeOptionsPanel();
                break;
            case KEYCODES.TAB:
            case KEYCODES.ESCAPE:
                this.closeOptionsPanel();
                break;
            case KEYCODES.HOME:
                // focus first
                this.focusEnabledOption(0);
                break;
            case KEYCODES.END:
                // focus last
                this.focusEnabledOption(this.enabledOptions.length - 1);
                break;
            case KEYCODES.UP:
            case KEYCODES.LEFT:
                this.focusEnabledOption(this.getPreviousOptionIndex(currentOptionIndex));
                break;
            case KEYCODES.DOWN:
            case KEYCODES.RIGHT:
                this.focusEnabledOption(this.getNextOptionIndex(currentOptionIndex));
                break;
        }

        this.scrollToSelectedElement();
    }

    /**
     * Called on click on the select element.
     * Toggles the options panel, shows the scrollbar and scrolls to
     * the selected option element.
    */
    onClick() {
        const scrollableContainer = this.querySelector('scrollable-container');

        if (this.isOpened) {
            this.closeOptionsPanel();
            return;
        }

        this.scrollToSelectedElement();
        scrollableContainer.shouldShowScrollbar();
        this.openOptionsPanel();
    }

    /**
     * Attaches event listeners.
    */
    attachEventListeners() {
        // handle keyboard
        this.addEventListener('keydown', (event) => this.onKeydown(event));

        // handle click on the select element
        const selectedElementPlaceholer = this.querySelector('.selected');
        selectedElementPlaceholer.addEventListener('click', (event) => this.onClick(event));

        // // handle click on the option elements
        const options = this.querySelectorAll('dropdown-option');
        for (let i = 0; i < options.length; i++) {
            options[i].addEventListener('selected-option', (event) => this.onClickOption(event));
            options[i].addEventListener('mouseover', (event) => this.onMouseOverOption(event));
            options[i].addEventListener('mouseout', (event) => {
                // if (this.keydown) return;
                event.target.classList.remove('active');
            });
        }
    }

    /**
     * Called on mouseover an option element.
     * @param {MouseEvent} event - the current event object.
    */
    onMouseOverOption(event) {
        const options = this.allOptions;
        const index = options.indexOf(event.target);

        this.selected.classList.remove('active');
        event.target.classList.add('active');
        this.hoveredElIndex = index;
    }

    /**
     * Called when an option element is clicked.
     * Updates the selected member and closes the options panel.
     * @param {MouseEvent} event - the current event object.
    */
    onClickOption(event) {
        this.selected = event.target;
        this.closeOptionsPanel();
    }

    /**
     * Hides the options panel.
    */
    closeOptionsPanel() {
        const optionsPanel = this.querySelector('.options-container');
        this.isOpened = false;
        optionsPanel.classList.add('hidden');
        this.stopListeningToDocumentClick();
    }

    /**
     * Shows the options panel.
     * Adds the active class to the currently selected option.
     * Focuses the dropdown element.
    */
    openOptionsPanel() {
        this.selected.classList.add('active');
        const optionsPanel = this.querySelector('.options-container');
        this.isOpened = true;
        optionsPanel.classList.remove('hidden');
        this.focus();
        this.listenToDocumentClick();
    }

    /**
     * Starts listening to document click.
     * Used to detect if the user clicked outside the dropdown, in which case
     * the options panel should be closed. It's a workaround to COH-14366.
    */
    listenToDocumentClick() {
        document.addEventListener('click', this.onDocumentClick);
    }

    /**
     * Stop listening to document click.
     * If the options panel was manually closed, we no longer need to listen
     * to document click.
    */
    stopListeningToDocumentClick() {
        document.removeEventListener('click', this.onDocumentClick);
    }

    /**
     * Sets the selected element of the dropdown and scrolls to it.
     * @param {DropdownOption} - the option element.
    */
    setSelected(element) {
        this.selected = element;
        this.scrollToSelectedElement();
    }

    /**
     * Scrolls to the selected option element.
    */
    scrollToSelectedElement() {
        // this.keydown = true;
        // get the scrollable container
        const scrollbleContainer = this.querySelector('.scrollable-container');
        // get an option element
        const option = this.querySelector('dropdown-option');
        // get the height of the option element
        const optionSize = option.getBoundingClientRect().height;

        // the scroll position in pixels is equal to the height of the selected
        // option multiplied by its index
        
        clearTimeout(this.timeout)
        document.body.classList.add('disable-hover');
        let scrollInPX = this.hoveredElIndex * optionSize;
        scrollbleContainer.scrollTop = scrollInPX;
        scrollbleContainer.dispatchEvent(new CustomEvent('scroll'));

        this.timeout = setTimeout(() => {
            document.body.classList.remove('disable-hover');
        }, 500)
    }
}

class DropdownOption extends HTMLElement {
    static get observedAttributes() {
        return ['disabled'];
    }

    /**
     * Called when an attribute changes
    */
    attributeChangedCallback() {
        if (this.hasAttribute('disabled')) {
            this.classList.add('disabled');
            this.stopListeningToClick();
        } else {
            this.classList.remove('disabled');
            this.listenToClick();
        }
    }

    constructor() {
        super();
        this.attributeChangedCallback();
    }

    listenToClick() {
        this.addEventListener('click', this.onClick);
    }

    stopListeningToClick() {
        this.removeEventListener('click', this.onClick);
    }

    onClick(event) {
        event.target.dispatchEvent(new CustomEvent('selected-option'));
    }
}

components.defineCustomElement('dropdown-option', DropdownOption);
components.defineCustomElement('gameface-dropdown', GamefaceDropdown);

export default GamefaceDropdown;