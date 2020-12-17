import components from 'coherent-gameface-components';
import slider from 'slider';
import template from './template.html';
import style from './style.css';
 
class ScrollableContainer extends HTMLElement {
    constructor() {
        super();
        this.template = template;
        components.importStyleTag('scrollable_container', style);
        this.url = '/components/scrollable_container/template.html';
    }

    connectedCallback() {
        components.loadResource(this)
            .then((response) => {
                this.template = response[1].cloneNode(true);
                components.render(this);

                this.setup();
                this.addEventListeners();
                this.shouldShowScrollbar();
            })
            .catch(err => console.error(err));
    }

    setup() {
        this.scrollbleContainer = this.getElementsByClassName('scrollable-container')[0];
        this.scrollbar = this.getElementsByClassName('slider-component')[0];
    }

    addEventListeners() {
        window.addEventListener('resize', () => this.scrollbar.resize(this.scrollbleContainer));
        this.scrollbar.addEventListener('slider-scroll', (e) => this.onScrollSlider(e));
        this.scrollbleContainer.addEventListener('scroll', (e) => this.onScroll(e));
    }

    onScrollSlider(e) {
        const scrollTop = e.detail.handlePosition * this.scrollbleContainer.scrollHeight / 100;
        this.scrollbleContainer.scrollTop = scrollTop;
        this.scrollbleContainer.dispatchEvent(new CustomEvent('scroll'));
    }

    onScroll(e) {
        this.scrollPos = ((this.scrollbleContainer.scrollTop) / this.scrollbleContainer.scrollHeight) * 100;
        this.scrollbar.handlePosition = this.scrollPos;
    }

    showScrollBar(scrollbar) {
        scrollbar.style.display = 'block';
    }

    hideScrollBar(scrollbar) {
        scrollbar.style.display = 'none';
    }

    shouldShowScrollbar() {
        const scrollableContent = this.querySelector('[name="scrollable-content"]');

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    const scrollableContentRect = scrollableContent.getBoundingClientRect();
                    const boundingRect = this.getBoundingClientRect();

                    if (!(scrollableContentRect.height > boundingRect.height)) return;
                    this.showScrollBar(this.scrollbar);
                    this.scrollbar.resize(this.scrollbleContainer);
                });
            });
        });
    }
}
components.defineCustomElement('scrollable-container', ScrollableContainer);
export default ScrollableContainer;