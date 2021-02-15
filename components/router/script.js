// import components from 'coherent-gameface-components';
// import template from './template.html';
// import style from './style.css';

const template = `<div class="gameface-router"><component-slot data-name="route"></component-slot></div>`;

class BrowserHistory {
    constructor() {
        this.listeners = [];
        this.current = '';
        this.currentRouteId = 0;
    }

    onBeforeNavigation() {
        console.log('--- onBeforeNavigation');
        return true;
    }

    listen(callback) {
        this.listeners.push(callback);
    }

    dispatch() {
        for(let listener of this.listeners) {
            listener(this.current);
        }
    }

    go(index) {
        if (this.onBeforeNavigation(() => history.go(), [index])) {
            return history.go(index);
        }
    }

    pushState(state, title, url) {
        const result = history.pushState(state, title, url);
        this.current = url;
        this.dispatch();

        return result;
    }

    back() {
        if (this.onBeforeNavigation( () => history.back(), [])) {
            history.back();
        }
    }

    forward() {
        if (this.onBeforeNavigation(() => history.forward(), [])) {
            history.forward();
        }
    }
}

const browserHistory = new BrowserHistory();

browserHistory.onBack = function() {
    // navigate
    return true;
    // don't navigate
    return false;
}


class Router {
    constructor(routes, history, onBeforeNavigation = () => {return true}) {
        this.routes = routes;

        if (history) {
            this.history = history;
            this.history.onBeforeNavigation = onBeforeNavigation;

            window.addEventListener('popstate', (event) => {
                if(!window.history || !window.history.state) return;

                let callback;

                if(this.isBack(browserHistory.currentRouteId, event.state.id)) {
                    this.history.currentRouteId -= 1;
                    callback = () => window.history.back;
                } else if (this.isForward(browserHistory.currentRouteId, event.state.id)) {
                    this.history.currentRouteId += 1;
                    callback = () => window.history.forward;
                }
                 setTimeout(() => {
                    if (history.onBeforeNavigation(() => {
                        callback();
                        this.navigateTo(window.history.state.current);
                    }, [])) {
                        // console.log('onpopstate --- onBeforeNavigation');
                    }
                 }, 0);
            });

            window.addEventListener("beforeunload", function(event) {
                console.log();
             });

            this.history.listen((current) => {
                this.navigateTo(current);
            });
        }
    }

    isBack(previous, current) {
        return previous > current;
    }

    isForward(previous, current) {
        return previous < current;
    }

    parseURL(url) {
        const parse_url_exp = new RegExp([
            '(.+?(?=\/))'                     // host
            , '(/[^?#]*|)'                    // pathname
            , '(\\?([^#]*)|)'                 // search & query
          ].join(''));

        const parses_url_map = {
            host:     1
          , pathname: 2
          , search  : 3
          , query   : 4
        }

        let match = url.match(parse_url_exp);

        if(!match || !match.length) return; // not valid error?

        const parsedURL = {...{}, ...parses_url_map};
        const parsedURLKeys = Object.keys(parsedURL);

        for(let i = 0; i < parsedURLKeys.length; i++) {
            const key = parsedURLKeys[i];
            if (match[parsedURL[key]]) parsedURL[key] = match[parsedURL[key]];
        }

        return parsedURL;
    }

    navigateTo(current) {
        const matches = this.matches(current, this.routes);
        const bestMatchedRoute = matches.matchedConfig;
        const params = matches.routeParams;
        const component = this.routes[bestMatchedRoute];

        if(!component) return;
        if(component instanceof Router) {
            const url = this.parseURL(current);
            component.navigateTo(url.pathname);
            return;
        }
        const view = document.querySelector('router-view');
        const el = document.createElement(component);
        // TODO rename - route params
        el.params = params;

        view.innerHTML = '';
        view.appendChild(el);
    }

    getSegmetsFromURL(url) {
        // suport single slash / for home
        const slashes = new RegExp(/(^\/+|\/+$)/, 'g');
        return url.replace(slashes, '').split('/');
    }

