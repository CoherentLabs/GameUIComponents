/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { SERVER_TIMEOUT } from "./constants";

export async function submitForm(formElement, shouldWaitForServerResponse = true) {
    const submitButton = formElement.querySelector('[type="submit"]');

    if (!shouldWaitForServerResponse) {
        click(submitButton);
        return true;
    }

    return new Promise((resolve, reject) => {
        const xhr = formElement.xhr;
        xhr.onload = (event) => resolve(event.target.response);
        xhr.onerror = () => reject('Submitting form failed because of server error!');
        xhr.ontimeout = () => reject('Submitting form failed because of server timeout!');
        xhr.timeout = SERVER_TIMEOUT;
        xhr.onabort = () => reject('Submitting form failed because request has been aborted!');

        click(submitButton);
        setTimeout(() => reject('Unknown error occured during submitting the form!'), SERVER_TIMEOUT * 2);
    })
}

export async function checkResponseData(expectedData) {
    await createAsyncSpec(() => {
        const data = document.querySelector('.response').textContent;
        assert(data === expectedData, `The form data is not the same as the expected one. Expected: ${expectedData}. Received: ${data}`);
    });
}