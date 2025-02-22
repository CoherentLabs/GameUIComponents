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
    static get observedAttributes() {
        return ['value'];
    }

    get value() {
        return hslaToHexAndRGB(this.hsla);
    }

    set value(value) {
        const checkedValue = this.processValue(value).HEX;
        this.setAttribute('value', checkedValue);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (!this.isRendered) return;

        if (name === 'value') {
            this.updateColorPickerState(newValue);
        }
    }

    constructor() {
        super();
        this.template = template;
        this.init = this.init.bind(this);

        this.lsPickerDragStart = this.lsPickerDragStart.bind(this);
        this.lsPickerDragMove = this.lsPickerDragMove.bind(this);
        this.lsPickerDragEnd = this.lsPickerDragEnd.bind(this);

        this.lsPickerTouchStart = this.lsPickerTouchStart.bind(this);
        this.lsPickerTouchEnd = this.lsPickerTouchEnd.bind(this);

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
            this.lsPickerAttributeStyleMap = this.lsPickerHandle.attributeStyleMap;

            this.colorBox = this.querySelector('.guic-color-preview-box-color');

            this.huePicker = this.querySelector('.guic-hue-picker-slider');
            this.alphaPicker = this.querySelector('.guic-alpha-picker-slider');

            this.colorInput = this.querySelector('.guic-color-preview-input');
            this.tabs = this.querySelectorAll('.guic-color-preview-tab');

            this.value = this.getAttribute('value');


            this.attachEventListeners();
            this.isRendered = true;
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
        this.lsPicker.addEventListener('touchstart', this.lsPickerTouchStart);
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
        if (!this.lsRendered) return;

        this.lsPicker.removeEventListener('mousedown', this.lsPickerDragStart);
        this.lsPicker.removeEventListener('touchstart', this.lsPickerTouchStart);
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
    processValue(value) {
        const defaultColor = new ColorTranslator('rgba(0, 0, 0, 1)');
        let color;

        try {
            color = new ColorTranslator(value);
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

        this.lsPickerDragMove(e);

        document.addEventListener('mousemove', this.lsPickerDragMove);
        document.addEventListener('mouseup', this.lsPickerDragEnd);
    }

    /**
     * Handles the touch start event on the color picker
     * @param {TouchEvent} e
     */
    lsPickerTouchStart(e) {
        if (e.touches.length > 1) return;

        this.lsPickerRect = this.lsPicker.getBoundingClientRect();

        this.lsPickerDragMove(e.touches[0]);

        document.addEventListener('touchmove', this.lsPickerDragMove);
        document.addEventListener('touchend', this.lsPickerTouchEnd);
    }

    /**
     * Handles the mouse move event on the color picker
     * @param {MouseEvent} e
     */
    lsPickerDragMove(e) {
        const move = e.touches ? e.touches[0] : e;
        this.setPickerCoordinates(move.clientX, move.clientY);
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
     * Handles the touch end event on the color picker
     */
    lsPickerTouchEnd() {
        document.removeEventListener('touchmove', this.lsPickerDragMove);
        document.removeEventListener('touchend', this.lsPickerTouchEnd);
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
     * Updates the color picker state based on the value attribute
     * @param {string} value - the color value
     */
    updateColorPickerState(value) {
        const setValue = this.processValue(value).HSLAObject;

        this.hsla = setValue;

        this.hue = setValue.H;
        this.alpha = setValue.A;

        this.pickerCoords = { x: setValue.S, y: this.convertLigthnesToY(setValue.L, setValue.S) };

        this.dispatchColorChangeEvent();
        this.updateSliders();
        this.updateColorPreview();
        this.updateHandleStyle();
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
        this.lsPickerAttributeStyleMap.set('top', CSS.percent(this.pickerCoords.y));
        this.lsPickerAttributeStyleMap.set('left', CSS.percent(this.pickerCoords.x));

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
