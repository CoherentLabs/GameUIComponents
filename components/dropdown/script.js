import components from 'coherent-gameface-components';
import ScrollableContainer from 'gameface-scrollable-container';
import template from './template.html';
import theme from '../../theme/components-theme.css';
import style from './style.css';

const KEY_CODES = {
    'ARROW_UP': 38,
    'ARROW_DOWN': 40,
    'ARROW_RIGHT': 39,
    'ARROW_LEFT': 37,
    'END': 35,
    'HOME': 36,
    'ENTER': 13,
    'ESCAPE': 27,
    'TAB': 9,
};

class GamefaceDropdown extends HTMLElement {
    constructor() {
        super();

        this.selectedOption = null;
        this.isOpened = false;
        // the index of the currently selected option element
        this._selected = 0;

        this.template = template;
        components.importStyleTag('gameface-dropdown-theme', theme);
        components.importStyleTag('gameface-dropdown', style);
    }

    /**
     * Returns all dropdown-option elements.
     * @returns {Array<HTMLElement>}
    */
    get allOptions() {
        return this.querySelectorAll('dropdown-option');
    }

    /**
     * Sets the currently selected option.
     * Updates the class names of the current and the previously active options.
     * Dispatches a change event to notify that the active option has been changed.
    */
    set selected(option) {
        if (this._selected) {
            this.allOptions[this._selected].classList.remove('active');
        }

        option.classList.add('active');
        // get the index of the current option
        this._selected = Array.from(this.allOptions).indexOf(option);
        this.querySelector('.selected').textContent = option.textContent;

        // dispatch a change event
        this.dispatchEvent(new CustomEvent('change', {
            detail: {
                target: option
            }
        }));
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
                this.selected = this.allOptions[this._selected];
                this.attachEventListeners();
            })
            .catch(err => console.error(err));
    }

    /**
     * Selects the next option element.
     * Wraps around if it reaches the end of the list.
    */
    focusNext() {
        const options = this.allOptions;
        let newIdx = this._selected + 1;
        this.selected = options[newIdx % options.length];
    }

    /**
     * Selects the previous option element.
     * Wraps around if it reaches the start of the list.
    */
    focusPrevious() {
        const options = this.allOptions;
        let newIdx = this._selected - 1;
        this.selected = options[(newIdx + options.length) % options.length];
    }

    /**
     * Called on keydown. Used to handle option selection via the keyboard.
     * @param {KeyboardEvent} event - the current event object
    */
    onKeydown(event) {
        switch (event.keyCode) {
            case KEY_CODES.TAB:
            case KEY_CODES.ENTER:
            case KEY_CODES.ESCAPE:
                this.closeOptionsPanel();
                break;
            case KEY_CODES.HOME:
                // focus first
                this.focusElByIdx(0);
                break;
            case KEY_CODES.END:
                // focus last
                this.focusElByIdx(-1);
                break;
            case KEY_CODES.ARROW_UP:
            case KEY_CODES.ARROW_LEFT:
                this.focusPrevious();
                break;
            case KEY_CODES.ARROW_DOWN:
            case KEY_CODES.ARROW_RIGHT:
                this.focusNext();
                break;
        }
        this.scrollToSelectedElement();
    }

    /**
     * Focuses an option element by given index.
     * If the index is equal to -1 - focus the last element.
     * If there is no element with at this index - do nothing.
     * @param {Number} idx - the index of the option element.
    */
    focusElByIdx(idx) {
        const options = this.allOptions;

        if (idx === -1) {
            this.selected = options[options.length - 1];
            return;
        }

        if (!options[idx]) return;

        this.selected = options[idx];
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

        // handle click on the option elements
        const options = this.querySelectorAll('dropdown-option');
        for (let i = 0; i < options.length; i++) {
            options[i].addEventListener('click', (event) => this.onClickOption(event));
        }

        // handle focus...
        // this.addEventListener('focusout', () => {
        //     console.log('focusout');
        //     this.closeOptionsPanel();
        // });

        // this.addEventListener('focusin', () => {
        //     console.log('focusin');
        // });
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
        // get the scrollable container
        const scrollbleContainer = this.querySelector('.scrollable-container');
        // get an option element
        const option = this.querySelector('dropdown-option');
        // get the height of the option element
        const optionSize = option.getBoundingClientRect().height;

        // the scroll position in pixels is equal to the height of the selected
        // option multiplied by its index
        let scrollInPX = this._selected * optionSize;
        scrollbleContainer.scrollTop = scrollInPX;
        scrollbleContainer.dispatchEvent(new CustomEvent('scroll'));
    }
}

components.defineCustomElement('dropdown-option', class DropdownOption extends HTMLElement {});
components.defineCustomElement('gameface-dropdown', GamefaceDropdown);

export default GamefaceDropdown;