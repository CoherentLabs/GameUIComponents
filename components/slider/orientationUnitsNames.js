const orientationUnitsNames = new Map([
    ['vertical', {
        mouseAxisCoords: 'clientY',
        size: 'height',
        position: 'top'
    }],
    ['horizontal', {
        mouseAxisCoords: 'clientX',
        size: 'width',
        position: 'left'
    }]
]);

export { orientationUnitsNames }