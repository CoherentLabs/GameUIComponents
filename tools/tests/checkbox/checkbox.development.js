(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('coherent-gameface-components')) :
    typeof define === 'function' && define.amd ? define(['exports', 'coherent-gameface-components'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.checkbox = {}, global.components));
}(this, (function (exports, components) { 'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var components__default = /*#__PURE__*/_interopDefaultLegacy(components);

    var template = "<div class=\"checkbox-wrapper\">\r\n    <div class=\"checkbox-wrapper-inner\">\r\n        <component-slot data-name=\"checkbox-background\">\r\n            <div class=\"checkbox-background\"></div>\r\n        </component-slot>\r\n        <component-slot data-name=\"check-mark\">\r\n            <div class=\"check-mark\"></div>\r\n        </component-slot>\r\n    </div>\r\n    <component-slot data-name=\"label\"><span class=\"label\">Click me!</span></component-slot>\r\n</div>\r\n";

    var theme = ":root{--default-color-white:#fff;--default-color-blue:#25a5d6;--default-color-gray:#e6e6e6}button,input,textarea{border-color:var(--default-color-blue);background-color:var(--default-color-white)}button,input[type=button]{background-color:var(--default-color-gray)}.modal,tab-heading,tab-panel{border-color:var(--default-color-blue);background-color:var(--default-color-white)}tab-heading.active{background-color:var(--default-color-gray)}.header{border-bottom-color:var(--default-color-blue)}.close-x{background-color:var(--default-color-blue);color:var(--default-color-gray)}.close-x:hover{background-color:var(--default-color-gray);color:var(--default-color-blue)}.checkbox-wrapper-inner{background-color:var(--default-color-white)}.checkbox-background{border-color:var(--default-color-gray)}.check-mark{background-color:var(--default-color-blue)}";

    var style = ".checkbox-wrapper{position:relative;margin-top:10px;display:flex;flex-direction:row}.checkbox-background{top:0;width:30px;height:30px;border-width:5px;border-style:solid;box-sizing:border-box}.check-mark{position:absolute;top:5px;left:5px;width:20px;height:20px}.label{position:relative;padding-left:10px;line-height:30px}";

    class Checkbox extends HTMLElement {
        constructor() {
            super();

            this.template = template;

            components__default['default'].importStyleTag('gameface-checkbox-theme', theme);
            components__default['default'].importStyleTag('gameface-checkbox', style);

            this.state = {
                checked: true
            };

            this.url = '/components/checkbox/template.html';
        }

        connectedCallback() {
            components__default['default'].loadResource(this)
                .then((response) => {
                    this.template = response[1].cloneNode(true);
                    components__default['default'].render(this);
                    this.attachEventListeners();
                })
                .catch(err => console.error(err));
        }

        /**
         * Toggles the checkbox value. Called on click.
         * Updated the state and the visibility of the check mark.
        */
        toggleChecked() {
            this.state.checked = !this.state.checked;
            this.querySelector('[data-name="check-mark"]').style.display = this.state.checked ? '' : 'none';
        }

        /**
         * Adds event listeners to the checkbox.
         * Attached click handler.
        */
        attachEventListeners() {
            this.addEventListener('click', () => this.toggleChecked());
        }
    }

    components__default['default'].defineCustomElement('gameface-checkbox', Checkbox);

    exports.Checkbox = Checkbox;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
