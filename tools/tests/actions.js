/**
 * Replacement of HtmlElement.click.
 * Dispatches a custom event of type click on a given target element
 * @param {HTMLElement} element - the element that will be clicked
 * @param {object} customEventInit - a dictionary that hold additional event data
*/
function click(element, customEventInit = {}) {
    element.dispatchEvent(new CustomEvent('click', customEventInit));
}