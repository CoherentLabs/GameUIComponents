export const ORIENTATIONS = ['vertical', 'horizontal'];

/**
 * Converts a value to percent in a range
 * @param {number} value - the value to be converted
 * @param {number} min - the minimum value of the range
 * @param {number} max - the maximum number of the range
 * @returns {number} - returns the value in percent
 */
export function valueToPercent(value, min, max) {
    return ((value - min) * 100) / (max - min);
}

/**
 * Restricts a given value in a range
 * @param {number} val - the value to be restricted
 * @param {number} min - the minimum value of the range
 * @param {number} max - the maximum number of the range
 * @returns {number}
 */
export function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
}

/**
 * Checks if the orientation passed is vertical or horizontal, if it's neither it's set to horizontal
 * @param {string} orientation - the orientation string
 * @returns {string} - horizontal or vertical;
 */
export function checkOrientation(orientation) {
    if (!ORIENTATIONS.includes(orientation)) {
        console.warn(`'${orientation}' is not a valid orientation. It should be either 'horizontal' or 'vertical'. Will fallback to 'horizontal'`);
        return 'horizontal';
    }

    return orientation;
}

/**
 * Will validate the custom handle selector and if element with that selector exists.
 * @param {string} customHandleSelector
 * @param {HTMLElement} customHandleElement
 */
export function validateCustomHandle(customHandleSelector, customHandleElement) {
    if (customHandleSelector && !customHandleElement) {
        console.warn(`Unable to find element with selector - "${customHandleSelector}" that will be used for displaying the range slider value.`);
    }
}
