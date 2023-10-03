import SingleHandleRangeSliderBase from './singleHandleRangeSliderBase';
// eslint-disable-next-line no-unused-vars
import Rangeslider from '../../script';
import { clamp, valueToPercent } from '../rangeSliderUtils';
const SPACE_BETWEEN_GRID_POLS = 10;

/**
 * This is the basic rangeslider which has single thumb and works with numeric values.
 */
export default class BasicRangeSlider extends SingleHandleRangeSliderBase {
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

    /** @inheritdoc */
    updateValueState(value) {
        value = parseFloat(value);

        if (isNaN(value) || (this.min > value && this.max < value)) {
            this.value = this.min;
            return;
        }

        this.state.value = value;
        this.updateSliderPositionWithCurrentValue();
    }

    /** @inheritdoc */
    getCurrentValuePercent() {
        return valueToPercent(this.value, this.min, this.max);
    }

    /** @inheritdoc */
    updateMinMaxState(name, value) {
        this.setMinAndMax();
        const defaultValue = name === 'min' ? this.min : this.max;
        this.value = this.min <= this.value && this.max >= this.value ? this.value : defaultValue;
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
        let valueAttr = this.rangeslider.getAttribute('value');

        valueAttr = parseFloat(valueAttr);
        this.state.value = !isNaN(valueAttr) ? valueAttr : this.min;

        // checks if the value provided is less than the min or more than the max and sets it to the minimum value
        this.state.value = this.min <= this.value && this.max >= this.value ? this.value : this.min;
    }

    /** @inheritdoc */
    buildGrid() {
        // calculates the number of pols the grid will have based on the size of the slider
        const numberOfPols = Math.round(this.wrapper[this.units.offset] / SPACE_BETWEEN_GRID_POLS / 4) * 4; // here we round to a number that is divisible by 4 and to make sure, the last pol has a number
        const grid = document.createElement('div');
        grid.classList.add(`guic-${this.rangeslider.orientation}-rangeslider-grid`);
        for (let i = 0; i <= numberOfPols; i++) {
            // each forth poll will be larger with a value added
            if (i % (numberOfPols / 4) === 0) {
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
    updateSliderPositionWithCurrentValue() {
        const percent = this.getCurrentValuePercent();

        this.updateSliderPosition(percent);
    }

    /** @inheritdoc */
    updateSliderPosition(percent) {
        // The percent of the step that is set
        const percentStep = valueToPercent(this.step + this.min, this.min, this.max);

        // the range which should be clamped
        const clampRange = [0, 100];

        // the provided percent is clamped
        percent = clamp(Math.round(percent / percentStep) * percentStep, ...clampRange);

        const newValue = parseFloat(this.calculateHandleValue(percent).toFixed(2));
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
