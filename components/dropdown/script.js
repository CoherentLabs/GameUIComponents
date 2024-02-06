/* eslint-disable linebreak-style */
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Components } from 'coherent-gameface-components';
const components = new Components();
import 'coherent-gameface-scrollable-container';
import template from './template.html';

const KEYCODES = components.KEYCODES;

/**
 * Used to get the option element from an event target.
 * @param {event} event
 * @returns {HTMLElement | undefined}
 */
function getOptionElFromTarget(event) {
    const target = event.target;

    if (target === event.currentTarget) return;
    if (target.tagName.toLowerCase() === 'dropdown-option') return target;

    return target.closest('dropdown-option');
}

/**
 * A factory that wraps an option event handler.
 * @param {function} callback - the function that will be wrapped.
 * @returns {function} - the wrapped function.
 */
function createOptionEventHandler(callback) {
    return (event) => {
        const option = getOptionElFromTarget(event);
        if (!option) return;

        callback(option, event);
    };
}

const CustomElementValidator = components.CustomElementValidator;

/**
 * Class definition of the gameface dropdown custom element
 */
class GamefaceDropdown extends CustomElementValidator {
    // eslint-disable-next-line require-jsdoc
    constructor() {
        super();
        this._multiple = false;
        this._collapsable = false;

        this.selectedOption = null;
        this.isOpened = false;
        // the index of the currently selected option element
        // the selectedList is intended to hold the indexes as they are from the allOptions getter.
        this.selectedList = [];
        this._hovered = 0;
        this._pivotIndex = null;
        this.template = template;

        // save the built in array method so that we can use it for HTMLCollections
        // without creating a new array each time
        this.builtInIndexOf = [].indexOf;

        // bound handlers
        this.onDocumentClick = this.onDocumentClick.bind(this);
        this.onClickOption = createOptionEventHandler(this.onClickOption.bind(this));
        this.onKeydown = this.onKeydown.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onMouseOverOption = createOptionEventHandler(this.onMouseOverOption.bind(this));
        this.onMouseOut = createOptionEventHandler(this.onMouseOut.bind(this));
        this.init = this.init.bind(this);

        this.emptyPlaceholderOption = this.createOption('');
        this.isPlaceholderSelected = false;
    }

    /** Returns if the dropdown is collapsable */
    get collapsable() { return this._collapsable; }

    /**
     * Will change the dropdown collapsable state
     * @param {boolean} value
     */
    set collapsable(value) {
        value ? this.setAttribute('collapsable', '') : this.removeAttribute('collapsable');
    }

    /** Returns if the dropdown is multiple */
    get multiple() { return this._multiple; }

    /**
     * Will change the dropdown multiple state
     * @param {boolean} value
     */
    set multiple(value) {
        value ? this.setAttribute('multiple', '') : this.removeAttribute('multiple');
    }

    /**
     * Returns the text content of the selected dropdown-option.
     * @returns {String}
    */
    get value() {
        if (this.isFormElement() && this.multiple) return this.selectedOptions.map(el => el.value);
        if (this.selected) return this.selected.value;

        return '';
    }

    /**
     * Returns the text content of the selected dropdown-option.
     * @param {string} value
    */
    set value(value) {
        const trimmedValue = value.trim();

        const option = Array.from(this.allOptions).find(option => option.value === trimmedValue);

        if (!option && trimmedValue === '') {
            this.updateSelectHeader(this.emptyPlaceholderOption);
            this.resetSelection();
            this.isPlaceholderSelected = true;
        } else if (option) {
            this.resetSelection();
            this.setSelectedAndScroll(option, this.isOpened);
        } else {
            console.warn(`There is no '${trimmedValue}' as an option to the dropdown. Will not set the new value`);
        }
    }

    /**
     * Returns all dropdown-option elements' indexes that don't have attribute disabled.
     * @returns {Array<number>}
    */
    get enabledOptions() {
        const enabled = [];
        const allOptions = this.allOptions;

        for (let i = 0; i < this.allOptions.length; i++) {
            const option = allOptions[i];
            if (!option.hasAttribute('disabled')) enabled.push(i);
        }

        return enabled;
    }

    /**
     * Returns only the selected options from the allOptions array.
     * @returns {Array<HTMLElement>}
    */
    get selectedOptions() {
        return this.selectedList.map(selected => this.allOptions[selected]);
    }

