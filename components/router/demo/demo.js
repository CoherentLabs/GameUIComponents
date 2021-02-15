import components from 'coherent-gameface-components';
import {Router, Route, BrowserHistory} from '../umd/router.development.js';
import { pm } from 'postmessage-polyfill';
import { fetch as fetchPolyfill } from 'whatwg-fetch';

const browserHistory = new BrowserHistory();
Route.use(browserHistory);

window.postMessage = function (message) {
    pm({
        origin: 'http://127.0.0.1/:3000',
        target: window,
        data: message
    });
};

class Home extends HTMLElement {
    constructor() {
        super();
        this.template = `<div>Home</div>`;
    }

    connectedCallback() {
        components.loadResource(this)
            .then(([loadedTemplate]) => {
                this.template = loadedTemplate;

                components.renderOnce(this);
            })
            .catch(err => console.error(err));
    }
}

class StartGame extends HTMLElement {
    constructor() {
        super();
        this.template = `<div>Start Game</div>`;
    }

    connectedCallback() {
        components.loadResource(this)
            .then(([loadedTemplate]) => {
                this.template = loadedTemplate;

                components.renderOnce(this);
            })
            .catch(err => console.error(err));
    }
}

class Healers extends HTMLElement {
    constructor() {
        super();

        const style = `
        .healers-menu {
            display: flex;
            height: 135px;
            margin-bottom: 25px;
        }

        .avatar-container {
            display: flex;
            flex-direction: column;
            width: 100px;
        }

        .avatar {
            margin-bottom: 5px;
            min-height: 50px;
            height: 100px;
            background-size: contain;
            background-repeat: no-repeat no-repeat;
        }
        .avatar1 {
            background-image: url(/images/imgAvatar_2.png);
        }

        .avatar2 {
            background-image: url(/images/imgAvatar_3.png);
        }
        .avatar3 {
            background-image: url(/images/imgAvatar_4.png);
        }
    `;
        
        components.importStyleTag('supports', style);
        this.template = `<div>    <div>Available Supports:</div>    <p></p>    <div class="healers-menu">        <gameface-route slot="route" to="/heroes/healers/paladin">            <div class="avatar-container">                <div class="avatar avatar1"></div>                <div>Paladin</div>            </div>        </gameface-route>        <gameface-route slot="route" to="/heroes/healers/monk">            <div class="avatar-container">                <div class="avatar avatar2"></div>                <div>Monk</div>            </div>        </gameface-route>        <gameface-route slot="route" to="/heroes/healers/priest">            <div class="avatar-container">                <div class="avatar avatar3"></div>                <div>Priest</div>            </div>        </gameface-route>    </div></div>`;
    }

    connectedCallback() {
        components.loadResource(this)
            .then(([loadedTemplate]) => {
                this.template = loadedTemplate;

                components.renderOnce(this);
            })
            .catch(err => console.error(err));
    }
}

class DPS extends HTMLElement {
    constructor() {
        super();
        this.template = `<div>DPS</div>`;
    }

    connectedCallback() {
        components.loadResource(this)
            .then(([loadedTemplate]) => {
                this.template = loadedTemplate;

                components.renderOnce(this);
            })
            .catch(err => console.error(err));
    }
}

class Tanks extends HTMLElement {
    constructor() {
        super();
        const style = `
            .tanks-menu {
                display: flex;
                height: 135px;
                margin-bottom: 25px;
            }

            .avatar-container {
                display: flex;
                flex-direction: column;
                width: 100px;
            }

            .avatar {
                margin-bottom: 5px;
                min-height: 50px;
                height: 100px;
                background-size: contain;
                background-repeat: no-repeat no-repeat;
            }
            .avatar1 {
                background-image: url(/images/avatar1.png);
            }

            .avatar2 {
                background-image: url(/images/avatar4.png);
            }
            .avatar3 {
                background-image: url(/images/avatar5.png);
            }
        `;

        components.importStyleTag('tanks', style);
        this.template = `<div>    <div>Available Tanks:</div>    <p></p>    <div class="tanks-menu">        <gameface-route slot="route" to="/heroes/tanks/one/79/12">            <div class="avatar-container">                <div class="avatar avatar1"></div>                <div>Tank 1</div>            </div>        </gameface-route>        <gameface-route slot="route" to="/heroes/tanks/two">            <div class="avatar-container">                <div class="avatar avatar2"></div>                <div>Tank 2</div>            </div>        </gameface-route>        <gameface-route slot="route" to="/heroes/tanks/three">            <div class="avatar-container">                <div class="avatar avatar3"></div>                <div>Tank 3</div>            </div>        </gameface-route>    </div></div>`;
    }

    connectedCallback() {
        components.loadResource(this)
            .then(([loadedTemplate]) => {
                this.template = loadedTemplate;

                components.renderOnce(this);
            })
            .catch(err => console.error(err));
    }
}

