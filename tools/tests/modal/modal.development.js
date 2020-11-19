(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('coherent-gameface-components')) :
    typeof define === 'function' && define.amd ? define(['exports', 'coherent-gameface-components'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.modal = {}, global.components));
}(this, (function (exports, components) { 'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var components__default = /*#__PURE__*/_interopDefaultLegacy(components);

    var template = "<div class=\"modal-wrapper\">\r\n    <div class=\"backdrop\"></div>\r\n    <div class=\"modal\">\r\n        <div class=\"close close-x\">x</div>\r\n        <div class=\"header\">\r\n            <component-slot data-name=\"header\">Put your title here.</component-slot>\r\n        </div>\r\n        <div class=\"body\">\r\n            <component-slot data-name=\"body\">Put the content here.</component-slot>\r\n        </div>\r\n        <div class=\"footer\">\r\n            <component-slot data-name=\"footer\">Put your actions here.</component-slot>\r\n        </div>\r\n    </div>\r\n</div>";

    var theme = ":root{--default-color-white:#fff;--default-color-blue:#25a5d6;--default-color-gray:#e6e6e6}button,input,textarea{border-color:var(--default-color-blue);background-color:var(--default-color-white)}button,input[type=button]{background-color:var(--default-color-gray)}.modal,tab-heading,tab-panel{border-color:var(--default-color-blue);background-color:var(--default-color-white)}tab-heading.active{background-color:var(--default-color-gray)}.header{border-bottom-color:var(--default-color-blue)}.close-x{background-color:var(--default-color-blue);color:var(--default-color-gray)}.close-x:hover{background-color:var(--default-color-gray);color:var(--default-color-blue)}.checkbox-wrapper-inner{background-color:var(--default-color-white)}.checkbox-background{border-color:var(--default-color-gray)}.check-mark{background-color:var(--default-color-blue)}";

    var style = ".backdrop{width:100vw;height:100vh;background-color:#000;opacity:.4;user-select:none;z-index:1;left:0}.backdrop,.close-x{position:absolute;top:0}.close-x{width:30px;height:30px;right:0;cursor:pointer;text-align:center;z-index:2;line-height:30px}.modal{width:500px;height:500px;z-index:2;position:absolute;border-width:3px;border-style:solid;box-sizing:border-box}.modal-wrapper{position:absolute;top:0;left:0;justify-content:center;display:flex;align-items:center;width:100vw;height:100vh}.header{position:relative;top:0;height:50px;margin-bottom:20px;border-bottom-width:2px;border-bottom-style:solid;line-height:50px;padding:0 10px;box-sizing:border-box}.body,.footer{position:absolute;justify-content:center;display:flex;align-items:center}.body{position:relative;height:100px}.footer{height:100px;width:500px;position:absolute;bottom:0}";

    class Modal extends HTMLElement {
        constructor() {
            super();

            this.template = template;

            components__default['default'].importStyleTag('gameface-checkbox-theme', theme);
            components__default['default'].importStyleTag('gameface-modal', style);

            this.state = {
                display: 'none'
            };

            this.closeBound = e => this.close(e);
            this.url = '/components/modal/template.html';
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

        attachEventListeners() {
            const closeButtons = this.querySelectorAll('.close');
            for (let i = 0; i < closeButtons.length; i++) {
                closeButtons[i].addEventListener('click', this.closeBound);
            }
        }

        close(e) {
            this.style.display = 'none';
        }
    }

    components__default['default'].defineCustomElement('gameface-modal', Modal);

    exports.Modal = Modal;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
