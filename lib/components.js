((factory) => {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory(global);
    } else {
        window.components = factory(window);
    }
})((global) => {
    class GamefaceComponents {
        constructor() {
            this.definedElements = {};
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

        /**
         * Uses an XMLHttpRequest to load an external file.
         * @param {string} url - the url of the file.
         * @returns {promise} - a promise that is resolved with the file's text content.
        */
        loadResource(url) {
            const request = new XMLHttpRequest();
            const promise = new Promise(function (resolve, reject) {
                request.onload = (response) => {
                    if (request.status == 200) {
                        const tempEl = document.createElement('div');
                        tempEl.innerHTML = request.responseText;
                        resolve([url, tempEl]);
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
                    result[child.dataset.name] = child;
                } else {
                    this.findSlots(child, result);
                }
            }

            return result;
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
    }

    class ComponentImport extends HTMLElement {
        constructor() {
            super();
        }

        connectedCallback() {
            let url = this.dataset.url;
            components.importComponent(url);
        }
    }

    class ComponentSlot extends HTMLElement {
        constructor() {
            super();
        }
    }

    customElements.define('component-import', ComponentImport);
    customElements.define('component-slot', ComponentSlot);

    return new GamefaceComponents();
});