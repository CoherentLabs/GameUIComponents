/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

const orientationUnitsNames = new Map([
    ['vertical', {
        mouseAxisCoords: 'clientY',
        size: 'height',
        sizePX: 'heightPX',
        position: 'top',
        scroll: 'scrollHeight',
    }],
    ['horizontal', {
        mouseAxisCoords: 'clientX',
        size: 'width',
        sizePX: 'widthPX',
        position: 'left',
        scroll: 'scrollWidth',
    }]
]);

export { orientationUnitsNames }