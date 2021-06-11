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
    }]
]);

export { orientationUnitsNames }