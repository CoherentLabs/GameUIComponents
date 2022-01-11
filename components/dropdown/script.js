/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import components from 'coherent-gameface-components';
import ScrollableContainer from 'coherent-gameface-scrollable-container';
import template from './template.html';

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

const CustomElementValidator = components.CustomElementValidator;

class GamefaceDropdown extends CustomElementValidator {
    constructor() {
        super();
        this.multiple = false;
        this.collapsable = false;

        this.selectedOption = null;
        this.isOpened = false;
        // the index of the currently selected option element
        this._lastSelectedIndex = 0;
        // the selectedList is intended to hold the indexes as they are from the allOptions getter.
        this.selectedList = [];
        this._hovered = 0;
        this._pivotIndex = null;
        this.template = template;

        // bound handlers
        this.onDocumentClick = this.onDocumentClick.bind(this);
        this.onClickOption = this.onClickOption.bind(this);
        this.onKeydown = this.onKeydown.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onMouseOverOption = this.onMouseOverOption.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
    }

    get disabled() {
        return this.hasAttribute('disabled');
    }

    set disabled(value) {
        if (value) {
            this.classList.add('gameface-dropdown-disabled');
            this.setAttribute('disabled', '');
            this.setAttribute('tabindex', '-1');
        } else {
            this.classList.remove('gameface-dropdown-disabled');
            this.removeAttribute('disabled');
            this.setAttribute('tabindex', '1');
        }
    }

    /**
     * Returns the text content of the selected dropdown-option.
     * @returns {String}
    */
    get value() {
        if (this.isFormElement() && this.multiple) {
            return this.selectedOptions.map(el => el.value);
        }
        if (this.selected) return this.selected.value || this.selected.textContent;
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
        // reset
        if (option === null && this.selectedList.length > 0) {
            for (let index of this.selectedList) {
                this.allOptions[index].classList.remove('active');
            }
            this.selectedList = [];
            this._lastSelectedIndex = 0;
            this.hoveredElIndex = 0;
            return;
        }
        // if there is a selected option and multiple select is not enabled
        // remove the active class from the currently selected option
        if (this.allOptions[this._lastSelectedIndex] && !this.multiple) {
            this.allOptions[this._lastSelectedIndex].classList.remove('active');
        }
        // get the index of the current option
        const selectedIndex = this.allOptions.indexOf(option);

        if (!this.multiple) {
            components.transferContent(option.cloneNode(true), this.querySelector('.selected'));
            this.selectedList = [];
        }

        if (this.selectedList.indexOf(selectedIndex) > -1) {
            this.selectedList.splice(this.selectedList.indexOf(selectedIndex), 1);
            this._lastSelectedIndex = this.selectedList[this.selectedList.length - 1] || 0;
            option.classList.remove('active');
        } else if (option) {
            option.classList.add('active');
            this.selectedList.push(selectedIndex);
            this._lastSelectedIndex = selectedIndex;

            this.hoveredElIndex = this._pivotIndex = this._lastSelectedIndex;
            this.dispatchChangeEvent(option);
        }
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
        // Fallback to a cached option if options are not available yet.
        return this.allOptions[this._lastSelectedIndex] || components.cachedComponents.dropdowns[this.id].options[this._lastSelectedIndex];
    }

    get selectedOptions() {
        return this.selectedList.map(selected => this.allOptions[selected]);
    }

    valueMissing() {
        return !this.selectedOptions.length;
    }

    connectedCallback() {
        components.loadResource(this)
            .then((result) => {
                this.template = result.template;
                components.renderOnce(this);

                // Check the type after the component has rendered.
                this.multiple = this.hasAttribute('multiple');
                this.collapsable = this.hasAttribute('collapsable');

                // Pull out the cached options if available for this dropdown and append them inside .options element.
                if (components.cachedComponents.dropdowns && Object.keys(components.cachedComponents.dropdowns).indexOf(this.id) > -1) {
                    const optionsElement = this.querySelector('.options');
                    const cachedDropdownOptions = components.cachedComponents.dropdowns[this.id].options;

                    for (let i = 0; i < cachedDropdownOptions.length; i++) {
                        optionsElement.appendChild(cachedDropdownOptions[i]);
                    }
                }

                // make this element focusable
                this.setAttribute('tabindex', '1');
                if (this.multiple && !this.collapsable) {
                    this.querySelector('.dropdown-header').style.display = 'none';
                    components.waitForFrames(() => {
                        this.onClick();
                    }, 6);
                }

                // select the default element
                if (this._lastSelectedIndex > -1 && this.enabledOptions.length > 0) this.selected = this.enabledOptions[this._lastSelectedIndex];
                this.attachEventListeners();

                if (this.disabled) this.disabled = true;
                this.setInitialSelection();
            })
            .catch(err => console.error(err));
    }

