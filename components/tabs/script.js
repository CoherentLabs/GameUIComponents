/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// import { Components } from 'coherent-gameface-components';
// const components = new Components();
// import template from './template.html';

let tabsCounter = 0;
let panelsCounter = 0;

// const KEYCODES = components.KEYCODES;
// const BaseComponent = components.BaseComponent;
const template = `
<style>
.guic-tabs-wrapper {
    display: flex;
    flex-direction: column;
}

[name="tab"] {
    display: flex;
    flex-direction: row;
}

::slotted([slot="tab"]) {
    margin-right : 2px;
    padding: 10px;
    border-width: 3px;
    border-style: solid;
    cursor: pointer;
    box-sizing: border-box;
    border-top-color: var(--default-color-blue);
    border-right-color: var(--default-color-blue);
    border-bottom-color: var(--default-color-blue);
    border-left-color: var(--default-color-blue);
    background-color: var(--default-color-white);
}

.guic-tabs-active-tab {
    border-bottom: none;
    background-color: var(--default-color-gray);
}

.guic-tabs-active-panel {
    display: block;
}

::slotted([slot="panel"]) {
    position: relative;
    top: -3px;
    border-width: 2px;
    border-style: solid;
    padding: 10px;
    height: 500px;
    display: none;
    box-sizing: border-box;
    border-top-color: var(--default-color-blue);
    border-right-color: var(--default-color-blue);
    border-bottom-color: var(--default-color-blue);
    border-left-color: var(--default-color-blue);
    background-color: var(--default-color-white);
}

:host {
    display: flex;
}
</style>
<div class="guic-tabs-wrapper">
    <div class="guic-tabs-header">
        <slot name="tab">
            <span>First Tab</span>
            <span>Second Tab</span>
        </slot>
    </div>
    <div class="guic-tabs-panel">
        <slot name="panel">
            <div>First Tab Content</div>
            <div>Second Tab Content</div>
        </slot>
    </div>
</div>`;
/**
 * Class definition of the gameface-tabs custom element
 */
class Tabs extends HTMLElement {
    /* eslint-disable require-jsdoc */
    constructor() {
        super();

        this.template = template;

        // bind the scope to this so that we can access the current instance
        // this.onKeyDown = this.onKeyDown.bind(this);
        this.onClick = this.onClick.bind(this);

        this.url = '/components/tabs/template.html';
        this.init = this.init.bind(this);
    }

    /**
     * Initialize the custom component.
     * Set template, attach event listeners, setup initial state etc.
     * @param {object} data
    */
    init(data) {
        // this.setupTemplate(data, () => {
        // render the component
        // components.renderOnce(this);
        const shadow = this.attachShadow({ mode: 'open' });
        shadow.innerHTML = this.template;
        this.isRendered = true;
        this.tabSlot = this.shadowRoot.querySelector('slot[name="tab"]');
        this.panelSlot = this.shadowRoot.querySelector('slot[name="panel"]');

        this.attachEventListeners();
        this.tabs.forEach((tab, index) => {
            tab.index = tabsCounter++;
            tab.selected = false;
        });
        this.panels.forEach((panel, index) => {
            panel.index = panelsCounter++;
            panel.selected = false;
            panel.style.display = 'none';
        });
        this.selectTab(this.tabs[0]);
        // });
    }

    get tabs() {
        return this.tabSlot.assignedElements();
    }

    get panels() {
        return this.panelSlot.assignedElements();
    }

    get selectedTab() {
        return this.tabs.find(tab => tab.selected);
    }

    get selectedPanel() {
        return this.panels.find(panel => panel.selected);
    }

    connectedCallback() {
        this.init();
        // components.loadResource(this)
        //     .then(this.init)
        //     .catch(err => console.error(err));
    }

    /* eslint-enable require-jsdoc */

    /**
     * Called when the user clicks on the tab component.
     * @param {MouseEvent} event - the event object.
    */
    onClick(event) {
        this.selectTab(event.currentTarget);
    }

    /**
     * Gets a panel which should be opened by a specific tab.
     * @param {TabHeading} tab - a tab heading element.
     * @returns {HTMLElement} - the panel.
    */
    getPanelForTab(tab) {
        return this.panels.find(t => t.index === tab.index);
        // return this.querySelector(`tab-panel[index="${tab.getAttribute('index')}"]`);
    }

