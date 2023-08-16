/* eslint-disable no-unused-vars */
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/* eslint-disable require-jsdoc */
import '../node_modules/coherent-gameface-ui/node_modules/coherent-gameface-grid/dist/grid.production.min.css';
import {
    Checkbox,
    Switch,
    GamefaceMenu,
    GamefaceDropdown,
    Modal,
    ProgressBar,
    RadialMenu,
    GamefaceRadioGroup,
    Rangeslider,
    Slider,
    Stepper,
    Tooltip,
    TextField,
    AccordionMenu,
    Tabs,
    Router, Route, BrowserHistory, HashHistory,
    Components,
} from 'coherent-gameface-ui';

const components = new Components();

/* eslint-disable-require-jsdoc */
class Home extends HTMLElement {
    connectedCallback() {
        this.template = '<div>Home Page Content</div>';
        components.renderOnce(this);
    }
}
class StartGame extends HTMLElement {
    connectedCallback() {
        this.template = '<div>Start Game Page Content</div>';
        components.renderOnce(this);
    }
}


components.defineCustomElement('home-page', Home);
components.defineCustomElement('start-game-page', StartGame);

const history = new HashHistory();
Route.use(history);

// eslint-disable-next-line no-unused-vars
const router = new Router({
    '/': 'home-page',
    '/start-game': 'start-game-page',
}, history);


const state = { current: '/', id: history.currentRouteId };
const title = 'home';
history.pushState(state, title, '/');