    /**
     * Returns the length of the selected options.
     * @returns {number}
    */
    get selectedLength() {
        return this.selectedList.length;
    }

    /**
     * Returns the index of the last selected option
     * @returns {number}
    */
    get lastSelectedIndex() {
        return this.selectedLength ? this.selectedList[this.selectedLength - 1] : 0;
    }

    /**
     * Returns the element from which a selection sequence has began.
     * @returns {HTMLElement}
    */
    get pivotElement() {
        return this.allOptions[this._pivotIndex] || this.allOptions[0];
    }

    /**
     * Returns a boolean value that indicates if the dropdown is disabled.
     * @returns {boolean}
    */
    get disabled() {
        return this.hasAttribute('disabled');
    }

    /**
     * Sets the disabled attribute of the dropdown.
     * Also adds/removes the tabindex attribute to include/exclude the element from the focusable elements.
     * @param {boolean} value - make disabled if true, make enabled if false.
    */
    set disabled(value) {
        if (value) {
            this.classList.add('guic-dropdown-disabled');
            this.setAttribute('disabled', '');
            this.setAttribute('tabindex', '-1');
        } else {
            this.classList.remove('guic-dropdown-disabled');
            this.removeAttribute('disabled');
            this.setAttribute('tabindex', '1');
        }
    }

    /**
     * Returns the currently selected option element.
     * @returns {HTMLElement}
    */
    get selected() {
        if (this.isPlaceholderSelected) return this.emptyPlaceholderOption;
        const allOptions = this.allOptions;
        return allOptions[this.lastSelectedIndex] || allOptions[0];
    }

    /**
     * Sets the currently selected option.
     * Updates the select header if the select is single.
     * Dispatches a change event to notify that the active option has been changed.
     * @param {HTMLElement} option
    */
    set selected(option) {
        this.setSelection(option);
    }

    /**
     * Create an option element
     * @param {string} value - the string value of the option
     * @returns {HTMLElement}
     */
    createOption(value) {
        const option = document.createElement('gameface-option');
        option.value = value;
        return option;
    }

    /**
     * Set the selection of the Dropdown
     * @param {HTMLElement} option - the current option that needs to be selected
     * @returns {void}
     */
    setSelection(option) {
        // reset
        // eslint-disable-next-line no-setter-return
        if (option === null) return this.resetSelection();

        if (!this.multiple) {
            this.resetSelection();
            this.updateSelectHeader(option);
        }

        this.select(option);
        this.dispatchChangeEvent(option);
    }

    /**
    * Returns the currently hovered element's index.
    * @returns {Number}
    */
    get hoveredElIndex() {
        return this._hovered;
    }

    /**
     * Sets the currently hovered element's index.
     * @param {Number} value
    */
    set hoveredElIndex(value) {
        if (!this.allOptions[value]) return;
        this._hovered = value;
    }

    /**
     * Call the built in Array.prototype.indexOf method.
     * This function allows the user to use the indexOf
     * function without needing to use .call.
     *
     * @argument {any} args
     * @returns {number}
    */
    indexOf(...args) {
        return this.builtInIndexOf.call(...args);
    }

    /**
     * Checks if an element is selected by index.
     * @param {number} index - the index of the element.
     * @returns {boolean}
    */
    isSelected(index) {
        if (typeof index === 'number') return this.selectedList.indexOf(index) > -1;
        console.warn(`Using Dropdown.isSelected with an unsupported argument type - make sure you passed an index of type number.`);
        return false;
    }

    /**
     * Validation method. Checks if there is a selected element by
     *  checking the length of the selectedOptions.
     * @returns {boolean} - true if the array is empty and false if not.
    */
    valueMissing() {
        return !this.selectedOptions.length;
    }

    /**
     * Get all options of the selected list and:
     * 1. remove their active class
     * 2. remove their selected attribute
     * 3. reset the values of the selectedList and the hoveredElIndex.
    */
    resetSelection() {
        this.isPlaceholderSelected = false;

        for (const index of this.selectedList) {
            const option = this.allOptions[index];
            this.removeActiveClass(option);
            option.removeAttribute('selected');
        }

        this.selectedList = [];
        this.hoveredElIndex = 0;
    }

