import components from 'coherent-gameface-components';
import template from './template.html';
import style from './style.css';
 
class Slider extends HTMLElement {
    set handlePosition (value) {
        this._handlePosition = value;
        this.handle.style.top = value + '%';
    }

    get handlePosition () {
        return this._handlePosition;
    }

    constructor() {
        super();

        this.step = 10;
        this._handlePosition = 0;
        this.template = template;
        components.importStyleTag('gameface-slider', style);
        this.url = '/components/slider/template.html';
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
        this.slider = this.getElementsByClassName('slider')[0];
        this.handle = this.getElementsByClassName('handle')[0];

        this.attachEventListeners();
    }

    resize(scrollbleContainer) {
        setTimeout(() => {
            const sliderHeight = this.slider.getBoundingClientRect().height;
            const handleHeightPercent = (sliderHeight / scrollbleContainer.scrollHeight) * 100;
            this.handleHeight = (sliderHeight / 90) * handleHeightPercent;
            this.handle.style.height = this.handleHeight + 'px';
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

        const sliderY = sliderRect.top;
        // get the handle position within the 
        const handleY = handleRect.top - sliderY;
        const mouseY = e.clientY - sliderY;

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
        const mouseY = e.clientY - sliderRect.top;
        this.scrollTo(mouseY - this.delta);
    }

    onSlideWithArrorws(direction) {
        this.slidingWithArrows = true;
        this.interval = setInterval(() => this.scrollTo(this.getNextScrollPosition(direction, 10)), 10);
    }

    scrollTo(position){
        const handleRect = this.handle.getBoundingClientRect();
        const sliderRect = this.slider.getBoundingClientRect();

        const handleSizePercent = (handleRect.height / sliderRect.height) * 100;
        // new position in %
        let newPosPercents = (position / sliderRect.height) * 100;

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
        if (this.handle.getBoundingClientRect().top < e.clientY) direction = 1;
        this.scrollTo(this.getNextScrollPosition(direction, 10));
    }

    getNextScrollPosition(direction, step = this.step) {
        const scrollTop = this.handlePosition * this.slider.getBoundingClientRect().height / 100;
        return scrollTop + (direction * step);
    }
}

components.defineCustomElement('gameface-slider', Slider);
export default Slider;