    matches(currentURL, routes) {
        let isHome = currentURL === '/';
        if(isHome) {
            return {matchedConfig: currentURL, params: {}}
        }

        let isExact = true;

        let matchedConfiguration = [];
        const routeKeys = Object.keys(routes);
        for(let i = 0; i < routeKeys.length; i++) {
            const url = routeKeys[i];
            if(url === '/' || url === '**') continue;
            const isNested = this.routes[url] instanceof Router;
            isExact = !isNested;

            let routeParams = {};
            let configuration = url.split('/').filter((n) => n).map((segment, index) => {
                if (segment.substr(0, 1) !== ':') return segment;
                routeParams[segment.substr(1)] = currentURL.split('/')[index + 1];
                return '([a-z0-9]+)';
            });

            let finalRegex = configuration.join('/');
            let urlRegex = isExact ? new RegExp(`^(\/${finalRegex})$`, 'g') : new RegExp(`^(\/${finalRegex})`, 'g') ;
            const result = currentURL.match(urlRegex);
            if (result) {
                matchedConfiguration.push({ matchedConfig: url, matchedURL: result[0], routeParams });
            }
        }

        if(!matchedConfiguration.length) {
            // 404 or home
            let fallbackRoute = this.routes['**'] ? '**' : '/';
            matchedConfiguration.push({matchedConfig: fallbackRoute});
        }

        return matchedConfiguration[0];
    }
}

class GamefaceRoute extends HTMLElement {
    constructor() {
        super();

        this.history = browserHistory;
        this.attachEventListeners();
    }

    attachEventListeners() {
        this.addEventListener('click', e => {
            const route = e.currentTarget;
            const url = route.getAttribute('to');

            this.history.currentRouteId;
            this.history.currentRouteId += 1;

            const state = { current: url, id: this.history.currentRouteId};
            const title = url;

            this.history.pushState(state, title, url);
        });
    }
}

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
        this.template = `<div><div>Healers</div><p></p><div class="menu"><gameface-route slot="route" to="/heroes/healers/priest">Priest</gameface-route><gameface-route slot="route" to="/heroes/healers/monk">Monk</gameface-route><gameface-route slot="route" to="/heroes/healers/paladin">Paladin</gameface-route><gameface-route slot="route" to="/heroes/healers/paladin/sasho/100">Shasho</gameface-route></div><router-view></router-view></div>`;
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
        this.template = `<div><div>Tanks Container:</div><p></p><div class="menu"><gameface-route slot="route" to="/heroes/tanks/one/79/12">Tank One</gameface-route><gameface-route slot="route" to="/heroes/tanks/two">Tank Two</gameface-route><gameface-route slot="route" to="/heroes/tanks/three">Tank Three</gameface-route></div><p></p><router-view></router-view></div>`;
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

class RouterView extends HTMLElement {
    constructor() {
        super();
        // this.template = `<div></div>`;
    }

    connectedCallback() {
        // components.loadResource(this)
        //     .then(([loadedTemplate]) => {
        //         this.template = loadedTemplate;
        //         
        //         components.renderOnce(this);
        //     })
        //     .catch(err => console.error(err));
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

components.defineCustomElement('gameface-route', GamefaceRoute);
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
components.defineCustomElement('router-view', RouterView);
components.defineCustomElement('not-found-page', NotFound);


let tanksRouter = new Router({
    '/one/:health/:mana'     : 'tank-one-page',
    '/two'     : 'tank-two-page',
    '/three'   : 'tank-three-page',
});

let heroesRouter = new Router({
    '/dps'         : 'dps-page',
    '/healers'     : 'healers-page',
    '/healers/:id' : 'healer-page',
    '/tanks'       : 'tanks-page',
    '/tanks/:id'   : tanksRouter, 
});

let router = new Router({
    '/'       : 'home-page',
    '/start-game' : 'start-game-page',
    '/heroes'     : 'heroes-page',
    '/heroes/:id' : heroesRouter,
    '**'          : 'not-found-page'
}, browserHistory, (callback, params) => {
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
});


const state = { current: '/', id: browserHistory.currentRouteId };
const title = 'home';
browserHistory.pushState(state, title, '/');