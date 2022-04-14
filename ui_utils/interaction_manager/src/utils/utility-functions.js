const modifiers = ['CTRL', 'SHIFT', 'ALT'];
/**
 *
 * @param {string[]} keys
 * @returns {boolean}
 */
export function isCombinationCorrect(keys) {
    let keysCount = 0;

    return keys.reduce((acc, el) => {
        if (!modifiers.includes(el)) keysCount++;

        acc = keysCount <= 1 ? true : false;

        return acc;
    }, false);
}

/**
 *
 * @param {string[]} keys
 * @returns {Object}
 */
export function getModifiers(keys) {
    return keys.reduce(
        (acc, el) => {
            if (!modifiers.includes(el)) return acc;

            acc[el] = true;
            return acc;
        },
        { CTRL: false, ALT: false, SHIFT: false }
    );
}