    /**
     * Update the header of the select. Clone the content of the selected option
     * to the content of the header. If the option is falsy - do nothing.
     * @param {HTMLElement} option
    */
    updateSelectHeader(option) {
        // check if cloneNode exists in case the user has set the selected
        // to something that is not an HTMLElement instance
        if (!option || !option.cloneNode) return;
        components.transferContent(option.cloneNode(true), this.querySelector('.guic-dropdown-selected-option'));
    }

    /**
     * Select an option.
     * Add the active class and the selected attribute.
     * Add the option's index to the selectedList array.
     * @param {HTMLElement} option - the option that has to be selected.
     */
    select(option) {
        const index = this.indexOf(this.allOptions, option);
        if (!option || this.isSelected(index)) return;

        this.addActiveClass(option);
        this.selectedList.push(index);
    }

    /**
     * Deselect an option.
     * @param {HTMLElement} option - the option that has to be deselected.
     * Remove the active class and the selected attribute.
     * Remove the option's index from the selectedList array.
    */
    deselect(option) {
        const index = this.indexOf(this.allOptions, option);
        this.removeActiveClass(option);
        this.selectedList.splice(this.selectedList.indexOf(index), 1);
    }

    /**
     * Select the options that have the selected attribute.
     * This is executed when the dropdown is connected to the DOM.
     * @returns {void}
    */
    preselectOptions() {
        if (this.multiple) return this.setInitialMultipleSelection();
        this.setInitialSingleSelection();
    }

    /**
     * Select all options that have the selected attribute
    */
    setInitialMultipleSelection() {
        for (const option of this.allOptions) {
            if (!option.hasAttribute('selected')) continue;
            this.setSelectedAndScroll(option);
        }
    }

    /**
     * Select the last found option that has the selected attribute.
     * If none is found - selects the first element from the options list
    */
    setInitialSingleSelection() {
        const allSelected = this.querySelectorAll('[selected]');
        const selectedLength = allSelected.length;
        // use the last option that has the selected attribute or the first element in the options list
        const selectedDefault = selectedLength ? allSelected[selectedLength - 1] : this.selected;
        this.setSelectedAndScroll(selectedDefault);
    }

    /**
     * Setup the collapsable dropdown.
     * Show the header element.
     * @param {boolean} visible
    */
    toggleHeader(visible = true) {
        this.querySelector('.guic-dropdown-header').style.display = visible ? 'flex' : 'none';
    }

    /**
     * Remove the collapsable dropdown.
     * Hide the header element.
    */
    removeCollapsable() {
        if (!this.isOpened) {
            this.initScrollbar();
            this.openOptionsPanel();
        }
        this.toggleHeader(false);
    }

    /**
     * Setup the multiple dropdown.
     * Hide the header element.
     * Expand the options list by calling the click callback after 6 frames
     * because of the cohtml style resolver and the scrollable container initialization.
    */
    setupMultiple() {
        this.toggleHeader(false);
        components.waitForFrames(() => this.onClick(), 6);
    }

    /**
     * Stop "multiple" behavior
     */
    removeMultiple() {
        this.toggleHeader();
        // use the first element that is selected by the multiple selection
        this.setSelection(this.allOptions[this.selectedList[0]]);
        this.closeOptionsPanel();
    }

    /**
     * Initialize the custom component.
     * Set template, attach event listeners, setup initial state etc.
     * @param {object} data
    */
    init(data) {
        this.setupTemplate(data, () => {
            components.transferChildren(this, '.guic-dropdown-options', this.querySelectorAll('dropdown-option'));

            // Check the type after the component has rendered.
            this._multiple = this.hasAttribute('multiple');
            this._collapsable = this.hasAttribute('collapsable');
            // make this element focusable
            this.setAttribute('tabindex', '1');

            if (this.multiple && !this.collapsable) this.setupMultiple();
            if (this.disabled) this.disabled = true;

            // comment this out until we fix the bug with the broken live collections
            // this.allOptions = this.querySelector('.guic-dropdown-options').children;

            this.preselectOptions();
            this.attachEventListeners();
            this.isRendered = true;
        });
    }

    /**
     * Get an array of observed attributes
     * @returns {Array<string>}
     */
    static get observedAttributes() { return ['disabled', 'multiple', 'collapsable']; }

