/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

const orientationUnitsNames = new Map([
    ['vertical', {
        mouseAxisCoords: 'clientY',
        size: 'height',
        position: 'top',
        coordinate: 'y',
    }],
    ['horizontal', {
        mouseAxisCoords: 'clientX',
        size: 'width',
        position: 'left',
        coordinate: 'x',
    }],
]);

export { orientationUnitsNames };
