/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import components from 'coherent-gameface-components';
import ScrollableContainer from 'coherent-gameface-scrollable-container';
import template from './template.html';

const KEYCODES = components.KEYCODES;

const CustomElementValidator = components.CustomElementValidator;

class EnabledOptions extends Array {
    indexInFullList(currentIndex) {
        return this[currentIndex];
    }
}

class GamefaceDropdown extends CustomElementValidator {
    constructor() {
        super();
        this.multiple = false;
        this.collapsable = false;

        this.selectedOption = null;
        this.isOpened = false;
        // the index of the currently selected option element
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
        if (this.isFormElement() && this.multiple) return this.selectedOptions.map(el => el.value);
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
        const enabled = new EnabledOptions();
        const allOptions = this.allOptions;

        for(let i = 0; i < allOptions.length; i++) {
            if (allOptions[i].hasAttribute('disabled')) continue;
            enabled.push(i);
        }

        return enabled;
    }

    get selectedLength() {
        return this.selectedList.length;
    }

    get lastSelectedIndex () {
        return this.selectedLength ? this.selectedList[this.selectedLength -1] : 0;
    }

    /**
     * Returns the currently selected option element.
     * @returns {HTMLElement}
    */
    get selected() {
        // Fallback to a cached option if options are not available yet.
        return this.allOptions[this.lastSelectedIndex] || this.allOptions[0];
    }

    /**
     * Sets the currently selected option.
     * Updates the class names of the current and the previously active options.
     * Dispatches a change event to notify that the active option has been changed.
    */
    set selected(option) {
        // reset
        if (option === null) return this.resetSelection();

        if (!this.multiple) this.selectSingle(option)
        this.selectMultiple(option);

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
        return this._hovered = value;
    }

    get pivotElement() {
        return this.allOptions[this._pivotIndex] || this.allOptions[0];
    }

    get selectedOptions() {
        return this.selectedList.map(selected => this.allOptions[selected]);
    }

    isSelected(index) {
        if (typeof index !== 'number') return false;
        return this.selectedList.indexOf(index) > -1
    }

    updatePivotIndex(value) {
        this._pivotIndex = value;
    }

    updateHoveredElementIndex(value) {
        this.hoveredElIndex = value;
    }

    valueMissing() {
        return !this.selectedOptions.length;
    }

    resetSelection() {
        for (let index of this.selectedList) {
            this.allOptions[index].classList.remove('active');
        }
        this.selectedList = [];
        this.hoveredElIndex = 0;
    }

    selectSingle(option) {
        if (this.selected) this.removeActive(this.selected);
        components.transferContent(option.cloneNode(true), this.querySelector('.selected'));
        this.selectedList = [];
    }

    selectMultiple(option) {
        const currentOptionIndex = this.allOptions.indexOf(option);
        if (option && !this.isSelected(currentOptionIndex)) this.select(currentOptionIndex, option);
    }

    select(index, option) {
        this.addActive(option);
        this.selectedList.push(index);
    }

    deselect(index) {
        const option = this.allOptions[this.selectedList[index]];
        this.removeActive(option);
        this.selectedList.splice(index, 1);
    }

    selectDefault() {
        for (const option of this.allOptions) {
            if (!option.hasAttribute('selected')) continue;
            this.setSelected(option);
        }
    }

    setupMultiple () {
        this.querySelector('.dropdown-header').style.display = 'none';
        components.waitForFrames(() => this.onClick(), 6);
    }

    connectedCallback() {
        components.loadResource(this)
            .then((result) => {
                this.template = result.template;
                components.renderOnce(this);

                // Check the type after the component has rendered.
                this.multiple = this.hasAttribute('multiple');
                this.collapsable = this.hasAttribute('collapsable');
                // make this element focusable
                this.setAttribute('tabindex', '1');

                if (this.multiple && !this.collapsable) this.setupMultiple();
                if (this.disabled) this.disabled = true;

                this.selectDefault();
                this.attachEventListeners();
            })
            // .catch(err => console.error(err));
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
        if (this.contains(event.target)) return;
        if (this.multiple && !this.collapsable) return;
        if (this.isOpened) this.closeOptionsPanel();
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

        const nextOptionIndex = this.enabledOptions[newIndex];
        this.focusOption(nextOptionIndex);
    }

