class BrowserHistory {
    constructor() {
        this.listeners = [];
        this.current = '';
        this.currentRouteId = 0;
    }

    onBeforeNavigation(callback, params) {
        callback(params);
    }

    listen(callback) {
        this.listeners.push(callback);
    }

    dispatch() {
        for (let listener of this.listeners) {
            listener(this.current);
        }
    }

    go(index) {
        this.onBeforeNavigation(() => history.go(), [index]);
    }

    pushState(state, title, url) {
        const result = history.pushState(state, title, url);
        this.current = url;
        this.dispatch();

        return result;
    }

    back() {
        this.onBeforeNavigation(() => history.back(), []);
    }

    forward() {
        this.onBeforeNavigation(() => history.forward(), []);
    }
}

export { BrowserHistory };