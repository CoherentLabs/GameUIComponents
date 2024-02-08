import { Components } from 'coherent-gameface-components';
import template from './template.html';

const components = new Components();
const BaseComponent = components.BaseComponent;

const CONTENT_WRAPPER_SELECTOR = '.guic-carousel-content-wrapper';
const DOTS_CONTAINER_SELECTOR = '.guic-carousel-dots';
const DOT_SELECTOR = '.guic-carousel-dot';
const CAROUSEL_SELECTOR = '.guic-carousel';
const NEXT_BTN_SELECTOR = '.guic-carousel-btn-next';
const PREV_BTN_SELECTOR = '.guic-carousel-btn-prev';
const NEXT_ARROW_SELECTOR = '.guic-carousel-right-arrow';
const PREV_ARROW_SELECTOR = '.guic-carousel-left-arrow';

const DIRECTIONS = {
    LEFT: -1,
    RIGHT: 1,
};

/**
 * Class description
 */
class Carousel extends BaseComponent {
    /* eslint-disable-next-line require-jsdoc */
    constructor() {
        super();
        this.template = template;
        this.init = this.init.bind(this);

        this._pageSize = 2;
        this._navArrowStepSize = 1;
        this._currentItemIndex = 0;
        this._currentPageIndex = 0;
        this.itemsDirection = 1;
    }

    /* eslint-disable-next-line require-jsdoc */
    connectedCallback() {
        components.loadResource(this)
            .then(this.init)
            .catch(err => console.error(err));
    }

    /* eslint-disable-next-line require-jsdoc */
    init(data) {
        this.setupTemplate(data, () => {
            components.renderOnce(this);

            this.contentWrapper = this.querySelector(CONTENT_WRAPPER_SELECTOR);
            components.waitForFrames(() => this.initSize());
            this.style.visibility = 'visible';

            this.createPaginationControls();
            this.attachControlButtonsListeners();

            this.shouldShowNavArrow(DIRECTIONS.RIGHT, this.nextStepIndex(this.navArrowStepSize));
            this.shouldShowNavArrow(DIRECTIONS.LEFT, this.prevStepIndex(this.navArrowStepSize));
        });
    }

    /**
     * Setup the sized of the carouse based on the items
     * @returns {undefined}
     */
    initSize() {
        if (!this.items || !this.items[0]) return console.warn('No items were added to the carousel!');
        const { width, height } = this.items[0].getBoundingClientRect();
        this.itemWidth = width;
        this.itemHeight = height;

        this.resize();
    }

    /**
     * Return the number of pages on the carousel.
     * Calculated runtime. Returns 0 if there are no items.
     */
    get pagesCount() {
        return (this.items?.length / this.pageSize) || 0;
    }

    /**
     * Return all carousel items.
     */
    get items() {
        return this.querySelector(CONTENT_WRAPPER_SELECTOR).children;
    }

    /**
     * Set the array of items to the carousel
     * @param {Array<HTMLElement>} value
     */
    set items(value) {
        this.contentWrapper.innerHTML = '';
        if (!(value instanceof Array)) {
            console.error(`Invalid type passed for items - it must be an array - received ${typeof value}`);
            return;
        }

        value.forEach((element) => {
            if (element instanceof HTMLElement) {
                this.contentWrapper.appendChild(element);
            } else {
                console.warn(`${element} is not an HTMLElement! It will not be added it to the carousel.`);
            }
        });

        components.waitForFrames(() => {
            this.initSize();
            this.createPaginationControls();
        });
    }

    /**
     * Return the length of all current items
     */
    get itemsLength() {
        return this.items.length;
    }

    /**
     * Return the indexes of all items that are currently visible on the carousel.
     * @returns {Array<string>}
     */
    get visibleItemsIndexes() {
        return Array.from({ length: this.pageSize }, (_, i) => i + this.currentItemIndex);
    }

    /**
     * Return an array of all currently visible HTMLElements on the carousel.
     * @returns {Array<HTMLElement>}
     */
    get visibleItems() {
        const items = this.items;
        return this.visibleItemsIndexes.map(idx => items[idx]);
    }

    /**
     * Return the left navigation arrow HTML Element.
     */
    get leftArrow() {
        return document.querySelector(PREV_ARROW_SELECTOR);
    }

