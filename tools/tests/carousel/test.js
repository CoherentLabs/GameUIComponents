/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/* eslint-disable max-lines-per-function */

const styles = `
.box {
    width: 100px;
    height: 100px;
}

#box0 {
    background-color: rgb(170, 215, 255);
}

#box1 {
    background-color: rgb(51, 162, 240);
}

#box2 {
    background-color: rgb(159, 235, 152);
}

#box3 {
    background-color: rgb(255, 243, 154);
}

#box4 {
    background-color: rgb(246, 230, 7);
}

#box5 {
    background-color: rgb(246, 173, 136);
}

#box6 {
    background-color: rgb(254, 103, 9);
}

#box7 {
    background-color: rgb(149, 254, 200);
}

#box8 {
    background-color: rgb(142, 251, 157);
}`;

const carouselTemplate = `<gameface-carousel class="carousel-component">
<div slot="carousel-content" class="box" id="box0">0</div>
<div slot="carousel-content" class="box" id="box1">1</div>
<div slot="carousel-content" class="box" id="box2">2</div>
<div slot="carousel-content" class="box" id="box3">3</div>
<div slot="carousel-content" class="box" id="box4">4</div>
<div slot="carousel-content" class="box" id="box5">5</div>
<div slot="carousel-content" class="box" id="box6">6</div>
<div slot="carousel-content" class="box" id="box7">7</div>
</gameface-carousel>`;

/**
 * @param {string} template
 * @returns {Promise<void>}
 */
function setupCarousel(template) {
    const el = document.createElement('div');
    const styleEl = document.createElement('style');
    styleEl.innerText = styles;
    document.head.appendChild(styleEl);

    el.className = 'carousel-test-wrapper';
    el.innerHTML = template;

    cleanTestPage('.carousel-test-wrapper');

    document.body.appendChild(el);

    return new Promise((resolve) => {
        waitForStyles(resolve);
    });
}

/**
 * Create an HTML element that can be added as an item to the carousel
 * @param {string} textContent
 * @returns {HTMLElement}
 */
function createCarouselItem(textContent) {
    const cItem = document.createElement('div');
    cItem.textContent = textContent;
    cItem.id = `box${textContent}`;
    cItem.classList.add('box');
    cItem.style.backgroundColor = 'red';

    return cItem;
}

/**
 * Dynamically add an item to the carousel.
 * @param {HTMLElement} carousel
 */
function addItem(carousel) {
    const numberText = document.querySelectorAll('.box').length + 1;
    carousel.addItem(createCarouselItem(numberText));
}

