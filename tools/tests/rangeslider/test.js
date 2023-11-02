/**
 * @param {string} customHandle
 */
function addCustomElementValue(customHandle) {
    const customElementValue = document.createElement('span');
    customElementValue.id = customHandle.replace('#', '');
    customElementValue.style.marginRight = '20px';
    document.body.appendChild(customElementValue);
}

/**
 * @param {Object} param0
 * @returns {Promise<void>}
 */
function loadRangeslider({ value, min, max, values, grid, thumb, twoHandles, orientation,
    step,
    customHandle,
    customHandleLeft,
    customHandleRight,
}) {
    const attributes = [
        value ? `value="${value}"` : '',
        min ? `min="${min}"` : '',
        max ? `max="${max}"` : '',
        values ? `values=${JSON.stringify(values).replace(/"/g, '&quot;')}` : '',
        orientation ? `orientation="${orientation}"` : '',
        step ? `step="${step}"` : '',
        grid ? `grid` : '',
        thumb ? `thumb` : '',
        twoHandles ? `two-handles` : '',
        customHandle ? `custom-handle="${customHandle}"` : '',
        customHandleLeft ? `custom-handle-left="${customHandleLeft}"` : '',
        customHandleRight ? `custom-handle-right="${customHandleRight}"` : '',
    ];

    const wrapper = document.createElement('div');
    wrapper.innerHTML = `<gameface-rangeslider ${attributes.join(' ')}></gameface-rangeslider>`;

    customHandle && addCustomElementValue(customHandle);
    customHandleLeft && addCustomElementValue(customHandleLeft);
    customHandleRight && addCustomElementValue(customHandleRight);

    document.body.appendChild(wrapper.children[0]);

    return new Promise((resolve) => {
        waitForStyles(resolve, 4);
    });
}

const dragSim = (start, end, element) => {
    return new Promise((resolve) => {
        const drag = (currX, endX) => {
            element.onMouseMove({ clientX: currX });

            if (currX < endX) {
                requestAnimationFrame(() => drag(currX + 1, endX));
                return;
            }

            resolve();
        };

        drag(start, end);
    });
};

const customHandleSelectors = {
    SINGLE: '#myValue',
    LEFT: '#myValueLeft',
    RIGHT: '#myValueRight',
};

/**
 * Will remove the custom handles
 */
function removeCustomHandles() {
    for (const value of Object.values(customHandleSelectors)) {
        const element = document.querySelector(value);

        if (element) {
            document.body.removeChild(element);
        }
    }
}

