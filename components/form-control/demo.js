/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { pm } from 'postmessage-polyfill';
import { fetch as fetchPolyfill } from 'whatwg-fetch';
import 'coherent-gameface-checkbox';
import 'coherent-gameface-radio-button';
import 'coherent-gameface-switch';
import 'coherent-gameface-rangeslider';
import 'coherent-gameface-dropdown';
import 'coherent-gameface-text-field';
import './script.js';

document.getElementById('dropdown-test').addEventListener('loadend', (event) => {
    document.getElementById('form-eight-response').textContent = event.detail.target.response;
});

// Custom validators should be set after the components library is added!

const form = document.getElementById('custom-validation-form');

form.addEventListener('loadend', (event) => {
    document.getElementById('form-custom-validation').textContent = event.detail.target.response;
});


let serverError = false;
let serverNotReachable = false;

// Will set custom validators for the form element with name attribute that has value - "username"
form.setCustomValidators('username', {
    // There is no required attribute to the form element so we can add validation about it here
    valueMissing: {
        method: element => !element.value,
        errorMessage: () => 'The username is required! ',
    },
    // We can change the default message on the 'tooShort' preset validator
    tooShort: {
        errorMessage: element => `The username should have more than ${element.getAttribute('minlength')} symbols typed! `,
    },
    // Async validator that checks if the user is already added to the database by making a request to the server
    nameExists: {
        method: async (element) => {
            if (!element.value) return false;

            serverError = false;
            serverNotReachable = false;
            return new Promise((resolve) => {
                const xhr = new XMLHttpRequest();
                xhr.open('GET', `http://localhost:3000/user-exists?username=${element.value}`);
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                xhr.onload = event => resolve(event.target.response === 'true');
                xhr.onerror = () => {
                    serverError = true;
                    return resolve(true);
                };
                xhr.timeout = 1000;
                xhr.ontimeout = () => {
                    serverNotReachable = true;
                    return resolve(true);
                },
                xhr.send();
            });
        },
        errorMessage: (element) => {
            if (serverNotReachable) return 'Unable to reach the server! ';
            if (serverError) return 'Unable to reach the server due an error! ';

            return `"${element.value}" already used! Please use another one! `;
        },
    },
});
// We can change where the error message can be displayed for the user name
// By default the error will be visible in a tooltip displayed next to the form element
form.setCustomDisplayErrorElement('username', '#username-error');

// We can set a custom validation of the form element with a custom method and a message
form.setCustomValidators('url', {
    notStartingWithHttpProtocol: {
        method: element => !element.value.startsWith('http://') && !element.value.startsWith('https://'),
        errorMessage: () => 'The url should start with "http://" or "https://"!',
    },
});

form.setCustomValidators('email', {
    // We can remove the preset error message if the preset validator for email fails
    // That will also remove the tooltip because no error messages should be visible even if the check fails
    badEmail: {
        errorMessage: () => '',
    },
});

window.postMessage = function (message) {
    pm({
        origin: 'http://127.0.0.1/:3000',
        target: window,
        data: message,
    });
};
