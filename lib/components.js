const components = function () {
    class GamefaceComponents {
        constructor() {
            this.definedElements = {};
            this.imported = this.imported || [];
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
                return result[1];
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
                this.importStyle(url + '/style.css');
                this.importScript(url + '/script.js');
            })
        }

        removeSlashes(path) {
            return path.replace(/[/|\\]/g, '');
        }

        /**
         * Uses an XMLHttpRequest to load an external file.
         * @param {string} url - the url of the file.
         * @returns {promise} - a promise that is resolved with the file's text content.
        */
       loadResource(component) {
        if (component.template) {
            const element = document.createElement('div');
            element.innerHTML = component.template;

            return new Promise((resolve) => {
                resolve([component.url, element.firstChild]);
            });
        }

        if (window.__optimize) {
            const id = this.removeSlashes(component.url);
            const element = document.getElementById(id).firstChild;
            // fallback to XHR
            if (!element) return this.requestResource(component.url);

            return new Promise((resolve) => {
                resolve([component.url, element]);
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
                        resolve([url, tempEl.firstChild]);
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
         * Appends a <link> element which imports a given css file.
         * @param {string} url - the source to a given css file.
        */
        importStyle(url) {
            // this style was already added
            if (document.querySelector(`[href="${url}"]`)) return;

            let style = document.createElement('link');
            style.setAttribute('rel', 'stylesheet');
            style.setAttribute('type', 'text/css');
            style.setAttribute('href', url);
            document.head.appendChild(style);
        }

        importStyleTag(componentName, css) {
            if (document.querySelector(`[data-name="${componentName}"]`)) return;

            let style = document.createElement('style');
            style.setAttribute('data-name', componentName)
            style.textContent = css;
            document.head.appendChild(style);
        }

        /**
         * Recursively finds the slot elements in a given element.
         * @param {HTMLElement} parent - the element which is searched for slots.
         * @param {object} result - a key:value object containing the slot elements
         * under their data-name as value:
         * { <my-slot-name>: HTMLElement }
         * @returns {Object} result
        */
        findSlots(parent, result = {}) {
            const children = parent.children;
            const length = children.length;

            for (let i = 0; i < length; ++i) {
                const child = children[i];
                if (child instanceof ComponentSlot) {
                    const name = child.dataset.name;
                    if (!result[name]) result[name] = [];
                    result[name].push(child);
                } else if (child.hasAttribute('slot')) {
                    const slot = child.getAttribute('slot');
                    if (!result[slot]) result[slot] = [];
                    result[slot].push(child);
                } else {
                    this.findSlots(child, result);
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

            const parent = fakeRoot.parentNode;
            for (let i = 0; i < source.length; ++i) {
                parent.removeChild(fakeRoot);
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
        * Renders an element's content into its template.
        * @param {HTMLElement} element - the element into which to render the content
        */
        render(element) {
            const templateRoot = document.createElement('div')
            templateRoot.appendChild(element.template);

            const templateSlots = this.findSlots(templateRoot);
            const userSlots = this.findSlots(element);

            // use for...of instead of for...in for better performance
            const userSlotsKeys = Object.keys(userSlots);

            for (let userSlot of userSlotsKeys) {
                this.replaceSlots(userSlots[userSlot], templateSlots[userSlot]);
            }

            this.transferContent(templateRoot, element);
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
    components.defineCustomElement('component-slot', ComponentSlot);

    return components;
};

export default components();