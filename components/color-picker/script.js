import { Components } from 'coherent-gameface-components';
import 'coherent-gameface-rangeslider';
import template from './template.html';
import { clamp, hslaToHexAndRGB } from './colorPickerUtils';
import { ColorTranslator } from 'colortranslator';

const components = new Components();
const BaseComponent = components.BaseComponent;

/**
 * Class description
 */
class ColorPicker extends BaseComponent {
    /* eslint-disable require-jsdoc */
    get value() {
        const value = hslaToHexAndRGB(this.hsla);
        return value;
    }

    set value(value) {
        this.setAttribute('value', value);

        const setValue = this.validateValue(value);

        this.hsla = setValue;

        this.hue = setValue.H;
        this.alpha = setValue.A;

        this.pickerCoords = { x: setValue.S, y: this.convertLigthnesToY(setValue.L, setValue.S) };

        this.dispatchColorChangeEvent();
        this.updateSliders();
        this.updateColorPreview();
        this.updateHandleStyle();
    }

    constructor() {
        super();
        this.template = template;
        this.init = this.init.bind(this);

        this.lsPickerDragStart = this.lsPickerDragStart.bind(this);
        this.lsPickerDragMove = this.lsPickerDragMove.bind(this);
        this.lsPickerDragEnd = this.lsPickerDragEnd.bind(this);

        this.huePickerUpdate = this.huePickerUpdate.bind(this);
        this.alphaPickerUpdate = this.alphaPickerUpdate.bind(this);

        this.changeTabs = this.changeTabs.bind(this);
        this.inputColor = this.inputColor.bind(this);
    }

    init(data) {
        this.setupTemplate(data, () => {
            components.renderOnce(this);

            this.mode = 'HEX';

            this.lsPicker = this.querySelector('.guic-ls-picker');
            this.lsPickerHandle = this.querySelector('.guic-ls-picker-handle');
            this.colorBox = this.querySelector('.guic-color-preview-box-color');

            this.huePicker = this.querySelector('.guic-hue-picker-slider');
            this.alphaPicker = this.querySelector('.guic-alpha-picker-slider');

            this.colorInput = this.querySelector('.guic-color-preview-input');
            this.tabs = this.querySelectorAll('.guic-color-preview-tab');

            if (this.hasAttribute) this.value = this.getAttribute('value');
            else this.value = 'rgba(0, 0, 0, 1)';

            this.attachEventListeners();
        });
    }

    connectedCallback() {
        components
            .loadResource(this)
            .then(this.init)
            .catch(err => console.error(err));
    }

    disconnectedCallback() {
        this.detachEventListeners();
    }
    /* eslint-enable require-jsdoc */

    /**
     * Attaches the event listeners for the component
     */
    attachEventListeners() {
        this.lsPicker.addEventListener('mousedown', this.lsPickerDragStart);
        this.huePicker.addEventListener('sliderupdate', this.huePickerUpdate);
        this.alphaPicker.addEventListener('sliderupdate', this.alphaPickerUpdate);
        this.tabs.forEach((tab) => {
            tab.addEventListener('click', this.changeTabs);
        });
        this.colorInput.addEventListener('keyup', this.inputColor);
    }

    /**
     * Detaches the event listeners for the component
     */
    detachEventListeners() {
        if (!this.lsPicker) return;

        this.lsPicker.removeEventListener('mousedown', this.lsPickerDragStart);
        this.huePicker.removeEventListener('sliderupdate', this.huePickerUpdate);
        this.alphaPicker.removeEventListener('sliderupdate', this.alphaPickerUpdate);
        this.tabs.forEach((tab) => {
            tab.removeEventListener('click', this.changeTabs);
        });
    }

    /**
     * Validates the value attribute
     * @param {string} value - the color value to be validated
     * @returns {boolean}
     */
    validateValue(value) {
        const defaultColor = new ColorTranslator('rgba(0, 0, 0, 1)').HSLAObject;
        let color;

        try {
            color = new ColorTranslator(value).HSLAObject;
        } catch (error) {
            return defaultColor;
        }

        return color;
    }

    /**
     * Handles the mouse down event on the color picker
     * @param {MouseEvent} e
     */
    lsPickerDragStart(e) {
        this.lsPickerRect = this.lsPicker.getBoundingClientRect();

        this.setPickerCoordinates(e.clientX, e.clientY);
        this.updateSelectedColor();
        this.updateHandleStyle();

        document.addEventListener('mousemove', this.lsPickerDragMove);
        document.addEventListener('mouseup', this.lsPickerDragEnd);
    }

    /**
     * Handles the mouse move event on the color picker
     * @param {MouseEvent} e
     */
    lsPickerDragMove(e) {
        this.setPickerCoordinates(e.clientX, e.clientY);
        this.updateSelectedColor();
        this.updateHandleStyle();
    }