    /**
     * Return the right navigation arrow HTML Element.
     */
    get rightArrow() {
        return document.querySelector(NEXT_ARROW_SELECTOR);
    }

    /**
     * Return the current step size of the carousel.
     */
    get navArrowStepSize() {
        return this._navArrowStepSize;
    }

    /**
     * Set the step size of the carousel.
     * @param {number} value
     */
    set navArrowStepSize(value) {
        this._navArrowStepSize = value;
    }

    /**
     * Return the currently active element on the carousel.
     * The counting starts from the element which is positioned at the leftmost side.
     */
    get currentItemIndex() {
        return this._currentItemIndex;
    }

    /**
     * Set the currently active item.
     * @param {number} value
     */
    set currentItemIndex(value) {
        this._currentItemIndex = value;
        this.moveTo(value);
    }

    /**
     * Return the current page size.
     */
    get pageSize() {
        return this._pageSize;
    }

    /**
     * Set the current page size.
     * @param {number} value
     */
    set pageSize(value) {
        this._pageSize = value;
        this.resize();
        this.createPaginationControls();
    }

    /**
     * Returns the current page
     */
    get currentPage() {
        return Math.ceil(this.currentItemIndex / this.pageSize + 1);
    }

    /**
     * Set the current page index
     * Move the carousel to the specified page
     * @param {number} value
     */
    set currentPage(value) {
        if (value > this.pagesCount) value = this.pagesCount;
        if (value < 0) value = 1;
        this.moveTo(this.pageSize * value - this.pageSize);

        this.shouldShowNavArrow(DIRECTIONS.RIGHT, this.nextStepIndex(this.navArrowStepSize));
        this.shouldShowNavArrow(DIRECTIONS.LEFT, this.prevStepIndex(this.navArrowStepSize));
    }

    /**
     * Hide one of the navigation arrows.
     * @param {number} direction - 1 for right arrow, -1 for left.
     * @returns {undefined}
     */
    hideArrow(direction) {
        if (direction === DIRECTIONS.RIGHT) return this.rightArrow.classList.add('guic-carousel-hidden');
        this.leftArrow.classList.add('guic-carousel-hidden');
    }

    /**
     * Show one of the navigation arrows.
     * @param {number} direction - 1 for right arrow, -1 for left.
     * @returns {undefined}
     */
    showArrow(direction) {
        if (direction === DIRECTIONS.RIGHT) return this.rightArrow.classList.remove('guic-carousel-hidden');
        this.leftArrow.classList.remove('guic-carousel-hidden');
    }

    /**
     * Check if the next item will overflow the carousel's boundaries.
     * @param {number} next - the index of the next element
     * @returns {boolean}
     */
    overflows(next) {
        return this.itemsLength - next < this.pageSize;
    }

    /**
     * Get the index of the next element based on the current step size.
     * @param {number} stepSize
     * @returns {number}
     */
    nextStepIndex(stepSize) {
        return (this.currentItemIndex + stepSize) % this.items.length;
    }

    /**
     * Get the index of the previous element based on the current step size.
     * @param {number} stepSize
     * @returns {number}
     */
    prevStepIndex(stepSize) {
        const itemsLength = this.items.length;
        return (this.currentItemIndex - stepSize + itemsLength) % itemsLength;
    }

    /**
     * Check if a nav arrow based on a given direction should be
     * visible - if navigating in that direction is possible
     * @param {number} direction - -1  for left and 1 for right
     * @param {number} nextIndex - the index of the next item
     * @returns {undefined}
     */
    shouldShowNavArrow(direction, nextIndex) {
        if (this.overflows(nextIndex)) return this.hideArrow(direction);
        this.showArrow(direction);
    }

    /**
     * Add an item to the carousel.
     * @param {HTMLElement} node
     * @param {index} index - the position at which to add it.
     */
    addItem(node, index) {
        if (index === undefined || index < 0) {
            this.contentWrapper.appendChild(node);
        } else {
            const referenceNode = this.items[index - 1];
            referenceNode.parentNode.insertBefore(node, referenceNode);
        }

        this.createPaginationControls();
    }

    /**
     * Remove an item from the carousel.
     * @param {number} index - the position from which to remove.
     */
    removeItem(index = 0) {
        const items = this.items;
        const itemsArr = Array.from(items);
        itemsArr[index].remove();
        this.createPaginationControls();
    }

