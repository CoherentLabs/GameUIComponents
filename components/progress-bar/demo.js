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
progressBarOne.animDuration = 5000;
progressBarOne.targetValue = 100;

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

const progressBarTwo = document.getElementById('progress-bar-two');
let progressBarTwoValue = 0;

setInterval(() => {
    (progressBarTwoValue < 100) ? progressBarTwoValue += 2 : progressBarTwoValue = 0;
    progressBarTwo.targetValue = progressBarTwoValue;
}, 100);

const progressBarThree = document.getElementById('progress-bar-three');

setInterval(() => {
    progressBarThree.targetValue = getRandomInt(0, 100);
}, getRandomInt(250, 750));

const progressBarFour = document.getElementById('progress-bar-four');

// animation duration controls
const updateAnimDurationAttrButton = document.querySelector('.update-anim-duration');
const animDurationInput = document.querySelector('.anim-duration-input');

updateAnimDurationAttrButton.addEventListener('click', () => {
    progressBarFour.setAttribute('animation-duration', animDurationInput.value);
});

animDurationInput.addEventListener('keydown', (e) => {
    // press enter
    if (e.keyCode === 13) progressBarFour.setAttribute('animation-duration', e.currentTarget.value);
});

const progressBarFive = document.getElementById('progress-bar-five');

// target value controls
const updateTargetValueAttrButton = document.querySelector('.update-target-value');
const targetValueInput = document.querySelector('.target-value-input');

updateTargetValueAttrButton.addEventListener('click', () => {
    progressBarFive.setAttribute('target-value', targetValueInput.value);
});

targetValueInput.addEventListener('keydown', (e) => {
    // press enter
    if (e.keyCode === 13) progressBarFive.setAttribute('target-value', e.currentTarget.value);
});

window.postMessage = function (message) {
    pm({
        origin: 'http://127.0.0.1/:3000',
        target: window,
        data: message,
    });
};
