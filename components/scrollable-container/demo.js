/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import ScrollableContainer from './script.js';
import { pm } from 'postmessage-polyfill';
import { fetch as fetchPolyfill } from 'whatwg-fetch';

const modeElement = document.getElementById('mode');

document.querySelector('.show-dynamic-content').addEventListener('click', () => {
    document.querySelector('.dynamic-content').style.display = 'block';
});
document.querySelector('.hide-dynamic-content').addEventListener('click', () => {
    document.querySelector('.dynamic-content').style.display = 'none';
});
document.querySelector('.remove-auto-attribute').addEventListener('click', () => {
    document.querySelector('.auto').removeAttribute('automatic');
    modeElement.textContent = 'Non automatic';
});
document.querySelector('.add-auto-attribute').addEventListener('click', () => {
    document.querySelector('.auto').setAttribute('automatic', 'automatic');
    modeElement.textContent = 'Automatic';
});

const modeElementFixedSlider = document.getElementById('mode-fixed-slider');
document.querySelector('.show-dynamic-content-fixed-slider').addEventListener('click', () => {
    document.querySelector('.dynamic-content-fixed-slider').style.display = 'block';
});
document.querySelector('.hide-dynamic-content-fixed-slider').addEventListener('click', () => {
    document.querySelector('.dynamic-content-fixed-slider').style.display = 'none';
});
document.querySelector('.remove-auto-attribute-fixed-slider').addEventListener('click', () => {
    document.querySelector('.auto-fixed-slider').removeAttribute('automatic');
    modeElementFixedSlider.textContent = 'Non automatic';
});
document.querySelector('.add-auto-attribute-fixed-slider').addEventListener('click', () => {
    document.querySelector('.auto-fixed-slider').setAttribute('automatic', 'automatic');
    modeElementFixedSlider.textContent = 'Automatic';
});

window.postMessage = function (message) {
    pm({
        origin: 'http://127.0.0.1/:3000',
        target: window,
        data: message,
    });
};
