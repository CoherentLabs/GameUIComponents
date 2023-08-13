/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Components } from 'coherent-gameface-components';
const components = new Components();
import { BrowserHistory, HashHistory } from './history';

/**
 * Creates the GamefaceRoute component class and registers it.
 * We pass the history here, so that we can attach the event listeners with the
 * correct history.
*/
class Route {
    // eslint-disable-next-line require-jsdoc
    static set history(value) {
        this._history = value;
    }

    // eslint-disable-next-line require-jsdoc
    static get history() {
        return this._history;
    }

    /**
     * Will set the passed history as preffered one for the router
     * @param {HashHistory|BrowserHistory} history
     */
    static use(history) {
        if (!(history instanceof BrowserHistory) && !(history instanceof HashHistory)) {
            console.error(`Type error: ${history} is not an instance of BrowserHistory or HashHistory.
             Make sure you pass an instance of BrowserHistory or HashHistory to Route.use()!`);
        }
        this.history = history;
    }
}

/**
 * Class definition of the gameface route custom element
 */
class GamefaceRoute extends HTMLElement {
    // eslint-disable-next-line require-jsdoc
    constructor() {
        super();
        this.onClick = this.onClick.bind(this);
        this.onHistoryChange = this.onHistoryChange.bind(this);
    }


    // eslint-disable-next-line require-jsdoc
    get activeClass() {
        return this.getAttribute('activeClass') ||
            this.parentElement.getAttribute('activeClass') ||
            'guic-route-active';
    }

    // eslint-disable-next-line require-jsdoc
    disconnectedCallback() {
        window.removeEventListener('onHistoryChange', this.onHistoryChange);
    }

    /**
     * Called when the custom onHistoryChange event is dispatched.
     * Checks if there is an activeClass and adds/removes it depending on
     * whether the current route matches the route element's to attribute.
     *
     * @param {Event} event
    */
    onHistoryChange(event) {
        const activeClass = this.activeClass;
        const url = this.getAttribute('to');

        if (!url) return;
        if (url === event.detail) {
            this.classList.add(activeClass);
        } else {
            this.classList.remove(activeClass);
        }
    }

    /**
     * Called on click of a route element. Pushes a new state to the
     * history and increments the currentRouteId of the history.
     * @param {MouseEvent} event - the event object
     */
    onClick(event) {
        const route = event.currentTarget;
        const url = route.getAttribute('to');

        const state = { current: url, id: Route.history.nextRouteId };
        const title = url;

        Route.history.pushState(state, title, url);
    }

    // eslint-disable-next-line require-jsdoc
    connectedCallback() {
        this.addEventListener('click', this.onClick);
        window.addEventListener('onHistoryChange', this.onHistoryChange);
    }
}

if (!window.GUIComponentsDefinedElements['gameface-route']) {
    components.defineCustomElement('gameface-route', GamefaceRoute);
}

export { Route };
