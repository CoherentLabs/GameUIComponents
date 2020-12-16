import components from 'coherent-gameface-components';
import verticalTemplate from './vertical.html';
import horizontalTemplate from './horizontal.html';
import verticalStyle from './vertical.css';
import horizontalStyle from './horizontal.css'

 
const dimentionUnitsNames = new Map([
    ['vertical', {
        mouseAxisCoords: 'clientY',
        size: 'height',
        position: 'top'
    }],
    ['horizontal', {
        mouseAxisCoords: 'clientX',
        size: 'width',
        position: 'left'
    }]
]);


class Slider extends HTMLElement {
    set handlePosition (value) {
        this._handlePosition = value;
        this.handle.style[this.units.position] = value + '%';
    }

    get handlePosition () {
        return this._handlePosition;
    }

    constructor() {
        super();
        this.step = 10;
        this._handlePosition = 0;
        components.importStyleTag('gameface-slider-vertical', verticalStyle);
        components.importStyleTag('gameface-slider-horizontal', horizontalStyle);

        this.orientation = this.getAttribute('orientation') || 'vertical';
        this.template = (this.orientation === 'vertical') ? horizontalTemplate : verticalTemplate;
        this.units = dimentionUnitsNames.get(this.orientation);
    }

    connectedCallback() {
        components.loadResource(this)
            .then((response) => {
                this.template = response[1].cloneNode(true);
                components.render(this);
                this.setup();
            })
            .catch(err => console.error(err));
    }

    setup() {
        this.slider = this.getElementsByClassName(`${this.orientation}-slider`)[0];
        this.handle = this.getElementsByClassName(`${this.orientation}-handle`)[0];

        this.attachEventListeners();
    }

    resize(scrollbleContainer) {
        setTimeout(() => {
            const sliderHeight = this.slider.getBoundingClientRect()[this.units.size];
            const handleHeightPercent = (sliderHeight / scrollbleContainer.scrollHeight) * 100;
            this.handleHeight = (sliderHeight / 90) * handleHeightPercent;
            this.handle.style[this.units.size] = this.handleHeight + 'px';
        }, 2);
    }

    attachEventListeners() {
        this.slider.addEventListener('click', (e) => this.onClick(e));
        this.slider.addEventListener('wheel', (e) => this.onWheel(e));
        this.handle.addEventListener('mousedown', (e) => this.onMouseDown(e));
        this.querySelector('.up').addEventListener('mousedown', () => this.onSlideWithArrorws(-1));
        this.querySelector('.down').addEventListener('mousedown', () => this.onSlideWithArrorws(1));

        //-------------
        document.addEventListener('mousemove', (e) => this.onMouseMove(e));
        document.addEventListener('mouseup', (e) => this.onMouseUp(e));
    }

    onMouseDown(e) {
        this.mousedown = true;
        const handleRect = this.handle.getBoundingClientRect();
        const sliderRect = this.slider.getBoundingClientRect();

        const sliderY = sliderRect[this.units.position];
        // get the handle position within the 
        const handleY = handleRect[this.units.position] - sliderY;
        const mouseY = e[this.units.mouseAxisCoords] - sliderY;

        this.delta = mouseY - handleY;
    }

    onMouseUp(e) {
        this.mousedown = false;
        this.dragging = false;

        if(this.slidingWithArrows) {
            this.slidingWithArrows = false;
            clearInterval(this.interval);
        }
    }

    onMouseMove(e) {
        if(!this.mousedown) return
        this.dragging = true;
        const sliderRect = this.slider.getBoundingClientRect();
        // get the mouse position within the slider coordinates
        const mouseY = e[this.units.mouseAxisCoords] - sliderRect[this.units.position];
        this.scrollTo(mouseY - this.delta);
    }

    onSlideWithArrorws(direction) {
        this.slidingWithArrows = true;
        this.interval = setInterval(() => this.scrollTo(this.getNextScrollPosition(direction, 10)), 10);
    }

    scrollTo(position){
        const handleRect = this.handle.getBoundingClientRect();
        const sliderRect = this.slider.getBoundingClientRect();

        const handleSizePercent = (handleRect[this.units.size] / sliderRect[this.units.size]) * 100;
        // new position in %
        let newPosPercents = (position / sliderRect[this.units.size]) * 100;

        if (newPosPercents < 0) newPosPercents = 0;
        if (newPosPercents + handleSizePercent > 100) newPosPercents = 100 - handleSizePercent;
        this.handlePosition = newPosPercents;

        //scroll the scrollable container
        this.dispatchEvent(new CustomEvent('slider-scroll', { detail: { handlePosition: newPosPercents } }));
    }

    onWheel(event) {
        let direction = (event.deltaY < 0) ? -1 : 1;
        this.scrollTo(this.getNextScrollPosition(direction, 10));
    }

    onClick(e) {
        if (e.target.classList.contains('handle')) return;
        let direction = -1;
        if (this.handle.getBoundingClientRect()[this.units.position] < e[this.units.mouseAxisCoords]) direction = 1;
        this.scrollTo(this.getNextScrollPosition(direction, 10));
    }

    getNextScrollPosition(direction, step = this.step) {
        const scrollTop = this.handlePosition * this.slider.getBoundingClientRect()[this.units.size] / 100;
        return scrollTop + (direction * step);
    }
}

components.defineCustomElement('gameface-slider', Slider);
export default Slider;