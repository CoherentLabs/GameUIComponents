/**
 * Converts radians to degrees
 * @param {number} rad
 * @returns {number}
 */
export function toDeg(rad) {
    return (rad * 180) / Math.PI;
}

/**
 * Clamps a value in a range
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}
