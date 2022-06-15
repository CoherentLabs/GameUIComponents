const createResizeElement = async () => {
    const container = document.createElement('DIV');

    const template = `<div class="square" style="background-color: cadetblue; width: 200px; height: 200px;"></div>`;
    container.innerHTML = template;

    document.body.appendChild(container.firstChild);

    await waitResizeFrames();
};

const waitResizeFrames = () => {
    return new Promise((resolve) => {
        waitForStyles(resolve, 4);
    });
};

const removeResizeElement = () => {
    const square = document.querySelector('.square');

    document.body.removeChild(square);
};

const dragBorderElement = (square, x, y, target) => {
    square.onMouseDown({ target });
    square.onMouseMove({ clientX: x, clientY: y });
    square.onMouseUp();
};

describe('Resize', () => {
    beforeEach(async () => {
        await createResizeElement();
    });

    afterEach(() => {
        removeResizeElement();
    });

    it('Should create resize object', () => {
        const square = new interactionManager.resize({ element: '.square' });

        assert.isObject(square);
        assert.isNotNull(square.resizableElement);
    });

    it('Should get correct HTML element', () => {
        const selector = '.square';

        const square = new interactionManager.resize({ element: selector });
        const squareElement = document.querySelector(selector);

        assert.equal(square.resizableElement, squareElement);
    });

    it('Should create correct borders', () => {
        const square = new interactionManager.resize({ element: '.square' });
        const squareElement = square.resizableElement;

        const bottomEdge = squareElement.querySelector('[data-edge="bottom"]');
        const rightEdge = squareElement.querySelector('[data-edge="right"]');
        const bottomRightEdge = squareElement.querySelector('[data-edge="bottomRight"]');

        assert.exists(bottomEdge);
        assert.exists(rightEdge);
        assert.exists(bottomRightEdge);
    });

    it('Should change width', async () => {
        const square = new interactionManager.resize({ element: '.square' });
        const squareElement = square.resizableElement;
        const rightEdge = squareElement.querySelector('[data-edge="right"]');

        const { x } = squareElement.getBoundingClientRect();
        const targetWidth = 300;
        const movement = x + targetWidth;

        dragBorderElement(square, movement, 0, rightEdge);

        await waitResizeFrames();

        const { width } = squareElement.getBoundingClientRect();

        assert.equal(width, targetWidth);
    });

    it('Should change height', async () => {
        const square = new interactionManager.resize({ element: '.square' });
        const squareElement = square.resizableElement;
        const bottomEdge = squareElement.querySelector('[data-edge="bottom"]');

        const { y } = squareElement.getBoundingClientRect();
        const targetHeight = 300;
        const movement = y + targetHeight;

        dragBorderElement(square, 0, movement, bottomEdge);

        await waitResizeFrames();
        const { height } = squareElement.getBoundingClientRect();

        assert.equal(height, targetHeight);
    });

    it('Should change height and width', async () => {
        const square = new interactionManager.resize({ element: '.square' });
        const squareElement = square.resizableElement;
        const bottomRightEdge = squareElement.querySelector('[data-edge="bottomRight"]');

        const { x, y } = squareElement.getBoundingClientRect();
        const target = 300;
        const movementX = x + target;
        const movementY = y + target;

        dragBorderElement(square, movementX, movementY, bottomRightEdge);

        await waitResizeFrames();
        const { height, width } = squareElement.getBoundingClientRect();

        assert.equal(height, target);
        assert.equal(width, target);
    });

    it('Width action should change width', async () => {
        const square = new interactionManager.resize({ element: '.square' });
        const squareElement = square.resizableElement;
        const targetWidth = 300;

        interactionManager.actions.execute(square.widthAction, targetWidth);

        await waitResizeFrames();
        const { width } = squareElement.getBoundingClientRect();

        assert.equal(width, targetWidth);
    });

    it('Height action should change height', async () => {
        const square = new interactionManager.resize({ element: '.square' });
        const squareElement = square.resizableElement;
        const targetHeight = 300;

        interactionManager.actions.execute(square.heightAction, targetHeight);

        await waitResizeFrames();
        const { height } = squareElement.getBoundingClientRect();

        assert.equal(height, targetHeight);
    });

    it('Should trigger onWidthChange', async () => {
        let hasPassed = false;

        const square = new interactionManager.resize({
            element: '.square',
            onWidthChange: () => {
                hasPassed = true;
            },
        });
        const squareElement = square.resizableElement;
        const rightEdge = squareElement.querySelector('[data-edge="right"]');

        const { x } = squareElement.getBoundingClientRect();
        const targetWidth = 300;
        const movement = x + targetWidth;

        dragBorderElement(square, movement, 0, rightEdge);

        await waitResizeFrames();

        assert.isTrue(hasPassed);
    });

    it('Should trigger onHeightChange', async () => {
        let hasPassed = false;

        const square = new interactionManager.resize({
            element: '.square',
            onHeightChange: () => {
                hasPassed = true;
            },
        });
        const squareElement = square.resizableElement;
        const bottomEdge = squareElement.querySelector('[data-edge="bottom"]');

        const { y } = squareElement.getBoundingClientRect();
        const targetHeight = 300;
        const movement = y + targetHeight;

        dragBorderElement(square, 0, movement, bottomEdge);

        await waitResizeFrames();

        assert.isTrue(hasPassed);
    });
});
