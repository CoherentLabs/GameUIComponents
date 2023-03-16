/* eslint-disable linebreak-style */
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import components from 'coherent-gameface-components';
// eslint-disable-next-line no-unused-vars
import Slider from 'coherent-gameface-slider';
import template from './template.html';

/**
 * Scrollable container. If it's content overflows a scrollbar will appear.
*/
class ScrollableContainer extends HTMLElement {
    // eslint-disable-next-line require-jsdoc
    static get observedAttributes() {
        return ['automatic'];
    }

    // eslint-disable-next-line require-jsdoc
    get automatic() {
        return this.hasAttribute('automatic');
    }

    // eslint-disable-next-line require-jsdoc
    set automatic(value) {
        this._automatic = value;
    }

    // eslint-disable-next-line require-jsdoc
    attributeChangedCallback(name, oldValue, newValue) {
        // boolean attributes' initial value is an empty string, so
        // we need to check if the old value was null
        if (oldValue !== null && !newValue) this.removeMutationObserver();
        if (oldValue === null && newValue) this.initMutationObserver();
    }

    // eslint-disable-next-line require-jsdoc
    constructor() {
        super();
        this.template = template;
        this.url = '/components/scrollable-container/template.html';

        this.onScrollSlider = this.onScrollSlider.bind(this);
        this.onScroll = this.onScroll.bind(this);
        this.onResize = this.onResize.bind(this);
        this.init = this.init.bind(this);
    }

    /**
     * Initialize the custom component.
     * Set template, attach event listeners, setup initial state etc.
     * @param {object} data
    */
    init(data) {
        components.onTemplateLoaded(this, data, () => {
            // render the component
            components.renderOnce(this);
            // do the initial setup - add event listeners, assign members

            this.setup();
            this.shouldShowScrollbar();
            if (this.automatic) this.initMutationObserver();
        });
    }

    /**
     * Called when the element is attached to the DOM.
    */
    connectedCallback() {
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
        this.observer = new MutationObserver(() => this.shouldShowScrollbar());

        const options = {
            attributes: true,
            subtree: true,
            childList: true,
            attributesFilter: ['style', 'class'],
        };

        this.observer.observe(this, options);
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
        window.addEventListener('resize', this.onResize);
        this.scrollbar.addEventListener('slider-scroll', this.onScrollSlider);
        this.scrollableContainer.addEventListener('scroll', this.onScroll);
    }

    // eslint-disable-next-line require-jsdoc
    removeEventListeners() {
        window.removeEventListener('resize', this.onResize);
    }

    /**
     * Called on window resize
     */
    onResize() {
        this.scrollbar.resize(this.scrollableContainer);
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
        // set the position of the scrollbar handle
        this.scrollbar.handlePosition = this.scrollPos;
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
        const scrollableContent = this.querySelector('[data-name="scrollable-content"]');
        components.waitForFrames(() => {
            const scrollableContentRect = scrollableContent.getBoundingClientRect();
            const boundingRect = this.getBoundingClientRect();
            if (scrollableContentRect.height <= boundingRect.height) {
                return this.hideScrollBar(this.scrollbar);
            }
            this.showScrollBar(this.scrollbar);
            this.scrollbar.resize(this.scrollableContainer);
        });
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