    /**
     * Gets all TabHeading child elements of the current Tab component.
     * @returns {Array<TabHeading>} - the tabs of the tab component.
    */
    getAllTabs() {
        return this.tabs;
        // return Array.from(this.querySelector('.guic-tabs-header').querySelectorAll('tab-heading'));
    }

    /**
     * Gets all TabPanel child element of the current Tab component.
     * @returns {Array<TabPanel>} - the panels of the tab component.
    */
    getAllPanels() {
        return this.panels;
        // const panels = [];
        // let tabsPanel = this.querySelector(`.guic-tabs-panel`);
        // // If is used <gameface-tabs> without filling the slots we need to get the children of the component-slot element
        // if (tabsPanel.children.length === 1 && tabsPanel.children[0].tagName === 'COMPONENT-SLOT') {
        //     tabsPanel = tabsPanel.children[0];
        // }
        // Array.from(tabsPanel.children).forEach((child) => {
        //     if (child instanceof TabPanel) panels.push(child);
        // });
        // return panels;
    }

    /**
     * Sets all tabs and panels in an inactive state.
     * No tab is selected and no panel is visible.
    */
    reset() {
        // const tabs = this.getAllTabs();
        // const panels = this.getAllPanels();

        this.tabs.forEach(tab => tab.selected = false);
        this.panels.forEach(panel => panel.selected = false);
    }

    /**
     * Attaches the keydown and click event listeners for keyboard and mouse
     * controls respectively.
    */
    attachEventListeners() {
        // this.addEventListener('keydown', this.onKeyDown);

        // const tabHeadings = this.getAllTabs();

        for (const tabHeading of this.tabs) {
            tabHeading.addEventListener('click', this.onClick);
        }
    }
    /**
     * Sets a tab and its corresponding panel in an active state.
     * The tab is highlighted and the panel is visible.
     * @param {TabHeading} newTab - the tab which has been clicked on.
    */
    selectTab(newTab) {
        this.selectedTab?.classList.remove('guic-tabs-active-tab');
        const currentPanel = this.selectedPanel;
        if (currentPanel) {
            currentPanel.classList.remove('guic-tabs-active-panel');
            currentPanel.style.display = 'none';
        }
        // Deselect all tabs and hide all panels.
        this.reset();
        // Get the panel that the `newTab` is associated with.
        const newPanel = this.getPanelForTab(newTab);
        // If that panel doesn’t exist, abort.
        if (!newPanel) {
            console.error(`Could not find tab panel corresponding to tab ${newPanel}`);
            return;
        }
        newTab.selected = true;
        newPanel.selected = true;
        newTab.classList.add('guic-tabs-active-tab');
        newPanel.classList.add('guic-tabs-active-panel');
        newPanel.style.display = 'block';
        // Show scrollbar inside the tabs panel because if the panel has been hidden then the scrollable container will be
        // hidden as well and that is why here we force it to recalculate if it should be visible or not.
        newPanel.querySelectorAll('gameface-scrollable-container').forEach(el => el.shouldShowScrollbar());
        newTab.focus();
    }

    /**
     * Gets the previous tab in the tabs list.
     * If the current tab is the first one - returns the last tab.
     * @returns {TabHeading} - the previous tab.
    */
    getPrevTab() {
        const tabs = this.getAllTabs();

        const newIdx = tabs.findIndex(tab => tab.selected) - 1;
        // Add `tabs.length` to make sure the index is a positive number
        // and get the modulus to wrap around if necessary.
        return tabs[(newIdx + tabs.length) % tabs.length];
    }

    /**
     * Gets the first tab in the tabs list.
     * @returns {TabHeading} - the first tab.
    */
    getFirstTab() {
        const tabs = this.getAllTabs();
        return tabs[0];
    }

    /**
     * Gets the next tab in the tabs list.
     * If the current tab is the last one - returns the first tab.
     * @returns {TabHeading} - the next tab.
    */
    getNextTab() {
        const tabs = this.getAllTabs();
        const newIdx = tabs.findIndex(tab => tab.selected) + 1;
        return tabs[newIdx % tabs.length];
    }

