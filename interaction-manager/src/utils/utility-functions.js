/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

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

/**
 * Creates a random 5 character hash
 * @returns {string}
 */
export function createHash() {
    return (Math.random() + 1).toString(36).substring(7);
}

/**
 * Get the distance between two points
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @returns {number}
 */
export function distanceBetweenTwoPoints(x1, y1, x2, y2) {
    const a = x1 - x2;
    const b = y1 - y2;

    return Math.hypot(a, b);
}

/**
 * Calculates the midpoint between two points
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @returns {Object}
 */
export function getMidPoint(x1, y1, x2, y2) {
    return {
        x: (x1 + x2) / 2,
        y: (y1 + y2) / 2,
    };
}
