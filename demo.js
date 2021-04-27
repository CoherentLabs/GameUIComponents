import {
    homeTemplate,
    checkBoxTemplate,
    dropDownTemplate,
    responsiveGridTemplate,
    menuTemplate,
    scrollableContainerTemplate,
    sliderTemplate,
    modalTemplate,
    tabsTemplate,
    radialMenuTemplate,
} from '/demoTemplates.js';

// radial menu
const itemsModel = {
    items: [
        {
            id: '125',
            name: 'Pistol X0RG',
            imagePath: './images/weapon1.png',
        },
        {
            id: '421',
            name: 'Shotgun SBud',
            imagePath: './images/weapon2.png',
        },
        {
            id: '735',
            name: 'Assault Brawl D0G',
            imagePath: './images/weapon3.png',
        },
        {
            id: '234',
            name: 'Laser Pistol G0RG',
            imagePath: './images/weapon4.png',
        },
        {
            id: '635',
            name: 'Big Fancy Gun V04',
            imagePath: './images/weapon5.png',
        },
        {
            id: '872',
            name: 'Snippy Flagger',
            imagePath: './images/weapon6.png',
        },
        {
            id: '446',
            name: 'Slide-Action DBud',
            imagePath: './images/weapon2.png',
        },
        {
            id: '247',
            name: 'Laser Blagger',
            imagePath: './images/weapon4.png',
        }
    ]
};

const routes = document.querySelectorAll('gameface-route');
let activeRoute = document.querySelector('gameface-route.active-route');

for (let i = 0; i < routes.length; i++) {
    const route = routes[i];

    route.addEventListener('click', (e) => {
        const currentRoute = e.currentTarget;
        activeRoute.classList.remove('active-route');
        currentRoute.classList.add('active-route');

        activeRoute = currentRoute;
    });
}

class Home extends HTMLElement {
    constructor() {
        super();
        this.template = homeTemplate;
    }

    connectedCallback() {
        components.loadResource(this)
            .then((result) => {
                this.template = result.template;

                components.renderOnce(this);
            })
            .catch(err => console.error(err));
    }
}

class Checkbox extends HTMLElement {
    constructor() {
        super();
        this.template = checkBoxTemplate;
    }

    connectedCallback() {
        components.loadResource(this)
            .then((result) => {
                this.template = result.template;

                components.renderOnce(this);
            })
            .catch(err => console.error(err));
    }
}

class Dropdown extends HTMLElement {
    constructor() {
        super();
        this.template = dropDownTemplate;
    }

    connectedCallback() {
        components.loadResource(this)
            .then((result) => {
                this.template = result.template;

                components.renderOnce(this);
                this.setupStyles();
            })
            .catch(err => console.error(err));
    }

    setupStyles() {
        const css = `
                gameface-dropdown .dropdown .wrapper {
                    width: 100%;
                    height: 200px;
                }

                gameface-dropdown .dropdown .vertical-slider-wrapper {
                    height: 200px;
                }`;

        setTimeout(() => {
            const componentName = 'dropdown';

            if (document.querySelector(`[data-name="${componentName}"]`)) return;

            let style = document.createElement('style');
            style.setAttribute('data-name', componentName)
            style.textContent = css;
            document.head.appendChild(style);
        }, 500);
    }
}

class ResponsiveGrid extends HTMLElement {
    constructor() {
        super();
        this.template = responsiveGridTemplate;
    }

    connectedCallback() {
        components.loadResource(this)
            .then((result) => {
                this.template = result.template;

                components.renderOnce(this);
            })
            .catch(err => console.error(err));
    }
}

class Menu extends HTMLElement {
    constructor() {
        super();
        this.template = menuTemplate;
    }

    connectedCallback() {
        components.loadResource(this)
            .then((result) => {
                this.template = result.template;

                components.renderOnce(this);
            })
            .catch(err => console.error(err));
    }
}

class ScrollableContainer extends HTMLElement {
    constructor() {
        super();
        this.template = scrollableContainerTemplate;
    }

    connectedCallback() {
        components.loadResource(this)
            .then((result) => {
                this.template = result.template;

                components.renderOnce(this);
            })
            .catch(err => console.error(err));
    }
}

class Slider extends HTMLElement {
    constructor() {
        super();
        this.template = sliderTemplate;
    }

    connectedCallback() {
        components.loadResource(this)
            .then((result) => {
                this.template = result.template;

                components.renderOnce(this);
            })
            .catch(err => console.error(err));
    }
}

class Modal extends HTMLElement {
    constructor() {
        super();
        this.template = modalTemplate;
    }

    connectedCallback() {
        components.loadResource(this)
            .then((result) => {
                this.template = result.template;

                components.renderOnce(this);
            })
            .catch(err => console.error(err));
    }
}

class Tabs extends HTMLElement {
    constructor() {
        super();
        this.template = tabsTemplate;
    }

    connectedCallback() {
        components.loadResource(this)
            .then((result) => {
                this.template = result.template;

                components.renderOnce(this);
            })
            .catch(err => console.error(err));
    }
}

class RadialMenu extends HTMLElement {
    constructor() {
        super();
        this.template = radialMenuTemplate;
    }

    connectedCallback() {
        components.loadResource(this)
            .then((result) => {
                this.template = result.template;

                components.renderOnce(this);
                this.firstElementChild.style.backgroundColor = 'rgba(0,0,0,0.5)';
                this.setupItems();
            })
            .catch(err => console.error(err));
    }

    disconnectedCallback() {
        this.firstElementChild.style.backgroundColor = 'rgba(255,255,255,1)'
    }

    setupItems() {
        const radialMenu = this.querySelector('#radial-menu-one');
        components.whenDefined('radial-menu').then((menu) => {
            radialMenu.items = itemsModel.items;
        });
    }
}

components.defineCustomElement('home-page', Home);
components.defineCustomElement('checkbox-page', Checkbox);
components.defineCustomElement('dropdown-page', Dropdown);
components.defineCustomElement('responsive-grid-page', ResponsiveGrid);
components.defineCustomElement('menu-page', Menu);
components.defineCustomElement('scrollable-container-page', ScrollableContainer);
components.defineCustomElement('slider-page', Slider);
components.defineCustomElement('modal-page', Modal);
components.defineCustomElement('tabs-page', Tabs);
components.defineCustomElement('radial-menu-page', RadialMenu);

const browserHistory = new router.BrowserHistory();
router.Route.use(browserHistory);

new router.Router({
    '/': 'home-page',
    '/checkbox': 'checkbox-page',
    '/dropdown': 'dropdown-page',
    '/responsive-grid': 'responsive-grid-page',
    '/menu': 'menu-page',
    '/scrollable-container': 'scrollable-container-page',
    'slider': 'slider-page',
    'modal': 'modal-page',
    'tabs': 'tabs-page',
    'radial-menu': 'radial-menu-page',
    '**': 'home-page'
}, browserHistory);

const state = { current: '/', id: browserHistory.currentRouteId };
const title = 'home';
browserHistory.pushState(state, title, '/');