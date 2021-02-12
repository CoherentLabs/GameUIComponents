// import components from 'coherent-gameface-components';
// import template from './template.html';
// import style from './style.css';

const template = `<div class="gameface-router"><component-slot data-name="route"></component-slot></div>`;

class BrowserHistory {
    constructor() {
        this.listeners = [];
        this.current = '';
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
        return history.go(index);
    }

    pushState(state, title, url) {
        const result = history.pushState(state, title, url);
        this.current = url;
        this.dispatch();

        return result;
    }
}

const browserHistory = new BrowserHistory();

class Router {
    constructor(routes, history, root) {
        this.routes = routes;
        this.root = root || null;

        if (history) {
            this.history = history;

            window.onpopstate = (event) => {
                if(!window.history || !window.history.state) return;
                console.log(window.history.state.current);
                // console.log('onpopstate', window.location.href.replace('C:', ''))
                console.log('onpopstate', window.history.state.current);
                // history.pushState({current: window.history.state.current}, '', window.history.state.current)
                 setTimeout(() => {
                    this.navigateTo(window.history.state.current);
                 }, 0);
            };

            this.history.listen((current) => {
                this.navigateTo(current);
            });
        }
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
        
            const bestMatchedRoute = matches.routes[0];
            const params = matches.params;
            const component = this.routes[bestMatchedRoute];
    
            if(!component) return;
            if(component instanceof Router) {
                const url = this.parseURL(current);
                component.navigateTo(url.pathname);
                return;
            }
            const view = document.querySelector('router-view');
            const el = document.createElement(component);
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
        // if (routes[currentURL]) return routes[currentURL];
        const star = new RegExp(/\*\*/);
        const parameter = new RegExp(/(:.*)/);
        const flags = new RegExp(/[+*?]+$/);
        // matches all slashes in the beginning and the end of the url
        
    
        // currentURL:   /heroes/tanks
        // routes[i]: /heroes
        // routes[i]: /heroes/**
        
        // debugger

        let matches = [];
        let params = {};
        const currentURLSegments = this.getSegmetsFromURL(currentURL);
        const routesKeys = Object.keys(routes);

        for (let r = 0; r < routesKeys.length; r++) {
            let currentMatch = '';
            // debugger
            const route = routesKeys[r];
            const routeSegments = this.getSegmetsFromURL(route);
    
            let max = Math.max(currentURLSegments.length, routeSegments.length);
    
            for(let i = 0; i < max; i++) {
                const routeSegment = routeSegments[i];
                const urlSegment = currentURLSegments[i];
                // no match
                if (!routeSegment || !urlSegment) continue;
                if(urlSegment !== routeSegment && !routeSegment.match(parameter)) continue;
    
                if(urlSegment === routeSegment) {
                    currentMatch += '/' + routeSegment;
                    if (matches.indexOf(currentMatch) === -1) matches.push(currentMatch);
                }
                
                const urlParam = routeSegment.match(parameter);

                if(urlParam) {
                    currentMatch += '/' + routeSegment;
                    params[urlParam[0].replace(':', '')] = urlSegment;
                    matches.push(currentMatch);
                }
            }
        }

        return {routes: matches.sort((a, b) => a.length > b.length ? -1: 1), params: params};
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

            const state = { current: url };
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
        this.template = `<div><div>Tanks Container:</div><p></p><div class="menu"><gameface-route slot="route" to="/heroes/tanks/one">Tank One</gameface-route><gameface-route slot="route" to="/heroes/tanks/two">Tank Two</gameface-route><gameface-route slot="route" to="/heroes/tanks/three">Tank Three</gameface-route></div><p></p><router-view></router-view></div>`;
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


let tanksRouter = new Router({
    '/one'     : 'tank-one-page',
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
    '/home'       : 'home-page',
    '/start-game' : 'start-game-page',
    '/heroes'     : 'heroes-page',
    '/heroes/:id'  : heroesRouter,
}, browserHistory);


const state = { current: '/home' };
const title = 'home';
browserHistory.pushState(state, title, '/home');