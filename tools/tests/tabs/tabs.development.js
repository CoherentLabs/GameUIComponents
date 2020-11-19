(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('coherent-gameface-components')) :
    typeof define === 'function' && define.amd ? define(['exports', 'coherent-gameface-components'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.tabs = {}, global.components));
}(this, (function (exports, components) { 'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var components__default = /*#__PURE__*/_interopDefaultLegacy(components);

    var template = "<div class=\"tabs-wrapper\">\r\n    <component-slot data-name=\"tab\" class=\"tabs-header\">\r\n        <tab-heading slot=\"tab\">First Tab</tab-heading>\r\n        <tab-heading slot=\"tab\">Second Tab</tab-heading>\r\n    </component-slot>\r\n    <component-slot data-name=\"panel\">\r\n        <tab-panel slot=\"panel\">First Tab Content</tab-panel>\r\n        <tab-panel slot=\"panel\">Second Tab Content</tab-panel>\r\n    </component-slot>\r\n</div>";

    var theme = ":root{--default-color-white:#fff;--default-color-blue:#25a5d6;--default-color-gray:#e6e6e6}button,input,textarea{border-color:var(--default-color-blue);background-color:var(--default-color-white)}button,input[type=button]{background-color:var(--default-color-gray)}.modal,tab-heading,tab-panel{border-color:var(--default-color-blue);background-color:var(--default-color-white)}tab-heading.active{background-color:var(--default-color-gray)}.header{border-bottom-color:var(--default-color-blue)}.close-x{background-color:var(--default-color-blue);color:var(--default-color-gray)}.close-x:hover{background-color:var(--default-color-gray);color:var(--default-color-blue)}.checkbox-wrapper-inner{background-color:var(--default-color-white)}.checkbox-background{border-color:var(--default-color-gray)}.check-mark{background-color:var(--default-color-blue)}";

    var style = ".tabs-wrapper{display:flex;flex-wrap:wrap;flex-direction:column}.tabs-header{display:flex;flex-direction:row}tab-heading{margin-right:2px;padding:10px;border-width:3px;border-style:solid;cursor:pointer;box-sizing:border-box}tab-heading.active{background-color:#ebebeb;border-bottom:none}tab-panel{border-width:2px;border-style:solid;padding:10px;width:500px;height:500px;display:none;box-sizing:border-box}gameface-tabs{display:block;width:1000px;height:200px}";

    let tabsCounter = 0;
    let panelsCounter = 0;

    const KEYCODE = {
        DOWN: 40,
        LEFT: 37,
        RIGHT: 39,
        UP: 38,
        HOME: 36,
        END: 35,
    };

    class Tabs extends HTMLElement {
        constructor() {
            super();

            this.template = template;

            components__default['default'].importStyleTag('gameface-checkbox-theme', theme);
            components__default['default'].importStyleTag('gameface-tabs', style);

            // bind the scope to this so that we can access the current instance
            this.onKeyDown = this.onKeyDown.bind(this);
            this.onClick = this.onClick.bind(this);

            this.url = '/components/tabs/template.html';
        }

        connectedCallback() {
            this.tabs = this.getElementsByTagName('tab-heading');
            this.panels = this.getElementsByTagName('tab-panel');

            components__default['default'].loadResource(this)
                .then((response) => {
                    this.template = response[1].cloneNode(true);
                    components__default['default'].render(this);
                })
                .catch(err => console.error(err));

            // wait for the tab-heading and tab-panel custom elements to be defined
            // before attaching the events
            Promise.all([
                customElements.whenDefined('tab-heading'),
                customElements.whenDefined('tab-panel'),
            ]).then(() => {
                this.tabSlot = this.querySelector('[data-name="tab"]');
                this.panelSlot = this.querySelector('[data-name="panel"]');

                this.attachEventListeners();
            });
        }

        disconnectedCallback() {
            this.removeEventListeners();
        }

        /**
         * Called when the user clicks on the tab component.
         * @param {MouseEvent} event - the event object.
        */
        onClick(event) {
            // avoid all cases except when the target is a tab heading.
            if (event.target.tagName === 'TAB-HEADING') {
                this.selectTab(event.target);
            }
        }

        /**
         * Gets a panel which should be opened by a specific tab.
         * @param {TabHeading} tab - a tab heading element.
         * @returns {HTMLElement} - the panel.
        */
        getPanelForTab(tab) {
            return this.querySelector(`tab-panel[index="${tab.getAttribute('index')}"]`)
        }

        /**
         * Gets all TabHeading child elements of the current Tab component.
         * @returns {Array<TabHeading>} - the tabs of the tab component.
        */
        getAllTabs() {
            return Array.from(this.getElementsByTagName('tab-heading'));
        }

        /**
         * Gets all TabPanel child element of the current Tab component.
         * @returns {Array<TabPanel>} - the panels of the tab component.
        */
        getAllPanels() {
            return Array.from(this.getElementsByTagName('tab-panel'));
        }

        /**
         * Sets all tabs and panels in an inactive state.
         * No tab is selected and no panel is visible. 
        */
        reset() {
            const tabs = this.getAllTabs();
            const panels = this.getAllPanels();

            tabs.forEach(tab => tab.selected = false);
            panels.forEach(panel => panel.selected = false);
        }

        /**
         * Attaches the keydown and click event listeners for keyboard and mouse
         * controls respectively.
        */
        attachEventListeners() {
            this.addEventListener('keydown', this.onKeyDown);
            this.addEventListener('click', this.onClick);
        }

        /**
         * Removes keydown and click event listeners.
        */
        removeEventListeners() {
            this.removeEventListener('keydown', this.onKeyDown);
            this.removeEventListener('click', this.onClick);
        }

        /**
         * Sets a tab and its corresponding panel in an active state.
         * The tab is highlighted and the panel is visible.
         * @param {TabHeading} newTab - the tab which has been clicked on.
        */
        selectTab(newTab) {
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
            newTab.focus();
        }

        /**
         * Gets the previous tab in the tabs list.
         * If the current tab is the first one - returns the last tab.
         * @returns {TabHeading} - the previous tab.
        */
        getPrevTab() {
            const tabs = this.getAllTabs();

            let newIdx =
                tabs.findIndex(tab => tab.selected) - 1;
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
            let newIdx = tabs.findIndex(tab => tab.selected) + 1;
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

        /**
         * Called on keydown.
         * Gets the currently pressed key from the event and calls a function based
         * on the key code.
         * @param {KeyboardEvent} event - the event object
        */
        onKeyDown(event) {
            if (event.target.tagName !== 'TAB-HEADING' || event.altKey) return;

            // The switch-case will determine which tab should be marked as active
            // depending on the key that was pressed.
            let newTab;
            switch (event.keyCode) {
                case KEYCODE.LEFT:
                case KEYCODE.UP:
                    newTab = this.getPrevTab();
                    break;

                case KEYCODE.RIGHT:
                case KEYCODE.DOWN:
                    newTab = this.getNextTab();
                    break;

                case KEYCODE.HOME:
                    newTab = this.getFirstTab();
                    break;

                case KEYCODE.END:
                    newTab = this.getLastTab();
                    break;
                default:
                    return;
            }

            event.preventDefault();
            this.selectTab(newTab);
        }
    }

    class TabHeading extends HTMLElement {
        static get observedAttributes() {
            return ['selected'];
        }

        attributeChangedCallback(name, oldValue, newValue) {
            const value = this.hasAttribute('selected');
            this.setAttribute('tabindex', value ? 0 : -1);
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
            }
        }

        get index() {
            return this._index;
        }

        set index(value) {
            this._index = value;
            this.setAttribute('index', value);
        }

        constructor() {
            super();

            this.selected = false;
        }

        connectedCallback() {
            if (!this.index) {
                this.index = `${tabsCounter++}`;
            }
        }
    }

    class TabPanel extends HTMLElement {
        static get observedAttributes() {
            return ['selected'];
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
            }
        }

        get index() {
            return this._index;
        }

        set index(value) {
            this._index = value;
            this.setAttribute('index', value);
        }

        constructor() {
            super();

            this.selected = false;
        }

        attributeChangedCallback(name, oldValue, newValue) {
            if (name === 'selected') {
                this.style.display = (newValue === 'true') ? 'block' : 'none';
            }
        }

        connectedCallback() {
            if (!this.index) {
                this.index = `${panelsCounter++}`;
            }
        }
    }

    components__default['default'].defineCustomElement('gameface-tabs', Tabs);
    components__default['default'].defineCustomElement('tab-heading', TabHeading);
    components__default['default'].defineCustomElement('tab-panel', TabPanel);

    exports.TabHeading = TabHeading;
    exports.TabPanel = TabPanel;
    exports.Tabs = Tabs;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
