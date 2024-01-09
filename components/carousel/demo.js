/* eslint-disable no-unused-vars */
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import Carousel from './script.js';

import { pm } from 'postmessage-polyfill';
import { fetch as fetchPolyfill } from 'whatwg-fetch';


/**
 * Create an HTML element that can be added as an item to the carousel
 * @param {string} textContent
 * @returns {HTMLElement}
 */
function createCarouselItem(textContent) {
    const cItem = document.createElement('div');
    cItem.textContent = textContent;
    cItem.id=`box${textContent}`;
    cItem.classList.add('box');
    cItem.style.backgroundColor = `rgba(${getRandomArbitrary(1, 200)}, ${getRandomArbitrary(1, 200)}, ${getRandomArbitrary(1, 200)}, 1)`;

    return cItem;
}

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
    const numberText = document.querySelectorAll('.box').length + 1;
    document.querySelector('gameface-carousel').addItem(createCarouselItem(numberText));

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

document.querySelector('#set-items').addEventListener('click', () => {
    const items = [];

    for (let i = 0; i < 10; i++) {
        const numberText = i + '___element';
        items.push(createCarouselItem(numberText));
    }

    logParagraph.textContent = `Added Elements.`;
    document.querySelector('gameface-carousel').items = items;
});


window.postMessage = function (message) {
    pm({
        origin: 'http://127.0.0.1/:3000',
        target: window,
        data: message,
    });
};
