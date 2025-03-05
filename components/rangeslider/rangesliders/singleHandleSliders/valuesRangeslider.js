import SingleHandleRangeSliderBase from './singleHandleRangeSliderBase.js';
// eslint-disable-next-line no-unused-vars
import Rangeslider from '../../script.js';
import { clamp } from '../rangeSliderUtils.js';

/**
 * This is the rangeslider with values array which has single thumb and works with string values.
 */
export default class ValuesRangeSlider extends SingleHandleRangeSliderBase {
    /**
     * @param {Rangeslider} rangeslider - The gameface-rangeslider custom element
     */
    constructor(rangeslider) {
        super(rangeslider);
        this.state.values = [];
    }

    /** @inheritdoc */
    updateValuesState(oldValue, newValue) {
        this.state.values = newValue;
        this.toggleGrid(this.grid);
        this.updateSliderPositionWithCurrentValue();
    }

    /** @inheritdoc */
    updateValueState(value) {
        this.state.value = value;
        this.updateSliderPositionWithCurrentValue();
    }

    /** @inheritdoc */
    updateSliderPositionWithCurrentValue() {
        const percent = this.getCurrentValuePercent();
        if (percent < 0) {
            this.value = this.values[0];
            return;
        }
        this.updateSliderPosition(percent);
    }

    /** @inheritdoc */
    connectedCallback() {
        const valuesArray = JSON.parse(this.rangeslider.getAttribute('values'));

        this.state.values = Array.isArray(valuesArray) ? valuesArray : [];

        if (!this.state.values.length) console.warn('You need to pass the data in the correct data format - Array<string>.');

        this.initSliderState();
        this.loadTemplate();
    }

    /** @inheritdoc */
    getCurrentValuePercent() {
        return this.values.findIndex(el => el === this.value) * (100 / (this.values.length - 1));
    }

    /** @inheritdoc */
    buildGrid() {
        const grid = document.createElement('div');
        grid.classList.add(`guic-${this.rangeslider.orientation}-rangeslider-grid`);
        // builds only pols for the values of the array
        for (let i = 0; i < this.values.length; i++) {
            const entry = this.values[i];
            grid.appendChild(this.createGridPol(entry));
        }

        this.rangesliderEl.appendChild(grid);
    }

    /** @inheritdoc */
    setMinAndMax() {
        // if we have an array we set the min and max values to the first and last entry of the array
        this.state.min = this.values[0];
        this.state.max = this.values[this.values.length - 1];
    }

    /** @inheritdoc */
    setHandleValues() {
        const valueAttr = this.rangeslider.getAttribute('value');

        this.state.value = valueAttr !== null ? valueAttr : this.min;
    }

    /** @inheritdoc */
    updateSliderPosition(percent) {
        // The percent of the step that is set, if the values are an array, the step is between each array value
        const percentStep = 100 / (this.values.length - 1);

        // the range which should be clamped
        const clampRange = [0, 100];

        // the provided percent is clamped
        percent = clamp(Math.round(percent / percentStep) * percentStep, ...clampRange);

        const newValue = this.values[percent / percentStep];
        if (newValue !== this.value) {
            this.value = newValue;
            return;
        }

        this.setBarStyles(percent);
        this.setThumbPosition(percent);
        this.updateCustomHandles();
        // dispatching a custom event with the rangeslider values
        this.rangeslider.dispatchEvent(new CustomEvent('sliderupdate', { detail: this.value }));
    }
}
