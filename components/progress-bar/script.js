/* eslint-disable linebreak-style */
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Components } from 'coherent-gameface-components';
const components = new Components();
import template from './template.html';

const BaseComponent = components.BaseComponent;

/**
 * Class definition of the gameface progress bar custom element
 */
class ProgressBar extends BaseComponent {
    // eslint-disable-next-line require-jsdoc
    static get observedAttributes() { return ['target-value', 'animation-duration']; }

    // eslint-disable-next-line require-jsdoc
    constructor() {
        super();
        this.template = template;

        this.filler = {};

        this._targetValue = 0;
        this._animDuration = 0;

        this.currentRafInstanceId = 0;
        this.hasStarted = false;
        this.previousWidth = 0;
        this.init = this.init.bind(this);
    }

    /**
     * Get the target value of the progress bar
     */
    get targetValue() {
        if (this.hasAttribute('target-value')) {
            const targetValueAttribute = this.getAttribute('target-value');
            // return negative value to indicate that target value is not valid
            if (!components.isNumberPositiveValidation('target-value', targetValueAttribute)) return -1;
            return targetValueAttribute;
        }
        return this._targetValue;
    }

    /**
     * Set the target value that detirmines the length that the progress will reach
     * @param {number|string} value
     */
    set targetValue(value) {
        const validValue = components.isNumberPositiveValidation('targetValue', value) ? value : 0;
        this.setAttribute('target-value', validValue);
    }

    /**
     * Get the animDuration property
     */
    get animDuration() {
        if (this.hasAttribute('animation-duration')) {
            const animationDurationAttribute = parseInt(this.getAttribute('animation-duration'));
            if (!isNaN(animationDurationAttribute)) return animationDurationAttribute;
        }

        if (this._animDuration !== undefined) return this._animDuration;
        return 0;
    }

    /**
     * Set the animDuration
     * @param {number|string} value
     */
    set animDuration(value) {
        if (components.isNumberPositiveValidation('animDuration', value)) this._animDuration = value;
    }

    /**
     * Set the width of the progress bar in %
     * @param {number} value
     */
    set _fillerWidth(value) {
        this.filler.style.width = `${value}%`;
    }

    // eslint-disable-next-line require-jsdoc
    get _fillerWidth() {
        return this.filler.style.width;
    }

    /**
     * Initialize the custom component.
     * Set template, attach event listeners, setup initial state etc.
     * @param {object} data
    */
    init(data) {
        this.setupTemplate(data, () => {
            components.renderOnce(this);

            // Get the filler element when the component is rendered.
            this.filler = this.querySelector('.guic-progress-bar-filler');
            this.setProgress();
        });
    }

    // eslint-disable-next-line require-jsdoc
    connectedCallback() {
        components.loadResource(this)
            .then(this.init)
            .catch(err => console.error(err));
    }

    /**
     * Linear interpolation between two known points.
     * The previous width is x1 and the the target value is x2.
     * @param {number} decimalMidpoint The decimal midpoint.
     * @returns {number} Returns the value at the given decimal midpoint between the values.
     */
    interpolateBetweenWidths(decimalMidpoint) {
        return this.previousWidth * (1 - decimalMidpoint) + this.targetValue * decimalMidpoint;
    }

    /**
     * Callback for animating the progressbar fill
     */
    fill() {
        // Get the elapsed time from when the animation has been initiated.
        const runTime = new Date().getTime() - this.animStartTime; // milliseconds
        // Clip the current progress between 0 and 1.
        const currentProgress = Math.min(runTime / this.animDuration, 1);
        const targetWidth = this.interpolateBetweenWidths(currentProgress);

        this._fillerWidth = targetWidth;

        /* If the duration is not met yet, call raF again with the parameters. */
        if (runTime < this.animDuration) {
            this.currentRafInstanceId = requestAnimationFrame(() => {
                this.fill();
            });
        } else {
            this.hasStarted = false;
        }
    }

    /**
     * Initiating the animation while saving the initial width and the time the animation started.
     * @param {boolean} fromBeginning - specify if the progress should start from the beginning as if
     * the animation runs for the first time or from the current position(the default)
     */
    startAnimation(fromBeginning = false) {
        this.currentRafInstanceId = requestAnimationFrame(() => {
            // Or zero if no width has been set yey.
            this.previousWidth = parseFloat(this._fillerWidth) || 0;
            if (fromBeginning) this.previousWidth = 0;
            this.animStartTime = new Date().getTime();

            this.fill();
        });
    }

    /**
     * Start animating or directly set the width if no animation duration time is provided.
     * @param {boolean} fromBeginning - specify if the progress should start from the beginning as if
     * the animation runs for the first time or from the current position(the default)
     */
    setProgress(fromBeginning = false) {
        // invalid target value was passes
        if (this.targetValue < 0) {
            this._fillerWidth = 0;
            return;
        }

        this.previousWidth = 0;

        if (this.targetValue < 0) {
            this.targetValue = 0;
        } else if (this.targetValue > 100) {
            this.targetValue = 100;
        }

        if (this.animDuration !== 0) {
            // Cancel the currently running animation if a new one is started with another value.
            if (this.hasStarted) {
                cancelAnimationFrame(this.currentRafInstanceId);
            }

            this.hasStarted = true;
            this.startAnimation(fromBeginning);
        } else {
            this._fillerWidth = this.targetValue;
        }
    }

    /**
     * Custom element lifecycle method. Called when an attribute is changed.
     * @param {string} name
     * @param {string} oldValue
     * @param {string|boolean} newValue
     */
    attributeChangedCallback(name, oldValue, newValue) {
        if (!this.isRendered) return;
        if (!components.isNumberPositiveValidation(name, newValue)) return;

        if (name === 'target-value') {
            this._targetValue = newValue;
            this.setProgress();
            return;
        }

        if (name === 'animation-duration') {
            this._animDuration = parseInt(newValue);
            this.setProgress(true);
        }
    }
}

components.defineCustomElement('gameface-progress-bar', ProgressBar);

export default ProgressBar;
