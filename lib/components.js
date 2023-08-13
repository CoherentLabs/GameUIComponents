/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
/* eslint-disable no-useless-escape */
const newLinesRegExp = new RegExp('^\s+|\s+$', 'g');
const NATIVE_TEXT_FIELD_ELEMENTS = ['input', 'textarea'];

/**
 * Checks if the passed element is a native text field
 * @param {HTMLElement} element
 * @returns {boolean}
 */
function isNativeTextField(element) {
    return NATIVE_TEXT_FIELD_ELEMENTS.indexOf(element.tagName.toLowerCase()) > -1;
}

// eslint-disable-next-line max-lines-per-function, require-jsdoc
const Components = function () {
    /**
     * BaseComponent
     * The base class from which all other components inherit shared logic
     */
    class BaseComponent extends HTMLElement {
        /**
         * Called when the template of a component was loaded.
         * @param {object} data
         * @param {function} callback
         * @returns {undefined}
        */
        setupTemplate(data, callback) {
            if (!this.isConnected) {
                return console.log(`DEBUG: component ${this.tagName} was not initialized because it was disconnected from the DOM!`);
            }

            this.template = data.template;
            callback(data.template);
        }
    }

    /**
     * This is the base class that holds all functionality shared between custom components
     * and native elements
     */
    class Validator {
        /**
         * Check if element is child of a form
         * @param {HTMLElement} element
         * @returns {boolean}
         */
        static isFormElement(element) {
            element = element.parentElement;
            while (element) {
                if (element.tagName === 'GAMEFACE-FORM-CONTROL' || element.tagName === 'gameface-form-control') return true;
                element = element.parentElement;
            }

            return false;
        }

        /**
         * Check if element value is bigger than element maxlength
         * @returns {boolean}
         */
        static tooLong() {
            return false;
        }

        /**
         * Check if element value is less than element minlength
         * @returns {boolean}
         */
        static tooShort() {
            return false;
        }

        /**
         * Checks if the value of an element is bigger than its max attribute
         * @returns {boolean}
        */
        static rangeOverflow() {
            return false;
        }

        /**
         * Checks if the value of an element is smaller than its min attribute
         * @returns {boolean}
        */
        static rangeUnderflow() {
            return false;
        }

        /**
         * Check if element is required and its value is missing
         * @param {HTMLElement} element
         * @returns {boolean}
         */
        static valueMissing(element) {
            return element.hasAttribute('required') && !element.value;
        }

        /**
         * Check if element name is missing
         * @param {HTMLElement} element
         * @returns {boolean}
         */
        static nameMissing(element) {
            return !element.name && !element.getAttribute('name');
        }

        /**
         * Check if an element is required
         * @param {HTMLElement} element
         * @returns {boolean}
        */
        static isRequired(element) {
            return element.hasAttribute('required');
        }

        /**
         * Checks if there is a custom error for the element
         * @returns {boolean}
         */
        static customError() {
            return false;
        }

        /**
         * Checks if element is going to be serialized.
         * If an element doesn't have a name it will not be serialized.
         * Used to determine if an element should be validated.
         * @param {HTMLElement} element
         * @returns {boolean}
        */
        static willSerialize(element) {
            return this.nameMissing(element) ? false : true;
        }

        /* eslint-disable require-jsdoc */
        static isBadURL() {
            return false;
        }

        static isBadEmail() {
            return false;
        }
        /* eslint-enable require-jsdoc */
    }

    /**
     * The NativeElementValidator uses the methods from the Validator class
     * All native elements tha don't support methods like isFormElement, tooLong, tooShort
     * etc.. will be wrapped in this class in order to enable us to validate native and
     * custom elements using the same methods.
     * */
    class NativeElementValidator {
        /* eslint-disable require-jsdoc */

        constructor(element) {
            this.element = element;
        }

        isFormElement() {
            return Validator.isFormElement(this.element);
        }

        tooLong() {
            if (isNativeTextField(this.element)) return TextFieldValidator.tooLong(this.element);
            return Validator.tooLong();
        }

        tooShort() {
            if (isNativeTextField(this.element)) return TextFieldValidator.tooShort(this.element);
            return Validator.tooShort();
        }

        rangeOverflow() {
            if (isNativeTextField(this.element)) return TextFieldValidator.rangeOverflow(this.element);
            return Validator.rangeOverflow();
        }

        rangeUnderflow() {
            if (isNativeTextField(this.element)) return TextFieldValidator.rangeUnderflow(this.element);
            return Validator.rangeUnderflow();
        }

        valueMissing() {
            return Validator.valueMissing(this.element);
        }

        nameMissing() {
            return Validator.nameMissing(this.element);
        }

        customError() {
            return Validator.customError();
        }

        isRequired() {
            return Validator.isRequired(this.element);
        }

        willSerialize() {
            return Validator.willSerialize(this.element);
        }

        isBadEmail() {
            if (isNativeTextField(this.element)) return TextFieldValidator.isBadEmail(this.element);
            return false;
        }

        isBadURL() {
            if (isNativeTextField(this.element)) return TextFieldValidator.isBadURL(this.element);
            return false;
        }
        /* eslint-enable require-jsdoc */
    }

    /**
     * The CustomElementValidator is inherited by custom elements in order to gain the
     * validation function from the Validator class.
     * This class can not be used to wrap the native elements as it inherits the
     * HTMLElement which can not be instantiated using the new keyword.
    */
    class CustomElementValidator extends BaseComponent {
        /* eslint-disable require-jsdoc */

        isFormElement() {
            return Validator.isFormElement(this);
        }

        tooLong() {
            return Validator.tooLong(this);
        }

        tooShort() {
            return Validator.tooShort(this);
        }

        valueMissing() {
            return Validator.valueMissing(this);
        }

        nameMissing() {
            return Validator.nameMissing(this);
        }

        customError() {
            return Validator.customError();
        }

        isRequired() {
            return Validator.isRequired(this);
        }

        rangeOverflow() {
            return Validator.rangeOverflow(this);
        }

        rangeUnderflow() {
            return Validator.rangeUnderflow(this);
        }

        willSerialize() {
            return Validator.willSerialize(this);
        }

        isBadEmail() {
            return Validator.isBadEmail(this);
        }

        isBadURL() {
            return Validator.isBadURL(this);
        }
        /* eslint-enable require-jsdoc */
    }

    /**
     * Class that implements the commong validation methods for the text fields
     */
    class TextFieldValidator {
        /**
         * Most of the custom elements will not need this check however,
         * we call all validation methods in order to determine if an element is valid.
         * Each element that needs this check implements it itself.
         * @param {HTMLElement} element
         * @returns {boolean}
         */
        static tooLong(element) {
            const maxLength = element.getAttribute('maxlength');
            if (!maxLength) return false;
            return element.value.length > parseFloat(maxLength);
        }

        /**
        * Most of the custom elements will not need this check however,
        * we call all validation methods in order to determine if an element is valid.
        * Each element that needs this check implements it itself.
        * @param {HTMLElement} element
        * @returns {boolean}
        */
        static tooShort(element) {
            const minLength = element.getAttribute('minlength');
            if (!minLength) return false;
            return element.value.length < parseFloat(minLength);
        }

        /**
        * Most of the custom elements will not need this check however,
        * we call all validation methods in order to determine if an element is valid.
        * Each element that needs this check implements it itself.
        * @param {HTMLElement} element
        * @returns {boolean}
        */
        static rangeOverflow(element) {
            const max = element.getAttribute('max');
            if (!max) return false;
            return parseFloat(element.value) > parseFloat(max);
        }

        /**
         * Most of the custom elements will not need this check however,
         * we call all validation methods in order to determine if an element is valid.
         * Each element that needs this check implements it itself.
         * @param {HTMLElement} element
         * @returns {boolean}
         */
        static rangeUnderflow(element) {
            const min = element.getAttribute('min');
            if (!min) return false;
            return parseFloat(element.value) < parseFloat(min);
        }

        /**
         * Checks if the text field with type url has a valid url by its pattern
         * @param {HTMLElement} element
         * @returns {boolean}
         */
        static isBadURL(element) {
            if (element.getAttribute('type') !== 'url') return false;
            const pattern = element.pattern || element.getAttribute('pattern');
            if (!pattern) return false;
            if (!element.value.match(pattern)) return true;
            return false;
        }

        /**
         * Checks if the text field element with type email is valid
         * @param {HTMLElement} element
         * @returns {boolean}
         */
        static isBadEmail(element) {
            if (element.getAttribute('type') !== 'email') return false;
            if (!element.value.match('@')) return true;
            return false;
        }
    }

    const GF_COMPONENT_SLOT_TAG_NAME = 'component-slot';
    const KEYCODES = {
        DOWN: 40,
        LEFT: 37,
        RIGHT: 39,
        UP: 38,
        HOME: 36,
        END: 35,
        ENTER: 13,
        ESCAPE: 27,
        TAB: 9,
        SHIFT: 16,
        CTRL: 17,
        SPACE: 32,
        PAGE_UP: 33,
        PAGE_DOWN: 34,
        LETTER_A: 65,
    };

    /**
     * Class that defines the Gameface components
     */
    class GamefaceComponents {
        // eslint-disable-next-line require-jsdoc
        constructor() {
            this.definedElements = {};
            this.imported = this.imported || [];
            this.KEYCODES = KEYCODES;
            this.cachedComponents = {};

            this.CustomElementValidator = CustomElementValidator;
            this.NativeElementValidator = NativeElementValidator;
            this.TextFieldValidator = TextFieldValidator;
            this.Validator = Validator;
            this.BaseComponent = BaseComponent;
        }

        /**
         * Create and add a script tag with given url.
         * @param {string} url
        */
        importScript(url) {
            const script = document.createElement('script');
            script.setAttribute('src', url);
            document.body.appendChild(script);
        }

        /**
         * Loads an html by given url.
         * @param {string} url
         * @returns {promise} resolved with the html as text.
        */
        loadHTML(url) {
            return this.loadResource(url).then((result) => {
                return result.template;
            });
        }

        /**
         * Creates a promise which resolves when a custom element was defined.
         * Saves the promise for each defined component.
         * @param {string} name - the name of the custom element
         * @returns {promise} - the previously saved promise it any or a new one
        */
        whenDefined(name) {
            if (this.definedElements[name] !== undefined) {
                return this.definedElements[name].promise;
            }

            const defined = this.definedElements[name] = {};
            defined.promise = new Promise((resolve, reject) => {
                defined.resolve = resolve;
                defined.reject = reject;
            });
            return defined.promise;
        }

        /**
         * Defines a custom element.
         * @param {string} name - the name of the element.
         * @param {Object} element - the object which describes the element.
        */
        defineCustomElement(name, element) {
            // don't attempt to register custom element twice
            if (this.definedElements[name] || customElements.get(name)) return;
            this.whenDefined(name);
            customElements.define(name, element);
            this.definedElements[name].resolve(element);
        }

        /**
         * Imports a component by given url.
         * It will automatically try to import style.css and script.js if these
         * files' names were not explicitly specified.
         * @param {string} url - the url of the component
        */
        importComponent(url) {
            requestAnimationFrame(() => {
                this.importScript(url + '/script.js');
            });
        }

        /**
         * Removes back and forward slashes from string
         * @param {string} path
         * @returns {string}
         */
        removeSlashes(path) {
            return path.replace(/[/|\\]/g, '');
        }

        /**
         * Remove new lines from the beginning of templates,
         * because template.firstChild.cloneNode will clone an empty
         * string and will return an empty template.
         * @param {string} template
         * @returns {string}
        */
        removeNewLines(template) {
            return template.replace(newLinesRegExp, '').trim();
        }

        /**
         * Removes the copyright notice from the template
         * @param {string} template
         * @returns {string} the template without the copyright notice
        */
        removeCopyrightNotice(template) {
            return template.replace(`<!--Copyright (c) Coherent Labs AD. All rights reserved. Licensed under the MIT License. See License.txt in the project root for license information. -->`, '').trim();
        }

        /**
         * Used when the element has already been rendered.
         * Return the already rendered template instead of
         * loading and slotting its elements.
         *
         * @param {HTMLElement} component - the component that was rendered
         * @returns {Promise<HTMLElement>} - a promise that will resolve with the rendered template
        */
        resolveWithTemplate(component) {
            return new Promise((resolve) => {
                resolve({
                    template: component.template,
                    url: component.url,
                });
            });
        }

        /**
         * Uses an XMLHttpRequest to load an external file.
         * @param {string} component - the url of the file.
         * @returns {promise} - a promise that is resolved with the file's text content.
        */
        loadResource(component) {
            if (component.template && typeof component.template === 'string') {
                if (component.isRendered) return this.resolveWithTemplate(component);
                const template = this.removeCopyrightNotice(component.template);

                return new Promise((resolve) => {
                    resolve({
                        template: this.removeNewLines(template),
                        url: component.url,
                    });
                });
            }

            if (typeof component.template === 'object' && component.isRendered) {
                return this.resolveWithTemplate(component);
            }

            if (window.__optimize) {
                const id = this.removeSlashes(component.url);
                const element = document.getElementById(id).firstChild;
                // fallback to XHR
                if (!element) return this.requestResource(component.url);

                return new Promise((resolve) => {
                    resolve({ template: element.innerHTML, url: component.url });
                });
            }

            return this.requestResource(component.url);
        }


        /**
         * Execute an XMLHttpRequest to load a resource by url.
         * @param {string} url - the path to the resource
         * @returns {promise} - promise which resolves with the loaded resource
        */
        requestResource(url) {
            const request = new XMLHttpRequest();
            const promise = new Promise(function (resolve, reject) {
                request.onload = (response) => {
                    if (request.status == 200) {
                        resolve({ template: request.responseText, url: url });
                    } else {
                        reject(response);
                    }
                };
                request.onerror = reject;
            });
            request.open('GET', url);
            request.send();
            return promise;
        }

        /**
         * Recursively finds the slot elements in a given element.
         * @param {HTMLElement} parent - the element which is searched for slots.
         * @param {string} parentElName
         * @param {object} result - a key:value object containing the slot elements
         * under their data-name as value:
         * { <my-slot-name>: HTMLElement }
         * @returns {Object} result
        */
        findSlots(parent, parentElName, result = {}) {
            const children = parent.children;
            const length = children.length;

            for (let i = 0; i < length; ++i) {
                const child = children[i];
                const childTagName = child.tagName.toLowerCase();

                if (childTagName === 'component-slot') {
                    const name = child.dataset.name;
                    if (!result[name]) result[name] = [];
                    result[name].push(child);
                    this.findSlots(child, parentElName, result);
                } else if (child.hasAttribute('slot')) {
                    const slot = child.getAttribute('slot');
                    if (!result[slot]) result[slot] = [];
                    result[slot].push(child);
                    this.findSlots(child, parentElName, result);
                    // the scrollable container is the ONLY component that can hold
                    // slots of another elements; we allow this in order achieve
                    // better integration of the scrollbar inside other components
                    // The WebComponents and the standard slot elements don't support
                    // such behavior; an element handles only its own slots. The scrollable
                    // container is an exception from this rule.
                } else if (childTagName === 'gameface-scrollable-container' ||
                    (childTagName !== GF_COMPONENT_SLOT_TAG_NAME &&
                        parentElName !== childTagName &&
                        !this.definedElements[childTagName])) {
                    // if the child is another nested element don't look for slots in it
                    this.findSlots(child, parentElName, result);
                }
            }

            return result;
        }

        /**
         * Will replace the slot element
         * @param {HTMLElement[]} source
         * @param {HTMLElement} target
         */
        replaceSlots(source, target) {
            const fakeRoot = target[0];
            if (source.length && fakeRoot.childNodes.length) {
                while (fakeRoot.firstChild) {
                    fakeRoot.removeChild(fakeRoot.lastChild);
                }
            }
            // remove the slot so that it can be replaced
            const parent = fakeRoot.parentNode;
            parent.removeChild(fakeRoot);

            for (let i = 0; i < source.length; ++i) {
                parent.appendChild(source[i]);
            }
        }

        /**
         * Transfers the slottable elements into their slots.
         * @param {HTMLElement} source - the element containing the slottable elements.
         * @param {HTMLElement} target - the element containing the slots elements.
        */
        transferContent(source, target) {
            while (target.childNodes.length > 0) {
                const nodes = target.childNodes;
                target.removeChild(nodes[nodes.length - 1]);
            }
            while (source.childNodes.length > 0) {
                const nodes = source.childNodes;
                const node = nodes[0];
                source.removeChild(node);
                target.appendChild(node);
            }
        }

        /**
         * Renderes an element only if it wasn't rendered before that
         * @param {HTMLElement} element
         * @returns {boolean} - true if it was rendered, false if not
        */
        renderOnce(element) {
            if (element.isRendered) return false;

            this.render(element);
            element.isRendered = true;
            return true;
        }

        /**
        * Renders an element's content into its template.
        * @param {HTMLElement} element - the element into which to render the content
        */
        render(element) {
            const templateRoot = document.createElement('div');
            templateRoot.innerHTML = element.template;

            const parentElName = element.tagName.toLowerCase();

            const templateSlots = this.findSlots(templateRoot, parentElName);
            const userSlots = this.findSlots(element, parentElName);

            // use for...of instead of for...in for better performance
            const userSlotsKeys = Object.keys(userSlots);
            const templateSlotsKeys = Object.keys(templateSlots);

            // there's no point in looping over userSlots if there aren't
            // corresponding template slots
            if (templateSlotsKeys.length) {
                for (const userSlot of userSlotsKeys) {
                    if (!userSlots[userSlot] || !templateSlots[userSlot]) continue;
                    this.replaceSlots(userSlots[userSlot], templateSlots[userSlot]);
                }
            }

            this.transferContent(templateRoot, element);
        }

        /**
         * Used to render.
         * @param {HTMLElement} element - the element which will be rendered
         * @param {string} targetContainerSelector - the selector of the parent element
         * @param {Array<HTMLElement>} children - the child elements that need to go into the parent
         */
        transferChildren(element, targetContainerSelector, children) {
            const templateRoot = document.createElement('div');
            templateRoot.innerHTML = element.template;
            const container = templateRoot.querySelector(targetContainerSelector);
            children.forEach(child => container.appendChild(child));

            this.transferContent(templateRoot, element);
        }

        /**
         * Delay the execution of a callback function by n amount of frames.
         * Used to retrieve the computed styles of elements.
         * @param {Function} callback - the function that will be executed.
         * @param {number} count - the amount of frames that the callback execution
         * should be delayed by.
         * @returns {any}
        */
        waitForFrames(callback = () => { }, count = 3) {
            if (count === 0) return callback();
            count--;
            requestAnimationFrame(() => this.waitForFrames(callback, count));
        }

        /**
         * Checks if the current user agent is Cohtml
         * @returns {boolean}
        */
        isBrowserGameface() {
            return navigator.userAgent.match('Cohtml');
        }
    }

    const components = new GamefaceComponents();

    /**
     * Class that will handle gameface components slot element
     */
    class ComponentSlot extends HTMLElement {
        /* eslint-disable require-jsdoc */

        constructor() {
            super();

            this.originalAppendChild = this.appendChild;
            this.originalInsertBefore = this.insertBefore;
            this.originalReplaceChild = this.replaceChild;
            this.originalRemoveChild = this.removeChild;

            this.appendChild = (node) => {
                const child = this.originalAppendChild(node);
                this.disptachSlotChange(child);

                return child;
            };

            this.insertBefore = (newNode, referenceNode) => {
                const child = this.originalInsertBefore(newNode, referenceNode);
                this.disptachSlotChange(child);

                return child;
            };

            this.replaceChild = (newChild, oldChild) => {
                const replacedNode = this.originalReplaceChild(newChild, oldChild);
                this.disptachSlotChange(replacedNode);

                return replacedNode;
            };

            this.removeChild = (child) => {
                const removedNode = this.originalRemoveChild(child);
                this.disptachSlotChange(removedNode);

                return removedNode;
            };
        }

        disptachSlotChange(child) {
            this.dispatchEvent(new CustomEvent('slotchange'), {
                target: this,
                child: child,
            });
        }

        /* eslint-enable require-jsdoc */
    }

    components.defineCustomElement(GF_COMPONENT_SLOT_TAG_NAME, ComponentSlot);

    return components;
};

export { Components };
