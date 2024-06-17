/* eslint-disable linebreak-style */
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Components } from 'coherent-gameface-components';
const components = new Components();// eslint-disable-next-line no-unused-vars
import 'coherent-gameface-slider';
import template from './template.html';
import { clamp } from './scrollable-container-utils';

const BaseComponent = components.BaseComponent;
const fixedSliderHeightAttrString = 'fixed-slider-height';

/**
 * Scrollable container. If it's content overflows a scrollbar will appear.
*/
class ScrollableContainer extends BaseComponent {
    // eslint-disable-next-line require-jsdoc
    static get observedAttributes() {
        return ['automatic', fixedSliderHeightAttrString];
    }

    // eslint-disable-next-line require-jsdoc
    get automatic() {
        return this.hasAttribute('automatic');
    }

    // eslint-disable-next-line require-jsdoc
    set automatic(value) {
        value ? this.setAttribute('automatic', 'automatic') : this.removeAttribute('automatic');
    }

    // eslint-disable-next-line require-jsdoc
    get scrollPos() {
        return this._scrollPos;
    }

    /**
     * Set the scroll position of the scrollable container.
     * @param {number} value - the new scroll position in percents
     */
    set scrollPos(value) {
        this._scrollPos = value;
        // set the position of the scrollbar handle
        components.waitForFrames(() => this.scrollbar.scrollToPercents(this._scrollPos));
    }

    /* eslint-disable max-len */
    /**
     * Will scroll the container to a passed percents
     * @param {string|number} value
     * @returns {undefined}
     */
    scrollToPercents(value) {
        value = parseFloat(value);
        if (isNaN(value)) return console.error('The passed value to the scrollToPercents method should be number!');

        this.scrollableContainer.scrollTop =
            ((this.scrollableContainer.scrollHeight - this.scrollableContainer.offsetHeight) * clamp(value, 0, 100)) / 100;
        this.onScroll();
    }

    /**
     * Will scroll to some element inside the scrollable container. Based on the alignment the container will scroll to the element by position it
     * on the top, bottom or centering it inside the visible area of the scrollable container.
     * @param {HTMLElement} element
     * @param {string} alignment
     * @returns {undefined}
     */
    scrollToElement(element, alignment = 'start') {
        if (!this.scrollableContainer.contains(element)) return console.error('The passed element should be inside the scrollable container\'s content added with the <component-slot data-name="scrollable-content">!');
        const elementOffSetHeight = element.offsetHeight;
        const elementOffSetTop = element.offsetTop;
        const containerOffsetHeight = this.scrollableContainer.offsetHeight;

        switch (alignment) {
            case 'start':
                this.scrollableContainer.scrollTop = elementOffSetTop;
                break;
            case 'center':
                this.scrollableContainer.scrollTop = elementOffSetHeight / 2 + elementOffSetTop - containerOffsetHeight / 2;
                break;
            case 'end':
                this.scrollableContainer.scrollTop = elementOffSetHeight + elementOffSetTop - containerOffsetHeight;
                break;
            default: {
                console.error('The passed alignment argument is not valid. Possible values are "start", "center", "end".');
                this.scrollableContainer.scrollTop = elementOffSetTop;
            }
        }

        this.onScroll();
    }

    /* eslint-enable max-len */

    // eslint-disable-next-line require-jsdoc
    attributeChangedCallback(name, oldValue, newValue) {
        if (!this.isRendered) return;

        // boolean attributes' initial value is an empty string, so
        // we need to check if the old value was null
        if (name === fixedSliderHeightAttrString) return this.shouldShowScrollbar();
        if (oldValue !== null && !newValue) this.removeMutationObserver();
        if (oldValue === null && newValue) this.initMutationObserver();
    }

    // eslint-disable-next-line require-jsdoc
    constructor() {
        super();
        this.template = template;
        this.url = '/components/scrollable-container/template.html';
    }

    /**
     * Initialize the custom component.
     * Set template, attach event listeners, setup initial state etc.
     * @param {object} data
    */
    init(data) {
        this.setupTemplate(data, () => {
            // render the component
            components.renderOnce(this);
            // do the initial setup - add event listeners, assign members

            this.setup();
            this.scrollbar.style.visibility = 'hidden';
            this.shouldShowScrollbar();
            if (this.automatic) this.initMutationObserver();
            this.isRendered = true;
        });
    }

    /**
     * Called when the element is attached to the DOM.
    */
    connectedCallback() {
        this.onScrollSlider = this.onScrollSlider.bind(this);
        this.onScroll = this.onScroll.bind(this);
        this.resize = this.resize.bind(this);
        this.init = this.init.bind(this);
        this.setup = this.setup.bind(this);
        this.shouldShowScrollbar = this.shouldShowScrollbar.bind(this);
        this.shouldShowScrollbarCallback = this.shouldShowScrollbarCallback.bind(this);

        // load the template
        components.loadResource(this)
            .then(this.init)
            .catch(err => console.error(err));
    }

