import components from 'coherent-gameface-components';

class Router {
    constructor(routes, history, onBeforeNavigation) {
        this.routes = routes;

        if (history) {
            this.history = history;
            if (onBeforeNavigation) this.history.onBeforeNavigation = onBeforeNavigation;

            console.log('browserHistory.asdasdasd;', this.history.asdasdasd)

            window.addEventListener('popstate', (event) => {
                console.log(event.state.current)

                if (!window.history || !window.history.state) return;

                const navDirection = this.getNavigationDirection(this.history.currentRouteId, event.state.id);
                this.history.currentRouteId += navDirection;
                
                this.history.onBeforeNavigation(() => {
                    this.navigateTo(window.history.state.current);
                }, []);
            });

            this.history.listen((current) => {
                this.navigateTo(current);
            });
        }
    }

    getNavigationDirection(previous, current) {
        if (previous === current) return 0; // same
        if (previous > current) return -1;  // back
        return 1;                           // forward
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
        el.params = params;

        view.innerHTML = '';
        view.appendChild(el);
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

components.defineCustomElement('router-view', class RouterView extends HTMLElement {});

export { Router };