/* eslint-disable max-lines-per-function */

import { getDirection, getElement } from '../utils/gesture-utils';
import { distanceBetweenTwoPoints, toDeg } from '../utils/utility-functions';

/**
 * TouchGestures class that handles all of the touch interactions and gestures
 */
class TouchGestures {
    /* eslint-disable-next-line require-jsdoc */
    constructor() {
        this.activeTouches = new Map();
    }

    /**
     *
     * @param {Object} options
     * @param {HTMLElement | string} options.element - Element you want to attach the touch event to
     * @param {function} options.callback - Function to be executed on touch
     * @param {number} [options.time=1000] - Time in milliseconds for the press
     * @returns {void}
     */
    hold(options) {
        if (!options) return console.error('Options not provided for hold!');

        let holdTimer;

        const element = getElement(options.element);

        if (!element) return console.error('Element not found!');

        const onHold = ({ touches }) => {
            this.activeTouches.set(touches[0].identifier, touches[0]);

            holdTimer = setTimeout(() => {
                if (!options.callback) return;
                options.callback();
            }, options.time || 1000);
        };

        const onHoldEnd = ({ touches }) => {
            this.activeTouches.delete(touches[0].identifier);
            clearTimeout(holdTimer);
        };

        element.addEventListener('touchstart', onHold);

        element.addEventListener('touchend', onHoldEnd);

        return {
            /**
             * Removes the event listeners
             */
            remove() {
                element.removeEventListener('touchstart', onHold);
                element.removeEventListener('touchend', onHoldEnd);
            },
        };
    }

    /**
     *
     * @param {Object} options
     * @param {HTMLElement | string} options.element - Element you want to attach the touch event to
     * @param {function} options.callback - Function to be executed on touch
     * @param {number} [options.tapsNumber=1] - Number of taps necessary for the callback to be executed
     * @param {number} [options.tapTime=200] - Time in milliseconds between putting down the finger and lifting it up
     * @param {number} [options.betweenTapsTime=500] - Time in milliseconds between two sequential taps
     * @returns {void}
     */
    tap(options) {
        if (!options) return console.error('Options not provided for tap!');

        let tapTimer, betweenTapsTimer;
        let isTap = true;
        let tapCount = options.tapsNumber || 1;

        const element = getElement(options.element);

        if (!element) return console.error('Element not found!');

        const onTap = ({ touches }) => {
            this.activeTouches.set(touches[0].identifier, touches[0]);

            clearTimeout(betweenTapsTimer);

            tapTimer = setTimeout(() => {
                isTap = false;
            }, options.tapTime || 200);
        };

        const onTapEnd = ({ touches }) => {
            this.activeTouches.delete(touches[0].identifier);
            clearTimeout(tapTimer);

            if (!isTap) return;

            tapCount--;
            betweenTapsTimer = setTimeout(() => {
                tapCount = options.tapsNumber || 1;
                clearTimeout(betweenTapsTimer);
            }, options.betweenTapsTime || 500);

            if (tapCount !== 0 || !options.callback) return;
            options.callback();

            isTap = true;
            clearTimeout(tapTimer);
            tapCount = options.tapsNumber || 1;
        };

        element.addEventListener('touchstart', onTap);
        element.addEventListener('touchend', onTapEnd);

        return {
            /**
             * Removes the event listeners
             */
            remove() {
                element.removeEventListener('touchstart', onTap);
                element.removeEventListener('touchend', onTapEnd);
            },
        };
    }