    /**
     * Focuses an option by index. Updates the index of the hovered element.
     * @param {number} nextOptionIndex - the index of the option that has to be focused.
    */
    focusOption(nextOptionIndex) {
        this.setSelected(this.allOptions[nextOptionIndex], true);
        this.hoveredElIndex = nextOptionIndex;
    }

    deselectNextElement(nextOptionIndex) {
        const indexToBeRemoved = this.enabledOptions[nextOptionIndex];
        this.deselect(this.selectedList.indexOf(indexToBeRemoved));
    }

    isOutOfRange(current, to, direction) {
        return direction === 1 ? current > to : current < to;
    }

    resetOptions(options) {
        options.forEach((el) => el.classList.remove('active'));
    }

    selectFromTo(start, end, direction = 1, reset = true) {
        const enabledOptions = this.enabledOptions;
        const allOptions = this.allOptions;

        if (reset) this.resetSelection();

        // loop all enabled indexes and select the corresponding
        // options from the full list
        do {
            this.selected = allOptions[enabledOptions[start]];
            start += direction;
        } while (!this.isOutOfRange(start, end, direction));
    }

    selectAll() {
        this.selected = null;
        const allOptions = this.allOptions;

        this.enabledOptions.forEach(index => this.selected = allOptions[index]);
    }

    toggleSelection(currentOptionIndex, direction) {
        const nextOptionIndex = currentOptionIndex + direction; //next enabled index
        const nextFullListIndex = this.enabledOptions[nextOptionIndex];

        if (this.isSelected(nextFullListIndex)) {
            this.deselectNextElement(currentOptionIndex);
        } else {
            this.selectFromTo(currentOptionIndex, nextOptionIndex, direction, 0);
        }

        this.scrollToSelectedElement();
    }

    handleKeyboardFocus(keyCode) {
        switch (keyCode) {
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
        }
    }

    handleMultipleKeyboardSelection(keyCode, enabledOptions, currentOptionIndex) {
        switch (keyCode) {
            case KEYCODES.DOWN:
            case KEYCODES.RIGHT:
                this.toggleSelection(currentOptionIndex, 1);
                break;
            case KEYCODES.UP:
            case KEYCODES.LEFT:
                this.toggleSelection(currentOptionIndex, -1);
                break;
            case KEYCODES.HOME:
              this.selectFromTo(enabledOptions.indexOf(this._pivotIndex), 0, -1);
                break;
            case KEYCODES.END:
                this.selectFromTo(enabledOptions.indexOf(this._pivotIndex), this.allOptions.length -1, 1);
                break;
        }
    }

