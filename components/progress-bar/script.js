/* eslint-disable linebreak-style */
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import components from 'coherent-gameface-components';
import template from './template.html';

/**
 * Class definition of the gameface progress bar custom element
 */
class ProgressBar extends HTMLElement {
    // eslint-disable-next-line require-jsdoc
    constructor() {
        super();
        this.template = template;

        this.filler = {};

        this.targetValue = 0;
        this.animStartTime = 0;
        this.currentRafInstanceId = 0;
        this.hasStarted = false;
        this.previousWidth = 0;
    }

    // eslint-disable-next-line require-jsdoc
    connectedCallback() {
        components.loadResource(this)
            .then((result) => {
                this.template = result.template;
                components.renderOnce(this);

                // Get the filler element when the component is rendered.
                this.filler = this.querySelector('.progress-bar-filler');
                this.animDuration = parseInt(this.dataset.animationDuration) || 0;
            })
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

        this.filler.style.width = targetWidth + '%';

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
     */
    startAnimation() {
        this.currentRafInstanceId = requestAnimationFrame(() => {
            // Or zero if no width has been set yey.
            this.previousWidth = parseFloat(this.filler.style.width) || 0;
            this.animStartTime = new Date().getTime();

            this.fill();
        });
    }

    /**
     * Start animating or directly set the width if no animation duration time is provided.
     * @param {number} targetValue
     */
    setProgress(targetValue) {
        this.targetValue = targetValue;

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
            this.startAnimation();
        } else {
            this.filler.style.width = this.targetValue + '%';
        }
    }
}

components.defineCustomElement('gameface-progress-bar', ProgressBar);

export default ProgressBar;
