/* eslint-disable no-unused-vars */
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import Carousel from './script.js';

import { pm } from 'postmessage-polyfill';
import { fetch as fetchPolyfill } from 'whatwg-fetch';


/**
 * Returns a random number between min (inclusive) and max (exclusive)
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

const logParagraph = document.querySelector('#log');

// add element function
document.querySelector('#add').addEventListener('click', () => {
    const cItem = document.createElement('div');
    const numberText = document.querySelectorAll('.box').length + 1;
    cItem.textContent = numberText;
    cItem.id=`box${numberText}`;
    cItem.classList.add('box');
    cItem.style.backgroundColor = `rgba(${getRandomArbitrary(0, 255)}, ${getRandomArbitrary(0, 255)}, ${getRandomArbitrary(0, 255)}, 1)`;

    document.querySelector('gameface-carousel').addItem(cItem);

    logParagraph.textContent = `
        Added Element at ${numberText} position.
    `;
});

// remove element function
document.querySelector('#remove').addEventListener('click', () => {
    const allItems = document.querySelectorAll('.box');
    const allItemsLength = allItems.length;

    const idxToRemove = Math.floor(getRandomArbitrary(0, allItemsLength - 1));
    const itemToRemove = allItems[idxToRemove];
    const itemText = itemToRemove.textContent;

    document.querySelector('gameface-carousel').removeItem(idxToRemove);

    logParagraph.textContent = `
        Removed Element with number ${itemText}.
    `;
});

// update page size function
document.querySelector('#change_page').addEventListener('keydown', (event) => {
    // enter
    if (event.keyCode === 13) document.querySelector('gameface-carousel').pageSize = Math.floor(event.currentTarget.value);
});


window.postMessage = function (message) {
    pm({
        origin: 'http://127.0.0.1/:3000',
        target: window,
        data: message,
    });
};
