const isCohtml = navigator.userAgent.match('cohtml');

const createRotateElement = async () => {
    const container = document.createElement('DIV');

    container.style.width = '500px';
    container.style.height = '500px';
    container.classList.add('container');

    const template = `<div class="square" style="background-color: cadetblue; width: 200px; height: 200px;"></div>`;
    container.innerHTML = template;

    document.body.appendChild(container);

    await waitRotateFrames();
};

const waitRotateFrames = () => {
    return new Promise((resolve) => {
        waitForStyles(resolve, 4);
    });
};

const removeRotateElement = () => {
    const container = document.querySelector('.container');

    document.body.removeChild(container);
};

const rotateElement = (square, x, y) => {
    const { left, top, width } = square.rotatingElement.getBoundingClientRect();

    square.onMouseDown({ clientX: left + width / 2, clientY: top });
    square.onMouseMove({ clientX: left + width / 2 + x, clientY: top + y });
    square.onMouseUp();
};

const handleMatrix = (matrix) => {
    const values = matrix.match(/(?<=\().+?(?=\))/g)[0].split(','); // Get value between parenthesis

    return Math.round(Math.asin(parseFloat(values[1])) * (180 / Math.PI));
};

describe('Rotate', () => {
    beforeEach(async () => {
        await createRotateElement();
    });

    afterEach(() => {
        removeRotateElement();
    });

    it('Should create rotate object', () => {
        const square = new interactionManager.rotate({ element: '.square' });

        assert.isObject(square);
        assert.isNotNull(square.rotatingElement);
    });

    it('Should get correct element', () => {
        const selector = '.square';

        const square = new interactionManager.rotate({ element: selector });
        const squareElement = document.querySelector(selector);

        assert.equal(square.rotatingElement, squareElement);
    });

    it('Should rotate element', async () => {
        const square = new interactionManager.rotate({ element: '.square' });
        const squareElement = square.rotatingElement;

        const moveX = 100;
        const moveY = 100;

        rotateElement(square, moveX, moveY);

        await waitRotateFrames();

        const { transform } = getComputedStyle(squareElement);

        const angle = !isCohtml ? handleMatrix(transform) : parseInt(transform.match(/\d+/g)[0]);

        assert.isNumber(angle);
    });

    it('Action should rotate element correctly', async () => {
        const square = new interactionManager.rotate({ element: '.square' });
        const squareElement = square.rotatingElement;
        const targetAngle = 45;

        interactionManager.actions.execute(square.actionName, targetAngle);

        await waitRotateFrames();

        const { transform } = getComputedStyle(squareElement);

        const angle = !isCohtml ? handleMatrix(transform) : parseInt(transform.match(/\d+/g)[0]);

        assert.equal(angle, targetAngle);
    });

    it('Should correctly snap to angle', async () => {
        const snapAngle = 45;
        const square = new interactionManager.rotate({ element: '.square', snapAngle });
        const squareElement = square.rotatingElement;

        const moveX = 100;
        const moveY = 100;

        rotateElement(square, moveX, moveY);

        await waitRotateFrames();

        const { transform } = getComputedStyle(squareElement);

        const angle = !isCohtml ? handleMatrix(transform) : parseInt(transform.match(/\d+/g)[0]);

        assert.isTrue(angle % snapAngle === 0);
    });

    it('Should trigger onRotation callback', async () => {
        let hasPassed = false;

        const square = new interactionManager.rotate({
            element: '.square',
            onRotation: () => {
                hasPassed = true;
            },
        });

        const moveX = 100;
        const moveY = 100;

        rotateElement(square, moveX, moveY);

        await waitRotateFrames();

        assert.isTrue(hasPassed);
    });
});
