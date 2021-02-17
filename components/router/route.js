import components from 'coherent-gameface-components';
import theme from '../../theme/components-theme.css';
import { BrowserHistory } from '../../tools/tests/router/router.development';
import styles from './style.css';

class Route {
    /**
     * Creates the GamefaceRoute component class and registers it.
     * @param {BrowserHistory} browserHistory - the browserHistory instance.
     * We pass the history here, so that we can attach the event listeners with the
     * correct history.
    */
    static use(browserHistory) {
        class GamefaceRoute extends HTMLElement {
            constructor() {
                super();

                this.history = browserHistory;
                this.onClick = this.onClick.bind(this);

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

                this.history.currentRouteId;
                this.history.currentRouteId += 1;

                const state = { current: url, id: this.history.currentRouteId };
                const title = url;

                this.history.pushState(state, title, url);
            }
        }
        if (!components.definedElements['gameface-route']) {
            components.defineCustomElement('gameface-route', GamefaceRoute);
        }
    }
}

export { Route };