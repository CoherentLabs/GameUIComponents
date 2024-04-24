/* eslint-disable no-unused-vars */

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import ColorPicker from './script.js';
import { pm } from 'postmessage-polyfill';
import { fetch as fetchPolyfill } from 'whatwg-fetch';
import 'coherent-gameface-tooltip';

window.postMessage = function (message) {
    pm({
        origin: 'http://127.0.0.1/:3000',
        target: window,
        data: message,
    });
};

const colorPicker = document.querySelector('#tooltip-color-picker');
colorPicker.addEventListener('colorchange', (event) => {
    const color = event.detail;
    const colorPreview = document.querySelector('.color-preview');
    colorPreview.style.backgroundColor = color.rgba;
});
