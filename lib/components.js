/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

const newLinesRegExp = new RegExp('^\s+|\s+$', 'g');

const components = function () {
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
    };

    class GamefaceComponents {
        constructor() {
            this.definedElements = {};
            this.imported = this.imported || [];
            this.KEYCODES = KEYCODES;
        }

        /**
         * Create and add a script tag with given url.
         * @param {string} script
        */
        importScript(url) {
            let script = document.createElement('script');
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
            if(this.definedElements[name]) return;
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
            })
        }

        removeSlashes(path) {
            return path.replace(/[/|\\]/g, '');
        }

        /**
         * Remove new lines from the beginning of templates,
         * because template.firstChild.cloneNode will clone an empty
         * string and will return an empty template.
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
            return template.replace('<!--Copyright (c) Coherent Labs AD. All rights reserved. -->', '').trim();
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
                    template: component.template.cloneNode(true),
                    url: component.url
                });
            });
        }

        /**
         * Uses an XMLHttpRequest to load an external file.
         * @param {string} url - the url of the file.
         * @returns {promise} - a promise that is resolved with the file's text content.
        */
       loadResource(component) {
        if (component.template) {
            if(component.isRendered) return this.resolveWithTemplate(component);
            const element = document.createElement('div');
            const template = this.removeCopyrightNotice(component.template);
            element.innerHTML = this.removeNewLines(template);

            return new Promise((resolve) => {
                resolve({
                    template: element.firstChild.cloneNode(true),
                    url: component.url
                });
            });
        }

        if (window.__optimize) {
            const id = this.removeSlashes(component.url);
            const element = document.getElementById(id).firstChild;
            // fallback to XHR
            if (!element) return this.requestResource(component.url);

            return new Promise((resolve) => {
                resolve({template: element.cloneNode(true), url: component.url});
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
                        const tempEl = document.createElement('div');
                        tempEl.innerHTML = request.responseText;
                        resolve({template: tempEl.firstChild.cloneNode(true), url: url});
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

                if (child instanceof ComponentSlot) {
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
                } else if (childTagName === 'scrollable-container'
                     || (childTagName !== GF_COMPONENT_SLOT_TAG_NAME
                     && parentElName !== childTagName
                     && !this.definedElements[childTagName])) {
                    // if the child is another nested element don't look for slots in it
                    this.findSlots(child, parentElName, result);
                }
            }

            return result;
        }

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
            const templateRoot = document.createElement('div')
            templateRoot.appendChild(element.template);

            const parentElName = element.tagName.toLowerCase();

            const templateSlots = this.findSlots(templateRoot, parentElName);
            const userSlots = this.findSlots(element, parentElName);

            // use for...of instead of for...in for better performance
            const userSlotsKeys = Object.keys(userSlots);
            const templateSlotsKeys = Object.keys(templateSlots);

            // there's no point in looping over userSlots if there aren't
            // corresponding template slots
            if (templateSlotsKeys.length) {
                for (let userSlot of userSlotsKeys) {
                    if (!userSlots[userSlot] || !templateSlots[userSlot]) continue;
                    this.replaceSlots(userSlots[userSlot], templateSlots[userSlot]);
                }
            }

            this.transferContent(templateRoot, element);
        }

        /**
         * Delay the execution of a callback function by n amount of frames.
         * Used to retrieve the computed styles of elements.
         * @param {Function} callback - the function that will be executed.
         * @param {number} count - the amount of frames that the callback execution
         * should be delayed by.
        */
        waitForFrames(callback = () => { }, count = 3) {
            if (count === 0) return callback();
            count--;
            requestAnimationFrame(() => this.waitForFrames(callback, count));
        }
    }

    const components = new GamefaceComponents();

    class ComponentImport extends HTMLElement {
        constructor() {
            super();
        }

        connectedCallback() {
            const url = `/components/${this.dataset.url}/`;
            const componentName = `gameface-${this.dataset.url}`;

            if (components.imported.indexOf(componentName) === -1) {
                components.importComponent(url);
                components.imported.push(componentName);
            }
            this.appendChild(document.createElement(componentName));
        }
    }

    class ComponentSlot extends HTMLElement {
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
                child: child
            });
        }
    }

    components.defineCustomElement('component-import', ComponentImport);
    components.defineCustomElement(GF_COMPONENT_SLOT_TAG_NAME, ComponentSlot);

    return components;
};

export default components();
