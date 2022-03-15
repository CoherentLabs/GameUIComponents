/* eslint-disable linebreak-style */
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import components from 'coherent-gameface-components';

const PADDING_BOTTOM = 16;

/**
 * AccordionMenu component, allows you to create a menu with drawers that can be expanded or shrunk on click
 */
class AccordionMenu extends HTMLElement {
    // eslint-disable-next-line require-jsdoc
    constructor() {
        super();

        this.panelClick = this.panelClick.bind(this);
    }

    // eslint-disable-next-line require-jsdoc
    connectedCallback() {
        // Check if it has the multiple attribute
        this._multiple = this.hasAttribute('multiple');

        // Remove the border from the last panel
        this.lastElementChild.classList.add('accordion-last-panel');

        this.addEventListener('click', this.panelClick);
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
            !event.target.parentNode.hasAttribute('disabled');

        if (isHeaderEnabled) {
            // If we have a single accordion menu we need to make sure we close the expanded panels before we expand a new one.
            // We also check if the clicked panel is already expanded, if it is we expect that other panels are already shrunk and we don't need to shrink them as well.
            if (!this._multiple && !event.target.parentNode.hasAttribute('expanded')) this.closeExpanded();

            // Run the panel togglePanel function
            event.target.parentNode.togglePanel();
        }
    }

    /**
     * Close all panels that have the expanded attribute
     */
    closeExpanded() {
        const expanded = this.querySelectorAll('[expanded]');
        for (let i = 0; i < expanded.length; i++) {
            const panel = expanded[i];

            panel.togglePanel();
        }
    }
}

/**
 * The panel that contains the header and content and expands
 */
class AccordionPanel extends HTMLElement {
    /**
     * We get the height of the content to make a smooth transition
     */
    get _contentHeight() {
        return this._content.scrollHeight;
    }

    // eslint-disable-next-line require-jsdoc
    constructor() {
        super();
    }

    // eslint-disable-next-line require-jsdoc
    connectedCallback() {
        this._isExpanded = this.hasAttribute('expanded');
        this._isDisabled = this.hasAttribute('disabled');

        this._content = this.querySelector('gameface-accordion-content');
        this._header = this.querySelector('gameface-accordion-header');

        if (this._isDisabled) this.classList.add('accordion-panel-disabled');

        // If a panel is expanded on load we wait 3 frames so that we have the correct content height and expand it
        if (this._isExpanded) {
            components.waitForFrames(() => {
                this._content.toggleContentExpansion(this._contentHeight + PADDING_BOTTOM);
                this._header.rotateCaret(false);
            }, 3);
        }
    }

    /**
     * Toggles the panel to either expand or shrink based if it has the expanded attribute
     */
    togglePanel() {
        if (!this._isDisabled) {
            this._isExpanded = this.hasAttribute('expanded');

            // If the panel is expanded we set the height to 0 and if it's not we set it to the height of the content + padding. We don't use padding in the CSS as we need to clear it as well when shrinking panels
            this._isExpanded ?
                this._content.toggleContentExpansion(0) :
                this._content.toggleContentExpansion(this._contentHeight + PADDING_BOTTOM);

            // We rotate the caret of the header depending if it's expanded or not
            this._header.rotateCaret(this._isExpanded);

            // If the panel is not expanded we set the expanded attribute and vice-versa to keep the state of the panel
            !this._isExpanded ? this.setAttribute('expanded', '') : this.removeAttribute('expanded');
        }
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
        this._caret.classList.add('accordion-header-caret');

        // Clear any carets on rerender
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