    handleSingleKeyboardSelection(keyCode, enabledOptions, currentOptionIndex) {
        switch (keyCode) {
            case KEYCODES.HOME:
            case KEYCODES.PAGE_UP:
                // focus first
                this.focusEnabledOption(0);
                this.scrollToSelectedElement();
                break;
            case KEYCODES.END:
            case KEYCODES.PAGE_DOWN:
                // focus last
                this.focusEnabledOption(enabledOptions.length - 1);
                this.scrollToSelectedElement();
                break;
            case KEYCODES.UP:
            case KEYCODES.LEFT:
                this.focusEnabledOption(currentOptionIndex - 1);
                this.scrollToSelectedElement();
                break;
            case KEYCODES.DOWN:
            case KEYCODES.RIGHT:
                this.focusEnabledOption(currentOptionIndex + 1);
                this.scrollToSelectedElement();
                break;
        }
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
        let currentOptionIndex = enabledOptions.indexOf(this.lastSelectedIndex);

        if (shiftKey && this.multiple) {
            // pivotIndex is the LAST selected - last clicked or selected via key
            if (this._pivotIndex === null) this._pivotIndex = this.selectedList[this.selectedLength - 1];
            this.handleMultipleKeyboardSelection(keyCode, enabledOptions, currentOptionIndex);
        }

        if (ctrlKey && keyCode === 65 && this.multiple) {
            event.preventDefault();
            this.selectAll();
        }

        if (!ctrlKey && !shiftKey && !event.altKey) {
            this.handleKeyboardFocus(keyCode);
            this.handleSingleKeyboardSelection(keyCode, enabledOptions, currentOptionIndex);
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
        if (this.isOpened) return this.closeOptionsPanel();

        this.initScrollbar();
        this.openOptionsPanel();
        this.scrollToSelectedElement();
    }

    initScrollbar() {
        const scrollableContainer = this.querySelector('gameface-scrollable-container');

        if (!this.isGameface()) return scrollableContainer.querySelector('.scrollable-container').classList.add('full-width');
        scrollableContainer.shouldShowScrollbar();
    }

    /**
     * Attaches event listeners.
    */
    attachEventListeners() {
        // handle keyboard
        this.addEventListener('keydown', this.onKeydown);
        // handle click on the selected element placeholder
        this.querySelector('.selected').addEventListener('click', this.onClick);
        this.attachOptionsListeners();
    }

    attachOptionsListeners() {
        const options = this.querySelectorAll('dropdown-option');

        for (let i = 0; i < options.length; i++) {
            const option = options[i];
            option.addEventListener('selected-option', this.onClickOption);
            option.addEventListener('mouseenter', this.onMouseOverOption);
            option.addEventListener('mouseleave', this.onMouseLeave);
        }
    }

    onMouseLeave(event) {
        const index = this.allOptions.indexOf(event.target);
        if (this.multiple && this.selectedList.indexOf(index) > -1) return;
        this.removeActive(event.target);
    }

    addActive(element) {
        element.classList.add('active');
    }

    removeActive(element) {
        element.classList.remove('active');
    }

    /**
     * Called on mouseover an option element.
     * @param {MouseEvent} event - the current event object.
    */
    onMouseOverOption(event) {
        const options = this.allOptions;
        const target = event.target;

        if (!this.multiple) this.removeActive(target);
        this.addActive(target);
        this.hoveredElIndex = options.indexOf(event.target);
    }

    onClickMultipleOptions(event) {
        // reset the selectedList if only one option is selected
        if (!event.detail.ctrlKey) this.selected = null;

        const currentOptionIndex = this.allOptions.indexOf(event.target);
        const indexInSelectedList = this.selectedList.indexOf(currentOptionIndex);

        if (indexInSelectedList > -1) return this.deselect(indexInSelectedList);

        this.setSelected(event.target);
        this.focus();
    }

    onClickSingleOption(event) {
        this.setSelected(event.target);
        this.closeOptionsPanel();
    }

    /**
     * Called when an option element is clicked.
     * Updates the selected member and closes the options panel.
     * @param {MouseEvent} event - the current event object.
    */
    onClickOption(event) {
        // handle multiple
        if (this.multiple) return this.onClickMultipleOptions(event);
        this.onClickSingleOption(event);
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
    setSelected(element, scroll = false) {
        this.selected = element;
        this.updatePivotIndex(this.lastSelectedIndex);
        this.updateHoveredElementIndex( this.lastSelectedIndex);

        // TODO: fix, maybe call separately?
        if (scroll) this.scrollToSelectedElement();
    }

    /**
     * Scrolls to the selected option element.
    */
    scrollToSelectedElement() {
        const scrollbleContainer = this.querySelector('.scrollable-container');
        const option = this.querySelector('dropdown-option');
        const optionSize = option.getBoundingClientRect().height;

        // the scroll position in pixels is equal to the height of the selected
        // option multiplied by its index
        clearTimeout(this.timeout);
        document.body.classList.add('disable-hover');

        let scrollInPX = this.lastSelectedIndex * optionSize;
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
