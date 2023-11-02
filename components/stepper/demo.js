/* eslint-disable no-unused-vars */

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import Stepper from './script.js';
import { pm } from 'postmessage-polyfill';
import { fetch as fetchPolyfill } from 'whatwg-fetch';

const stepper = document.querySelector('.stepper-component-keyboard');

document.addEventListener('keydown', (e) => {
    if (e.keyCode === 37) {
        stepper.prev();
    }

    if (e.keyCode === 39) {
        stepper.next();
    }
});

window.postMessage = function (message) {
    pm({
        origin: 'http://127.0.0.1/:3000',
        target: window,
        data: message,
    });
};
