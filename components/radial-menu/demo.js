/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import RadialMenu from './script.js';
import { pm } from 'postmessage-polyfill';
import { fetch as fetchPolyfill } from 'whatwg-fetch';
import itemsModel from './demo/items-mocking.js';

setTimeout(() => {
    const radialMenuOne = document.getElementById('radial-menu-one');
    // Provide the items.
    radialMenuOne.items = itemsModel.items;

    const radialMenuTwo = document.getElementById('radial-menu-two');
    // Provide the items.
    radialMenuTwo.items = itemsModel.items;


    // Listen to the same event names provided in the related attributes.
    radialMenuOne.addEventListener('radOneItemChanged', () => {
        console.log(`Highlighted item has changed.`);
    });

    radialMenuOne.addEventListener('radOneItemSelected', () => {
        console.log(
            ('Item <' + radialMenuOne.items[radialMenuOne.currentSegmentId].name + '>' +
                ' with id: ' + radialMenuOne.items[radialMenuOne.currentSegmentId].id +
                ' in segment #' + radialMenuOne.currentSegmentId) + ' selected');
    });
}, 0);

window.postMessage = function (message) {
    pm({
        origin: 'http://127.0.0.1/:3000',
        target: window,
        data: message,
    });
};