describe('Carousel component', () => {
    afterAll(() => cleanTestPage('.carousel-test-wrapper'));

    beforeEach(async () => {
        return await setupCarousel(carouselTemplate);
    });

    it('Should be rendered', async () => {
        await createAsyncSpec(() => {
            assert(document.querySelector('gameface-carousel') !== null, 'Carousel was not rendered.');
            assert(document.querySelector('gameface-carousel .carousel-current-item').textContent === '0', 'Carousel has invalid active item.');
        });
    });

    it('Should have only next arrow navigation visible', () => {
        const carousel = document.querySelector('gameface-carousel');
        const leftArrow = carousel.querySelector('.guic-carousel-left-arrow');
        const rightArrow = carousel.querySelector('.guic-carousel-right-arrow');

        assert(rightArrow.classList.contains('guic-carousel-hidden') === false, 'Right arrow is not visible.');
        assert(leftArrow.classList.contains('guic-carousel-hidden') === true, 'Left arrow is visible when there is no way to navigate left.');
    });

    it('Should have correct number of navigation dots', () => {
        const carousel = document.querySelector('gameface-carousel');
        const dots = carousel.querySelectorAll('.guic-carousel-dot');

        assert(dots.length === 4, 'Carousel does not have 4 dots.');
    });

    it('Should have only left arrow visible when on last page', () => {
        const carousel = document.querySelector('gameface-carousel');
        const dots = carousel.querySelectorAll('.guic-carousel-dot');
        click(dots[dots.length - 1]);

        const leftArrow = carousel.querySelector('.guic-carousel-left-arrow');
        const rightArrow = carousel.querySelector('.guic-carousel-right-arrow');

        assert(rightArrow.classList.contains('guic-carousel-hidden') === true, 'Right arrow is visible when there is no way to navigate right.');
        assert(leftArrow.classList.contains('guic-carousel-hidden') === false, 'Left arrow is not visible.');
        assert(document.querySelector('gameface-carousel .carousel-current-item').textContent === '6', 'Carousel has invalid active item.');
    });

    it('Should have the first and second elements visible', () => {
        const carousel = document.querySelector('gameface-carousel');

        assert(carousel.visibleItemsIndexes.length === 2, 'The initially visible elements are not 2.');
        assert(carousel.visibleItemsIndexes[0] === 0, 'The first initially visible element is not the first from the carousel items.');
        assert(carousel.visibleItemsIndexes[1] === 1, 'The second initially visible element is not the second from the carousel items.');
    });

    it('Should navigate properly using the arrows', () => {
        const carousel = document.querySelector('gameface-carousel');

        const rightArrow = carousel.querySelector('.guic-carousel-right-arrow');
        const leftArrow = carousel.querySelector('.guic-carousel-left-arrow');

        click(rightArrow);
        click(rightArrow);
        click(rightArrow);

        assert(carousel.visibleItemsIndexes[0] === 3, 'Right arrow navigation failed - the first visible element is not correct.');
        assert(carousel.visibleItemsIndexes[1] === 4, 'Right arrow navigation failed - the second initially visible element is not correct.');
        assert(document.querySelector('gameface-carousel .carousel-current-item').textContent === '3', 'Carousel has invalid active item.');

        click(leftArrow);
        click(leftArrow);

        assert(carousel.visibleItemsIndexes[0] === 1, 'Left arrow navigation failed - The first visible element is not correct.');
        assert(carousel.visibleItemsIndexes[1] === 2, 'The second initially visible element is not correct.');
        assert(document.querySelector('gameface-carousel .carousel-current-item').textContent === '1', 'Carousel has invalid active item.');
    });

    it('Should be able to dynamically add new elements to the carousel', () => {
        const carousel = document.querySelector('gameface-carousel');
        addItem(carousel);
        addItem(carousel);

        assert(carousel.items.length === 10, 'Items were not added.');
    });

    it('Should be able to dynamically remove elements from the carousel', () => {
        const carousel = document.querySelector('gameface-carousel');
        carousel.removeItem();
        carousel.removeItem();

        assert(carousel.items.length === 6, 'Items were not removed.');
    });

    it('Should update dots when new items are added', () => {
        const carousel = document.querySelector('gameface-carousel');

        addItem(carousel);
        addItem(carousel);
        addItem(carousel);
        addItem(carousel);

        const dots = carousel.querySelectorAll('.guic-carousel-dot');

        assert(dots.length === 6, 'Dots were not updated.');
    });

    it('Should update dots when new items are removed', () => {
        const carousel = document.querySelector('gameface-carousel');

        carousel.removeItem();
        carousel.removeItem();
        carousel.removeItem();
        carousel.removeItem();

        const dots = carousel.querySelectorAll('.guic-carousel-dot');

        assert(dots.length === 2, 'Dots were not updated.');
    });

    it('Should dynamically update page size', () => {
        const carousel = document.querySelector('gameface-carousel');
        carousel.pageSize = 4;

        const dots = carousel.querySelectorAll('.guic-carousel-dot');

        assert(carousel.visibleItemsIndexes.length === 4, 'Carousel did not update the page size.');
        assert(dots.length === 2, 'Carousel did not update the length of the dots.');
    });

    it('Should set currentItemIndex', () => {
        const carousel = document.querySelector('gameface-carousel');
        carousel.currentItemIndex = 2;

        assert(carousel.visibleItemsIndexes[0] === 2, 'Carousel did not update its active item.');
    });

    it('Should get currentItemIndex', () => {
        const carousel = document.querySelector('gameface-carousel');
        assert(carousel.currentItemIndex === 0, 'Carousel did not return correct active item.');
    });

    it('Should get items correctly', () => {
        const carousel = document.querySelector('gameface-carousel');
        assert(carousel.items.length === 8, 'Carousel did not return correct length for items.');
    });

    it('Should set items correctly', () => {
        const carousel = document.querySelector('gameface-carousel');
        carousel.items = [createCarouselItem('First Item'), createCarouselItem('Second Item')];

        assert(carousel.items.length === 2, 'Carousel did not set items correctly.');
        assert(carousel.items[0].textContent === 'First Item', `Carousel's first element is not correct.`);
        assert(carousel.items[1].textContent === 'Second Item', `Carousel's second element is not correct.`);
        assert(carousel.pagesCount === 1, `Carousel did not update its pages correctly.`);
    });

    it('Should get current page correctly', () => {
        const carousel = document.querySelector('gameface-carousel');
        assert(carousel.currentPage === 1, 'Carousel did not return correct current page.');
    });

    it('Should set current page correctly', () => {
        const carousel = document.querySelector('gameface-carousel');
        carousel.currentPage = 2;

        assert(carousel.visibleItemsIndexes[0] === 2, 'Carousel did not update its current page.');
    });
});