    /**
     * Custom element lifecycle method. Called when an attribute is changed.
     * @param {string} name
     * @param {string} oldValue
     * @param {string|boolean} newValue
     * @returns {void}
     */
    attributeChangedCallback(name, oldValue, newValue) {
        if (!this.isRendered) return;

        if (name === 'disabled') {
            const disabled = newValue !== null;

            if (disabled) {
                this.classList.add('guic-dropdown-disabled');
                this.setAttribute('tabindex', '-1');
            } else {
                this.classList.remove('guic-dropdown-disabled');
                this.setAttribute('tabindex', '1');
            }
        } else if (name === 'multiple') {
            const multiple = newValue !== null;
            this._multiple = multiple;
            if (multiple && !this.collapsable) this.setupMultiple();
            if (!multiple) this.removeMultiple();
        } else if (name === 'collapsable') {
            const collapsable = newValue !== null;
            this._collapsable = collapsable;
            if (collapsable) return this.toggleHeader();
            this.removeCollapsable();
        }
    }

    // eslint-disable-next-line require-jsdoc
    connectedCallback() {
        components.loadResource(this)
            .then(this.init)
            .catch(err => console.error(err));
    }

    /**
     * A temporary getter for the dropdown's children - until we fix the
     * live HTMLCollections.
    */
    get allOptions() {
        return this.querySelector('.guic-dropdown-options').children;
    }

    /**
     * Called whenever the element is removed from the DOM.
     */
    disconnectedCallback() {
        this.removeEventListeners();
        this.isRendered = false;
    }

    /**
     * Dispatch a custom event to notify listeners for selection change.
     * @param {HTMLElement} option - the newly selected option.
    */
    dispatchChangeEvent(option) {
        this.dispatchEvent(new CustomEvent('change', {
            detail: { target: option },
        }));
    }

    /**
     * Called on document click.
     * Closes the options panel if it's opened.
     * @param {MouseEvent} event - the current event object.
    */
    onDocumentClick(event) {
        if (this.contains(event.target)) return;
        if (this.multiple && !this.collapsable) return;
        this.closeOptionsPanel();
    }

    /**
     * Focuses an option by index. Updates the index of the hovered element.
     * @param {number} nextOptionIndex - the index of the option that has to be focused.
    */
    focusOption(nextOptionIndex) {
        this.setSelectedAndScroll(this.allOptions[nextOptionIndex], true);
        this.hoveredElIndex = nextOptionIndex;
    }

    /**
     * Check if a number is out of a given range.
     * @param {number} current - the current value of the number.
     * @param {number} limit - the limit that current must not exceed.
     * @param {number} direction - the direction specifies on which side of the limit the current must be.
     * @returns {boolean} - true if it is in range, false if it is not.
     */
    isOutOfRange(current, limit, direction) {
        return direction === 1 ? current > limit : current < limit;
    }

    /**
     * Select all enabled options from a given range defined by start and end indexes.
     * @param {number} start - the low limit of the range.
     * @param {number} end - the higher limit of the range.
     * @param {number} direction - the direction of the selection.
     * @param {boolean} reset - whether to reset the current selection or not:
     * @param {boolean} scroll - whether to scroll to the selected element or not; useful if
     * selecting using the keyboard, but disruptive if using the mouse
     * In a single selection we must reset the selected list, but in multiple we must not.
     */
    selectFromTo(start, end, direction = 1, reset = true, scroll = true) {
        const enabledOptions = this.enabledOptions;
        const allOptions = this.allOptions;

        if (!enabledOptions.length) return;
        if (reset) this.resetSelection();

        // loop all enabled indexes and select the corresponding
        // options from the full list
        do {
            this.selected = allOptions[enabledOptions[start]];
            start += direction;
        } while (!this.isOutOfRange(start, end, direction));

        if (scroll) this.scrollToSelectedElement();
    }

    /**
     * Select all options.
     * Used for keyboard selection when holding Ctrl + A.
     */
    selectAll() {
        this.selected = null;
        const allOptions = this.allOptions;

        this.enabledOptions.forEach(index => this.selected = allOptions[index]);
    }

