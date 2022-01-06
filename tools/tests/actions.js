/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

const DEFAULT_FRAMES_TO_WAIT = 3;

/**
 * Replacement of HtmlElement.click.
 * Dispatches a custom event of type click on a given target element
 * @param {HTMLElement} element - the element that will be clicked
 * @param {object} customEventInit - a dictionary that hold additional event data
*/
function click(element, customEventInit = {}) {
    element.dispatchEvent(new CustomEvent('click', customEventInit));
}

/**
 * Delay the execution of a callback function by n amount of frames.
 * Used to retrieve the computed styles of elements.
 * @param {Function} callback - the function that will be executed.
 * @param {number} count - the amount of frames that the callback execution
 * should be delayed by.
*/
function waitForStyles(callback = () => {}, count = DEFAULT_FRAMES_TO_WAIT) {
    if (count === 0) return callback();
    count--;
    requestAnimationFrame(() => waitForStyles(callback, count));
}

/**
 * Usually wraps assert() in cases where there is a need to wait before validating
 * or wraps an action which needs some frames before proceeding to a validation with assert().
 * @param {Function} callback
 * @param {number} frames
 * @returns {Promise}
 */
function createAsyncSpec(callback = () => {}, frames = DEFAULT_FRAMES_TO_WAIT) {
    return new Promise((resolve, reject) => {
        waitForStyles(() => {
            try {
                callback();
                resolve();
            } catch (error) {
                reject(error);
            }
        }, frames);
    });
}

/**
 * Async function for waiting a certain amount of milliseconds. Default 50ms.
 * @param {number} responseTimeout
 * @returns {Promise}
 */
async function waitServerResponse(responseTimeout = 50) {
	return new Promise((resolve) => {
		setTimeout(resolve, responseTimeout);
	})
}


function setupTestPage() {

}

function cleanTestPage(selector) {
    // Since we don't want to replace the whole content of the body using
    // innerHtml setter, we query only the current custom element and we replace
    // it with a new one; this is needed because the specs are executed in a random
    // order and sometimes the component might be left in a state that is not
    // ready for testing
    let testWrapper = document.querySelector(selector);

    if (testWrapper) {
        testWrapper.parentElement.removeChild(testWrapper);
    }
}