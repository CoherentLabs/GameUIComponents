/* eslint-disable linebreak-style */
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/* eslint-disable no-useless-escape */
import { Components } from 'coherent-gameface-components';
const components = new Components();
import { HashHistory, BrowserHistory } from './history';
import { Route } from './route';

const WILDCARD = '**';
const HOME = '/';

/**
 * Class definition of the gameface router custom element
 */
class Router {
    /**
     * @typedef {Object<string, string|Router>} Routes
     */

    /**
     * @param {Routes} routes - The routes map
     * @param {HashHistory|BrowserHistory} history - The router history
     * @param {any} onBeforeNavigation - Method that can be used for code execution before the next history navigation
     */
    constructor(routes, history, onBeforeNavigation) {
        this.routes = routes;

        if (history) {
            this.history = history;
            if (onBeforeNavigation) this.history.onBeforeNavigation = onBeforeNavigation;

            this.history.addPopStateListener();
            this.history.onHistoryChange = curentPath => this.navigateTo(curentPath);
        }
    }

    /**
     * Will clear the router data and remove the history listeners
     */
    clear() {
        if (this.history) {
            this.history.removePopStateListener();
            this.history.onBeforeNavigation = null;
            this.history.onHistoryChange = null;
            this.history = null;
        }

        this.routes = null;
    }

    /**
     * Used to parse a url into named segments - host and pathname
     * @param {string} url - the url that needs to be parsed.
     * @returns {object} - the parsed url.
     * for url '/heroes/tanks/first' - { hostname: '/heroes', pathname: '/tanks/first' }
     */
    parseURL(url) {
        const parseUrlExp = new RegExp([
            '(.+?(?=\/))',                     // host
            '(/[^?#]*|)',                      // pathname
        ].join(''));

        const parseUrlMap = {
            host: 1,
            pathname: 2,
        };

        const match = url.match(parseUrlExp);

        if (!match || !match.length) return console.error(`The provided url - ${url} is not valid!`);

        // create a new object from the map
        const parsedURL = { ...{}, ...parseUrlMap };
        const parsedURLKeys = Object.keys(parsedURL);

        // assign the values of the parsed url to the map keys
        for (let i = 0; i < parsedURLKeys.length; i++) {
            const key = parsedURLKeys[i];
            if (match[parsedURL[key]]) parsedURL[key] = match[parsedURL[key]];
        }

        return parsedURL;
    }

    /**
     * Navigates to a given url
     * @param {string} current - the current url.
     */
    navigateTo(current) {
        const matches = this.matches(current, this.routes);
        const bestMatchedRoute = matches.matchedConfig;
        const params = matches.routeParams;
        const component = this.routes[bestMatchedRoute];

        // if there is no component specified for this match, do nothing
        if (!component) return;
        // if the component is a Router, then the route is nested and we need
        // to pass it to the nested router to process it.
        if (component instanceof Router) {
            const url = this.parseURL(current);
            component.navigateTo(url.pathname);
            return;
        }

        // get the <router-view> element and replace its content with the
        // new component
        const view = document.querySelector('router-view');

        let el;
        if (window.GUIComponentsDefinedElements[component]) {
            el = document.createElement(component);
        } else {
            el = document.createElement('div');
            el.innerHTML = component;
        }
        // inject the params to the el
        // el is a custom element
        el.params = params;

        view.innerHTML = '';
        view.appendChild(el);
    }

    /**
     * Used to extract the route parameters from url
     * @param {string} url - The url that should be matched with the current url
     * @param {string} currentURL
     * @returns {[Object<string,string>,string[]]}
     */
    getRouteParamsAndConfiguration(url, currentURL) {
        // all value of the url preceded by : will be added here
        const routeParams = {};
        const configuration = url.split('/') // split url into segments by '/'
            .filter(value => value)      // remove the empty strings - '/path'.split('/') will return ['', 'path']
            .map((segment, index) => {     // loop all segments and generate regular expressions for them
                // if the current segment doesn't contain a param, return the segment
                if (segment.substr(0, 1) !== ':') return segment;

                // assign the param name to its value
                // the name is the value after the : - for path '/:id' it's id
                // the value is the part of the url at the same position
                routeParams[segment.substr(1)] = currentURL.split('/')[index + 1]; // + 1 to compensate for the empty string result from the split
                // match all letters and numbers one or more times
                return '([a-z0-9]+)';
            });

        return [routeParams, configuration];
    }

    /**
     * Matches the current url to the router configuration.
     * If no match is found fallbacks to the wildcard route or to home if
     * wildcard is not configured.
     * @param {string} currentURL - the current url that the user tries to navigate to.
     * @param {object} routes - the router configuration.
     * @returns {object} - an object with the matched path from the configuration,
     * the url that matched that config and the route params:
     * { matchedConfig: {string}, matchedURL: {string}, routeParams: {object} }
     */
    matches(currentURL, routes) {
        // if the current route is home, return the home config
        if (currentURL === HOME) return { matchedConfig: currentURL, params: {} };

        let isExact = true;

        // a url can match multiple routes, only the first one is used
        let matchedConfiguration = null;
        const routeKeys = Object.keys(routes);

        for (let i = 0; i < routeKeys.length; i++) {
            const url = routeKeys[i];

            // if the url is HOME or the WILDCARD, there's no need to use regExp
            if (url === HOME || url === WILDCARD) continue;

            // Nested routes should not be matched exactly as the parent router
            // might match part of the url and pass the pathname to the child
            // router. If we try to match the whole url neither the parent nor the
            // child router will match.
            const isNested = this.routes[url] instanceof Router;
            isExact = !isNested;

            const [routeParams, configuration] = this.getRouteParamsAndConfiguration(url, currentURL);
            const finalRegex = configuration.join('/');
            // match from the beginning ^ of the url to the end $ if the match is exact
            const urlRegex = new RegExp(`^(/${finalRegex})${isExact ? '$' : ''}`);
            const result = currentURL.match(urlRegex);

            if (result) {
                matchedConfiguration = { matchedConfig: url, matchedURL: result[0], routeParams };
                break;
            }
        }

        if (matchedConfiguration === null) {
            // 404 or home
            const fallbackRoute = this.routes[WILDCARD] ? WILDCARD : HOME;
            matchedConfiguration = { matchedConfig: fallbackRoute };
        }

        return matchedConfiguration;
    }
}

if (!window.GUIComponentsDefinedElements['router-view']) {
    components.defineCustomElement('router-view', class RouterView extends HTMLElement { });
}

export { Router, Route, HashHistory, BrowserHistory };