    disconnectedCallback() {
        // Cache the dropdown options for adding them back if the component is re-added to the document.
        if (!components.cachedComponents.dropdowns) components.cachedComponents.dropdowns = {};
        const dropdownInstanceCache = components.cachedComponents.dropdowns[this.id] = {};
        dropdownInstanceCache.options = Array.from(this.querySelectorAll('dropdown-option'));
    }

    dispatchChangeEvent(option) {
        this.dispatchEvent(new CustomEvent('change', {
            detail: {
                target: option
            }
        }));
    }

    /**
     * Called on document click.
     * Closes the options panel if it's opened.
     * @param {MouseEvent} event - the current event object.
    */
    onDocumentClick(event) {
        if (event.target === this || isDescendant(this, event.target)) return;

        if (this.isOpened) {
            if (this.multiple && !this.collapsable) return;
            this.closeOptionsPanel();
        }
    }

    /**
     * Focuses an option from the enabledOptions list.
     * Uses the index of the enabled option to find the index of the same option
     * in the full list.
     * @param {number} newIndex - the index of the enabled option.
    */
    focusEnabledOption(newIndex) {
        if (newIndex === -1 || newIndex > this.enabledOptions.length - 1) return;

        // only one option can be selected via keyboard!
        this.selected = null;

        const nextOptionIndex = this.allOptions.indexOf(this.enabledOptions[newIndex]);
        this.focusOption(nextOptionIndex);
    }

    /**
     * Focuses an option by index. Updates the index of the hovered element.
     * @param {number} nextOptionIndex - the index of the option that has to be focused.
    */
    focusOption(nextOptionIndex) {
        // this.allOptions[this.hoveredElIndex].classList.remove('active');

        this.selected = this.allOptions[nextOptionIndex];
        this.hoveredElIndex = nextOptionIndex;
    }

    selectSiblingOption(nextOptionIndex, option, isPrevSelection) {
        if (!option) return;

        const existsInSelectedList = this.selectedList.indexOf(nextOptionIndex);

        if (existsInSelectedList === -1) {
            option.classList.add('active');
            this.selectedList.push(nextOptionIndex);
        } else if (existsInSelectedList > -1) {
            const optionIndexForSplice = (isPrevSelection) ? nextOptionIndex + 1 : nextOptionIndex - 1;
            this.allOptions[this.selectedList[this.selectedList.length - 1]].classList.remove('active');
            this.selectedList.splice(this.selectedList.indexOf(this.allOptions.indexOf(optionIndexForSplice)), 2);
        }

        this._lastSelectedIndex = nextOptionIndex;
        this.dispatchChangeEvent(option);
    }

    selectOptionSiblingMode(newIndex, isPrevSelection = false) {
        const nextOptionIndex = this.allOptions.indexOf(this.enabledOptions[newIndex]);
        this.selectSiblingOption(nextOptionIndex, this.allOptions[nextOptionIndex], isPrevSelection);
    }

    selectOptionBoundaryMode(isLastEntryDirection = false) {
        this.selectedList = [];

        const targetOptionIndex = (isLastEntryDirection) ? this.enabledOptions[this.enabledOptions.length - 1] : 0;

        let currentSelectionIndex = this.enabledOptions.indexOf(this.allOptions[this._pivotIndex]);

        this.enabledOptions.forEach((el) => el.classList.remove('active'));

        for (let i = 0; i < this.enabledOptions.length; i++) {
            if (currentSelectionIndex > this.enabledOptions.length - 1 || currentSelectionIndex < 0) break;

            const currentOption = this.enabledOptions[currentSelectionIndex];
            currentOption.classList.add('active');
            this.selectedList.push(this.allOptions.indexOf(currentOption));

            (isLastEntryDirection) ? currentSelectionIndex++ : currentSelectionIndex--;
        }

        // In both directions, the last element is going the correct index of the
        // element from allOptions because of the order they get pushed in this.selectedList.
        this._lastSelectedIndex = this.selectedList[this.selectedList.length - 1];

        this.dispatchChangeEvent(this.enabledOptions[targetOptionIndex]);
    }

