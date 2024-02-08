/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * @param {string} template
 * @returns {Promise<void>}
 */
function setupSlider(template) {
    const el = document.createElement('div');
    el.className = 'slider-test-wrapper';
    el.innerHTML = template;

    cleanTestPage('.slider-test-wrapper');

    document.body.appendChild(el);

    return new Promise((resolve) => {
        waitForStyles(resolve);
    });
}

const template = `<gameface-slider></gameface-slider>`;

// eslint-disable-next-line max-lines-per-function
describe('Slider Component', () => {
    afterAll(() => cleanTestPage('.slider-test-wrapper'));

    beforeEach(async () => {
        await setupSlider(template);
    });

    it('Should be rendered', () => {
        assert(document.querySelector('.guic-vertical-slider-wrapper') !== null, 'Slider is not rendered.');
    });

    it('Should change orientation of the slider', async () => {
        const slider = document.querySelector('gameface-slider');
        slider.orientation = 'horizontal';

        await createAsyncSpec(() => {
            assert(slider.orientation === 'horizontal', 'The orientation state has not been updated correctly.');
            assert(document.querySelector('.guic-horizontal-slider-wrapper') !== null, 'Horizontal slider is not rendered.');
            assert(slider.getAttribute('orientation') === 'horizontal', 'The orientation attribute is not set.');
        });
    });

    it('Should change orientation of the slider through attribute', async () => {
        const slider = document.querySelector('gameface-slider');

        slider.setAttribute('orientation', 'horizontal');
        await createAsyncSpec(() => {
            assert(slider.getAttribute('orientation') === 'horizontal', 'The orientation attribute is not set.');
            assert(document.querySelector('.guic-horizontal-slider-wrapper') !== null, 'Horizontal slider is not rendered.');
            assert(slider.orientation === 'horizontal', 'Slider orientation state is not updated');
        });
    });

    it('Should set wrong value for orientation of the slider', async () => {
        const slider = document.querySelector('gameface-slider');
        slider.orientation = 'horizontal'; // We are making it horizontal here because the initial slider is vertical
        await createAsyncSpec(() => {
            slider.orientation = 'invalid';
        });
        await createAsyncSpec(() => {
            assert(document.querySelector('.guic-vertical-slider-wrapper') !== null, 'Slider has not fallback to vertical if orientation value is invalid.');
        });
    });

    it('Should change the step of the slider', async () => {
        const slider = document.querySelector('gameface-slider');
        slider.step = 50;

        await createAsyncSpec(() => {
            assert(slider.getAttribute('step') === '50', 'The step attribute is not set.');
            assert(slider.step === 50, 'The step state has not been updated correctly.');
        });
    });

    it('Should change the step of the slider through attribute', async () => {
        const slider = document.querySelector('gameface-slider');

        slider.setAttribute('step', '60');
        await createAsyncSpec(() => {
            assert(slider.getAttribute('step') === '60', 'The step attribute is not set.');
            assert(slider.step === 60, 'Slider step state is not updated');
        });
    });
});
