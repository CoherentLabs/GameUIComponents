import hexTransperancies from './hexTransperancies.js';

/**
 * Clamp a value between a minimum and maximum value.
 * @param {number} val - the value to be restricted
 * @param {number} min - the minimum value of the range
 * @param {number} max - the maximum number of the range
 * @returns {number}
 */
export function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
}

/* eslint-disable max-lines-per-function */
/**
 *
 * @param {Object} hsl - {h: number, s: number, l: number, a: number}
 * @returns {string} - Hex color
 */
export function hslaToHexAndRGB({ H, S, L, A }) {
    H /= 360;
    S /= 100;
    L /= 100;

    let r, g, b;
    if (S === 0) {
        r = g = b = L; // achromatic
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };
        const q = L < 0.5 ? L * (1 + S) : L + S - L * S;
        const p = 2 * L - q;
        r = hue2rgb(p, q, H + 1 / 3);
        g = hue2rgb(p, q, H);
        b = hue2rgb(p, q, H - 1 / 3);
    }

    const toHex = (x) => {
        const hex = Math.round(x * 255).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };

    return {
        rgba: `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${A})`,
        hex: `#${toHex(r)}${toHex(g)}${toHex(b)}${hexTransperancies[Math.round(A * 100)]}`.toUpperCase(),
    };
}

/* eslint-enable max-lines-per-function */
