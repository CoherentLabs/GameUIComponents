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