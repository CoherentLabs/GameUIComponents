import components from 'coherent-gameface-components';
import theme from '../../theme/components-theme.css';
import styles from './style.css';

class Route {
    static use(browserHistory) {
        class GamefaceRoute extends HTMLElement {
            constructor() {
                super();

                this.history = browserHistory;
                this.onClick = this.onClick.bind(this);
                this.attachEventListeners();

                components.importStyleTag('gameface-route-theme', theme);
                components.importStyleTag('gameface-route', styles);
            }

            attachEventListeners() {
                this.addEventListener('click', this.onClick);
            }

            onClick(e) {
                const route = e.currentTarget;
                const url = route.getAttribute('to');

                this.history.currentRouteId;
                this.history.currentRouteId += 1;

                const state = { current: url, id: this.history.currentRouteId };
                const title = url;

                this.history.pushState(state, title, url);
            }
        }

        components.defineCustomElement('gameface-route', GamefaceRoute);
    }
}

export { Route };