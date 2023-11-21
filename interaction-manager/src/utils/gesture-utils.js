/**
 *
 * @param {number} diffX - Difference in X axis
 * @param {number} diffY - Difference in Y axis
 * @returns {string}
 */
export function getDirection(diffX, diffY) {
    if (diffY < 0 && (diffX > -200 && diffX < 200)) return 'top';
    if (diffY > 0 && (diffX > -200 && diffX < 200)) return 'bottom';
    if (diffX < 0 && (diffY > -200 && diffY < 200)) return 'left';
    if (diffX > 0 && (diffY > -200 && diffY < 200)) return 'right';
    if (diffX <= -200 && diffY <= -200) return 'top-left';
    if (diffX >= 200 && diffY <= -200) return 'top-right';
    if (diffX <= -200 && diffY >= 200) return 'bottom-left';
    if (diffX >= 200 && diffY >= 200) return 'bottom-right';
}
