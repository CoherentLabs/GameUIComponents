/* eslint-disable linebreak-style */
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Components } from 'coherent-gameface-components';
const components = new Components();
const BaseComponent = components.BaseComponent;

const PADDING_BOTTOM = 16;

/**
 * AccordionMenu component, allows you to create a menu with drawers that can be expanded or shrunk on click
 */
class AccordionMenu extends BaseComponent {
    // eslint-disable-next-line require-jsdoc
    static get observedAttributes() { return ['multiple']; }

    // eslint-disable-next-line require-jsdoc
    constructor() {
        super();

        this.panelClick = this.panelClick.bind(this);

        this.stateSchema = {
            multiple: { type: ['boolean'] },
        };

        this.state = {
            multiple: false,
        };
    }

    // eslint-disable-next-line require-jsdoc
    set multiple(value) {
        value ? this.setAttribute('multiple', '') : this.removeAttribute('multiple');
    }

    // eslint-disable-next-line require-jsdoc
    get multiple() {
        return this.state.multiple;
    }

    /**
     * Custom element lifecycle method. Called when an attribute is changed.
     * @param {string} name
     * @param {string} oldValue
     * @param {string|boolean} newValue
     */
    attributeChangedCallback(name, oldValue, newValue) {
        if (!this.isRendered) return;

        if (name === 'multiple') this.updateMultipleState(newValue !== null);
    }


    /**
     * Will update the multiple state of the accordion menu
     * @param {boolean} value
     * @returns {undefined}
     */
    updateMultipleState(value) {
        this.updateState('multiple', value);
        if (this.multiple) return;

        // If there are multiple expanded menus leave the first one opened when the `multiple` option is disabled
        // If there are expanded elements that are disabled we need to skip them
        const expanded = [...this.querySelectorAll('[expanded]')].filter(el => !el.disabled);
        if (expanded.length > 1) {
            expanded.shift();
            this.closeExpanded(expanded);
        }
    }

    /**
     * Update the checkbox's state.
     * @param {string} name - the name of the prop
     * @param {string | boolean} value - the value of the the prop
     * @returns {void}
     */
    updateState(name, value) {
        if (!this.isStatePropValid(name, value)) return;
        this.state[name] = value;
    }

    // eslint-disable-next-line require-jsdoc
    connectedCallback() {
        // Check if it has the multiple attribute
        this.state.multiple = this.hasAttribute('multiple');

        // Remove the border from the last panel
        this.lastElementChild.classList.add('guic-accordion-last-panel');

        this.addEventListener('click', this.panelClick);
        // In order for the attributeChangedCallback to work we need to set the isRendered method to true
        // Otherwise attributeChangedCallback will be triggered before the connectedCallback and produce problems
        this.isRendered = true;
    }

    /**
     * The function that fires when you click a header in the accordion menu. It makes the panels expand or shrink
     * @param {MouseEvent} event
     */
    panelClick(event) {
        // Using event propagation to make sure panels expand and shrink only when clicking the header. Also makes sure that clicking on disabled panels doesn't do anything.
        // Also using toLowerCase as in the browser tagNames are with capital letters whereas in Gameface they are with lowercase
        const isHeaderEnabled =
            event.target.tagName.toLowerCase() === 'gameface-accordion-header' &&
            !event.target.parentNode.disabled;

        if (isHeaderEnabled) {
            const isExpanded = event.target.parentNode.expanded;
            // If we have a single accordion menu we need to make sure we close the expanded panels before we expand a new one.
            // We also check if the clicked panel is already expanded, if it is we expect that other panels are already shrunk and we don't need to shrink them as well.
            if (!this.multiple && !isExpanded) this.closeExpanded();

            // Change the expanded value with its opposite
            event.target.parentNode.expanded = !isExpanded;
        }
    }

    /**
     * Close all panels that have the expanded attribute
     * @param {Array<HTMLElement>} elements - An array with elements that should be closed
     */
    closeExpanded(elements = []) {
        const expanded = !elements || !elements.length ? this.querySelectorAll('[expanded]') : elements;
        for (let i = 0; i < expanded.length; i++) {
            const panel = expanded[i];

            panel.togglePanel(false);
        }
    }
}

/**
 * The panel that contains the header and content and expands
 */
class AccordionPanel extends HTMLElement {
    // eslint-disable-next-line require-jsdoc
    static get observedAttributes() { return ['disabled', 'expanded']; }

    /**
     * We get the height of the content to make a smooth transition
     */
    get _contentHeight() {
        return this._content.scrollHeight;
    }

    // eslint-disable-next-line require-jsdoc
    constructor() {
        super();

        this.stateSchema = {
            disabled: { type: ['boolean'] },
            expanded: { type: ['boolean'] },
        };

        this.state = {
            disabled: false,
            expanded: false,
        };
    }

