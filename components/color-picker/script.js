import { components } from '../../lib/components.js';
import '../rangeslider/script.js';
// import template from './template.html';
import { clamp, hslaToHexAndRGB } from './colorPickerUtils.js';
import { ColorTranslator } from './node_modules/colortranslator/esm/index.js';

const template = `
<style>
.guic-color-picker {
    width: 30vh;
    background-color: var(--default-color-gray);
}

.guic-ls-picker {
    height: 15vh;
    width: 100%;
    position: relative;
    background-image: linear-gradient(to bottom, transparent, black), linear-gradient(to right, white, red 62%);
}

.guic-color-picker .guic-horizontal-rangeslider-handle {
    width: 2vh;
    height: 2vh;
    border: 0.3vh solid white;
    background-color: transparent;
    border-radius: 50%;
    position: absolute;
}

.guic-ls-picker .guic-horizontal-rangeslider-handle {
    transform: translate(-50%, -50%);
}

.guic-hue-picker,
.guic-alpha-picker {
    height: 2.5vh;
    width: 100%;
    padding: 0 2vh;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
}

.guic-color-picker .guic-horizontal-rangeslider-wrapper {
    width: 27vh;
    margin: 0;
}

.guic-hue-picker .guic-horizontal-rangeslider {
    background-image: linear-gradient(to right, red, yellow, lime, cyan, blue, magenta, red);
    height: 1.5vh;
    border-radius: 1vh;
}

.guic-alpha-picker .guic-horizontal-rangeslider {
    background-image: linear-gradient(45deg, #ccc 25%, transparent 25%),
        linear-gradient(135deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%),
        linear-gradient(135deg, transparent 75%, #ccc 75%);
    background-size: 1.5vh 1.5vh; /* Must be a square */
    background-position: 0 0, 0.75vh 0, 0.75vh -0.75vh, 0px 0.75vh; /* Must be half of one side of the square */
    height: 1.5vh;
    border-radius: 1vh;
    position: relative;
}

.guic-alpha-picker-slider {
    --color: red;
}

.guic-alpha-picker .guic-horizontal-rangeslider::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: linear-gradient(to right, transparent, var(--color));
    border-radius: 1vh;
}

.guic-color-picker .guic-horizontal-rangeslider-bar {
    background-color: transparent;
}

.guic-color-preview-tabs {
    width: 100%;
    display: flex;
    justify-content: center;
}

.guic-color-preview-tab {
    width: 5vh;
    height: 3vh;
    color: rgb(97, 97, 97);
    border: 0.3vh solid rgb(97, 97, 97);
    font-size: 1.3vh;
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;
}

.guic-color-preview-tab:first-child {
    border-radius: 1.5vh 0 0 1.5vh;
    border-right: 0;
}

.guic-color-preview-tab:last-child {
    border-radius: 0 1.5vh 1.5vh 0;
}

.guic-color-preview-tab-active {
    background-color: rgb(97, 97, 97);
    color: white;
}

.guic-color-preview {
    width: 100%;
    height: 8vh;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2vh;
    box-sizing: border-box;
}

.guic-color-preview-box {
    width: 5vh;
    height: 5vh;
    border: 0.3vh solid rgb(97, 97, 97);
    background-image: linear-gradient(45deg, #ccc 25%, transparent 25%),
        linear-gradient(135deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%),
        linear-gradient(135deg, transparent 75%, #ccc 75%);
    background-size: 1.5vh 1.5vh; /* Must be a square */
    background-position: 0 0, 0.75vh 0, 0.75vh -0.75vh, 0px 0.75vh; /* Must be half of one side of the square */
    border-radius: 50%;
    position: relative;
}

.guic-color-preview-box-color {
    width: 100%;
    height: 100%;
    background-color: #00000001;
    border-radius: 50%;
}

.guic-color-preview-input {
    height: 5vh;
    width: 20vh;
    background-color: transparent;
    border: 0.3vh solid rgb(97, 97, 97);
    border-radius: 4vh;
    display: flex;
    padding: 1vh;
    font-size: 1.7vh;
    text-align: center;
    box-sizing: border-box;
}
</style>
<div class="guic-color-picker">
    <div class="guic-ls-picker">
        <div class="guic-horizontal-rangeslider-handle guic-ls-picker-handle"></div>
    </div>
    <div class="guic-hue-picker">
        <gameface-rangeslider class="guic-hue-picker-slider" min="0" max="360"></gameface-rangeslider>
    </div>
    <div class="guic-alpha-picker">
        <gameface-rangeslider class="guic-alpha-picker-slider"></gameface-rangeslider>
    </div>
    <div class="guic-color-preview-container">
        <div class="guic-color-preview-tabs">
            <div class="guic-color-preview-tab guic-color-preview-tab-active">HEX</div>
            <div class="guic-color-preview-tab">RGBA</div>
        </div>
        <div class="guic-color-preview">
            <div class="guic-color-preview-box">
                <div class="guic-color-preview-box-color"></div>
            </div>
            <input class="guic-color-preview-input" />
        </div>
    </div>
</div>
`;
// const components = new Components();
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
        // this.setupTemplate(data, () => {
        // components.renderOnce(this);

        this.mode = 'HEX';
        const shadow = this.attachShadow({ mode: 'open' });
        shadow.innerHTML = this.template;
        this.isRendered = true;
        this.lsPicker = this.shadowRoot.querySelector('.guic-ls-picker');

        this.lsPickerHandle = this.shadowRoot.querySelector('.guic-ls-picker-handle');
        this.lsPickerAttributeStyleMap = this.lsPickerHandle.attributeStyleMap;

        this.colorBox = this.shadowRoot.querySelector('.guic-color-preview-box-color');

        this.huePicker = this.shadowRoot.querySelector('.guic-hue-picker-slider');
        this.alphaPicker = this.shadowRoot.querySelector('.guic-alpha-picker-slider');

        this.colorInput = this.shadowRoot.querySelector('.guic-color-preview-input');
        this.tabs = this.shadowRoot.querySelectorAll('.guic-color-preview-tab');

        this.value = this.getAttribute('value');

        this.attachEventListeners();
        this.isRendered = true;
        // });
    }

    connectedCallback() {
        this.init();
        // components
        //     .loadResource(this)
        //     .then(this.init)
        //     .catch(err => console.error(err));
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
