/* eslint-disable linebreak-style */
/* eslint-disable require-jsdoc */
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Components } from 'coherent-gameface-components';
const components = new Components();
import { Router, Route, BrowserHistory, HashHistory } from './script.js';
import { pm } from 'postmessage-polyfill';
import 'coherent-gameface-switch';

// eslint-disable-next-line no-unused-vars
import { fetch as fetchPolyfill } from 'whatwg-fetch';
import {
    tanksTemplate,
    healersTemplate,
    startGameTemplate,
    homeTemplate,
    heroesTemplate,
    tankOneTemplate,
    tankTwoTemplate,
    tankThreeTemplate,
    healerTemplate,
    notFoundTemplate,
} from './templates';

window.postMessage = function (message) {
    pm({
        origin: 'http://127.0.0.1/:3000',
        target: window,
        data: message,
    });
};

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

class StartGame extends HTMLElement {
    constructor() {
        super();
        this.template = startGameTemplate;
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

class Healers extends HTMLElement {
    constructor() {
        super();

        this.template = healersTemplate;
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

class Tanks extends HTMLElement {
    constructor() {
        super();
        this.template = tanksTemplate;
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

class Heroes extends HTMLElement {
    constructor() {
        super();
        this.template = heroesTemplate;
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

class TankOne extends HTMLElement {
    constructor() {
        super();
        this.template = '<div></div>';
    }

    connectedCallback() {
        // dynamically set params from the current path
        this.template = tankOneTemplate(this.params);

        components.loadResource(this)
            .then((result) => {
                this.template = result.template;
                components.renderOnce(this);
            })
            .catch(err => console.error(err));
    }
}

class TankTwo extends HTMLElement {
    constructor() {
        super();
        this.template = tankTwoTemplate;
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

class TankThree extends HTMLElement {
    constructor() {
        super();
        this.template = tankThreeTemplate;
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

class Healer extends HTMLElement {
    constructor() {
        super();

        this.healers = {
            priest: {
                mana: 200,
                strength: 100,
            },
            paladin: {
                mana: 100,
                strength: 90,
            },
            monk: {
                mana: 300,
                strength: 110,
            },
        };

        this.template = healerTemplate;
    }

    connectedCallback() {
        const id = this.params.id;
        this.model = this.healers[id];

        components.loadResource(this)
            .then((result) => {
                this.template = result.template;
                this.template.querySelector('#mana').textContent = this.model.mana;
                this.template.querySelector('#strength').textContent = this.model.strength;
                components.renderOnce(this);
            })
            .catch(err => console.error(err));
    }
}


class NotFound extends HTMLElement {
    constructor() {
        super();
        this.template = notFoundTemplate;
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

components.defineCustomElement('home-page', Home);
components.defineCustomElement('start-game-page', StartGame);
components.defineCustomElement('heroes-page', Heroes);
components.defineCustomElement('tanks-page', Tanks);
components.defineCustomElement('healers-page', Healers);
components.defineCustomElement('healer-page', Healer);
components.defineCustomElement('tank-one-page', TankOne);
components.defineCustomElement('tank-two-page', TankTwo);
components.defineCustomElement('tank-three-page', TankThree);
components.defineCustomElement('not-found-page', NotFound);

function setupRouters() {
    const history = window.routerHistory && window.routerHistory === 'hashHistory' ? new HashHistory() : new BrowserHistory();
    Route.use(history);

    const tanksRouter = new Router({
        '/one/:health/:mana': 'tank-one-page',
        '/two': 'tank-two-page',
        '/three': 'tank-three-page',
    });

    const heroesRouter = new Router({
        '/healers': 'healers-page',
        '/healers/:id': 'healer-page',
        '/tanks': 'tanks-page',
        '/tanks/:id': tanksRouter,
    });

    // eslint-disable-next-line no-unused-vars
    const router = new Router({
        '/': 'home-page',
        '/start-game': 'start-game-page',
        '/heroes': 'heroes-page',
        '/heroes/:id': heroesRouter,
        '**': 'not-found-page',
    }, history);

    const state = { current: '/', id: history.currentRouteId };
    const title = 'home';
    history.pushState(state, title, '/');
}

const switchComponent = document.querySelector('gameface-switch');
const switchValueMap = {
    true: 'hashHistory',
    false: 'browserHistory',
};

setupRouters();

switchComponent.addEventListener('switch_toggle', ({ detail }) => {
    window.routerHistory = switchValueMap[detail];
    setupRouters();
});
