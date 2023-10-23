/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
/* eslint-disable require-jsdoc */
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import progressBar from './script.js';
import { pm } from 'postmessage-polyfill';
import { fetch as fetchPolyfill } from 'whatwg-fetch';

const progressBarOne = document.getElementById('progress-bar-one');
progressBarOne.setProgress(100);

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

const progressBarTwo = document.getElementById('progress-bar-two');
let progressBarTwoValue = 0;

setInterval(() => {
    (progressBarTwoValue < 100) ? progressBarTwoValue += 2 : progressBarTwoValue = 0;
    progressBarTwo.setProgress(progressBarTwoValue);
}, 100);

const progressBarThree = document.getElementById('progress-bar-three');

setInterval(() => {
    progressBarThree.setProgress(getRandomInt(0, 100));
}, getRandomInt(250, 750));

window.postMessage = function (message) {
    pm({
        origin: 'http://127.0.0.1/:3000',
        target: window,
        data: message,
    });
};