    // eslint-disable-next-line require-jsdoc
    set expanded(value) {
        value ? this.setAttribute('expanded', '') : this.removeAttribute('expanded');
    }

    // eslint-disable-next-line require-jsdoc
    get expanded() {
        return this.state.expanded;
    }

    // eslint-disable-next-line require-jsdoc
    set disabled(value) {
        value ? this.setAttribute('disabled', '') : this.removeAttribute('disabled');
    }

    // eslint-disable-next-line require-jsdoc
    get disabled() {
        return this.state.disabled;
    }

    /**
    * Custom element lifecycle method. Called when an attribute is changed.
    * @param {string} name
    * @param {string} oldValue
    * @param {string|boolean} newValue
    */
    attributeChangedCallback(name, oldValue, newValue) {
        if (!this.isRendered) return;

        this.updateAttributeState(name, newValue);
    }

    /**
    * Will update the state properties linked with the accordion panel attributes
    * @param {string} name
    * @param {string|boolean} value
    */
    updateAttributeState(name, value) {
        switch (name) {
            case 'expanded':
                this.updateExpandedState(value !== null);
                break;
            case 'disabled':
                this.updateDisabledState(value !== null);
                break;
        }
    }

    /**
     * Will update the disabled state of the accordion panel
     * @param {boolean} value
     */
    updateDisabledState(value) {
        this.state.disabled = value;
        this.toggleDisabled();
    }

    /**
     * Will update the expanded state of the accordion panel
     * @param {boolean} value
     */
    updateExpandedState(value) {
        this.state.expanded = value;
        // If the panel is expanded we set the height to 0 and if it's not we set it to the height of the content + padding. We don't use padding in the CSS as we need to clear it as well when shrinking panels
        !this.expanded ?
            this._content.toggleContentExpansion(0) :
            this._content.toggleContentExpansion(this._contentHeight + PADDING_BOTTOM);

        // We rotate the caret of the header depending if it's expanded or not
        this._header.rotateCaret(!this.expanded);
    }

    // eslint-disable-next-line require-jsdoc
    connectedCallback() {
        this.state.expanded = this.hasAttribute('expanded');
        this.state.disabled = this.hasAttribute('disabled');

        this._content = this.querySelector('gameface-accordion-content');
        this._header = this.querySelector('gameface-accordion-header');

        this.toggleDisabled();

        // If a panel is expanded on load we wait 3 frames so that we have the correct content height and expand it
        if (this.expanded) {
            components.waitForFrames(() => {
                this.updateExpandedState(true);
            }, 3);
        }

        // In order for the attributeChangedCallback to work we need to set the isRendered method to true
        // Otherwise attributeChangedCallback will be triggered before the connectedCallback and produce problems
        this.isRendered = true;
    }

    /**
     * Will add disabled class if the accordion panel is disabled
     */
    toggleDisabled() {
        this.classList.toggle('guic-accordion-panel-disabled', this.disabled);
    }

    /**
     * Toggles the panel to either expand or shrink based if it has the expanded attribute
     * @param {boolean} visible - If the panel is visible or not
     * @param {boolean} toggleDisabled - If to force toggle the panel even if it is disabled
     */
    togglePanel(visible) {
        if (this.disabled) return;

        this.expanded = visible;
    }
}

/**
 * Class definition of the gameface accordion header custom element
 */
class AccordionHeader extends HTMLElement {
    // eslint-disable-next-line require-jsdoc
    constructor() {
        super();
    }

    /**
     * We add the caret from the JS so users don't have to manually with slots.
     */
    connectedCallback() {
        this._caret = document.createElement('div');
        this._caret.classList.add('guic-accordion-header-caret');

        // Clear any carets on rerender
        // eslint-disable-next-line no-self-assign
        this.textContent = this.textContent;

        this.appendChild(this._caret);
    }

    /**
     * Rotating the caret depending on whether the panel is expanded or not
     * @param {Boolean} isExpanded
     */
    rotateCaret(isExpanded) {
        this._caret.style.transform = isExpanded ? 'rotate(0deg)' : 'rotate(180deg)';
    }
}

/**
 * Class definition of the gameface accordion content custom element
 */
class AccordionContent extends HTMLElement {
    // eslint-disable-next-line require-jsdoc
    constructor() {
        super();
    }

    /**
     * Sets the height of the panel to create the expanding and shrinking animations
     * @param {Number} number
     */
    toggleContentExpansion(number) {
        this.style.height = `${number}px`;
    }
}

components.defineCustomElement('gameface-accordion-menu', AccordionMenu);
components.defineCustomElement('gameface-accordion-panel', AccordionPanel);
components.defineCustomElement('gameface-accordion-header', AccordionHeader);
components.defineCustomElement('gameface-accordion-content', AccordionContent);

export { AccordionMenu, AccordionPanel, AccordionHeader, AccordionContent };
