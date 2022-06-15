const createDropzoneElement = (hasChild = false) => {
    const container = document.createElement('DIV');

    container.style.width = '100px';
    container.style.height = '100px';
    container.classList.add('dropzone');

    if (hasChild) {
        container.innerHTML = `<div class="square" style="background-color: cadetblue; width: 100px; height: 100px;"></div>`;
    }

    return container;
};

const createDropzones = async () => {
    const zones = [true, false, true, false, true];

    zones.forEach((zone) => {
        document.body.appendChild(createDropzoneElement(zone));
    });

    await waitDropzoneFrames();
};

const waitDropzoneFrames = () => {
    return new Promise((resolve) => {
        waitForStyles(resolve, 4);
    });
};

const removeDropzones = () => {
    const dropzones = document.querySelectorAll('.dropzone');

    dropzones.forEach((dropzone) => document.body.removeChild(dropzone));
};

const dragToDropzone = (square, x, y, dropzone) => {
    const squareElement = square.draggableElements[0];

    square.draggedOver = dropzone;

    square.onMouseDown({ currentTarget: squareElement });
    square.onMouseMove({ clientX: x, clientY: y });
    square.onMouseUp();

    square.draggedOver = null;
};

describe('Dropzone', () => {
    beforeEach(async () => {
        await createDropzones();
    });

    afterEach(() => {
        removeDropzones();
    });

    it('Should create dropzone object', () => {
        const square = new interactionManager.dropzone({ element: '.square', dropzones: ['.dropzone'] });

        assert.isObject(square);
        assert.isNotNull(square.draggableElements);
        assert.isNotNull(square.dropzones);
    });

    it('Should get correct HTML element', () => {
        const selector = '.square';

        const square = new interactionManager.dropzone({ element: selector, dropzones: ['.dropzone'] });
        const squareElement = document.querySelector(selector);

        assert.equal(square.draggableElements[0], squareElement);
    });

    it('Should drag element to dropzone', async () => {
        const square = new interactionManager.dropzone({ element: '.square', dropzones: ['.dropzone'] });
        const squareElement = square.draggableElements[0];
        const dropzone = square.dropzones[1];

        const { left: dropzoneLeft, top: dropzoneTop } = dropzone.getBoundingClientRect();

        dragToDropzone(square, dropzoneLeft, dropzoneTop, dropzone);

        await waitDropzoneFrames();

        const { left, top } = squareElement.getBoundingClientRect();

        assert.equal(left, dropzoneLeft);
        assert.equal(top, dropzoneTop);
    });

    it('Should add to dropzone if droptype is add', async () => {
        const square = new interactionManager.dropzone({
            element: '.square',
            dropzones: ['.dropzone'],
            dropType: 'add',
        });
        const dropzone = square.dropzones[2];

        const { left: dropzoneLeft, top: dropzoneTop } = dropzone.getBoundingClientRect();

        dragToDropzone(square, dropzoneLeft, dropzoneTop, dropzone);

        await waitDropzoneFrames();

        assert.equal(dropzone.children.length, 2);
    });

    it('Should not move element if droptype is none', async () => {
        const square = new interactionManager.dropzone({
            element: '.square',
            dropzones: ['.dropzone'],
            dropType: 'none',
        });
        const squareElement = square.draggableElements[0];
        const dropzone = square.dropzones[2];

        const { left: initialLeft, top: initialTop } = squareElement.getBoundingClientRect();
        const { left: dropzoneLeft, top: dropzoneTop } = dropzone.getBoundingClientRect();

        dragToDropzone(square, dropzoneLeft, dropzoneTop, dropzone);

        await waitDropzoneFrames();

        const { left, top } = squareElement.getBoundingClientRect();

        assert.equal(left, initialLeft);
        assert.equal(top, initialTop);
    });

    it('Should switch elements if droptype is switch', async () => {
        const square = new interactionManager.dropzone({
            element: '.square',
            dropzones: ['.dropzone'],
            dropType: 'switch',
        });
        const squareElement = square.draggableElements[0];
        const dropzone = square.dropzones[2];
        const dropzoneChild = dropzone.children[0];

        const { left: initialLeft, top: initialTop } = squareElement.getBoundingClientRect();
        const { left: switchLeft, top: switchTop } = dropzoneChild.getBoundingClientRect();
        const { left: dropzoneLeft, top: dropzoneTop } = dropzone.getBoundingClientRect();

        dragToDropzone(square, dropzoneLeft, dropzoneTop, dropzone);

        await waitDropzoneFrames();

        const { left, top } = squareElement.getBoundingClientRect();
        const { left: switchNewLeft, top: switchNewTop } = dropzoneChild.getBoundingClientRect();

        assert.equal(switchNewLeft, initialLeft);
        assert.equal(switchNewTop, initialTop);
        assert.equal(left, switchLeft);
        assert.equal(top, switchTop);
    });

    it('Should shift element to the nearest empty space if droptype is shift', async () => {
        const square = new interactionManager.dropzone({
            element: '.square',
            dropzones: ['.dropzone'],
            dropType: 'shift',
        });
        const squareElement = square.draggableElements[0];
        const dropzone = square.dropzones[2];
        const dropzoneNext = square.dropzones[1];
        const dropzoneChild = dropzone.children[0];

        const { left: dropzoneLeft, top: dropzoneTop } = dropzone.getBoundingClientRect();
        const { left: dropzoneNextLeft, top: dropzoneNextTop } = dropzoneNext.getBoundingClientRect();

        dragToDropzone(square, dropzoneLeft, dropzoneTop, dropzone);

        await waitDropzoneFrames();

        const { left, top } = squareElement.getBoundingClientRect();
        const { left: switchLeft, top: switchTop } = dropzoneChild.getBoundingClientRect();

        assert.equal(switchLeft, dropzoneNextLeft);
        assert.equal(switchTop, dropzoneNextTop);
        assert.equal(left, dropzoneLeft);
        assert.equal(top, dropzoneTop);
    });

    it('Should trigger onDragStart callback', async () => {
        let hasPassed = false;
        const square = new interactionManager.dropzone({
            element: '.square',
            dropzones: ['.dropzone'],
            onDragStart: () => {
                hasPassed = true;
            },
        });
        const dropzone = square.dropzones[1];

        const { left: dropzoneLeft, top: dropzoneTop } = dropzone.getBoundingClientRect();

        dragToDropzone(square, dropzoneLeft, dropzoneTop, dropzone);

        await waitDropzoneFrames();

        assert.isTrue(hasPassed);
    });

    it('Should trigger onDragMove callback', async () => {
        let hasPassed = false;
        const square = new interactionManager.dropzone({
            element: '.square',
            dropzones: ['.dropzone'],
            onDragMove: () => {
                hasPassed = true;
            },
        });
        const dropzone = square.dropzones[1];

        const { left: dropzoneLeft, top: dropzoneTop } = dropzone.getBoundingClientRect();

        dragToDropzone(square, dropzoneLeft, dropzoneTop, dropzone);

        await waitDropzoneFrames();

        assert.isTrue(hasPassed);
    });

    it('Should trigger onDragEnd callback', async () => {
        let hasPassed = false;
        const square = new interactionManager.dropzone({
            element: '.square',
            dropzones: ['.dropzone'],
            onDragEnd: () => {
                hasPassed = true;
            },
        });
        const dropzone = square.dropzones[1];

        const { left: dropzoneLeft, top: dropzoneTop } = dropzone.getBoundingClientRect();

        dragToDropzone(square, dropzoneLeft, dropzoneTop, dropzone);

        await waitDropzoneFrames();

        assert.isTrue(hasPassed);
    });
});