    /**
     *
     * @param {Object} options
     * @param {HTMLElement | string} options.element - Element you want to attach the touch event to
     * @param {function} options.onDragStart - Function to be executed on drag start
     * @param {function} options.onDrag - Function to be executed on drag
     * @param {function} options.onDragEnd - Function to be executed on drag end
     * @returns {void}
     */
    drag(options) {
        if (!options) return console.error('Options not provided for drag!');

        const element = getElement(options.element);

        if (!element) return console.error('Element not found!');

        const onDrag = ({ touches }) => {
            if (!this.activeTouches.has(touches[0].identifier)) return;

            if (!options.onDrag) return;
            options.onDrag({ x: touches[0].clientX, y: touches[0].clientY });
        };

        const onDragEnd = ({ touches }) => {
            this.activeTouches.delete(touches[0].identifier);
            document.removeEventListener('touchmove', onDrag);
            document.removeEventListener('touchend', onDragEnd);

            if (!options.onDragEnd) return;
            options.onDragEnd({ x: touches[0].clientX, y: touches[0].clientY });
        };

        const onDragStart = ({ touches }) => {
            this.activeTouches.set(touches[0].identifier, touches[0]);

            document.addEventListener('touchmove', onDrag);
            document.addEventListener('touchend', onDragEnd);

            if (!options.onDragStart) return;
            options.onDragStart({ x: touches[0].clientX, y: touches[0].clientY });
        };

        element.addEventListener('touchstart', onDragStart);

        return {
            /**
             * Removes the event listeners
             */
            remove() {
                element.removeEventListener('touchstart', onDragStart);
            },
        };
    }

    /**
     *
     * @param {Object} options
     * @param {HTMLElement | string} options.element - Element you want to attach the touch event to
     * @param {function} options.callback - Function to be executed on touch- Directions of the swipe
     * @param {number} options.touchNumber - Number of fingers necessary for the swipe
     * @returns {void}
     */
    swipe(options) {
        if (!options) return console.error('Options not provided for swipe!');
        let swipeTimer, direction, distance;
        let isSwipe = true;

        const SWIPE_MIN_DISTANCE = 100;

        options.touchNumber ||= 1;

        const element = getElement(options.element);

        if (!element) return console.error('Element not found!');

        const onSwipe = ({ touches }) => {
            if (!this.activeTouches.has(touches[0].identifier)) return;

            const { clientX: startX, clientY: startY } = this.activeTouches.get(touches[0].identifier);

            const diffX = touches[0].clientX - startX;
            const diffY = touches[0].clientY - startY;

            direction = getDirection(diffX, diffY);
            distance = distanceBetweenTwoPoints(startX, startY, touches[0].clientX, touches[0].clientY); // To prevent slight taps to be considered as swipes
        };

        const onSwipeEnd = ({ touches }) => {
            this.activeTouches.delete(touches[0].identifier);

            if (this.activeTouches.size !== 0) return;

            document.removeEventListener('touchmove', onSwipe);
            document.removeEventListener('touchend', onSwipeEnd);

            if (isSwipeComplete()) {
                options.callback(direction);
            }

            clearTimeout(swipeTimer);
            isSwipe = true;
            swipeTimer = null;
        };

        const isSwipeComplete = () => {
            return isSwipe && options.callback && direction && distance > SWIPE_MIN_DISTANCE;
        };

        const onSwipeStart = ({ touches }) => {
            this.activeTouches.set(touches[0].identifier, touches[0]);

            if (this.activeTouches.size > options.touchNumber) {
                // If the user has added two swipes with different fingers this way we can differentiate them
                document.removeEventListener('touchmove', onSwipe);
                document.removeEventListener('touchend', onSwipeEnd);
            }

            if (this.activeTouches.size !== options.touchNumber) return;

            swipeTimer = setTimeout(() => {
                isSwipe = false;
                clearTimeout(swipeTimer);
                swipeTimer = null;
            }, 1000);

            document.addEventListener('touchmove', onSwipe);
            document.addEventListener('touchend', onSwipeEnd);
        };

        element.addEventListener('touchstart', onSwipeStart);

        return {
            /**
             * Removes the event listeners
             */
            remove() {
                element.removeEventListener('touchstart', onSwipeStart);
            },
        };
    }

