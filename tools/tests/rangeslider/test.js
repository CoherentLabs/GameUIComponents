const loadRangeslider = ({ value, min, max, values, grid, thumb, twoHandles, orientation, step }) => {
    const attributes = [
        value ? `value="${value}"` : '',
        min ? `min="${min}"` : '',
        max ? `max="${max}"` : '',
        values ? `values="${JSON.stringify(values)}"` : '',
        orientation ? `orientation="${orientation}"` : '',
        step ? `step="${step}"` : '',
        grid ? `grid` : '',
        thumb ? `thumb` : '',
        twoHandles ? `two-handles` : ''
    ];

    const wrapper = document.createElement('div');
    wrapper.innerHTML = `<gameface-rangeslider ${attributes.join(' ')}></gameface-rangeslider>`;

    document.body.appendChild(wrapper.children[0]);

    return new Promise((resolve) => {
        setTimeout(() => resolve(), 1000);
    });
};

const dragSim = (start, end, element) => {
    return new Promise((resolve) => {
        const drag = (currX, endX) => {
            element.onMouseMove({ clientX: currX });

            if (currX < endX) {
                requestAnimationFrame(() => drag(++currX, endX));
                return;
            }

            resolve();
        };

        drag(start, end);
    });
};

describe('Rangeslider component', () => {
    afterEach(() => {
        // Since we don't want to replace the whole content of the body using
        // innerHtml setter, we query only the current custom element and we replace
        // it with a new one; this is needed because the specs are executed in a random
        // order and sometimes the component might be left in a state that is not
        // ready for testing
        let rangeslider = document.querySelector('gameface-rangeslider');

        if (rangeslider) {
            rangeslider.parentElement.removeChild(rangeslider);
        }
    });

    it('Should be rendered', async () => {
        await loadRangeslider({});
        const rangeslider = document.querySelector('.horizontal-rangeslider');
        assert.exists(rangeslider, 'Rangeslider is rendered in the DOM');
    });

    it('Should be horizontal', async () => {
        await loadRangeslider({ orientation: 'horizontal' });
        const rangeslider = document.querySelector('.horizontal-rangeslider');
        const { width, height } = rangeslider.getBoundingClientRect();

        assert.isAbove(width, height);
    });

    it('Should be vertical', async () => {
        await loadRangeslider({ orientation: 'vertical' });
        const rangeslider = document.querySelector('.vertical-rangeslider');
        const { width, height } = rangeslider.getBoundingClientRect();

        assert.isAbove(height, width);
    });

    it('Handle should correspond to value', async () => {
        const value = 50;
        await loadRangeslider({ value });
        const rangesliderHandle = document.querySelector('.horizontal-rangeslider-handle');
        const left = parseFloat(rangesliderHandle.style.left);

        assert.equal(left, value);
    });

    it('Bar should correspond to value', async () => {
        const value = 50;
        await loadRangeslider({ value });
        const rangesliderBar = document.querySelector('.horizontal-rangeslider-bar');
        const width = parseFloat(rangesliderBar.style.width);

        assert.equal(width, value);
    });

    it('Should have grid', async () => {
        await loadRangeslider({ grid: true });
        const grid = document.querySelector('.horizontal-rangeslider-grid');
        assert.exists(grid);
    });

    it('Should have thumb', async () => {
        await loadRangeslider({ thumb: true });
        const thumb = document.querySelector('.horizontal-rangeslider-thumb');
        assert.exists(thumb);
    });

    it('Should have two handles', async () => {
        await loadRangeslider({ twoHandles: true });
        const handles = document.querySelectorAll('.horizontal-rangeslider-handle');
        assert.lengthOf(handles, 2);
    });

    it('Should have two thumbs', async () => {
        await loadRangeslider({ twoHandles: true, thumb: true });
        const thumbs = document.querySelectorAll('.horizontal-rangeslider-thumb');
        assert.lengthOf(thumbs, 2);
    });

    it('Should emit custom event', (done) => {
        loadRangeslider({}).then(() => {
            const rangeslider = document.querySelector('gameface-rangeslider');
            rangeslider.addEventListener('sliderupdate', ({ detail }) => {
                assert.equal(detail[0], 50);
                done();
            });

            rangeslider.updateSliderPosition(50, 0);
        });
    });

    it('Should move handle and change bar width when clicked on', (done) => {
        loadRangeslider({}).then(() => {
            const rangeslider = document.querySelector('gameface-rangeslider');
            const rangesliderElement = rangeslider.querySelector('.horizontal-rangeslider');
            const handle = rangeslider.querySelector('.horizontal-rangeslider-handle');
            const bar = rangeslider.querySelector('.horizontal-rangeslider-bar');
            const { x, width } = rangesliderElement.getBoundingClientRect();

            rangeslider.onMouseDown({ clientX: x + width / 2 });
            rangeslider.onMouseUp();

            assert.equal(parseFloat(bar.style.width), 50);
            assert.equal(parseFloat(handle.style.left), 50);
            done();
        });
    });

    it('Should move closest handle when clicked on', (done) => {
        loadRangeslider({ twoHandles: true, thumb: true }).then(() => {
            const rangeslider = document.querySelector('gameface-rangeslider');
            const rangesliderElement = rangeslider.querySelector('.horizontal-rangeslider');
            const handles = rangeslider.querySelectorAll('.horizontal-rangeslider-handle');
            const { x, width } = rangesliderElement.getBoundingClientRect();

            rangeslider.onMouseDown({ clientX: x + width * 0.75 }); //0.75 so that I am sure that the click is closer to the second handle
            rangeslider.onMouseUp();

            assert.equal(parseFloat(handles[1].style.left), 75);
            done();
        });
    });

    it('Should change handle positon and bar width when dragged', (done) => {
        loadRangeslider({}).then(() => {
            const rangeslider = document.querySelector('gameface-rangeslider');
            const rangesliderElement = rangeslider.querySelector('.horizontal-rangeslider');
            const handle = rangeslider.querySelector('.horizontal-rangeslider-handle');
            const bar = rangeslider.querySelector('.horizontal-rangeslider-bar');
            const { x, width } = rangesliderElement.getBoundingClientRect();

            rangeslider.onMouseDown({ clientX: x });

            dragSim(x, x + width / 4, rangeslider).then(() => {
                rangeslider.onMouseUp();

                assert.equal(parseFloat(bar.style.width), 25);
                assert.equal(parseFloat(handle.style.left), 25);
                done();
            });
        });
    });

    it('Should change thumb positon and value when dragged', (done) => {
        loadRangeslider({ thumb: true }).then(() => {
            const rangeslider = document.querySelector('gameface-rangeslider');
            const rangesliderElement = rangeslider.querySelector('.horizontal-rangeslider');
            const thumb = rangeslider.querySelector('.horizontal-rangeslider-thumb');
            const { x, width } = rangesliderElement.getBoundingClientRect();

            rangeslider.onMouseDown({ clientX: x });

            dragSim(x, x + width / 4, rangeslider).then(() => {
                rangeslider.onMouseUp();

                assert.equal(parseFloat(thumb.style.left), 25);
                assert.equal(parseFloat(thumb.textContent), 25);
                done();
            });
        });
    });

    it('Should change handle position and thumb value according to step', (done) => {
        loadRangeslider({ thumb: true, step: 40 }).then(() => {
            const rangeslider = document.querySelector('gameface-rangeslider');
            const rangesliderElement = rangeslider.querySelector('.horizontal-rangeslider');
            const thumb = rangeslider.querySelector('.horizontal-rangeslider-thumb');
            const handle = rangeslider.querySelector('.horizontal-rangeslider-handle');
            const { x, width } = rangesliderElement.getBoundingClientRect();

            rangeslider.onMouseDown({ clientX: x });

            dragSim(x, x + width / 4, rangeslider).then(() => {
                rangeslider.onMouseUp();

                assert.equal(parseFloat(handle.style.left), 40);
                assert.equal(parseFloat(thumb.textContent), 40);
                done();
            });
        });
    });
});