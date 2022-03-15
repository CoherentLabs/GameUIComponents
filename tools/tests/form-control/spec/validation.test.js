/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { VALIDATION_TEMPLATE, CUSTOM_FORM_VALIDATION_TEMPLATE } from '../utils/templates';
import { ERROR_MESSAGES, SERVER_TIMEOUT } from '../utils/constants';
import { submitForm } from '../utils/actions';

/**
 * @param {HTMLElement} element
 * @returns {string}
 */
function getTextContent(element) {
    return element.textContent.replace(/(\n)+/g, '').trim();
}

/**
 * Will set new input value
 * @param {string} elSelector
 * @param {string} value
 */
function setValue(elSelector, value) {
    const input = document.querySelector(elSelector);
    input.value = value;
}

/**
 * Will get the tooltip message
 * @returns {string}
 */
function getTooltipMessage() {
    const tooltip = document.querySelector('gameface-form-control').tooltip;
    assert(tooltip.style.display !== 'none', 'Tooltip was not displayed!');

    const received = getTextContent(tooltip);
    tooltip.hide();
    return received;
}

/**
 * Will test if the tooltip will be visible when a bad value exist in the gameface form
 * @param {string} elSelector
 * @param {string} errorType
 * @param {string} value
 * @returns {Promise<void>}
 */
async function badValueTest(elSelector, errorType, value) {
    setValue(elSelector, value);
    const formElement = document.querySelector('gameface-form-control');
    await submitForm(formElement, false);

    return createAsyncSpec(() => {
        const received = getTooltipMessage();
        const expected = ERROR_MESSAGES.get(errorType);
        assert(received === expected, `The error message is not correct. Expected: ${expected}. Received: ${received}.`);
    });
}

/**
 * Will test if the custom validation when a bad value exist in the gameface form
 * @param {string} elSelector
 * @param {string} errorMessage
 * @param {string} value
 * @param {string} errorDisplayElement
 * @param {string} [waitServerResponse = false]
 * @returns {Promise<void>}
 */
async function badValueTestCustomValidation(
    elSelector,
    errorMessage,
    value,
    errorDisplayElement,
    waitServerResponse = false
) {
    setValue(elSelector, value);
    const formElement = document.querySelector('gameface-form-control');
    await submitForm(formElement, false);

    // Used to test server side validation of the username
    if (waitServerResponse) {
        await new Promise(resolve => setTimeout(resolve, SERVER_TIMEOUT));
    }

    return createAsyncSpec(() => {
        let received = null;

        if (!errorDisplayElement) {
            received = getTooltipMessage();
        } else {
            received = getTextContent(document.querySelector(errorDisplayElement));
        }

        assert(received === errorMessage, `The error message is not correct. Expected: ${errorMessage}. Received: ${received}.`);
    });
}

let serverError, serverNotReachable;

/**
 * Will tests for user name existense on the server side
 * @param {HTMLElement} element
 * @returns {boolean}
 */
async function nameExistsValidationMethod(element) {
    if (!element.value) return false;

    serverError = false;
    serverNotReachable = false;
    return new Promise((resolve) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `http://localhost:12345/user-exists?username=${element.value}`);
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
        };
        xhr.send();
    });
}

/**
 * Method for testing custom error messages on the custom validation of the form
 * @param {HTMLElement} element
 * @returns {string}
 */
function getCustomErrorMessage(element) {
    if (serverNotReachable) return 'Unable to reach the server! ';
    if (serverError) return 'Unable to reach the server due an error! ';

    return `"${element.value}" already used! Please use another one! `;
}

/**
 * Will set the custom form validators for the test
 * @param {HTMLElement} form
 */
function setCustomFormValidators(form) {
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
            method: nameExistsValidationMethod,
            errorMessage: getCustomErrorMessage,
        },
    });
}

/**
 * Method for initializing the test for custom validation of the form
 */
function setCustomValidators() {
    const form = document.getElementById('custom-validation-form');

    form.addEventListener('loadend', (event) => {
        document.getElementById('form-response').textContent = event.detail.target.response;
    });

    serverError = false;
    serverNotReachable = false;

    setCustomFormValidators(form);
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
}

/**
 * Will setup test page for the forms tests
 * @param {string} template
 * @returns {Promise<void>}
 */
function setupFormValidationTestPage(template) {
    const el = document.createElement('div');
    el.innerHTML = template;
    el.className = 'form-validation-test-wrapper';
    el.style.position = 'absolute';
    el.style.top = '200px';
    el.style.left = '200px';

    cleanTestPage('.form-validation-test-wrapper');

    document.body.appendChild(el);

    return new Promise((resolve) => {
        waitForStyles(resolve);
    });
}

