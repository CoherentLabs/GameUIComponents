import components from 'coherent-gameface-components';
import Slider from 'slider';
import template from './template.html';
import style from './style.css';

/**
 * @class ScrollableContainer.
 * Scrollable container. If it's content overflows a scrollbar will appear.
*/
class ScrollableContainer extends HTMLElement {
    constructor() {
        super();
        this.template = template;
        components.importStyleTag('scrollable-container', style);
        this.url = '/components/scrollable-container/template.html';
    }

    /**
     * Called when the element is attached to the DOM.
    */
    connectedCallback() {
        // load the template
        components.loadResource(this)
            .then(([loadedTemplate]) => {
                this.template = loadedTemplate;
                // render the component
                components.render(this);
                // do the initial setup - add event listeners, assign members
                this.setup();
                this.shouldShowScrollbar();
            })
            .catch(err => console.error(err));
    }

    /**
     * Set the scrollableContainer  and scrollbar members and attach event listeners.
    */
    setup() {
        this.scrollableContainer = this.getElementsByClassName('scrollable-container')[0];
        this.scrollbar = this.getElementsByClassName('slider-component')[0];

        this.addEventListeners();
    }

    /**
     * Add event listeners to handle resize, slider scroll
     * and scroll of the scrollabe container.
    */
    addEventListeners() {
        window.addEventListener('resize', () => this.scrollbar.resize(this.scrollableContainer));
        this.scrollbar.addEventListener('slider-scroll', (e) => this.onScrollSlider(e));
        this.scrollableContainer.addEventListener('scroll', (e) => this.onScroll(e));
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
    */
    shouldShowScrollbar() {
        const scrollableContent = this.querySelector('[name="scrollable-content"]');

        Slider.waitForFrames(() => {
            const scrollableContentRect = scrollableContent.getBoundingClientRect();
            const boundingRect = this.getBoundingClientRect();

            if (scrollableContentRect.height <= boundingRect.height) return;
            this.showScrollBar(this.scrollbar);
            this.scrollbar.resize(this.scrollableContainer);
        });
    }
}
components.defineCustomElement('scrollable-container', ScrollableContainer);
export default ScrollableContainer;