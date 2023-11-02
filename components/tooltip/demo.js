/* eslint-disable no-unused-vars */
/* eslint-disable require-jsdoc */
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import tooltip from './script.js';
import { pm } from 'postmessage-polyfill';
import { fetch as fetchPolyfill } from 'whatwg-fetch';

document.querySelector('.button').addEventListener('click', (e) => {
    document.querySelector('#tutorial').hide();
});

let timeout;
// Mock dynamic content
function mockContentAsync() {
    return new Promise((resolve) => {
        if (timeout) clearTimeout(timeout);

        timeout = setTimeout(() => {
            resolve('Delayed message received!');
        }, 2000);
    });
}

async function show() {
    const delayedContent = mockContentAsync;
    const tooltipAsync = document.getElementById('async-tooltip');
    await tooltipAsync.setMessage(delayedContent);
}

document.querySelector('#async').addEventListener('mouseenter', show);

window.postMessage = function (message) {
    pm({
        origin: 'http://127.0.0.1/:3000',
        target: window,
        data: message,
    });
};
