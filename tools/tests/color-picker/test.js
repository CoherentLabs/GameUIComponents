const DEFAULT_COLOR = '#000000FF';
const RED_COLOR = '#FF0000FF';

/**
 * Loads the color picker component with the given value.
 * @param {Object} param0
 * @param {string} param0.value
 * @returns {Promise<void>}
 */
function loadColorPicker({ value }) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `<gameface-color-picker ${value ? `value="${value}"` : ''}></gameface-color-picker>`;

    document.body.appendChild(wrapper.children[0]);

    return new Promise((resolve) => {
        waitForStyles(resolve, 4);
    });
}

/**
 *
 * @param {number} x
 * @param {number} y
 * @param {HTMLElement} colorPicker
 */
async function colorPickerClick(x, y, colorPicker) {
    await createAsyncSpec(() => {
        colorPicker.lsPickerDragStart({ clientX: x, clientY: y });
        colorPicker.lsPickerDragEnd();
    });
}

/* eslint-disable-next-line max-lines-per-function */
describe('Color Picker', () => {
    afterEach(() => {
        cleanTestPage('gameface-color-picker');
    });

    it('Should load color picker', async () => {
        await loadColorPicker({ value: RED_COLOR });

        const colorPicker = document.querySelector('gameface-color-picker');

        expect(colorPicker).not.toBe(null);
    });

    it('Should set the color picker value to the given value', async () => {
        await loadColorPicker({ value: RED_COLOR });

        const colorPicker = document.querySelector('gameface-color-picker');

        expect(colorPicker.value.hex).toBe(RED_COLOR);
    });

    it('Should set the color picker value to the default value if none is given', async () => {
        await loadColorPicker({});

        const colorPicker = document.querySelector('gameface-color-picker');

        expect(colorPicker.value.hex).toBe(DEFAULT_COLOR);
    });

    it('Should set the color picker value to the default value if an invalid value is given', async () => {
        await loadColorPicker({ value: 'invalid' });

        const colorPicker = document.querySelector('gameface-color-picker');

        expect(colorPicker.value.hex).toBe(DEFAULT_COLOR);
    });

    it('Should set the color picker value dynamically', async () => {
        await loadColorPicker({});

        const colorPicker = document.querySelector('gameface-color-picker');

        colorPicker.value = RED_COLOR;

        expect(colorPicker.value.hex).toBe(RED_COLOR);
    });

    it('Should set the color picker value to the default value if an invalid value is set', async () => {
        const value = 'invalid';
        await loadColorPicker({});

        const colorPicker = document.querySelector('gameface-color-picker');

        colorPicker.value = value;

        expect(colorPicker.value.hex).toBe(DEFAULT_COLOR);
    });

    it('Should set the color picker to the correct color when the color picker is clicked', async () => {
        await loadColorPicker({});

        const colorPicker = document.querySelector('gameface-color-picker');

        const { x, y, width } = colorPicker.getBoundingClientRect();

        colorPicker.lsPickerDragStart({ clientX: x + width, clientY: y });
        colorPicker.lsPickerDragEnd();

        expect(colorPicker.value.hex).toBe(RED_COLOR);
    });

    it('Should set the correct hue when the hue slider is changed', async () => {
        const value = 360;
        await loadColorPicker({});

        const colorPicker = document.querySelector('gameface-color-picker');

        const hueSlider = colorPicker.querySelector('.guic-hue-picker-slider');

        hueSlider.value = value;

        expect(colorPicker.hsla.H).toBe(value);
    });

    it('Should set the correct saturation when the slider is changed', async () => {
        const saturation = 100;
        await loadColorPicker({});

        const colorPicker = document.querySelector('gameface-color-picker');

        const { x, y, width } = colorPicker.getBoundingClientRect();

        await colorPickerClick(x + width, y, colorPicker);

        expect(colorPicker.hsla.S).toBe(saturation);
    });

    it('Should set the correct lightness when the slider is changed', async () => {
        const lightness1 = 100;
        const lightness2 = 50;
        const lightness3 = 0;

        await loadColorPicker({});

        const colorPicker = document.querySelector('gameface-color-picker');
        const { x, y, height, width } = colorPicker.getBoundingClientRect();

        await colorPickerClick(x, y, colorPicker);
        expect(colorPicker.hsla.L).toBe(lightness1);

        await colorPickerClick(x + width, y, colorPicker);
        expect(colorPicker.hsla.L).toBe(lightness2);


        await colorPickerClick(x + width, y + height, colorPicker);
        expect(colorPicker.hsla.L).toBe(lightness3);
    });

    it('Should set the correct alpha when the alpha slider is changed', async () => {
        const alpha = 0.5;
        await loadColorPicker({});

        const colorPicker = document.querySelector('gameface-color-picker');

        const alphaSlider = colorPicker.querySelector('.guic-alpha-picker-slider');

        alphaSlider.value = alpha * 100;

        expect(colorPicker.hsla.A).toBe(alpha);
    });

    it('Should change the color input mode when the mode button is clicked', async () => {
        const colorMode = 'RGBA';
        await loadColorPicker({});

        const colorPicker = document.querySelector('gameface-color-picker');

        const modeButton = colorPicker.querySelectorAll('.guic-color-preview-tab')[1];

        colorPicker.changeTabs({ currentTarget: modeButton });

        expect(colorPicker.mode).toBe(colorMode);
    });

    it('Should change the active tab when changing color mode', async () => {
        const activeClass = 'guic-color-preview-tab-active';
        await loadColorPicker({});

        const colorPicker = document.querySelector('gameface-color-picker');

        const modeButtons = colorPicker.querySelectorAll('.guic-color-preview-tab');

        colorPicker.changeTabs({ currentTarget: modeButtons[1] });

        expect(modeButtons[0]).not.toHaveClass(activeClass);
        expect(modeButtons[1]).toHaveClass(activeClass);
    });

    it('Should change the input value when the color picker value is changed', async () => {
        await loadColorPicker({ value: RED_COLOR });

        const colorPicker = document.querySelector('gameface-color-picker');

        const input = colorPicker.querySelector('.guic-color-preview-input');

        expect(input.value).toBe(RED_COLOR);
    });

    it('Should change the color picker value when the input value is changed', async () => {
        await loadColorPicker({});

        const colorPicker = document.querySelector('gameface-color-picker');

        const input = colorPicker.querySelector('.guic-color-preview-input');

        input.value = RED_COLOR;

        colorPicker.inputColor({ keyCode: 13 });

        expect(colorPicker.value.hex).toBe(RED_COLOR);
    });
});