    /**
     * Returns the index of the next option element.
     * @param {Number} currentOptionIndex - the index of the currently active option
     * @returns {Number} - the index of the next enabled option
    */
    getNextOptionIndex(currentOptionIndex) {
        return currentOptionIndex + 1;
    }

    /**
     * Returns the index of the previous option element.
     * @param {Number} currentOptionIndex - the index of the currently active option
     * @returns {Number} - the index of the previous enabled option
    */
    getPreviousOptionIndex(currentOptionIndex) {
        return currentOptionIndex - 1;
    }

    selectAll() {
        this.selectedList = [];

        for (const option of this.enabledOptions) {
            const index = this.allOptions.indexOf(option);
            this.allOptions[index].classList.add('active');
            this.selectedList.push(index);
        }

        this._lastSelectedIndex = this.selectedList[this.selectedList.length - 1];
    }

    setInitialSelection() {
        for (const option of this.allOptions) {
            if (!option.hasAttribute('selected')) continue;
            this.selected = option;
        }
    }

    /**
     * Called on keydown. Used to handle option selection via the keyboard.
     * @param {KeyboardEvent} event - the current event object
    */
    onKeydown(event) {
        const keyCode = event.keyCode;
        const shiftKey = event.shiftKey;

        let currentOptionIndex = this.enabledOptions.indexOf(this.allOptions[this._lastSelectedIndex]);

        // If the select is multiple, the keyboard navigation should start from the element that was selected last
        if (this.multiple && this.selectedList.length > 1) {
            const lastSelectedOptionIndex = this.selectedList[this.selectedList.length - 1];
            currentOptionIndex = this.enabledOptions.indexOf(this.allOptions[lastSelectedOptionIndex]);
        }

        if (shiftKey && this.multiple) {
            if (this._pivotIndex === null) this._pivotIndex = this.selectedList[this.selectedList.length - 1];

            switch (keyCode) {
                case KEYCODES.DOWN:
                case KEYCODES.RIGHT:
                    this.selectOptionSiblingMode(this.getNextOptionIndex(currentOptionIndex), false);
                    this.scrollToSelectedElement();
                    break;
                case KEYCODES.UP:
                case KEYCODES.LEFT:
                    this.selectOptionSiblingMode(this.getPreviousOptionIndex(currentOptionIndex), true);
                    this.scrollToSelectedElement();
                    break;
                case KEYCODES.HOME:
                  this.selectOptionBoundaryMode(false);
                    break;
                case KEYCODES.END:
                    this.selectOptionBoundaryMode(true);
                    break;
            }
        }

        if (event.ctrlKey && keyCode === 65 && this.multiple) {
            event.preventDefault();
            this.selectAll();
        }

        if (!event.ctrlKey && !shiftKey && !event.altKey) {
            switch (event.keyCode) {
                case KEYCODES.ENTER:
                    if (this.multiple) return;
                    this.focusOption(this.hoveredElIndex);
                    this.closeOptionsPanel();
                    return;
                case KEYCODES.TAB:
                case KEYCODES.ESCAPE:
                    if (this.multiple) return;
                    this.closeOptionsPanel();
                    return;
                case KEYCODES.HOME:
                case KEYCODES.PAGE_UP:
                    // focus first
                    this.focusEnabledOption(0);
                    this.scrollToSelectedElement();
                    break;
                case KEYCODES.END:
                case KEYCODES.PAGE_DOWN:
                    // focus last
                    this.focusEnabledOption(this.enabledOptions.length - 1);
                    this.scrollToSelectedElement();
                    break;
                case KEYCODES.UP:
                case KEYCODES.LEFT:
                    this.focusEnabledOption(this.getPreviousOptionIndex(currentOptionIndex));
                    this.scrollToSelectedElement();
                    break;
                case KEYCODES.DOWN:
                case KEYCODES.RIGHT:
                    this.focusEnabledOption(this.getNextOptionIndex(currentOptionIndex));
                    this.scrollToSelectedElement();
                    break;
            }
        }
    }

    /**
     * Checks if the current user agent is Cohtml
    */
    isGameface() {
        return navigator.userAgent.match('Cohtml');
    }

