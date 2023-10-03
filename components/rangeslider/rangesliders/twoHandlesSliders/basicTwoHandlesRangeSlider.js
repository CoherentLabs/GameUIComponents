import TwoHandlesRangeSliderBase from './twoHandlesRangeSliderBase';
// eslint-disable-next-line no-unused-vars
import Rangeslider from '../../script';
import { clamp, valueToPercent } from '../rangeSliderUtils';
const SPACE_BETWEEN_GRID_POLS = 10;

/**
 * This is the basic rangeslider which has single thumb and works with numeric values.
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
        // TODO: Update the correct slider positions with the correct values percents as it is done in
        // updateMinMaxState method in basicRangeslider.js
        const percent = [0, 100];
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