    /**
     * Handles the mouse up event on the color picker
     */
    lsPickerDragEnd() {
        document.removeEventListener('mousemove', this.lsPickerDragMove);
        document.removeEventListener('mouseup', this.lsPickerDragEnd);
    }

    /**
     * Handles the mouse move event on the color picker
     * @param {number} clientX
     * @param {number} clientY
     */
    setPickerCoordinates(clientX, clientY) {
        this.pickerCoords = {
            x: clamp((clientX - this.lsPickerRect.left) / this.lsPickerRect.width, 0, 1) * 100,
            y: clamp((clientY - this.lsPickerRect.top) / this.lsPickerRect.height, 0, 1) * 100,
        };
    }

    /**
     * Updates the selected color based on the handle values
     */
    updateSelectedColor() {
        this.updateHSLAValues();
        this.dispatchColorChangeEvent();
        this.updateColorPreview();
        this.updateAlphaPickerColor();
    }

    /**
     * Updates the color preview box background color
     */
    updateColorPreview() {
        this.colorBox.style.backgroundColor = hslaToHexAndRGB(this.hsla).rgba;
        this.updateColorInput(this.mode === 'HEX' ? this.value.hex : this.value.rgba);
    }

    /**
     * Updates the HSLA values based on the handle values
     */
    updateHSLAValues() {
        const pickerY = 100 - this.pickerCoords.y;
        const lightness = pickerY - this.pickerCoords.x * (0.5 * (pickerY / 100));

        this.hsla = {
            H: this.hue,
            S: this.pickerCoords.x,
            L: lightness,
            A: this.alpha,
        };
    }

    /**
     * Handles the hue picker update event
     * @param {CustomEvent} - {detail: number} the slider value
     */
    huePickerUpdate({ detail }) {
        this.hue = detail;
        const rgba = hslaToHexAndRGB({ H: detail, S: 100, L: 50, A: 1 }).rgba;

        this.lsPicker.style.backgroundImage = `linear-gradient(to bottom, transparent, black), linear-gradient(to right, white, ${rgba} 62%)`;
        this.alphaPicker.style.setProperty('--color', rgba);

        this.updateSelectedColor();
        this.updateHandleStyle();
    }

    /**
     * Handles the alpha picker update event
     * @param {CustomEvent} - {detail: number} the slider value
     */
    alphaPickerUpdate({ detail }) {
        this.alpha = detail / 100;
        this.updateSelectedColor();
    }

    /**
     * Updates the alpha picker color based on the current HSLA values
     */
    updateAlphaPickerColor() {
        const { H, S, L } = this.hsla;
        this.alphaPicker.style.setProperty('--color', hslaToHexAndRGB({ H, S, L, A: 1 }).rgba);
    }

    /**
     * Converts Ligthness to Y coordinate
     * @param {number} lightness
     * @param {number} saturation
     * @returns {number}
     */
    convertLigthnesToY(lightness, saturation) {
        return 100 - lightness / (1 - (0.5 * saturation) / 100);
    }

    /**
     * Dispatches the color change event
     */
    dispatchColorChangeEvent() {
        this.dispatchEvent(
            new CustomEvent('colorchange', {
                detail: this.value,
            })
        );
    }

    /**
     * Updates the handle position based on the handle values
     */
    updateHandleStyle() {
        this.lsPickerHandle.style.left = this.pickerCoords.x + '%';
        this.lsPickerHandle.style.top = this.pickerCoords.y + '%';
        this.lsPickerHandle.style.backgroundColor = hslaToHexAndRGB(this.hsla).rgba;
    }

    /**
     * Handles the tab change event
     * @param {MouseEvent} event
     */
    changeTabs(event) {
        this.mode = event.currentTarget.textContent;
        this.tabs.forEach((tab) => {
            tab.classList.remove('guic-color-preview-tab-active');
        });
        event.currentTarget.classList.add('guic-color-preview-tab-active');

        this.colorInput.value = this.mode === 'HEX' ? this.value.hex : this.value.rgba;
    }

    /**
     * Handles the color input event
     * @param {KeyboardEvent} event
     */
    inputColor(event) {
        if (event.keyCode !== 13) return;
        this.value = this.colorInput.value;
    }

    /**
     * Updates the color input value
     * @param {string} value
     */
    updateColorInput(value) {
        this.colorInput.value = value;
    }

    /**
     * Updates the sliders based on the current HSLA values
     */
    updateSliders() {
        this.huePicker.value = this.hue;
        this.alphaPicker.value = this.alpha * 100;
    }
}
components.defineCustomElement('gameface-color-picker', ColorPicker);
export default ColorPicker;