class Heroes extends HTMLElement {
    constructor() {
        super();
        this.template = `<div><div>Heroes:</div><div class="menu"><gameface-route slot="route" to="/heroes/tanks">Tanks</gameface-route><gameface-route slot="route" to="/heroes/healers">Healers</gameface-route><gameface-route slot="route" to="/heroes/dps">Damage Dealers</gameface-route></div><router-view></router-view></div>`;
    }

    connectedCallback() {
        components.loadResource(this)
            .then(([loadedTemplate]) => {
                this.template = loadedTemplate;
                components.renderOnce(this);
            })
            .catch(err => console.error(err));
    }
}

class TankOne extends HTMLElement {
    constructor() {
        super();
        this.template = `<div><div>Tank One:</div><p>Tank One is the very first tank in the Evergloom. It uses its roots to defend the realm of trees.</p></div>`;
    }

    connectedCallback() {
        components.loadResource(this)
            .then(([loadedTemplate]) => {
                this.template = loadedTemplate;
                components.renderOnce(this);
            })
            .catch(err => console.error(err));
    }
}

class TankTwo extends HTMLElement {
    constructor() {
        super();
        this.template = `<div><div>Tank Two:</div><p>Tank Two is the very first tank in the Evergloom. It uses its roots to defend the realm of trees.</p></div>`;
    }

    connectedCallback() {
        components.loadResource(this)
            .then(([loadedTemplate]) => {
                this.template = loadedTemplate;
                components.renderOnce(this);
            })
            .catch(err => console.error(err));
    }
}

class TankThree extends HTMLElement {
    constructor() {
        super();
        this.template = `<div><div>Tank Three:</div><p>Tank Three is the very first tank in the Evergloom. It uses its roots to defend the realm of trees.</p></div>`;
    }

    connectedCallback() {
        components.loadResource(this)
            .then(([loadedTemplate]) => {
                this.template = loadedTemplate;
                components.renderOnce(this);
            })
            .catch(err => console.error(err));
    }
}

class Healer extends HTMLElement {
    constructor() {
        super();

        this.healers = {
            'priest': {
                name: 'Farondis',
                strength: 100
            },
            'paladin': {
                name: 'Flynn',
                strength: 90
            },
            'monk': {
                name: 'Cho',
                strength: 110
            },
        }

        
        this.template = `<div><div>Name: <span id="name"></span></div><div>Strength: <span id="strength"></span></div></div>`;
    }

    connectedCallback() {
        const id = this.params.id;
        this.model = this.healers[id];

        components.loadResource(this)
            .then(([loadedTemplate]) => {
                this.template = loadedTemplate;
                this.template.querySelector('#name').textContent = this.model.name;
                this.template.querySelector('#strength').textContent = this.model.strength;
                components.renderOnce(this);
            })
            .catch(err => console.error(err));
    }
}


class NotFound extends HTMLElement {
    constructor() {
        super();
        this.template = `<div>404</div>`;
    }

    connectedCallback() {
        components.loadResource(this)
            .then(([loadedTemplate]) => {
                this.template = loadedTemplate;

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
components.defineCustomElement('dps-page', DPS);
components.defineCustomElement('tank-one-page', TankOne);
components.defineCustomElement('tank-two-page', TankTwo);
components.defineCustomElement('tank-three-page', TankThree);
components.defineCustomElement('not-found-page', NotFound);


let tanksRouter = new Router({
    '/one/:health/:mana': 'tank-one-page',
    '/two': 'tank-two-page',
    '/three': 'tank-three-page',
});

let heroesRouter = new Router({
    '/dps': 'dps-page',
    '/healers': 'healers-page',
    '/healers/:id': 'healer-page',
    '/tanks': 'tanks-page',
    '/tanks/:id': tanksRouter,
});

let router = new Router({
    '/': 'home-page',
    '/start-game': 'start-game-page',
    '/heroes': 'heroes-page',
    '/heroes/:id': heroesRouter,
    '**': 'not-found-page'
}, browserHistory);

let beforeUnload = (callback, params) => {
    const confirmationDialog = document.createElement('div');
    const message = document.createElement('p');
    const confirmButton = document.createElement('button');
    const discardButton = document.createElement('button');

    message.textContent = 'Are you sure you want to navigate?';
    confirmButton.textContent = 'Yes';
    discardButton.textContent = 'No';

    confirmButton.onclick = () => {
        callback.apply(null, params);
        confirmationDialog.parentElement.removeChild(confirmationDialog);
    }

    discardButton.onclick = () => {
        confirmationDialog.parentElement.removeChild(confirmationDialog);
    }

    confirmationDialog.appendChild(confirmButton);
    confirmationDialog.appendChild(discardButton);

    document.body.appendChild(confirmationDialog);

    return false;
}

const state = { current: '/', id: browserHistory.currentRouteId };
const title = 'home';
browserHistory.pushState(state, title, '/');