    /**
     * Move the carousel to the previous element.
     * @param {number} pageSize
     */
    previous(pageSize = 1) {
        const itemsLength = this.items.length;
        let previous = (this.currentItemIndex - pageSize + itemsLength) % itemsLength;

        if (this.overflows(previous)) previous = 0;

        this.currentItemIndex = previous;
        this.moveTo(this.currentItemIndex);

        this.shouldShowNavArrow(DIRECTIONS.LEFT, this.prevStepIndex(this.navArrowStepSize));
        this.shouldShowNavArrow(DIRECTIONS.RIGHT, this.nextStepIndex(this.navArrowStepSize));
    }

    /**
     * Move the carousel to the next element.
     * @param {number} pageSize
     */
    next(pageSize = 1) {
        const next = (this.currentItemIndex + pageSize) % this.items.length;

        if (!this.overflows(next)) {
            this.currentItemIndex = next;
            this.moveTo(this.currentItemIndex);
        }

        this.shouldShowNavArrow(DIRECTIONS.LEFT, this.prevStepIndex(this.navArrowStepSize));
        this.shouldShowNavArrow(DIRECTIONS.RIGHT, this.nextStepIndex(this.navArrowStepSize));
    }

    /**
     * Move the carousel to a specific element based on given index.
     * @param {number} index
     */
    moveTo(index) {
        if (index < 0) index = 0;
        if (index > this.itemsLength) index = this.itemsLength - this.pageSize;

        this._currentItemIndex = index;
        this.contentWrapper.style.left = `${-index * this.itemWidth}px`;
    }

    /**
     * Create the pagination dots.
     * @param {number} page
     * @returns {HTMLElement}
     */
    createDot(page) {
        const dot = document.createElement('div');
        dot.classList.add('guic-carousel-dot');
        // do not use 0 as page number
        dot.dataset.page = page + 1;

        return dot;
    }

    /**
     * Create the pagination controls - the dots and attach click event handlers
     */
    createPaginationControls() {
        const container = this.querySelector(DOTS_CONTAINER_SELECTOR);
        container.innerHTML = '';

        for (let i = 0; i < this.pagesCount; i++) {
            container.appendChild(this.createDot(i));
        }

        const dots = container.querySelectorAll(DOT_SELECTOR);

        for (let i = 0; i < dots.length; i++) {
            dots[i].addEventListener('click', e => this.onClickOnNavDot(e));
        }
    }

    /**
     * Called when a navigation dot is clicked.
     * Navigates to the specific page.
     * @param {Event} e
     */
    onClickOnNavDot(e) {
        // page names start from 1 so we need to
        // detract 1 to get the page index
        const page = e.currentTarget.dataset.page - 1;
        this._currentPage = page;
        this.currentItemIndex = (Number(page) * this.pageSize);

        this.moveTo(this.currentItemIndex);
        this.shouldShowNavArrow(DIRECTIONS.RIGHT, this.nextStepIndex(this.navArrowStepSize));
        this.shouldShowNavArrow(DIRECTIONS.LEFT, this.prevStepIndex(this.navArrowStepSize));
    }

    /**
     * Resize the carousel based on the size of the elements.
     */
    resize() {
        this.querySelector(CAROUSEL_SELECTOR).style.width = this.pageSize * this.itemWidth + 'px';
        this.querySelector(CAROUSEL_SELECTOR).style.height = this.itemHeight + 'px';
        this.style.width = this.pageSize * this.itemWidth + 'px';
    }

    /**
     * Attach the event handlers of the control buttons - next, previous
     */
    attachControlButtonsListeners() {
        const singleNextButton = this.querySelector(NEXT_BTN_SELECTOR);
        const singlePreviousButton = this.querySelector(PREV_BTN_SELECTOR);

        singleNextButton.addEventListener('click', _ => this.next(1));
        singlePreviousButton.addEventListener('click', _ => this.previous(1));
    }

    /**
     * Rerender the carousel controls - dots and arrows
     */
    rerenderControls() {
        this.createPaginationControls();

        this.shouldShowNavArrow(DIRECTIONS.RIGHT, this.nextStepIndex(this.navArrowStepSize));
        this.shouldShowNavArrow(DIRECTIONS.LEFT, this.prevStepIndex(this.navArrowStepSize));
    }
}
components.defineCustomElement('gameface-carousel', Carousel);
export default Carousel;