    /**
     *
     * @param {Object} options
     * @param {HTMLElement | string} options.element - Element you want to attach the touch event to
     * @param {function} options.callback - Function to be executed on touch
     * @returns {void}
     */
    pinch(options) {
        if (!options) return console.error('Options not provided for pinch!');
        let distance;
        const PINCH_DELTA_NUMBER = 40;

        const element = getElement(options.element);

        if (!element) return console.error('Element not found!');

        const onPinch = ({ touches }) => {
            if (this.activeTouches.size < 2) return;

            this.activeTouches.set(touches[0].identifier, touches[0]);

            const newDistance = distanceBetweenTwoPoints(
                this.activeTouches.get(0).clientX,
                this.activeTouches.get(0).clientY,
                this.activeTouches.get(1).clientX,
                this.activeTouches.get(1).clientY
            );

            const pinchDelta = Math.sign(newDistance - distance) * PINCH_DELTA_NUMBER;
            distance = newDistance;

            if (options.callback) options.callback(pinchDelta);
        };
        const onPinchEnd = ({ touches }) => {
            this.activeTouches.delete(touches[0].identifier);

            if (this.activeTouches.size !== 0) return;
            document.removeEventListener('touchmove', onPinch);
            document.removeEventListener('touchend', onPinchEnd);
        };

        const onPinchStart = ({ touches }) => {
            this.activeTouches.set(touches[0].identifier, touches[0]);

            if (this.activeTouches.size !== 2) return;

            document.addEventListener('touchmove', onPinch);
            document.addEventListener('touchend', onPinchEnd);

            distance = distanceBetweenTwoPoints(
                this.activeTouches.get(0).clientX,
                this.activeTouches.get(0).clientY,
                this.activeTouches.get(1).clientX,
                this.activeTouches.get(1).clientY
            );
        };

        element.addEventListener('touchstart', onPinchStart);

        return {
            /**
             * Removes the event listeners
             */
            remove() {
                element.removeEventListener('touchstart', onPinchStart);
            },
        };
    }

    /**
     *
     * @param {Object} options
     * @param {HTMLElement | string} options.element - Element you want to attach the touch event to
     * @param {function} options.callback - Function to be executed on touch
     * @returns {void}
     */
    rotate(options) {
        if (!options) return console.error('Options not provided for rotate!');
        let angle = 0;
        let initialAngle;

        const element = getElement(options.element);

        if (!element) return console.error('Element not found!');

        const onRotate = ({ touches }) => {
            if (this.activeTouches.size < 2) return;

            this.activeTouches.set(touches[0].identifier, touches[0]);

            angle = getAngle() - initialAngle;

            if (options.callback) options.callback(angle);
        };
        const onRotateEnd = ({ touches }) => {
            this.activeTouches.delete(touches[0].identifier);

            if (this.activeTouches.size !== 0) return;
            document.removeEventListener('touchmove', onRotate);
            document.removeEventListener('touchend', onRotateEnd);
        };

        const onRotateStart = ({ touches }) => {
            this.activeTouches.set(touches[0].identifier, touches[0]);

            if (this.activeTouches.size !== 2) return;

            initialAngle = getAngle() - angle;

            document.addEventListener('touchmove', onRotate);
            document.addEventListener('touchend', onRotateEnd);
        };

        element.addEventListener('touchstart', onRotateStart);

        const getAngle = () => {
            const fullRotation = 360;
            const rotationOffset = 90;

            const offsetY = this.activeTouches.get(0).clientY - this.activeTouches.get(1).clientY;
            const offsetX = this.activeTouches.get(0).clientX - this.activeTouches.get(1).clientX;

            return (toDeg(Math.atan2(offsetY, offsetX)) + fullRotation + rotationOffset) % fullRotation;
        };

        return {
            /**
             * Removes the event listeners
             */
            remove() {
                element.removeEventListener('touchstart', onRotateStart);
            },
        };
    }
}

export default new TouchGestures();
