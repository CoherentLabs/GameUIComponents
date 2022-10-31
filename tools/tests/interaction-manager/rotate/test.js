/* eslint-disable new-cap */
/* eslint-disable max-lines-per-function */
/* global createIMElement */
const isCohtml = navigator.userAgent.match('cohtml');

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
        await createIMElement();
    });

    afterEach(() => {
        cleanTestPage('.container');
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

        await createAsyncSpec();

        const { transform } = getComputedStyle(squareElement);

        const angle = !isCohtml ? handleMatrix(transform) : parseInt(transform.match(/\d+/g)[0]);

        assert.isNumber(angle);
    });

    it('Action should rotate element correctly', async () => {
        const square = new interactionManager.rotate({ element: '.square' });
        const squareElement = square.rotatingElement;
        const targetAngle = 45;

        interactionManager.actions.execute(square.actionName, targetAngle);

        await createAsyncSpec();

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

        await createAsyncSpec();

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

        await createAsyncSpec();

        assert.isTrue(hasPassed);
    });
});