    /**
     * Called on click on the select element.
     * Toggles the options panel, shows the scrollbar and scrolls to
     * the selected option element.
    */
    onClick() {
        if (this.disabled) return;

        const scrollableContainer = this.querySelector('gameface-scrollable-container');

        if (this.isOpened) {
            this.closeOptionsPanel();
            return;
        }

        this.openOptionsPanel();

        if (!this.isGameface()) {
            scrollableContainer.querySelector('.scrollable-container').classList.add('full-width');
        } else if (this.isGameface()) {
            scrollableContainer.shouldShowScrollbar();
        }

        this.scrollToSelectedElement();
    }

    /**
     * Attaches event listeners.
    */
    attachEventListeners() {
        // handle keyboard
        this.addEventListener('keydown', this.onKeydown);

        // handle click on the select element
        const selectedElementPlaceholder = this.querySelector('.selected');
        selectedElementPlaceholder.addEventListener('click', this.onClick);

        // handle click on the option elements
        const options = this.querySelectorAll('dropdown-option');
        for (let i = 0; i < options.length; i++) {
            options[i].addEventListener('selected-option', this.onClickOption);
            options[i].addEventListener('mouseenter', this.onMouseOverOption);
            options[i].addEventListener('mouseleave', this.onMouseLeave);
        }
    }

    onMouseLeave(event) {
        const index = this.allOptions.indexOf(event.target);
        if (this.multiple && this.selectedList.indexOf(index) > -1) return;
        event.target.classList.remove('active');
    }

    /**
     * Called on mouseover an option element.
     * @param {MouseEvent} event - the current event object.
    */
    onMouseOverOption(event) {
        const options = this.allOptions;
        const index = options.indexOf(event.target);

        if (this.multiple) {
            event.target.classList.add('active');
        } else {
            this.selected.classList.remove('active');
            event.target.classList.add('active');
        }

        this.hoveredElIndex = index;
    }

    /**
     * Called when an option element is clicked.
     * Updates the selected member and closes the options panel.
     * @param {MouseEvent} event - the current event object.
    */
    onClickOption(event) {
        // handle multiple
        if (this.multiple) {
            // reset the selectedList if only one option is selected
            if (!event.detail.ctrlKey) this.selected = null;
            this.selected = event.target;
            this.focus();
            return;
        }

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
        document.removeEventListener('click', this.onDocumentClick);
    }

    /**
     * Shows the options panel.
     * Adds the active class to the currently selected option.
     * Focuses the dropdown element.
    */
    openOptionsPanel() {
        if (this._lastSelectedIndex > -1) this.selected.classList.add('active');
        const optionsPanel = this.querySelector('.options-container');
        this.isOpened = true;
        optionsPanel.classList.remove('hidden');
        this.focus();
        document.addEventListener('click', this.onDocumentClick);
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
        const scrollbleContainer = this.querySelector('.scrollable-container');
        const option = this.querySelector('dropdown-option') || components.cachedComponents.dropdowns[this.id].options[this._lastSelectedIndex];
        const optionSize = option.getBoundingClientRect().height;

        // the scroll position in pixels is equal to the height of the selected
        // option multiplied by its index
        clearTimeout(this.timeout);
        document.body.classList.add('disable-hover');

        let scrollInPX = this._lastSelectedIndex * optionSize;
        scrollbleContainer.scrollTop = scrollInPX;
        scrollbleContainer.dispatchEvent(new CustomEvent('scroll'));

        this.timeout = setTimeout(() => {
            document.body.classList.remove('disable-hover');
        }, 500);
    }
}

class DropdownOption extends HTMLElement {
    static get observedAttributes() {
        return ['disabled'];
    }

    get value() {
        return this.getAttribute('value') || this.textContent;
    }

    /**
     * Called when an attribute changes
    */
    attributeChangedCallback() {
        if (this.hasAttribute('disabled')) {
            this.classList.add('disabled');
            this.removeEventListener('click', this.onClick);
        } else {
            this.classList.remove('disabled');
            this.addEventListener('click', this.onClick);
        }
    }

    constructor() {
        super();
        this.attributeChangedCallback();
    }

    onClick(event) {
        event.target.dispatchEvent(new CustomEvent('selected-option', { detail: { ctrlKey: event.ctrlKey } }));
    }
}

components.defineCustomElement('dropdown-option', DropdownOption);
components.defineCustomElement('gameface-dropdown', GamefaceDropdown);

export default GamefaceDropdown;
