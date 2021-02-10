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

            this.history.listen((current) => {
                this.navigateTo(current);
            });
        }
    }

    navigateTo(current) {
        console.log('current history', current);

        const bestMatchedRoute = this.matches(current, this.routes)[0];
        const component = this.routes[bestMatchedRoute];


        if(!component) return;
        if(component instanceof Router) {
            // debugger
            // TODO: fix
            const root = this.getSegmetsFromURL(bestMatchedRoute)[0];
            component.navigateTo(current.split('/'+root)[1]);
        } else {
            let view = document.querySelector('router-view');
            const el = document.createElement(component);

            if(this.root) {
                debugger
                view = document.querySelector(this.root).querySelector('router-view');
            }

            view.innerHTML = '';
            view.appendChild(el);
        }
    }

    getSegmetsFromURL(url) {
        const slashes = new RegExp(/(^\/+|\/+$)/, 'g');
        return url.replace(slashes, '').split('/');
    }

    matches(currentURL, routes) {
        // if (routes[currentURL]) return routes[currentURL];
        const star = new RegExp(/\*\*/);
        const flags = new RegExp(/[+*?]+$/);
        // matches all slashes in the beginning and the end of the url
        
    
        // currentURL:   /heroes/tanks
        // routes[i]: /heroes
        // routes[i]: /heroes/**
    
        let matches = [];
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
                if(urlSegment !== routeSegment && !routeSegment.match(star)) continue;
    
                if(urlSegment === routeSegment) {
                    currentMatch += '/' + routeSegment;
                    if (matches.indexOf(currentMatch) === -1) matches.push(currentMatch);
                }
    
                if(routeSegment.match(star)) {
                    currentMatch += '/' + routeSegment;
                    matches.push(currentMatch);
                }
            }
        }

        return matches.sort((a, b) => a.length > b.length ? -1: 1);
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

            const state = { test: '1' };
            const title = '';

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
        this.template = `<div>Healers</div>`;
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
        this.template = `<div>Tanks</div>`;
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
        this.template = `
        <div>
            <div>Heroes:</div>
            <gameface-route slot="route" to="/heroes/tanks">Tanks</gameface-route>
            <gameface-route slot="route" to="/heroes/healers">Healers</gameface-route>
            <gameface-route slot="route" to="/heroes/dps">Damage Dealers</gameface-route>

            <router-view></router-view>
        </div>`;
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
components.defineCustomElement('dps-page', DPS);
components.defineCustomElement('router-view', RouterView);


let heroesRouter = new Router({
    '/dps'     : 'dps-page',
    '/healers' : 'healers-page',
    '/tanks'   : 'tanks-page',
}, null, 'heroes-page');

let router = new Router({
    '/'           : 'home-page',
    '/start-game' : 'start-game-page',
    '/heroes'     : 'heroes-page',
    '/heroes/**'  : heroesRouter,
}, browserHistory);