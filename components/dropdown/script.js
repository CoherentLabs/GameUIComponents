import components from 'coherent-gameface-components';
import ScrollableContainer from 'gameface-scrollable-container';
import template from './template.html';
import style from './style.css';
 
class GamefaceDropdown extends HTMLElement {
    constructor() {
        super();

        this.selectedOption = null;
        this.isOpened = false;

        this.template = template;
        components.importStyleTag('gameface-dropdown', style);
        this.url = '/components/gameface-dropdown/template.html';

        this.onClick = this.onClick.bind(this);
    }

    set selected(option) {
        // TODO: fix
        if (this._selected) {
            this.querySelectorAll('dropdown-option')[this._selected].style.backgroundColor = '#fff'
        }
        option.style.backgroundColor = '#80c1ff';
        this._selected = Array.from(this.querySelectorAll('dropdown-option')).indexOf(option);
        this.querySelector('#selected').textContent = option.textContent;
    }

    get selected() {
        return this.querySelectorAll('dropdown-option')[this._selected];
    }

    connectedCallback() {
        components.loadResource(this)
            .then(([loadedTemplate]) => {
                this.template = loadedTemplate;
                components.renderOnce(this);

                this.attachEventListeners();
            })
            .catch(err => console.error(err));
    }

    attachEventListeners() {
        const selectedElementPlaceholer = this.querySelector('#selected');
        const scrollableContainer = document.querySelector('scrollable-container');

        selectedElementPlaceholer.addEventListener('click', () => {
            if(this.isOpened) {
                scrollableContainer.classList.add('hidden');
                this.isOpened = false;
                return;
            };

           
            this.isOpened = true;
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    scrollableContainer.showScrollBar(scrollableContainer.scrollbar);
                    const scrollableContent = scrollableContainer.querySelector('[name="scrollable-content"]')
    
                    scrollableContainer.scrollbar.resize(scrollableContent);
                    this.scrollToSelectedElement();

                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            scrollableContainer.classList.remove('hidden');
                        });
                    });
                });
            })
        })

        const options = this.querySelectorAll('dropdown-option');
        for (let i = 0; i < options.length; i++) {
            options[i].addEventListener('click', this.onClick);
        }
    }

    onClick(event) {
        // debugger
        const target = event.target;
        this.selected = target;

        const scrollableContainer = document.querySelector('scrollable-container');
        this.isOpened = false;
        scrollableContainer.classList.add('hidden');
    }

    setSelected(element) {
        // TODO: if scrollbar
        this.selected = element;
        this.scrollToSelectedElement();
    }

    // TODO: check if it can be improved
    scrollToSelectedElement() {
        const scrollbleContainer = this.querySelector('.scrollable-container');
        const option = this.querySelector('dropdown-option');
        const optionSize = option.getBoundingClientRect().height;

        let scrollInPX = this._selected * optionSize;
        scrollbleContainer.scrollTop = scrollInPX;
        scrollbleContainer.dispatchEvent(new CustomEvent('scroll'));
    }
}

class DropdownOption extends HTMLElement{}

components.defineCustomElement('dropdown-option', DropdownOption);
components.defineCustomElement('gameface-dropdown', GamefaceDropdown);

export default GamefaceDropdown;