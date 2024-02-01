import TwoHandlesRangeSliderBase from './twoHandlesRangeSliderBase';
// eslint-disable-next-line no-unused-vars
import Rangeslider from '../../script';
import { clamp, valueToPercent } from '../rangeSliderUtils';
const SPACE_BETWEEN_GRID_POLS = 10;

/**
 * This is the basic rangeslider which has two thumbs and works with array with numeric values.
 */
export default class BasicTwoHandlesRangeSlider extends TwoHandlesRangeSliderBase {
    /**
     * @param {Rangeslider} rangeslider - The gameface-rangeslider custom element
     */
    constructor(rangeslider) {
        super(rangeslider);
    }

    /** @inheritdoc */
    connectedCallback() {
        this.initSliderState();
        this.loadTemplate();
    }

    /**
     * Don't allow state values to be set outside of the min/max range.
     * @param {array} valueArray
     */
    clampStateValues(valueArray) {
        if (valueArray[0] < this.min) {
            this.state.value[0] = this.min;
        } else {
            this.state.value[0] = valueArray[0];
        }

        if (valueArray[1] > this.max) {
            this.state.value[1] = this.max;
        } else {
            this.state.value[1] = valueArray[1];
        }
    }

    /**
     * Will update UI of the rangeslider when its `value` attribute has changed
     * @param {number[]} value
     */
    updateValueState(value) {
        // This is needed because of the way attributeChangedCallback
        // gets the value and is received here.
        // E.g. rangeslider.value = [20, 50] - it gets to here as "20,50".
        const valueArray = Array.from(value.split(','), Number);

        // This allows using a number or array with one value from the setter.
        if (!valueArray[1] && !Number.isNaN(valueArray[1])) valueArray[1] = this.state.value[1];

        for (let i = 0; i < valueArray.length; i++) {
            if (Number.isNaN(valueArray[i])) {
                console.error('Setter for Rangeslider with two handles can only receive a number or an array of numbers.');
                return;
            }
        }

        this.clampStateValues(valueArray);

        this.updateSliderPositionWithCurrentValue();
    }

    /** @inheritdoc */
    updateMinMaxState() {
        this.setMinAndMax();
        this.toggleGrid(this.grid);
        this.updateSliderPositionWithCurrentValue();
    }

    /** @inheritdoc */
    setMinAndMax() {
        const min = parseFloat(this.rangeslider.getAttribute('min'));
        const max = parseFloat(this.rangeslider.getAttribute('max'));
        this.state.min = !isNaN(min) ? min : 0;
        this.state.max = !isNaN(min) ? max : 100;
    }

    /** @inheritdoc */
    setHandleValues() {
        this.state.value = [this.min, this.max];
    }

    /** @inheritdoc */
    buildGrid() {
        // calculates the number of pols the grid will have based on the size of the slider
        // eslint-disable-next-line max-len
        const numberOfPols = Math.round(this.wrapper[this.units.offset] / SPACE_BETWEEN_GRID_POLS / this.state['pols-number']) * this.state['pols-number']; // here we round to a number that is divisible by 4 and to make sure, the last pol has a number
        const grid = document.createElement('div');
        grid.classList.add(`guic-${this.rangeslider.orientation}-rangeslider-grid`);
        for (let i = 0; i <= numberOfPols; i++) {
            // each forth poll will be larger with a value added
            if (i % (numberOfPols / this.state['pols-number']) === 0) {
                grid.appendChild(
                    this.createGridPol(
                        parseFloat((parseInt(this.min) + (this.max - this.min) * (i / numberOfPols)).toFixed(2))
                    )
                );
                continue;
            }
            grid.appendChild(this.createGridPol());
        }

        this.rangesliderEl.appendChild(grid);
    }

    /** @inheritdoc */
    getCurrentValuePercent() {
        const valuesInPercent = [null, null];

        for (let i = 0; i < valuesInPercent.length; i++) {
            valuesInPercent[i] = valueToPercent(this.state.value[i], this.min, this.max);
        }

        return valuesInPercent;
    }

    /** @inheritdoc */
    updateSliderPositionWithCurrentValue() {
        const percent = this.getCurrentValuePercent();
        percent.forEach((p, i) => this.updateSliderPosition(p, i));
    }

    /** @inheritdoc */
    updateSliderPosition(percent, index) {
        // The percent of the step that is set, if the values are an array, the step is between each array value
        const percentStep = valueToPercent(this.step + this.min, this.min, this.max);

        // the range which should be clamped
        let clampRange = [0, 100];

        if (this.handle[1].style[this.units.position]) {
            clampRange = this.clampTwoHandles(clampRange, index);
        }

        // the provided percent is clamped
        percent = clamp(Math.round(percent / percentStep) * percentStep, ...clampRange);

        this.setBarStyles(index, percent);

        this.state.value[index] = parseFloat(this.calculateHandleValue(percent).toFixed(2));

        this.setThumbPosition(percent, index);
        this.updateCustomHandles();
        // dispatching a custom event with the rangeslider values
        this.rangeslider.dispatchEvent(new CustomEvent('sliderupdate', { detail: this.value }));
    }
}