// eslint-disable-next-line max-lines-per-function
describe('Rangeslider component', () => {
    afterEach(() => {
        cleanTestPage('gameface-rangeslider');
        removeCustomHandles();
    });

    it('Should be rendered', async () => {
        await loadRangeslider({});
        const rangeslider = document.querySelector('.guic-horizontal-rangeslider');
        assert.exists(rangeslider, 'Rangeslider is rendered in the DOM');
    });

    it('Should be horizontal', async () => {
        await loadRangeslider({ orientation: 'horizontal' });
        const rangeslider = document.querySelector('.guic-horizontal-rangeslider');
        const { width, height } = rangeslider.getBoundingClientRect();

        assert.isAbove(width, height);
    });

    it('Should be vertical', async () => {
        await loadRangeslider({ orientation: 'vertical' });
        const rangeslider = document.querySelector('.guic-vertical-rangeslider');
        const { width, height } = rangeslider.getBoundingClientRect();

        assert.isAbove(height, width);
    });

    it('Should change orientation dynamically', async () => {
        await loadRangeslider({ orientation: 'vertical' });
        const rangeslider = document.querySelector('gameface-rangeslider');
        rangeslider.orientation = 'horizontal';
        await createAsyncSpec(() => {
            const { width, height } = document.querySelector('.guic-horizontal-rangeslider').getBoundingClientRect();
            assert.isAbove(width, height);
        });

        rangeslider.setAttribute('orientation', 'vertical');
        await createAsyncSpec(() => {
            const { width, height } = document.querySelector('.guic-vertical-rangeslider').getBoundingClientRect();
            assert.isAbove(height, width);
        });
    });

    it('Handle should correspond to value', async () => {
        const value = 50;
        await loadRangeslider({ value });
        const rangesliderHandle = document.querySelector('.guic-horizontal-rangeslider-handle');
        const left = parseFloat(rangesliderHandle.style.left);

        assert.equal(left, value);
    });

    it('Should change value dynamically', async () => {
        await loadRangeslider({});
        const rangeSlider = document.querySelector('gameface-rangeslider');
        const rangesliderHandle = document.querySelector('.guic-horizontal-rangeslider-handle');
        rangeSlider.value = 70;
        let left = parseFloat(rangesliderHandle.style.left);
        assert.equal(left, 70);

        rangeSlider.setAttribute('value', 20);
        left = parseFloat(rangesliderHandle.style.left);
        assert.equal(left, 20);
    });

    it('Should set value to min if changed value is invalid', async () => {
        await loadRangeslider({ value: 70 });
        const rangeSlider = document.querySelector('gameface-rangeslider');
        const rangesliderHandle = document.querySelector('.guic-horizontal-rangeslider-handle');
        rangeSlider.value = 'invalid';
        const left = parseFloat(rangesliderHandle.style.left);
        assert.equal(left, 0);
    });

    it('Should change value dynamically that overflows min', async () => {
        await loadRangeslider({ min: 10, max: 70 });
        const rangeSlider = document.querySelector('gameface-rangeslider');
        const rangesliderHandle = document.querySelector('.guic-horizontal-rangeslider-handle');

        rangeSlider.value = -10;
        const left = parseFloat(rangesliderHandle.style.left);
        assert.equal(left, 0);
    });

    it('Should change value dynamically that overflows max', async () => {
        await loadRangeslider({ min: 10, max: 70 });
        const rangeSlider = document.querySelector('gameface-rangeslider');
        const rangesliderHandle = document.querySelector('.guic-horizontal-rangeslider-handle');
        rangeSlider.value = 200;
        const left = parseFloat(rangesliderHandle.style.left);
        assert.equal(left, 100);
    });

    it('Should change dynamically min and recalculate the value', async () => {
        await loadRangeslider({ value: 30, min: 10, max: 70 });
        const rangeSlider = document.querySelector('gameface-rangeslider');
        const rangesliderHandle = document.querySelector('.guic-horizontal-rangeslider-handle');
        rangeSlider.min = 35;
        const left = parseFloat(rangesliderHandle.style.left);
        assert.equal(left, 0);
        assert.equal(rangeSlider.value, 35);
    });

    it('Should change dynamically max and recalculate the value', async () => {
        await loadRangeslider({ value: 35, min: 10, max: 70 });
        const rangeSlider = document.querySelector('gameface-rangeslider');
        const rangesliderHandle = document.querySelector('.guic-horizontal-rangeslider-handle');

        rangeSlider.setAttribute('max', 30);
        const left = parseFloat(rangesliderHandle.style.left);
        assert.equal(left, 100);
        assert.equal(rangeSlider.value, 30);
    });

    it('Should add values dynamically and change the rangeslider behavior', async () => {
        await loadRangeslider({ value: 50, grid: true });
        const rangeSlider = document.querySelector('gameface-rangeslider');
        rangeSlider.values = ['Easy', 'Medium', 'Hard'];

        await createAsyncSpec(() => {
            const values = document.querySelectorAll('.guic-rangeslider-horizontal-grid-text');
            assert.equal(rangeSlider.values.length, values.length);
            values.forEach((value, index) => {
                assert.equal(value.textContent, rangeSlider.values[index]);
            });
        }, 4);
    });

    it('Should remove values dynamically and change the rangeslider behavior', async () => {
        await loadRangeslider({ value: 50, grid: true, values: ['Easy', 'Medium', 'Hard'] });
        const rangeSlider = document.querySelector('gameface-rangeslider');
        rangeSlider.removeAttribute('values');

        await createAsyncSpec(() => {
            const expectedGridValues = ['0', '25', '50', '75', '100'];
            const values = document.querySelectorAll('.guic-rangeslider-horizontal-grid-text');
            assert.equal(expectedGridValues.length, values.length);
            values.forEach((value, index) => {
                assert.equal(value.textContent, expectedGridValues[index]);
            });
        }, 4);
    });

    it('Should change value dynamically', async () => {
        await loadRangeslider({ step: 20 });
        const rangeSlider = document.querySelector('gameface-rangeslider');
        const rangesliderHandle = document.querySelector('.guic-horizontal-rangeslider-handle');
        rangeSlider.value = 15;
        let left = parseFloat(rangesliderHandle.style.left);
        assert.equal(left, 20);

        rangeSlider.setAttribute('value', 5);
        left = parseFloat(rangesliderHandle.style.left);
        assert.equal(left, 0);
    });

    it('Should change value dynamically of rangeslider with values attribute', async () => {
        await loadRangeslider({ values: ['Easy', 'Medium', 'Hard'] });
        const rangeSlider = document.querySelector('gameface-rangeslider');
        const rangesliderHandle = document.querySelector('.guic-horizontal-rangeslider-handle');
        rangeSlider.value = 'Easy';
        let left = parseFloat(rangesliderHandle.style.left);
        assert.equal(left, 0);

        rangeSlider.setAttribute('value', 'Medium');
        left = parseFloat(rangesliderHandle.style.left);
        assert.equal(left, 50);

        rangeSlider.value = 'Hard';
        left = parseFloat(rangesliderHandle.style.left);
        assert.equal(left, 100);
    });

    it('Should set value to min if changed value is invalid for rangeslider with values array', async () => {
        await loadRangeslider({ values: ['Easy', 'Medium', 'Hard'], value: 'Hard' });
        const rangeSlider = document.querySelector('gameface-rangeslider');
        const rangesliderHandle = document.querySelector('.guic-horizontal-rangeslider-handle');
        rangeSlider.value = 'invalid';
        const left = parseFloat(rangesliderHandle.style.left);
        assert.equal(left, 0);
    });

    it('Custom handle should correspond to value', async () => {
        const value = 50;
        await loadRangeslider({ value, customHandle: customHandleSelectors.SINGLE });
        const customHandle = document.querySelector(customHandleSelectors.SINGLE);
        assert.exists(customHandle, 'Custom handle element is rendered in the DOM');
        assert.equal(customHandle.textContent, value);
    });

    it('Should change customHandle dynamically and check its value', async () => {
        const value = 50;
        await loadRangeslider({ value, customHandle: customHandleSelectors.SINGLE });
        const rangeSlider = document.querySelector('gameface-rangeslider');
        const customHandle = document.querySelector(customHandleSelectors.SINGLE);
        assert.exists(customHandle, 'Custom handle element is rendered in the DOM');
        addCustomElementValue('test');
        const customHandleTest = document.querySelector('#test');
        assert.exists(customHandleTest, 'Custom handle test element is rendered in the DOM');
        rangeSlider.customHandle = '#test';
        assert.equal(rangeSlider.customHandle, customHandleTest);

        rangeSlider.value = 70;
        assert.equal(customHandle.textContent, value);
        assert.equal(customHandleTest.textContent, rangeSlider.value);
    });

    it('Bar should correspond to value', async () => {
        const value = 50;
        await loadRangeslider({ value });
        const rangesliderBar = document.querySelector('.guic-horizontal-rangeslider-bar');
        const width = parseFloat(rangesliderBar.style.width);

        assert.equal(width, value);
    });

    it('Should have grid', async () => {
        await loadRangeslider({ grid: true });
        const grid = document.querySelector('.guic-horizontal-rangeslider-grid');
        assert.exists(grid);
    });

    it('Should disable grid dynamically', async () => {
        await loadRangeslider({ grid: true });
        const rangeSlider = document.querySelector('gameface-rangeslider');
        rangeSlider.grid = false;
        const grid = document.querySelector('.guic-horizontal-rangeslider-grid');
        assert.equal(grid, null);
    });

    it('Should enable grid dynamically', async () => {
        await loadRangeslider({});
        const rangeSlider = document.querySelector('gameface-rangeslider');

        rangeSlider.setAttribute('grid', '');
        const grid = document.querySelector('.guic-horizontal-rangeslider-grid');
        assert.exists(grid);
    });

    it('Should have thumb', async () => {
        await loadRangeslider({ thumb: true });
        const thumb = document.querySelector('.guic-horizontal-rangeslider-thumb');
        assert.exists(thumb);
    });

    it('Should disable thumb dynamically', async () => {
        await loadRangeslider({ thumb: true });
        const rangeSlider = document.querySelector('gameface-rangeslider');
        rangeSlider.thumb = false;
        const thumb = document.querySelector('.guic-horizontal-rangeslider-thumb');
        assert.equal(thumb, null);
    });

    it('Should enable thumb dynamically', async () => {
        await loadRangeslider({});
        const rangeSlider = document.querySelector('gameface-rangeslider');
        rangeSlider.setAttribute('thumb', '');
        const thumb = document.querySelector('.guic-horizontal-rangeslider-thumb');
        assert.exists(thumb);
    });

    it('Should have two handles', async () => {
        await loadRangeslider({ twoHandles: true });
        const handles = document.querySelectorAll('.guic-horizontal-rangeslider-handle');
        assert.lengthOf(handles, 2);
    });

    it('Should disable two handles', async () => {
        await loadRangeslider({ twoHandles: true });
        const rangeSlider = document.querySelector('gameface-rangeslider');
        rangeSlider.twoHandles = false;
        let handles;
        await createAsyncSpec(() => {
            handles = document.querySelectorAll('.guic-horizontal-rangeslider-handle');
            assert.lengthOf(handles, 1);
        });
    });

    it('Should enable/disable two handles', async () => {
        await loadRangeslider({});
        const rangeSlider = document.querySelector('gameface-rangeslider');
        rangeSlider.setAttribute('two-handles', '');

        await createAsyncSpec(() => {
            const handles = document.querySelectorAll('.guic-horizontal-rangeslider-handle');
            assert.lengthOf(handles, 2);
        });
    });

    it('Should change dynamically min and recalculate the values when two handles are enabled', async () => {
        await loadRangeslider({ twoHandles: true, min: 10, max: 70 });
        const rangeSlider = document.querySelector('gameface-rangeslider');
        const rangesliderHandles = document.querySelectorAll('.guic-horizontal-rangeslider-handle');
        rangeSlider.min = 35;
        const left = parseFloat(rangesliderHandles[0].style.left);
        assert.equal(left, 0);
        assert.equal(rangeSlider.value[0], 35);
    });

    it('Should change dynamically max and recalculate the values when two handles are enabled', async () => {
        await loadRangeslider({ twoHandles: true, min: 10, max: 70 });
        const rangeSlider = document.querySelector('gameface-rangeslider');
        const rangesliderHandles = document.querySelectorAll('.guic-horizontal-rangeslider-handle');
        rangeSlider.setAttribute('max', 60);
        const left = parseFloat(rangesliderHandles[1].style.left);
        assert.equal(left, 100);
        assert.equal(rangeSlider.value[1], 60);
    });

    it('Should have two thumbs', async () => {
        await loadRangeslider({ twoHandles: true, thumb: true });
        const thumbs = document.querySelectorAll('.guic-horizontal-rangeslider-thumb');
        assert.lengthOf(thumbs, 2);
    });

    it('Should disable two thumbs', async () => {
        await loadRangeslider({ twoHandles: true, thumb: true });
        const rangeslider = document.querySelector('gameface-rangeslider');
        rangeslider.thumb = false;
        const thumbs = document.querySelectorAll('.guic-horizontal-rangeslider-thumb');
        assert.lengthOf(thumbs, 0);
    });

    it('Should enable two thumbs', async () => {
        await loadRangeslider({ twoHandles: true });
        const rangeslider = document.querySelector('gameface-rangeslider');
        rangeslider.setAttribute('thumb', '');
        const thumbs = document.querySelectorAll('.guic-horizontal-rangeslider-thumb');
        assert.lengthOf(thumbs, 2);
    });

    it('Should emit custom event', (done) => {
        loadRangeslider({}).then(() => {
            const rangeslider = document.querySelector('gameface-rangeslider');
            rangeslider.addEventListener('sliderupdate', ({ detail }) => {
                assert.equal(detail, 50);
                done();
            });

            rangeslider.updateSliderPosition(50, 0);
        });
    });

    it('Should move handle and change bar width when clicked on', async () => {
        await loadRangeslider({});
        const rangeslider = document.querySelector('gameface-rangeslider');
        const rangesliderElement = rangeslider.querySelector('.guic-horizontal-rangeslider');
        const handle = rangeslider.querySelector('.guic-horizontal-rangeslider-handle');
        const bar = rangeslider.querySelector('.guic-horizontal-rangeslider-bar');
        const { x, width } = rangesliderElement.getBoundingClientRect();

        rangeslider.onMouseDown({ clientX: x + width / 2 });
        rangeslider.onMouseUp();

        assert.equal(parseFloat(bar.style.width), 50);
        assert.equal(parseFloat(handle.style.left), 50);
    });

    it('Should move closest handle when clicked on', async () => {
        await loadRangeslider({ twoHandles: true, thumb: true });
        const rangeslider = document.querySelector('gameface-rangeslider');
        const rangesliderElement = rangeslider.querySelector('.guic-horizontal-rangeslider');
        const handles = rangeslider.querySelectorAll('.guic-horizontal-rangeslider-handle');
        const { x, width } = rangesliderElement.getBoundingClientRect();

        // 0.75 so that I am sure that the click is closer to the second handle
        rangeslider.onMouseDown({ clientX: x + width * 0.75 });
        rangeslider.onMouseUp();

        assert.equal(parseFloat(handles[1].style.left), 75);
    });

    it('Should change handle positon and bar width when dragged', async () => {
        await loadRangeslider({});
        const rangeslider = document.querySelector('gameface-rangeslider');
        const rangesliderElement = rangeslider.querySelector('.guic-horizontal-rangeslider');
        const handle = rangeslider.querySelector('.guic-horizontal-rangeslider-handle');
        const bar = rangeslider.querySelector('.guic-horizontal-rangeslider-bar');
        const { x, width } = rangesliderElement.getBoundingClientRect();

        rangeslider.onMouseDown({ clientX: x });

        await dragSim(x, x + width / 4, rangeslider);
        rangeslider.onMouseUp();

        assert.equal(parseFloat(bar.style.width), 25);
        assert.equal(parseFloat(handle.style.left), 25);
    });

    it('Should change thumb positon and value when dragged', async () => {
        await loadRangeslider({ thumb: true });
        const rangeslider = document.querySelector('gameface-rangeslider');
        const rangesliderElement = rangeslider.querySelector('.guic-horizontal-rangeslider');
        const thumb = rangeslider.querySelector('.guic-horizontal-rangeslider-thumb');
        const { x, width } = rangesliderElement.getBoundingClientRect();

        rangeslider.onMouseDown({ clientX: x });

        await dragSim(x, x + width / 4, rangeslider);
        rangeslider.onMouseUp();

        assert.equal(parseFloat(thumb.style.left), 25);
        assert.equal(parseFloat(thumb.textContent), 25);
    });

    it('Should change handle position and thumb value according to step', async () => {
        await loadRangeslider({ thumb: true, step: 40 });
        const rangeslider = document.querySelector('gameface-rangeslider');
        const rangesliderElement = rangeslider.querySelector('.guic-horizontal-rangeslider');
        const thumb = rangeslider.querySelector('.guic-horizontal-rangeslider-thumb');
        const handle = rangeslider.querySelector('.guic-horizontal-rangeslider-handle');
        const { x, width } = rangesliderElement.getBoundingClientRect();

        rangeslider.onMouseDown({ clientX: x });

        await dragSim(x, x + width / 4, rangeslider);
        rangeslider.onMouseUp();

        assert.equal(parseFloat(handle.style.left), 40);
        assert.equal(parseFloat(thumb.textContent), 40);
    });

    it('Should change handle position and custom element value according to step', async () => {
        await loadRangeslider({ customHandle: customHandleSelectors.SINGLE, step: 40 });
        const rangeslider = document.querySelector('gameface-rangeslider');
        const rangesliderElement = rangeslider.querySelector('.guic-horizontal-rangeslider');
        const handle = rangeslider.querySelector('.guic-horizontal-rangeslider-handle');
        const { x, width } = rangesliderElement.getBoundingClientRect();
        const customHandle = document.querySelector(customHandleSelectors.SINGLE);

        rangeslider.onMouseDown({ clientX: x });

        await dragSim(x, x + width / 4, rangeslider);
        rangeslider.onMouseUp();

        assert.equal(parseFloat(handle.style.left), 40);
        assert.equal(customHandle.textContent, 40);
    });

    it('Should move closest handle when clicked on and update the custom handle element', async () => {
        await loadRangeslider({
            twoHandles: true,
            customHandleLeft: customHandleSelectors.LEFT,
            customHandleRight: customHandleSelectors.RIGHT,
        });
        const rangeslider = document.querySelector('gameface-rangeslider');
        const rangesliderElement = rangeslider.querySelector('.guic-horizontal-rangeslider');
        const customHandleRight = document.querySelector(customHandleSelectors.RIGHT);
        const { x, width } = rangesliderElement.getBoundingClientRect();

        // 0.75 so that I am sure that the click is closer to the second handle
        rangeslider.onMouseDown({ clientX: x + width * 0.75 });
        rangeslider.onMouseUp();

        assert.equal(customHandleRight.textContent, 75);
    });

    it('Should set values to two handle rangeslider', async () => {
        const value = [120, 180];

        await loadRangeslider({ min: 100, max: 200, twoHandles: true });
        const rangeSlider = document.querySelector('gameface-rangeslider');

        rangeSlider.value = value;

        assert.equal(rangeSlider.value[0], value[0]);
        assert.equal(rangeSlider.value[1], value[1]);
    });

    it('Should set values to two handle rangeslider with one provided number in array', async () => {
        const INITIAL_AND_MAX__VALUE = 200;
        const value = [120];

        await loadRangeslider({ min: 100, max: INITIAL_AND_MAX__VALUE, twoHandles: true });
        const rangeSlider = document.querySelector('gameface-rangeslider');

        rangeSlider.value = value;

        assert.equal(rangeSlider.value[0], value[0]);
        assert.equal(rangeSlider.value[1], INITIAL_AND_MAX__VALUE);
    });

    it('Should set values to two handle rangeslider with one number provided value', async () => {
        const INITIAL_AND_MAX__VALUE = 200;
        const value = 120;

        await loadRangeslider({ min: 100, max: INITIAL_AND_MAX__VALUE, twoHandles: true });
        const rangeSlider = document.querySelector('gameface-rangeslider');

        rangeSlider.value = value;

        assert.equal(rangeSlider.value[0], value);
        assert.equal(rangeSlider.value[1], INITIAL_AND_MAX__VALUE);
    });

    it('Should not set first value to two handle rangeslider to be more than the second', async () => {
        const BIGGER_VALUE = 180;
        const value = [BIGGER_VALUE, 120];

        await loadRangeslider({ min: 100, max: 200, twoHandles: true });
        const rangeSlider = document.querySelector('gameface-rangeslider');

        rangeSlider.value = value;

        assert.equal(rangeSlider.value[0], BIGGER_VALUE);
        assert.equal(rangeSlider.value[1], BIGGER_VALUE);
    });

    it('Should not set values to two handle rangeslider if one is NaN', async () => {
        const MIN = 100;
        const MAX = 200;

        await loadRangeslider({ min: MIN, max: MAX, twoHandles: true });
        const rangeSlider = document.querySelector('gameface-rangeslider');

        rangeSlider.value = [150, '100f'];

        assert.equal(rangeSlider.value[0], MIN);
        assert.equal(rangeSlider.value[1], MAX);
    });

    it('Should not set values to two handle rangeslider to more than min/max range', async () => {
        const MIN = 100;
        const MAX = 200;
        const value = [80, 220];

        await loadRangeslider({ min: MIN, max: MAX, twoHandles: true });
        const rangeSlider = document.querySelector('gameface-rangeslider');

        rangeSlider.value = value;

        assert.equal(rangeSlider.value[0], MIN);
        assert.equal(rangeSlider.value[1], MAX);
    });
});

