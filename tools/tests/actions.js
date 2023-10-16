/* eslint-disable no-unused-vars */
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
 * @returns {Function|void}
*/
function waitForStyles(callback = () => { }, count = DEFAULT_FRAMES_TO_WAIT) {
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
function createAsyncSpec(callback = () => { }, frames = DEFAULT_FRAMES_TO_WAIT) {
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
 * @param {string} selector
 */
function cleanTestPage(selector) {
    // Since we don't want to replace the whole content of the body using
    // innerHtml setter, we query only the current custom element and we replace
    // it with a new one; this is needed because the specs are executed in a random
    // order and sometimes the component might be left in a state that is not
    // ready for testing
    const testWrapper = document.querySelector(selector);

    if (testWrapper) {
        testWrapper.parentElement.removeChild(testWrapper);
    }
}

/**
 * Create a fake event object.
 * @param {HTMLElement} target
 * @param {boolean} bubbles
 * @param {boolean} ctrlKey
 * @returns {object}
 */
function mockEventObject(target, bubbles = false, ctrlKey = false) {
    return {
        target: target,
        ctrlKey: ctrlKey,
        bubbles: bubbles,
        stopPropagation: () => { },
    };
}
/**
 * Creates a square to work with the interaction manager
 * @returns {Promise}
 */
function createIMElement() {
    const container = document.createElement('DIV');

    container.style.width = '500px';
    container.style.height = '500px';
    container.classList.add('container');

    const template = `<div class="square" style="background-color: cadetblue; width: 200px; height: 200px;"></div>`;
    container.innerHTML = template;

    document.body.appendChild(container);

    return new Promise((resolve) => {
        waitForStyles(resolve, 3);
    });
}

/**
 * Drags a draggable object
 * @param {DraggableObject} square
 * @param {Object} options
 * @param {number} options.x
 * @param {number} options.y
 * @param {HTMLElement} options.currentTarget
 * @param {HTMLElement} options.target
 * @param {number} options.startDragY
 * @param {number} options.startDragX
 */
function dragIMElement(square, { x, y, target, currentTarget, startDragX, startDragY }) {
    square.onMouseDown({ target, currentTarget, clientX: startDragX, clientY: startDragY });
    square.onMouseMove({ clientX: x, clientY: y });
    square.onMouseUp();
}

/**
 * Will initialize the binding model or updates it if there is already registered
 * @param {string} modelName
 * @param {object} model
 */
function initModel(modelName, model) {
    // There are components tests with data-binding that are using the same model name so we need to clear the previous model if we are in this scenario
    // If the model already exists clear its keys and add the new keys from the model object
    // We need to clear it in this way so we preserve the reference and updateWholeModel updates it correctly.
    // Otherwise updateWholeModel will fail if we change the reference of the global object for example like this -> window[modelName] = model;
    const currentModel = window[modelName];
    if (currentModel !== undefined) {
        for (const key in currentModel) {
            delete currentModel[key];
        }

        for (const key in model) {
            currentModel[key] = model[key];
        }
    } else {
        engine.createJSModel(modelName, model);
    }

    engine.updateWholeModel(currentModel);
}

/**
 * Creates a Gameface JS data bind model, creates the template with the
 * provided function and synchronizes the models to reflect the change.
 * @param {*} modelName The name of the data binding model that will be created
 * @param {*} template Template that includes an element with data-bind property
 * @param {*} setupFunction The function used in the test for creating the component
 * @param {*} model [{ array: [{}, {}] }] The model used to populate the component
 */
async function setupDataBindingTest(modelName, template, setupFunction, model = { array: [{}, {}] }) {
    initModel(modelName, model);

    await setupFunction(template);

    engine.synchronizeModels();
}

const RETRY_INTERVAL = 500;

/**
 * Retries a test action.
 *
 * @param {function} action
 * @param {function} resolve
 * @param {function} reject
 * @param {number} remainingCount
 * @private
 */
function _retryInner(action, resolve, reject, remainingCount) {
    action().then(resolve).catch((error) => {
        if (remainingCount) {
            remainingCount--;

            setTimeout(() => {
                _retryInner(action, resolve, reject, remainingCount);
            }, RETRY_INTERVAL);
        } else {
            reject(error);
        }
    });
}

/**
 * Retries a function if it fails for a number of times.
 *
 * @param {function} action
 * @param {number} retryCount - Default = 10.
 * @returns {Promise<any>}
 */
function retryIfFails(action, retryCount = 10) {
    return new Promise((resolve, reject) => {
        _retryInner(action, resolve, reject, retryCount);
    });
}

/**
 * This is currently only used for the Scrollable Container tests.
 * Chrome can start with great height and there will be no scroll.
 * I didn't want to include another dependency like https://www.npmjs.com/package/karma-viewport
 * @param {element} container
 * @param {number} xySize Desired width and height in pixels.
 */
function resizeElementTo(container, xySize = 500) {
    container.style.height = `${xySize}px`;
    container.style.width = `${xySize}px`;
}