    /**
     * Toggles the selection of an element by given index.
     * If the element is selected - deselect it.
     * @param {number} currentOptionIndex - the index of the currently selected option.
     * @param {number} direction - the direction in which the selection is going.
     * @param {number[]} enabledOptions
     */
    toggleSelection(currentOptionIndex, direction, enabledOptions) {
        const nextOptionIndex = currentOptionIndex + direction; // next enabled index
        const nextFullListIndex = enabledOptions[nextOptionIndex]; // corresponding index in the allOptions list

        if (this.isSelected(nextFullListIndex)) {
            const indexToBeRemoved = enabledOptions[currentOptionIndex];
            this.deselect(this.allOptions[indexToBeRemoved]);
        } else {
            this.selectFromTo(currentOptionIndex, nextOptionIndex, direction, 0);
        }

        this.scrollToSelectedElement();
    }

    /**
     * Handles the focus of the dropdown options
     * when the keyboard is used to navigate through the options.
     * @param {number} keyCode - the code of the current key that is being pressed.
    */
    handleKeyboardFocus(keyCode) {
        if (this.multiple) return;

        switch (keyCode) {
            case KEYCODES.ENTER:
                this.focusOption(this.hoveredElIndex);
                this.closeOptionsPanel();
                return;
            case KEYCODES.TAB:
            case KEYCODES.ESCAPE:
                this.closeOptionsPanel();
                return;
        }
    }

    /**
     * Handles the multiple selection of the dropdown options when the keyboard is used.
     * @param {number} keyCode - the code of the current key that is being pressed.
     * @param {Array<number>} enabledOptions - the list of the indexes of the enabled options.
     * @param {number} currentOptionIndex - the index of the currently selected option.
    */
    handleMultipleKeyboardSelection(keyCode, enabledOptions, currentOptionIndex) {
        switch (keyCode) {
            case KEYCODES.DOWN:
            case KEYCODES.RIGHT:
                this.toggleSelection(currentOptionIndex, 1, enabledOptions);
                break;
            case KEYCODES.UP:
            case KEYCODES.LEFT:
                this.toggleSelection(currentOptionIndex, -1, enabledOptions);
                break;
            case KEYCODES.HOME:
                this.selectFromTo(enabledOptions.indexOf(this._pivotIndex), 0, -1);
                break;
            case KEYCODES.END:
                this.selectFromTo(enabledOptions.indexOf(this._pivotIndex), this.allOptions.length - 1, 1);
                break;
        }
    }

    /**
     * Handles the single selection of the dropdown options when the keyboard is used.
     * @param {number} keyCode - the code of the current key that is being pressed.
     * @param {Array<number>} enabledOptions - the list of the indexes of the enabled options.
     * @param {number} currentOptionIndex - the index of the currently selected option.
    */
    handleSingleKeyboardSelection(keyCode, enabledOptions, currentOptionIndex) {
        let nextElement = currentOptionIndex;

        switch (keyCode) {
            case KEYCODES.HOME:
            case KEYCODES.PAGE_UP:
                // focus first
                nextElement = 0;
                break;
            case KEYCODES.END:
            case KEYCODES.PAGE_DOWN:
                // focus last
                nextElement = enabledOptions.length - 1;
                break;
            case KEYCODES.UP:
            case KEYCODES.LEFT:
                nextElement = currentOptionIndex - 1;
                if (this.isOutOfRange(nextElement, 0, -1)) return;
                break;
            case KEYCODES.DOWN:
            case KEYCODES.RIGHT:
                nextElement = currentOptionIndex + 1;
                if (this.isOutOfRange(nextElement, enabledOptions.length - 1, 1)) return;
                break;
        }

        this.resetSelection();
        this.setSelectedAndScroll(this.allOptions[enabledOptions[nextElement]], true);
    }

    /**
     * Called on keydown. Used to handle option selection via the keyboard.
     * @param {KeyboardEvent} event - the current event object
    */
    onKeydown(event) {
        const keyCode = event.keyCode;
        const ctrlKey = event.ctrlKey;
        const shiftKey = event.shiftKey;
        const enabledOptions = this.enabledOptions;
        const currentOptionIndex = enabledOptions.indexOf(this.lastSelectedIndex);

        if (shiftKey && this.multiple) {
            // pivotIndex is the LAST selected - last clicked or selected via key
            if (this._pivotIndex === null) this._pivotIndex = this.selectedList[this.selectedLength - 1];
            this.handleMultipleKeyboardSelection(keyCode, enabledOptions, currentOptionIndex);
        }

        if (ctrlKey && keyCode === KEYCODES.LETTER_A && this.multiple) {
            event.preventDefault();
            this.selectAll();
        }

        if (!ctrlKey && !shiftKey && !event.altKey) {
            this.handleKeyboardFocus(keyCode);
            this.handleSingleKeyboardSelection(keyCode, enabledOptions, currentOptionIndex);
        }
    }