    /**
     * Gets the last tab.
     * @returns {TabHeading}
    */
    getLastTab() {
        const tabs = this.getAllTabs();
        return tabs[tabs.length - 1];
    }

    // /**
    //  * Called on keydown.
    //  * Gets the currently pressed key from the event and calls a function based
    //  * on the key code.
    //  * @param {KeyboardEvent} event - the event object
    // */
    // onKeyDown(event) {
    //     if (event.target.tagName.toLowerCase() !== 'tab-heading' || event.altKey) return;

    //     // The switch-case will determine which tab should be marked as active
    //     // depending on the key that was pressed.
    //     let newTab;
    //     switch (event.keyCode) {
    //         case KEYCODES.LEFT:
    //         case KEYCODES.UP:
    //             newTab = this.getPrevTab();
    //             break;

    //         case KEYCODES.RIGHT:
    //         case KEYCODES.DOWN:
    //             newTab = this.getNextTab();
    //             break;

    //         case KEYCODES.HOME:
    //             newTab = this.getFirstTab();
    //             break;

    //         case KEYCODES.END:
    //             newTab = this.getLastTab();
    //             break;
    //         default:
    //             return;
    //     }

    //     event.preventDefault();
    //     this.selectTab(newTab);
    // }
}

// /**
//  * Class definition of the tab heading custom element
//  */
// class TabHeading extends HTMLElement {
//     /* eslint-disable require-jsdoc */
//     static get observedAttributes() {
//         return ['selected'];
//     }

//     attributeChangedCallback(name, oldValue, newValue) {
//         if (!this.isRendered) return;

//         if (name === 'selected') this.updateSelectedState(newValue !== null);
//     }

//     get selected() {
//         return this._selected;
//     }

//     set selected(value) {
//         if (value) {
//             this.setAttribute('selected', '');
//         } else {
//             this.removeAttribute('selected');
//         }
//     }

//     updateSelectedState(value) {
//         this._selected = value;

//         if (value) {
//             this.classList.add('guic-tabs-active-tab');
//         } else {
//             this.classList.remove('guic-tabs-active-tab');
//         }

//         this.setAttribute('tabindex', value ? '0' : '-1');
//     }

//     get index() {
//         return this._index;
//     }

//     set index(value) {
//         this._index = value;
//         this.setAttribute('index', value);
//     }

//     constructor() {
//         super();

//         this._selected = false;
//     }

//     connectedCallback() {
//         if (!this.index) {
//             this.index = `${tabsCounter++}`;
//         }

//         this.updateSelectedState(this.hasAttribute('selected'));
//         this.isRendered = true;
//     }
//     /* eslint-enable require-jsdoc */
// }

// /**
//  * Class definition of the tab panel custom element
//  */
// class TabPanel extends HTMLElement {
//     /* eslint-disable require-jsdoc */

//     static get observedAttributes() {
//         return ['selected'];
//     }

//     get selected() {
//         return this._selected;
//     }

//     set selected(value) {
//         if (value) {
//             this.setAttribute('selected', '');
//         } else {
//             this.removeAttribute('selected');
//         }
//     }

//     updateSelectedState(value) {
//         this._selected = value;

//         if (value) {
//             this.classList.add('guic-tabs-active-panel');
//         } else {
//             this.classList.remove('guic-tabs-active-panel');
//         }

//         this.style.display = value ? 'block' : 'none';
//     }

//     get index() {
//         return this._index;
//     }

//     set index(value) {
//         this._index = value;
//         this.setAttribute('index', value);
//     }

//     constructor() {
//         super();

//         this._selected = false;
//     }

//     attributeChangedCallback(name, oldValue, newValue) {
//         if (!this.isRendered) return;

//         if (name === 'selected') this.updateSelectedState(newValue !== null);
//     }

//     connectedCallback() {
//         if (!this.index) {
//             this.index = `${panelsCounter++}`;
//         }

//         this.updateSelectedState(this.hasAttribute('selected'));
//         this.isRendered = true;
//     }
//     /* eslint-enable require-jsdoc */
// }

customElements.define('gameface-tabs', Tabs);
// components.defineCustomElement('tab-heading', TabHeading);
// components.defineCustomElement('tab-panel', TabPanel);


// export { Tabs, TabHeading, TabPanel };
