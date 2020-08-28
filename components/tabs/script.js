// TODO: remove
let tabsCounter = 0;
let panelsCounter = 0;

// TODO: add warnings
// for uneven count of tabs vs panels
// 

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

        const STYLE_URL = '/components/tabs/style.css';
        components.importStyle(STYLE_URL);
        // attach event listeners for keyboard control
    }

    connectedCallback() {
        this.tabs = this.getElementsByTagName('tab-heading');
        this.panels = this.getElementsByTagName('tab-panel');

        const VIEW_URL = '/components/tabs/template.html';
        components.loadResource(VIEW_URL)
            .then((response) => {
                this.template = response[1].cloneNode(true);
                components.render(this.parentNode, this);
                this.attachEventListeners();

            })
            .catch(err => console.error(err));

        // setup the link between the tabs and the panels
        Promise.all([
            customElements.whenDefined('tab-heading'),
            customElements.whenDefined('tab-panel'),
        ])
            // .then(() => this.attachEventListeners());
    }

    onClick(event) {
        // If the click was not targeted on a tab element itself,
        // it was a click inside the a panel or on empty space. Nothing to do.
        if (event.target.tagName !== 'TAB-HEADING')
            return;
        // If it was on a tab element, though, select that tab.
        this.selectTab(event.target);
    }

    getPanelForTab(tab) {
        return this.querySelector(`tab-panel[index="${tab.getAttribute('index')}"]`)
    }

    getTabs() {
        return Array.from(this.getElementsByTagName('tab-heading'));
    }

    getPanels() {
        return Array.from(this.getElementsByTagName('tab-panel'));
    }

    reset() {
        const tabs = this.getTabs();
        const panels = this.getPanels();

        tabs.forEach(tab => tab.selected = false);
        panels.forEach(panel => panel.selected = false);
    }

    attachEventListeners() {
        this.tabSlot = this.querySelector('[ data-name="tab"]');
        this.panelSlot = this.querySelector('[data-name="panel"]');

        this.tabSlot.addEventListener('slotcontentchange', (e) => {debugger});
        this.panelSlot.addEventListener('slotcontentchange', (e) => {debugger});

        // TODO: remove event listeners
        this.addEventListener('keydown', (e) => this.onKeyDown(e));
        this.addEventListener('click', (e) => this.onClick(e));
    }

    selectTab(newTab) {
        // Deselect all tabs and hide all panels.
        this.reset();

        // Get the panel that the `newTab` is associated with.
        const newPanel = this.getPanelForTab(newTab);
        // If that panel doesn’t exist, abort.
        if (!newPanel)
            throw new Error(`No panel was linked to ${newPanelId}`);
        newTab.selected = true;
        newPanel.selected = true;
        newTab.focus();
    }

    getAllTabs() {
        return Array.from(this.querySelectorAll('tab-heading'));
      }

    getPrevTab() {
        const tabs = this.getAllTabs();

        let newIdx =
          tabs.findIndex(tab => tab.selected) - 1;
        // Add `tabs.length` to make sure the index is a positive number
        // and get the modulus to wrap around if necessary.
        return tabs[(newIdx + tabs.length) % tabs.length];
      }

      getFirstTab() {
        const tabs = this.getAllTabs();
        return tabs[0];
      }

      getNextTab() {
        const tabs = this.getAllTabs();
        let newIdx = tabs.findIndex(tab => tab.selected) + 1;
        return tabs[newIdx % tabs.length];
      }

      getLastTab() {
        const tabs = this.getAllTabs();
        return tabs[tabs.length - 1];
      }

   onKeyDown(event) {
       console.log('keydown')
    //    debugger
     // If the keypress did not originate from a tab element itself,
     // it was a keypress inside the a panel or on empty space. Nothing to do.
     if (event.target.tagName !== 'TAB-HEADING') return;
     // Don’t handle modifier shortcuts typically used by assistive technology.
     if (event.altKey) return;

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
       // Any other key press is ignored and passed back to the browser.
       default:
         return;
     }

     event.preventDefault();
     // Select the new tab, that has been determined in the switch-case.
     this.selectTab(newTab);
    }


    addTab(position = -1) {
        // add tab at the end of the tab list by default
        // pass position for other position
    }

    removeTab(position) {
        // remove tab placed at a specific position
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
        if(value) {
            this.setAttribute('selected', value)
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
        if(value) {
            this.setAttribute('selected', value)
            this.classList.add('active');
        } else {
            this.classList.remove('active');
            this.removeAttribute('selected');
        }      }

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
            if (newValue === 'true') return this.style.display = 'block';
            this.style.display = 'none';
        }
    }

    connectedCallback() {
        debugger
        if (!this.index) {
            this.index = `${panelsCounter++}`;
        }
    }
}

components.defineCustomElement('gameface-tabs', Tabs);
components.defineCustomElement('tab-heading', TabHeading);
components.defineCustomElement('tab-panel', TabPanel);