    /**
     * Called on click on the select element.
     * Toggles the options panel, shows the scrollbar and scrolls to
     * the selected option element.
     * @param {Event} event
     * @returns {void}
    */
    onClick(event) {
        if (event) event.stopPropagation();
        if (this.disabled) return;
        if (this.isOpened) return this.closeOptionsPanel();

        this.initScrollbar();
        this.openOptionsPanel();
        this.scrollToSelectedElement();
    }

    /**
     * Method for initializing the scrollbar
     * @returns {void}
     */
    initScrollbar() {
        const scrollableContainer = this.querySelector('gameface-scrollable-container');

        if (!components.isBrowserGameface()) return scrollableContainer.querySelector('.guic-scrollable-container').classList.add('full-width');
        scrollableContainer.shouldShowScrollbar();
    }

    /**
     * Attaches event listeners.
    */
    attachEventListeners() {
        this.addEventListener('keydown', this.onKeydown);
        this.querySelector('.guic-dropdown-selected-option').addEventListener('click', this.onClick);
        this.toggleOptionsListeners('addEventListener');
    }

    /**
     * Removes event listeners.
    */
    removeEventListeners() {
        this.removeEventListener('keydown', this.onKeydown);
        this.querySelector('.guic-dropdown-selected-option').removeEventListener('click', this.onClick);
        this.toggleOptionsListeners('removeEventListener');
    }

    /**
     * Loop all options and add or remove event listeners.
     * @param {string} methodName - the name of the method that should be
     * executed on the option - addEventListener or removeEventListener.
    */
    toggleOptionsListeners(methodName) {
        const optionsContainer = this.querySelector('.guic-dropdown-options');

        optionsContainer[methodName]('click', this.onClickOption);
        optionsContainer[methodName]('mouseover', this.onMouseOverOption);
        optionsContainer[methodName]('mouseout', this.onMouseOut);
    }

    /**
     * Handler for mouse leave
     * @param {HTMLElement} option
     * @returns {void}
     */
    onMouseOut(option) {
        const index = this.indexOf(this.allOptions, option);
        if (this.multiple && this.selectedList.indexOf(index) > -1) return;
    }

    /**
     * Adding active class
     * @param {HTMLElement} element
     */
    addActiveClass(element) {
        element.classList.add('guic-dropdown-option-active');
    }

    /**
     * Removing active class
     * @param {HTMLElement} element
     */
    removeActiveClass(element) {
        element.classList.remove('guic-dropdown-option-active');
    }

    /**
     * Called on mouseover an option element.
     * @param {HTMLElement} option
    */
    onMouseOverOption(option) {
        const options = this.allOptions;
        if (!this.multiple) this.removeActiveClass(this.selected);

        if (!(this.multiple && option.isAlreadySelected(this, options[this.hoveredElIndex]))) {
            this.removeActiveClass(options[this.hoveredElIndex]);
        }
        this.addActiveClass(option);
        this.hoveredElIndex = this.indexOf(options, option);
    }

    /**
     * Called when the option of a multiple select is clicked.
     * Selects the target if it is unselected and deselects it if it is selected.
     * @param {HTMLElement} option - the option element.
     * @param {Event} event - the event object.
     * @returns {void}
    */
    onClickMultipleOptions(option, event) {
        // reset the selectedList if only one option is selected
        if (!event.ctrlKey) this.selected = null;
        if (option.isAlreadySelected(this, option)) return this.deselect(option);

        if (event.shiftKey) {
            const fromIdx = this.enabledOptions.indexOf(this._pivotIndex);
            const toIdx = this.enabledOptions.indexOf(Array.from(this.allOptions).indexOf(option));
            const direction = (fromIdx - toIdx) > 0 ? -1 : 1;
            this.selectFromTo(fromIdx, toIdx, direction, true, false);
        }

        this.setSelectedAndScroll(option, false);
        this.focus();
    }

    /**
     * Called on click of an option of a single select.
     * Selects the target and closes the options list.
     * @param {HTMLElement} option
    */
    onClickSingleOption(option) {
        this.setSelectedAndScroll(option);
        this.closeOptionsPanel();
    }

