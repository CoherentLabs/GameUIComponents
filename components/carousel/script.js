import { Components } from 'coherent-gameface-components';
import template from './template.html';

const components = new Components();
const BaseComponent = components.BaseComponent;

/**
 * Class description
 */
class Carousel extends BaseComponent {
    /* eslint-disable require-jsdoc */
    constructor() {
        super();
        this.template = template;
        this.init = this.init.bind(this);

        this.items = [];
        this.auto = false;
        this._pageSize = 2;
        this.current = 0;
        this.itemsDirection = 1;

        this.pages = 0;
    }

    addItem(node, index) {
        const contentWrapper = this.querySelector('.content-wrapper');
        if (index === undefined) return contentWrapper.append(node);

        const referenceNode = this.items[index-1];
        referenceNode.parentNode.insertBefore(node, referenceNode);
    }

    removeItem(index) {
        const items = this.querySelectorAll('.box');

        if (this.itemsDirection === 1) return items[index].remove();

        const itemsArr = Array.from(items);
        const firstEl = itemsArr.pop();

        itemsArr.reverse();
        [firstEl, ...itemsArr][index].remove();
    }

    set pageSize(size) {
        this._pageSize = size;
        this.resize();
    }

    get pageSize() {
        return this._pageSize;
    }

    next(pageSize) {
        const itemsLength = this.items.length;

        let next = (this.current + pageSize) % this.items.length;
        if (itemsLength - next < this.pageSize) {
            this.reverse();
            next -= this.pageSize - (itemsLength - next);
        }
        this.current = next;

        this.moveTo(-this.current);
    }

    reverse() {
        const items = this.querySelectorAll('.box');
        const itemsArr = Array.from(items);
        itemsArr.shift();
        itemsArr.reverse();
        let firstEl = this.querySelector('.box');

        for (let i=0; i< itemsArr.length; i++) {
            firstEl.parentNode.insertBefore(itemsArr[i], firstEl);
            firstEl = itemsArr[i];
        }

        this.itemsDirection *= -1;
    }

    previous(pageSize) {
        const itemsLength = this.items.length;
        let previous = (this.current - pageSize + itemsLength) % itemsLength;
        if (itemsLength - previous < this.pageSize) {
            this.reverse();
            previous -= this.pageSize - (itemsLength - previous);
        }
        this.current = previous;
        this.moveTo(-this.current);
    }

    pause() {
        this.auto = false;
        clearInterval(this.slideInterval);
    }

    moveTo(index) {
        this.contentWrapper.style.left = `${index * this.itemWidth}px`;
    }

    init(data) {
        this.setupTemplate(data, () => {
            components.renderOnce(this);

            this.items = this.querySelector('.content-wrapper').children;
            this.itemWidth = this.items[0].getBoundingClientRect().width;
            this.itemHeight = this.items[0].getBoundingClientRect().height;

            this.contentWrapper = this.querySelector('.content-wrapper');
            this.resize();
            this.style.visibility = 'visible';

            this.pages = this.items.length / this.pageSize;

            this.createPaginationControls();
            this.attachControlButtonsListeners();
            // attach event handlers here
        });
    }

    createDot(page) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        dot.dataset.page = page;

        return dot;
    }

    createPaginationControls() {
        const container = this.querySelector('.dots');

        for (let i = 0; i < this.pages; i++) {
            container.appendChild(this.createDot(i));
        }

        const dots = container.querySelectorAll('.dot');

        for (let i = 0; i < dots.length; i++) {
            dots[i].addEventListener('click', (e) => {
                const page = e.currentTarget.dataset.page;
                this.current = (Number(page) * this.pageSize);
                this.moveTo(-this.current);
            });
        }
    }

    resize() {
        this.querySelector('.carousel').style.width = this.pageSize * this.itemWidth + 'px';
        this.querySelector('.carousel').style.height = this.itemHeight + 'px';
    }

    attachControlButtonsListeners() {
        const controls = this.querySelector('.controls');
        const nextButton = controls.querySelector('.next');
        const previousButton = controls.querySelector('.previous');
        const singleNextButton = controls.querySelector('.next-single');
        const singlePreviousButton = controls.querySelector('.previous-single');
        // const pauseButton = controls.querySelector('.pause');

        nextButton.addEventListener('click', _ => this.next(this.pageSize));
        previousButton.addEventListener('click', _ => this.previous(this.pageSize));
        singleNextButton.addEventListener('click', _ => this.next(1));
        singlePreviousButton.addEventListener('click', _ => this.previous(1));
    }

    connectedCallback() {
        components.loadResource(this)
            .then(this.init)
            .catch(err => console.error(err));
    }
    /* eslint-enable require-jsdoc */
}
components.defineCustomElement('gameface-carousel', Carousel);
export default Carousel;
