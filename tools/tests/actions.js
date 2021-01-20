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
function waitForStyles(callback = () => { }, count = 3) {
    if (count === 0) return callback();
    count--;
    requestAnimationFrame(() => waitForStyles(callback, count));
}