if (engine?.isAttached) {
    // eslint-disable-next-line max-lines-per-function
    describe('Rangeslider Component (Gameface Data Binding Test)', () => {
        /**
         * @param {string} template
         * @returns {Promise<void>}
         */
        function setupRangeSlider(template) {
            const el = document.createElement('div');
            el.className = 'test-wrapper';
            el.innerHTML = template;

            cleanTestPage('.test-wrapper');

            document.body.appendChild(el);

            return new Promise((resolve) => {
                waitForStyles(resolve, 4);
            });
        }

        afterAll(() => cleanTestPage('.test-wrapper'));

        it(`Should have populated 2 elements`, async () => {
            const templateName = 'model';
            const template = `<div data-bind-for="array:{{${templateName}.array}}"><gameface-rangeslider></gameface-rangeslider></div>`;

            await setupDataBindingTest(templateName, template, setupRangeSlider);
            const expectedCount = 2;
            const rangeSliderCount = document.querySelectorAll('gameface-rangeslider').length;
            assert.equal(rangeSliderCount, expectedCount, `Range Sliders found: ${rangeSliderCount}, should have been ${expectedCount}.`);
        });

        it(`Should dynamically change the value of rangeslider`, async () => {
            // eslint-disable-next-line require-jsdoc
            class Value {
                // eslint-disable-next-line require-jsdoc
                init(element, value) {
                    element.value = value;
                }
                // eslint-disable-next-line require-jsdoc
                update(element, value) {
                    element.value = value;
                }
            }

            engine.registerBindingAttribute('rangeslider-value', Value);
            const modelName = 'model';
            const templateAttributes = `<gameface-rangeslider data-bind-rangeslider-value="{{${modelName}.value}}"></gameface-rangeslider>`;

            await setupDataBindingTest(modelName, templateAttributes, setupRangeSlider, { value: 50 });
            const rangesliderHandle = document.querySelector('.guic-horizontal-rangeslider-handle');
            let left;

            await createAsyncSpec(() => {
                left = parseFloat(rangesliderHandle.style.left);
                assert.equal(left, 50);
            });

            window[modelName].value = 75;
            engine.updateWholeModel(window[modelName]);
            engine.synchronizeModels();

            await createAsyncSpec(() => {
                left = parseFloat(rangesliderHandle.style.left);
                assert.equal(left, 75);
            });
        });
    });
}
