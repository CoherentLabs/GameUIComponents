/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import Slider from './script.js';
import { pm } from 'postmessage-polyfill';
import { fetch as fetchPolyfill } from 'whatwg-fetch';

let blur = 0;
let hueRotate = 0;

window.postMessage = function (message) {
    pm({
        origin: 'http://127.0.0.1/:3000',
        target: window,
        data: message,
    });
};

document.querySelector('.slider-component').addEventListener('slider-scroll', (e) => {
    blur = e.detail.handlePosition / 10;
    document.querySelector('.blur-text').innerHTML = `Blur: ${blur}`;
    document.querySelector('.avatar').style.filter = `blur(${blur}px) hue-rotate(${hueRotate}deg)`;
});

document.querySelector('.horizontal-slider-component').addEventListener('slider-scroll', (e) => {
    hueRotate = e.detail.handlePosition * 3.6;
    document.querySelector('.rotate-text').innerHTML = `Hue Rotate: ${hueRotate}`;
    document.querySelector('.avatar').style.filter = `blur(${blur}px) hue-rotate(${hueRotate}deg)`;
});
