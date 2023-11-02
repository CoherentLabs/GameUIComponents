/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import TextField from './script.js';
import { pm } from 'postmessage-polyfill';
import { fetch as fetchPolyfill } from 'whatwg-fetch';

document.querySelector('#test1').addEventListener('change', event => console.log('change event', event.target.value));
document.querySelector('#test1').addEventListener('blur', event => console.log('blur event', event.target.value));
document.querySelector('#test1').addEventListener('focus', event => console.log('focus event', event.target.value));
document.querySelector('#test1').addEventListener('input', event => console.log('input event', event.target.value));
document.querySelector('#test1').addEventListener('click', event => console.log('click event', event.currentTarget.value));

window.postMessage = function (message) {
    pm({
        origin: 'http://127.0.0.1/:3000',
        target: window,
        data: message,
    });
};
