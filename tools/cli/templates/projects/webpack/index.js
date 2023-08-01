/* eslint-disable no-unused-vars */
import { Checkbox } from 'coherent-gameface-checkbox';
import { pm } from 'postmessage-polyfill';
import { fetch as fetchPolyfill } from 'whatwg-fetch';

import './style.css';
import './node_modules/coherent-gameface-checkbox/coherent-gameface-components-theme.css';
import './node_modules/coherent-gameface-checkbox/style.css';
import './node_modules/coherent-gameface-grid/dist/grid.production.min.css';

const originalInterval = window.setInterval;
window.setInterval = function (callback, delay = 0) {
    return originalInterval(callback, delay);
};

window.postMessage = function (message) {
    pm({
        type: message.type,
        origin: 'http://127.0.0.1/:3000',
        target: window,
        data: message,
    });
};
