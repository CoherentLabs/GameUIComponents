const createDraggableElement = async () => {
    const container = document.createElement('DIV');

    container.style.width = '500px';
    container.style.height = '500px';
    container.classList.add('container');

    const template = `<div class="square" style="background-color: cadetblue; width: 200px; height: 200px;"></div>`;
    container.innerHTML = template;

    document.body.appendChild(container);

    await waitDraggableFrames();
};

const waitDraggableFrames = () => {
    return new Promise((resolve) => {
        waitForStyles(resolve, 4);
    });
};

const removeDraggableElement = () => {
    const container = document.querySelector('.container');

    document.body.removeChild(container);
};

const dragElement = (square, x, y) => {
    const squareElement = square.draggableElements[0];
    square.onMouseDown({ currentTarget: squareElement });
    square.onMouseMove({ clientX: x, clientY: y });
    square.onMouseUp();
};

describe('Draggable', () => {
    beforeEach(async () => {
        await createDraggableElement();
    });

    afterEach(() => {
        removeDraggableElement();
    });

    it('Should create draggable object', () => {
        const square = new interactionManager.draggable({ element: '.square' });

        assert.isObject(square);
        assert.isNotNull(square.draggableElements);
    });

    it('Should get correct HTML element', () => {
        const selector = '.square';

        const square = new interactionManager.draggable({ element: selector });
        const squareElement = document.querySelector(selector);

        assert.equal(square.draggableElements[0], squareElement);
    });

    it('Should drag element on screen', async () => {
        const movement = 100;

        const square = new interactionManager.draggable({ element: '.square' });
        const squareElement = square.draggableElements[0];

        dragElement(square, movement, movement);

        await waitDraggableFrames();

        const { left, top } = squareElement.getBoundingClientRect();

        assert.equal(left, movement);
        assert.equal(top, movement);
    });

    it('Action should move the element on screen', async () => {
        const movement = 100;

        const square = new interactionManager.draggable({ element: '.square' });
        const squareElement = square.draggableElements[0];

        squareElement.style.position = 'absolute';

        interactionManager.actions.execute(square.actionName, { x: movement, y: movement, index: 0 });

        await waitDraggableFrames();

        const { left, top } = squareElement.getBoundingClientRect();

        assert.equal(left, movement);
        assert.equal(top, movement);
    });

    it('Should lock element in x axis when dragging', async () => {
        const movement = 100;

        const square = new interactionManager.draggable({ element: '.square', lockAxis: 'x' });
        const squareElement = square.draggableElements[0];

        const initialPosition = squareElement.getBoundingClientRect();

        dragElement(square, movement, movement);

        await waitDraggableFrames();

        const newPosition = squareElement.getBoundingClientRect();

        assert.equal(newPosition.left, movement);
        assert.equal(newPosition.top, initialPosition.top);
    });

    it('Should lock element in y axis when dragging', async () => {
        const movement = 100;

        const square = new interactionManager.draggable({ element: '.square', lockAxis: 'y' });
        const squareElement = square.draggableElements[0];

        const initialPosition = squareElement.getBoundingClientRect();

        dragElement(square, movement, movement);

        await waitDraggableFrames();

        const newPosition = squareElement.getBoundingClientRect();

        assert.equal(newPosition.top, movement);
        assert.equal(newPosition.left, initialPosition.left);
    });

    it('Should not go out of parent bounds when dragging', async () => {
        const square = new interactionManager.draggable({ element: '.square', restrictTo: '.container' });
        const squareElement = square.draggableElements[0];

        const { width: parentWidth, height: parentHeight } = squareElement.parentNode.getBoundingClientRect();
        const movementX = parentWidth + 200;
        const movementY = parentHeight + 200;

        dragElement(square, movementX, movementY);

        await waitDraggableFrames();

        const { left, top } = squareElement.getBoundingClientRect();

        assert.isBelow(left, parentWidth);
        assert.isBelow(top, parentHeight);
    });

    it('Should trigger onDragStart callback', () => {
        const movement = 100;

        let hasPassed = false;

        const square = new interactionManager.draggable({
            element: '.square',
            onDragStart: () => {
                hasPassed = true;
            },
        });

        dragElement(square, movement, movement);

        assert.isTrue(hasPassed);
    });

    it('Should trigger onDragMove callback', () => {
        const movement = 100;

        let hasPassed = false;

        const square = new interactionManager.draggable({
            element: '.square',
            onDragMove: () => {
                hasPassed = true;
            },
        });

        dragElement(square, movement, movement);

        assert.isTrue(hasPassed);
    });

    it('Should trigger onDragEnd callback', () => {
        const movement = 100;

        let hasPassed = false;

        const square = new interactionManager.draggable({
            element: '.square',
            onDragEnd: () => {
                hasPassed = true;
            },
        });

        dragElement(square, movement, movement);

        assert.isTrue(hasPassed);
    });
});