    /**
     * Will initialize a mutation obeserver that will watch if the scrollbar should be visible or not
     */
    initMutationObserver() {
        if (this.observer) this.removeMutationObserver();

        this.observer = new ResizeObserver(this.shouldShowScrollbar);
        const scrollableContent = this.querySelector('[data-name="scrollable-content"]');

        this.observer.observe(scrollableContent);
        this.observer.observe(this);
    }

    /**
     * Will remove mutation observer
     */
    removeMutationObserver() {
        this.observer.disconnect();
        this.observer = null;
    }

    /**
     * Set the scrollableContainer  and scrollbar members and attach event listeners.
    */
    setup() {
        this.scrollableContainer = this.getElementsByClassName('guic-scrollable-container')[0];
        this.scrollbar = this.getElementsByClassName('guic-slider-component')[0];
        if (!components.isBrowserGameface()) this.scrollableContainer.classList.add('guic-native-scroll-disabled');
        this.addEventListeners();
    }

    // eslint-disable-next-line require-jsdoc
    disconnectedCallback() {
        this.removeEventListeners();
    }

    /**
     * Add event listeners to handle resize, slider scroll
     * and scroll of the scrollabe container.
    */
    addEventListeners() {
        window.addEventListener('resize', this.resize);
        this.scrollbar.addEventListener('slider-scroll', this.onScrollSlider);
        this.scrollableContainer.addEventListener('scroll', this.onScroll);
    }

    // eslint-disable-next-line require-jsdoc
    removeEventListeners() {
        window.removeEventListener('resize', this.resize);
    }

    /**
     * Called on scroll event of the slider.
     * @param {CustomEvent} event
    */
    onScrollSlider(event) {
        // get the new scroll position in pixels
        const scrollTop = event.detail.handlePosition * this.scrollableContainer.scrollHeight / 100;
        // set the new scroll position
        this.scrollableContainer.scrollTop = scrollTop;
        // force a scroll event as setting scrollTop doesn't automatically emit it
        this.scrollableContainer.dispatchEvent(new CustomEvent('scroll'));
    }

    /**
     * Called on scroll event of the scrollable container.
     */
    onScroll() {
        // get the scroll position in percents
        this.scrollPos = (this.scrollableContainer.scrollTop / this.scrollableContainer.scrollHeight) * 100;
    }

    /**
     * Shows a scrollbar.
     * @param {HTMLElement} scrollbar
    */
    showScrollBar(scrollbar) {
        scrollbar.style.display = 'block';
    }

    /**
     * Hides a scrollbar.
     * @param {HTMLElement} scrollbar
    */
    hideScrollBar(scrollbar) {
        scrollbar.style.display = 'none';
    }

    /**
     * Checks if a scrollbar should be visible.
     * @warning - Be careful! Any mutation to the scrollable container in this method will cause a memory leak!
     * For example this.scrollableContainer.classList.add('some-class').
    */
    shouldShowScrollbar() {
        components.waitForFrames(this.shouldShowScrollbarCallback);
    }

    /**
     * Called after we've waited for enough frames for the UI to be ready.
     * @returns {void}
     */
    shouldShowScrollbarCallback() {
        const scrollableContent = this.querySelector('[data-name="scrollable-content"]');
        const scrollableContentRect = scrollableContent.getBoundingClientRect();
        const boundingRect = this.getBoundingClientRect();
        if (scrollableContentRect.height <= boundingRect.height) {
            return this.hideScrollBar(this.scrollbar);
        }

        this.showScrollBar(this.scrollbar);
        this.scrollbar.resize(this.scrollableContainer);
    }

    /**
     * Resizes the scrollbar manually
     */
    resize() {
        this.shouldShowScrollbar();
    }
}

/**
 * Will add styles for the non Coherent browsers that are disabling the native scrollbar
 */
function addDisabledNativeScrollbarStyles() {
    const style = document.createElement('style');
    style.innerHTML = `
        .guic-native-scroll-disabled {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
        .guic-native-scroll-disabled::-webkit-scrollbar {
            display: none;
        }`;
    document.head.appendChild(style);
}

if (!components.isBrowserGameface() && !components.nativeScrollDisabledStylesAdded) {
    addDisabledNativeScrollbarStyles();
    // We are doing this to prevent readdition of the styles needed for the native scrollbar to not be visible.
    // This problem is produced when multiple components have the scrollable container bundled.
    components.nativeScrollDisabledStylesAdded = true;
}

components.defineCustomElement('gameface-scrollable-container', ScrollableContainer);
export default ScrollableContainer;
