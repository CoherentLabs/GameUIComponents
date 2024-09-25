/* eslint-disable new-cap */
/* eslint-disable max-lines-per-function */
/* global createIMElement */
const simulateZoom = (x, y, direction, element) => {
    element.onWheel({
        preventDefault: () => {},
        clientX: x,
        clientY: y,
        deltaY: direction * -1,
    });
};

describe('Pan and Zoom', () => {
    beforeEach(async () => {
        await createIMElement();
    });

    afterEach(() => {
        cleanTestPage('.square');
        cleanTestPage('.container');
    });

    it('Should create panzoom object', () => {
        const zoom = new interactionManager.zoom({ element: '.square' });

        assert.isObject(zoom);
        assert.isNotNull(zoom.zoomableElement);
    });

    it('Should get correct element', () => {
        const selector = '.square';
        const zoom = new interactionManager.zoom({ element: selector });
        const zoomElement = document.querySelector(selector);

        assert.equal(zoom.zoomableElement, zoomElement);
    });

    it('Should zoom in correctly', async () => {
        const zoom = new interactionManager.zoom({ element: '.square' });
        const zoomElement = zoom.zoomableElement;

        const { width: initialWidth, height: initialHeight } = zoomElement.getBoundingClientRect();

        simulateZoom(100, 100, 1, zoom);

        await createAsyncSpec();

        const { width, height } = zoomElement.getBoundingClientRect();

        assert.equal((initialHeight * 1.1).toFixed(0), height.toFixed(0));
        assert.equal((initialWidth * 1.1).toFixed(0), width.toFixed(0));
    });

    it('Should zoom out correctly', async () => {
        const zoom = new interactionManager.zoom({ element: '.square' });
        const zoomElement = zoom.zoomableElement;

        const { width: initialWidth, height: initialHeight } = zoomElement.getBoundingClientRect();

        simulateZoom(100, 100, -1, zoom);

        await createAsyncSpec();

        const { width, height } = zoomElement.getBoundingClientRect();

        assert.equal((initialHeight * 0.9).toFixed(0), height.toFixed(0));
        assert.equal((initialWidth * 0.9).toFixed(0), width.toFixed(0));
    });

    it('Should pan correctly', async () => {
        const zoom = new interactionManager.zoom({ element: '.square' });
        const zoomElement = zoom.zoomableElement;
        const offset = 100;

        const { left: initialLeft, top: initialTop } = zoomElement.getBoundingClientRect();

        simulateZoom(initialLeft + offset, initialTop + offset, 1, zoom);

        await createAsyncSpec();

        const { left, top } = zoomElement.getBoundingClientRect();

        assert.equal((initialLeft - offset * 0.1).toFixed(0), left.toFixed(0));
        assert.equal((initialTop - offset * 0.1).toFixed(0), top.toFixed(0));
    });

    it('Should not zoom out less than the min zoom', async () => {
        let scale = 1;
        const minZoom = 0.3;
        const zoom = new interactionManager.zoom({ element: '.square', minZoom });
        const zoomElement = zoom.zoomableElement;

        const { width: initialWidth, height: initialHeight } = zoomElement.getBoundingClientRect();

        while (scale >= minZoom - 0.1) {
            simulateZoom(100, 100, -1, zoom);
            scale -= 0.1;
        }

        await createAsyncSpec();

        const { width, height } = zoomElement.getBoundingClientRect();

        assert.equal((initialHeight * minZoom).toFixed(0), height.toFixed(0));
        assert.equal((initialWidth * minZoom).toFixed(0), width.toFixed(0));
    });

    it('Should not zoom in more than the max zoom', async () => {
        let scale = 1;
        const maxZoom = 2;
        const zoom = new interactionManager.zoom({ element: '.square', maxZoom });
        const zoomElement = zoom.zoomableElement;

        const { width: initialWidth, height: initialHeight } = zoomElement.getBoundingClientRect();

        while (scale <= maxZoom + 0.1) {
            simulateZoom(100, 100, 1, zoom);
            scale += 0.1;
        }

        await createAsyncSpec();

        const { width, height } = zoomElement.getBoundingClientRect();

        assert.equal((initialHeight * maxZoom).toFixed(0), height.toFixed(0));
        assert.equal((initialWidth * maxZoom).toFixed(0), width.toFixed(0));
    });

    it('Should zoom according to the zoom factor', async () => {
        const zoomFactor = 1;
        const zoom = new interactionManager.zoom({ element: '.square', zoomFactor });
        const zoomElement = zoom.zoomableElement;

        const { width: initialWidth, height: initialHeight } = zoomElement.getBoundingClientRect();

        simulateZoom(100, 100, 1, zoom);

        await createAsyncSpec();

        const { width, height } = zoomElement.getBoundingClientRect();

        assert.equal((initialHeight * (1 + zoomFactor)).toFixed(0), height.toFixed(0));
        assert.equal((initialWidth * (1 + zoomFactor)).toFixed(0), width.toFixed(0));
    });

    it('Should trigger onZoom callback', async () => {
        let hasPassed = false;
        const zoom = new interactionManager.zoom({
            element: '.square',
            onZoom: () => {
                hasPassed = true;
            },
        });

        simulateZoom(100, 100, 1, zoom);

        await createAsyncSpec();

        assert.isTrue(hasPassed);
    });
});