/**
 * Will check the response from the server that will be visible into a HTML element
 * @param {boolean} expected
 */
async function checkResponse(expected) {
    await createAsyncSpec(() => {
        const data = document.querySelector('.response').textContent;
        assert(data === expected, `The form data is not the same as the expected one. Expected: ${expected}. Received: ${data}`);
    });
}

// eslint-disable-next-line max-lines-per-function
describe('Form validation', () => {
    afterAll(() => {
        const tooltips = document.querySelectorAll('gameface-tooltip');
        for (let i = 0; i < tooltips.length; i++) {
            tooltips[i].parentElement.removeChild(tooltips[i]);
        }

        cleanTestPage('.form-validation-test-wrapper');
    });

    beforeEach(function (done) {
        setupFormValidationTestPage(VALIDATION_TEMPLATE).then(done);
    });

    it('Should show value missing error', async () => {
        return badValueTest('#role', 'valueMissing', '');
    });

    it('Should show value too long error', async () => {
        return badValueTest('#username', 'tooLong', 'This is too long');
    });

    it('Should show value too short error', async () => {
        return badValueTest('#username', 'tooShort', 'Th');
    });

    it('Should show value too small - range underflow.', async () => {
        return badValueTest('#age', 'rangeUnderflow', 5);
    });

    it('Should show value too big - range overflow.', async () => {
        return badValueTest('#age', 'rangeOverflow', 40);
    });

    it('Should not validate elements that do not have name.', async () => {
        const input = document.querySelector('#no-name');
        input.value = '20';

        const formElement = document.querySelector('gameface-form-control');
        await submitForm(formElement, false);

        return createAsyncSpec(() => {
            const tooltip = formElement.tooltip;
            assert(tooltip === undefined, 'Tooltip should be displayed!');
        });
    });
});

// eslint-disable-next-line max-lines-per-function
describe('Form custom validation', () => {
    afterAll(() => {
        const tooltips = document.querySelectorAll('gameface-tooltip');
        for (let i = 0; i < tooltips.length; i++) {
            tooltips[i].parentElement.removeChild(tooltips[i]);
        }

        cleanTestPage('.form-validation-test-wrapper');
    });

    beforeAll(function (done) {
        setupFormValidationTestPage(CUSTOM_FORM_VALIDATION_TEMPLATE).then(() => {
            setCustomValidators();
            done();
        });
    });

    it('Should test with empty username', async () => {
        return badValueTestCustomValidation(
            '#username',
            'The username should have more than 5 symbols typed! The username is required!',
            '',
            '#username-error'
        );
    });

    it('Should test with short username', async () => {
        return badValueTestCustomValidation(
            '#username',
            'The username should have more than 5 symbols typed!',
            'abc',
            '#username-error'
        );
    });

    it('Should test with already added username', async () => {
        return badValueTestCustomValidation(
            '#username',
            '"username1" already used! Please use another one!',
            'username1',
            '#username-error',
            true
        );
    });

    it('Should test with another already added username', async () => {
        return badValueTestCustomValidation(
            '#username',
            '"username2" already used! Please use another one!',
            'username2',
            '#username-error',
            true
        );
    });

    it('Should set correct value for username', async () => {
        setValue('#username', 'username');
        assert(document.getElementById('username').value === 'username', 'The value of the username is not "username"');
    });

    it('Should test custom message of the url shown in a tooltip', async () => {
        return badValueTestCustomValidation(
            '#url',
            'The url should start with "http://" or "https://"!',
            'non valid site url'
        );
    });

    it('Should set correct value for the url', async () => {
        setValue('#url', 'https://site.com');
        assert(document.getElementById('url').value === 'https://site.com', 'The value of the url is not "https://site.com"');
    });

    it('Should set invalid email and receive no display error. The submit should be prevented.', async () => {
        setValue('#email', 'invalid');
        assert(document.getElementById('email').value === 'invalid', 'The value of the email is not "invalid"');
        const formElement = document.querySelector('gameface-form-control');
        await submitForm(formElement, false);
        await checkResponse('');
    });

    it('Should set correct value for the email', async () => {
        setValue('#email', 'email@domain.com');
        assert(document.getElementById('email').value === 'email@domain.com', 'The value of the email is not "email@domain.com"');
    });

    it('Should submit the form and have valid response', async () => {
        const formElement = document.querySelector('gameface-form-control');
        await submitForm(formElement, false);
        await checkResponse('{"username":"username","url":"https://site.com","email":"email@domain.com"}');
    });
});
