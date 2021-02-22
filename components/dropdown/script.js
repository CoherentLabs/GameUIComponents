import components from 'coherent-gameface-components';
import ScrollableContainer from 'gameface-scrollable-container';
import template from './template.html';
import style from './style.css';

const KEY_CODES = {
    'ARROW_UP': 38,
    'ARROW_DOWN': 40,
    'ARROW_RIGHT': 39,
    'ARROW_LEFT': 37,
    'END': 35,
    'HOME': 36,
    'ENTER': 13,
    'ESCAPE': 27,
    'TAB': 9,
};

class GamefaceDropdown extends HTMLElement {
    constructor() {
        super();

        this.selectedOption = null;
        this.isOpened = false;
        this._selected = 0;

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
        this.querySelector('.selected').textContent = option.textContent;

        this.dispatchEvent(new CustomEvent('change', {detail: {
            target: this._selected
        }}));
    }

    get selected() {
        return this.querySelectorAll('dropdown-option')[this._selected];
    }

    focusNext() {
        const options = this.querySelectorAll('dropdown-option');
        let newIdx = this._selected + 1;
        this.selected = options[newIdx % options.length];
    }

    focusPrevious() {
        const options = this.querySelectorAll('dropdown-option');
        let newIdx = this._selected - 1;
        this.selected = options[(newIdx + options.length) % options.length];
    }

    onKeydown(event) {
        //  TODO: getAllOptions method

        switch (event.keyCode) {
        case KEY_CODES.TAB:
        case KEY_CODES.ENTER:
        case KEY_CODES.ESCAPE:
            this.closeOptionsPanel();
            break;
        case KEY_CODES.HOME:
            // focus first
            this.focusElByIdx(0);
            break;
        case KEY_CODES.END:
            // focus last
            this.focusElByIdx(-1);
            break;
        case KEY_CODES.ARROW_UP:
        case KEY_CODES.ARROW_LEFT:
            this.focusPrevious();
            break;
        case KEY_CODES.ARROW_DOWN:
        case KEY_CODES.ARROW_RIGHT:
            this.focusNext();
            break;
        }
        this.scrollToSelectedElement();
    }

    connectedCallback() {
        components.loadResource(this)
            .then(([loadedTemplate]) => {
                this.template = loadedTemplate;
                components.renderOnce(this);

                this.setAttribute('tabindex', '1');
                this.attachEventListeners();
            })
            .catch(err => console.error(err));
    }

    focusElByIdx(idx) {
        const options = this.querySelectorAll('dropdown-option');

        if (idx === -1) return this.selected = options[options.length - 1];
        if (!options[idx]) return;
        this.selected = options[idx];
    }

    attachEventListeners() {
        const optionsPanel = this.querySelector('.options');
        const selectedElementPlaceholer = this.querySelector('.selected');
        const scrollableContainer = this.querySelector('scrollable-container');

        this.addEventListener('keydown', (e) => this.onKeydown(e));

        selectedElementPlaceholer.addEventListener('click', () => {
            if(this.isOpened) {
                scrollableContainer.classList.add('hidden');
                this.isOpened = false;
                return;
            };

            this.selected.style.backgroundColor = '#80c1ff';
            this.isOpened = true;
            this.scrollToSelectedElement();
            scrollableContainer.shouldShowScrollbar();
            scrollableContainer.classList.remove('hidden');
            this.focus();
        })

        const options = this.querySelectorAll('dropdown-option');
        for (let i = 0; i < options.length; i++) {
            options[i].addEventListener('click', this.onClick);
        }

        // this.addEventListener('focusout', () => {
        //     console.log('focusout');
        //     this.closeOptionsPanel();
        // });

        // this.addEventListener('focusin', () => {
        //     console.log('focusin');
        // });
    }

    /**
     * @param {MouseEvent} event
    */
    onClick(event) {
        const target = event.target;
        this.selected = target;

        this.closeOptionsPanel();
    }

    closeOptionsPanel() {
        const scrollableContainer = this.querySelector('scrollable-container');
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