    /**
     * Called when an option element is clicked.
     * Updates the selected member and closes the options panel.
     * @param {HTMLElement} option - the option that was clicked.
     * @param {MouseEvent} event - the current event object.
     * @returns {void}
    */
    onClickOption(option, event) {
        event.stopPropagation();
        // handle multiple
        if (this.multiple) return this.onClickMultipleOptions(option, event);
        this.onClickSingleOption(option);
    }

    /**
     * Hides the options panel.
    */
    closeOptionsPanel() {
        const optionsPanel = this.querySelector('.guic-dropdown-options-container');
        this.isOpened = false;
        optionsPanel.classList.add('guic-dropdown-hidden');
        document.removeEventListener('click', this.onDocumentClick);
        this.toggleOptionsListeners('removeEventListener');
    }

    /**
     * Shows the options panel.
     * Adds the active class to the currently selected option.
     * Focuses the dropdown element.
    */
    openOptionsPanel() {
        const optionsPanel = this.querySelector('.guic-dropdown-options-container');
        this.isOpened = true;
        optionsPanel.classList.remove('guic-dropdown-hidden');
        this.focus();
        this.toggleOptionsListeners('addEventListener');
        document.addEventListener('click', this.onDocumentClick);
    }

    /**
     * Sets the selected element of the dropdown and scrolls to it.
     * @param {DropdownOption} element - the option element.
     * @param {boolean} [scroll=false]
    */
    setSelectedAndScroll(element, scroll = false) {
        this.setSelection(element);
        this._pivotIndex = this.lastSelectedIndex;
        this.hoveredElIndex = this.lastSelectedIndex;

        if (scroll) this.scrollToSelectedElement();
    }

    /**
     * Scrolls to the selected option element.
    */
    scrollToSelectedElement() {
        const scrollableContainer = this.querySelector('.guic-scrollable-container');
        const option = this.querySelector('dropdown-option');
        if (!option) return;
        const optionSize = option.getBoundingClientRect().height;

        // the scroll position in pixels is equal to the height of the selected
        // option multiplied by its index

        const scrollInPX = this.lastSelectedIndex * optionSize;
        scrollableContainer.scrollTop = scrollInPX;
        scrollableContainer.dispatchEvent(new CustomEvent('scroll'));
    }
}

/**
 * Class definition of the gameface dropdown option custom element
 */
class DropdownOption extends HTMLElement {
    // eslint-disable-next-line require-jsdoc
    static get observedAttributes() {
        return ['disabled', 'selected', 'value'];
    }

    // eslint-disable-next-line require-jsdoc
    get selected() {
        return this.isAlreadySelected(this.closest('gameface-dropdown'), this) ||
            this.hasAttribute('selected');
    }

    // eslint-disable-next-line require-jsdoc
    get value() {
        if (this.hasAttribute('value')) return this.getAttribute('value');
        return this._value || this.textContent;
    }

    /**
     * Checks if an option is already selected
     * @param {HTMLElement} parent
     * @param {HTMLElement} option
     * @returns {boolean}
     */
    isAlreadySelected(parent, option) {
        return (parent.selectedOptions.findIndex(selectedOption => selectedOption === option) !== -1);
    }

    /**
     * Called when an attribute changes
     * @param {string} name
     * @param {string} oldValue
     * @param {string} newValue
     * @returns {void}
    */
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'disabled') {
            return this.classList.toggle('guic-dropdown-option-disabled', this.hasAttribute('disabled'));
        }

        if (name === 'selected') {
            const parent = this.closest('gameface-dropdown');
            if (!parent || !parent.isRendered) return;
            const hasSelected = newValue !== null;

            // attributeChangedCallback is called before the parent is upgraded to custom element therefore has no custom methods
            if (hasSelected && parent.setSelectedAndScroll) return parent.setSelectedAndScroll(this);
            if (!hasSelected && parent.deselect) parent.deselect(this, false);
        }

        if (name === 'value') this._value = this.hasAttribute('value') ? this.getAttribute('value') : this.textContent;
    }

    // eslint-disable-next-line require-jsdoc
    constructor() {
        super();
    }
}

components.defineCustomElement('dropdown-option', DropdownOption);
components.defineCustomElement('gameface-dropdown', GamefaceDropdown);

export default GamefaceDropdown;
