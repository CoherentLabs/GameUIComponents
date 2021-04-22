/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

class BrowserHistory {
    constructor() {
        this.listeners = [];
        this.currentURL = '';
        this.currentRouteId = 0;
    }

    /**
     * Adds a callback to the listeners array.
     * @param {function} callback - the function that will be called on dispatch.
    */
    listen(callback) {
        this.listeners.push(callback);
    }

    get nextRouteId() {
        return this.currentRouteId + 1;
    }

    /**
     * Calls all functions added to the listeners array.
    */
    dispatch() {
        for (let listener of this.listeners) {
            listener(this.currentURL);
        }
    }

    /**
     * Calls history.go.
     * Will call onBeforeNavigation if it is set.
     * @param {number} index - the position in the history stack.
    */
    go(index) {
        if (!this.onBeforeNavigation) return history.go(index);
        this.onBeforeNavigation(() => history.go(), [index]);
    }

    /**
     * Calls history.pushState. Calls dispatch to notify listeners that the
     * history has changed.
     * @param {object} state - the new state object.
     * @param {string} title - the title of the state.
     * @param {string} url - the url of the the state.
     */
    pushState(state, title, url) {
        history.pushState(state, title, url);
        this.currentURL = url;
        this.dispatch();
    }

    /**
     * Calls history.back.
     * Will call onBeforeNavigation if it is set.
    */
    back() {
        if (!this.onBeforeNavigation) return history.back();
        this.onBeforeNavigation(() => history.back(), []);
    }

    /**
     * Calls history.forward.
     * Will call onBeforeNavigation if it is set.
    */
    forward() {
        if (!this.onBeforeNavigation) return history.forward();
        this.onBeforeNavigation(() => history.forward(), []);
    }
}

export { BrowserHistory };