/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

class History {
    constructor() {
        this.currentRouteId = -1;
        this.onHistoryChange = null;
        this.onBeforeNavigation = null;
        this._onPopStateBound = this._onPopState.bind(this);
    }

    get currentState() {
        if (!window.history || !window.history.state || !window.history.state.current) return '';
        return window.history.state.current;
    }

    get nextRouteId() {
        return this.currentRouteId + 1;
    }

    /**
     * Will call the history change callback if there is one
     */
    _dispatchHistoryChange() {
        if (!this.onBeforeNavigation) {
            if (this.onHistoryChange) this.onHistoryChange();
            return;
        }

        this.onBeforeNavigation(() => {
            if (this.onHistoryChange) this.onHistoryChange();
        });
    }

    _onPopState(event) {
        if (this.skipPopStateEvent) {
            this.skipPopStateEvent = false;
            return;
        }

        if (!window.history || !window.history.state) return;
        // onpopstate is triggered when back, go or forward is called and the event object
        // does not hold information about which one of these methods triggered the event
        // so we keep track of the currentRouteId, we set it ot each pushState and we compare the
        // values on popstate to see if the user's going back or forward
        const navDirection = this._getNavigationDirection(this.currentRouteId, event.state.id);
        this.currentRouteId += navDirection;
        this._dispatchHistoryChange();
    }

    /**
     * Compares the currentRouteId of the current route and the previous one and
     * determines if the user's going back or forward.
     * @param {number} previous - the id of the history state before navigation
     * @param {number} current - the id of the history state after navigation attempt
     * @returns {number} - 0 if it's the same route, -1 if going back, 1 if going forward
     */
    _getNavigationDirection(previous, current) {
        if (previous === current) return 0; // same
        if (previous > current) return -1;  // back
        return 1;                           // forward
    }

    /**
     * Will add the popstate event
     */
    addPopStateListener() {
        window.addEventListener('popstate', this._onPopStateBound);
    }

    /**
     * Will remove the popstate event
     */
    removePopStateListener() {
        window.addEventListener('popstate', this._onPopStateBound);
    }
}

class BrowserHistory extends History {
    /**
     * Calls history.pushState. Calls dispatch to notify listeners that the
     * history has changed.
     * @param {object} state - the new state object.
     * @param {string} title - the title of the state.
     * @param {string} url - the url of the the state.
     */
    pushState(state, title, url) {
        history.pushState(state, title, url);

        this.currentRouteId++;
        this._dispatchHistoryChange();
    }
}

class HashHistory extends History {
    /**
     * Calls history.replaceState. Calls dispatch to notify listeners that the
     * history has changed.
     * @param {object} state - the new state object.
     * @param {string} title - the title of the state.
     * @param {string} url - the url of the the state.
     */
    pushState(state, title, url) {
        //we need to skip the pop state here because changing the window.location.hash will trigger popstate event.
        this.skipPopStateEvent = true;

        //set url as hash. This will change the current history state as well and will prefix the url with #.
        window.location.hash = url;
        //we need to replace the state in order to save the state to the history. The state.id will be used when onPopState is executed
        history.replaceState(state, title, window.location.href);
        this.currentRouteId++;
        this._dispatchHistoryChange();
    }
}

export { BrowserHistory, HashHistory };