/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import {
    homeTemplate,
    checkBoxTemplate,
    dropDownTemplate,
    responsiveGridTemplate,
    menuTemplate,
    scrollableContainerTemplate,
    sliderTemplate,
    rangeSliderTemplate,
    modalTemplate,
    tabsTemplate,
    radialMenuTemplate,
    automaticGridTemplate,
    progressBarTemplate,
    switchTemplate,
    textFieldsTemplate,
} from './demoTemplates.js';

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

class HomePage extends HTMLElement {
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

class CheckboxPage extends HTMLElement {
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

class DropdownPage extends HTMLElement {
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

class ResponsiveGridPage extends HTMLElement {
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

class MenuPage extends HTMLElement {
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

class ScrollableContainerPage extends HTMLElement {
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

class SliderPage extends HTMLElement {
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

class RangeSliderPage extends HTMLElement {
    constructor() {
        super();
        this.template = rangeSliderTemplate;
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

class ModalPage extends HTMLElement {
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

class TabsPage extends HTMLElement {
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

class RadialMenuPage extends HTMLElement {
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
        components.whenDefined('gameface-radial-menu').then((menu) => {
            radialMenu.items = itemsModel.items;
        });
    }
}

class AutomaticGridPage extends HTMLElement {
    constructor() {
        super();
        this.template = automaticGridTemplate;
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

class ProgressBarPage extends HTMLElement {
    constructor() {
        super();
        this.template = progressBarTemplate;
    }

    connectedCallback() {
        components.loadResource(this)
            .then((result) => {
                this.template = result.template;

                components.renderOnce(this);

                this.setupProgressBar();
            })
            .catch(err => console.error(err));
    }

    setupProgressBar() {
        const progressBar = document.getElementById('progress-bar');
        let progressBarValue = 0;
        progressBar.setProgress(progressBarValue);

        setInterval(() => {
            (progressBarValue < 100) ? progressBarValue += 10 : progressBarValue = 0;
            progressBar.setProgress(progressBarValue);
        }, 1000);
    }
}

class SwitchPage extends HTMLElement {
    constructor() {
        super();
        this.template = switchTemplate;
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

class TextFieldPage extends HTMLElement {
    constructor() {
        super();
        this.template = textFieldsTemplate;
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

components.defineCustomElement('home-page', HomePage);
components.defineCustomElement('checkbox-page', CheckboxPage);
components.defineCustomElement('dropdown-page', DropdownPage);
components.defineCustomElement('responsive-grid-page', ResponsiveGridPage);
components.defineCustomElement('menu-page', MenuPage);
components.defineCustomElement('scrollable-container-page', ScrollableContainerPage);
components.defineCustomElement('slider-page', SliderPage);
components.defineCustomElement('range-slider-page', RangeSliderPage);
components.defineCustomElement('modal-page', ModalPage);
components.defineCustomElement('tabs-page', TabsPage);
components.defineCustomElement('radial-menu-page', RadialMenuPage);
components.defineCustomElement('automatic-grid-page', AutomaticGridPage);
components.defineCustomElement('progress-bar-page', ProgressBarPage);
components.defineCustomElement('switch-page', SwitchPage);
components.defineCustomElement('text-field-page', TextFieldPage);

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
    'range-slider': 'range-slider-page',
    'modal': 'modal-page',
    'tabs': 'tabs-page',
    'radial-menu': 'radial-menu-page',
    'automatic-grid': 'automatic-grid-page',
    'progress-bar': 'progress-bar-page',
    'switch': 'switch-page',
    'text-field': 'text-field-page',
    '**': 'home-page'
}, browserHistory);

const state = { current: '/', id: browserHistory.currentRouteId };
const title = 'home';
browserHistory.pushState(state, title, '/');
