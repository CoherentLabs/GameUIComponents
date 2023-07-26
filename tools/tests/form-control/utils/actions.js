/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { SERVER_TIMEOUT } from './constants';

/**
 * Will submit the form and wait for server response
 * @param {HTMLElement} formElement
 * @param {boolean} [shouldWaitForServerResponse=true]
 * @param {boolean} [hasLoadendEvent=true]
 * @returns {boolean}
 */
export async function submitForm(formElement, shouldWaitForServerResponse = true, hasLoadendEvent = false) {
    const submitButton = formElement.querySelector('[type="submit"]');

    if (!shouldWaitForServerResponse) {
        if (hasLoadendEvent) {
            return new Promise((resolve) => {
                const loadendHandler = (event) => {
                    document.getElementById('form-response').textContent = event.detail.target.response;
                    // Remove event listener because it has been trigered again in the next form submit test after the form element is cleared in the Player.
                    formElement.removeEventListener('loadend', loadendHandler);
                    return resolve(true);
                };

                formElement.addEventListener('loadend', loadendHandler);
                click(submitButton);
            });
        } else {
            click(submitButton);
            return true;
        }
    }

    return new Promise((resolve, reject) => {
        const xhr = formElement.xhr;
        xhr.onload = event => resolve(event.target.response);
        xhr.onerror = () => reject('Submitting form failed because of server error!');
        xhr.ontimeout = () => reject('Submitting form failed because of server timeout!');
        xhr.timeout = SERVER_TIMEOUT;
        xhr.onabort = () => reject('Submitting form failed because request has been aborted!');

        click(submitButton);
        setTimeout(() => reject('Unknown error occured during submitting the form!'), SERVER_TIMEOUT * 2);
    });
}

/**
 * Will check the response data from the server
 * @param {string} expectedData
 */
export async function checkResponseData(expectedData) {
    await createAsyncSpec(() => {
        const data = document.querySelector('.response').textContent;
        assert(data === expectedData, `The form data is not the same as the expected one. Expected: ${expectedData}. Received: ${data}`);
    });
}
