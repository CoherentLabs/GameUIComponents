/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import components from 'coherent-gameface-components';
import theme from '../../theme/components-theme.css';
import styles from './style.css';
import { BrowserHistory } from './history';

/**
 * Creates the GamefaceRoute component class and registers it.
 * We pass the history here, so that we can attach the event listeners with the
 * correct history.
*/

class Route {
    static set history(value) {
        this._history = value;
    }

    static get history() {
        return this._history;
    }

    static use(browserHistory) {
        if (!(browserHistory instanceof BrowserHistory)) {
            console.error(`Type error: ${browserHistory} is not an instance of BrowserHistory.
             Make sure you pass an instance of BrowserHistory to Route.use()!`);
        }
        this.history = browserHistory;
    }
}

class GamefaceRoute extends HTMLElement {
    constructor() {
        super();

        this.addEventListener('click', this.onClick);

        components.importStyleTag('gameface-theme', theme);
        components.importStyleTag('gameface-route', styles);
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
}

if (!components.definedElements['gameface-route']) {
    components.defineCustomElement('gameface-route', GamefaceRoute);
}

export { Route };