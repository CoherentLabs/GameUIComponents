describe('Components Library', () => {
    it('Should be exposed to the global namespace', () => {
      expect(window.components).toBeDefined();
    });

    it('Should import script tag', () => {
        components.importScript('test-url');
        const scriptTag = document.querySelector('script[src="test-url"]');
        expect(scriptTag).toBeTruthy();
    });

    it('Should resolve a promise when a component is defined', async () => {
        components.defineCustomElement('test-element', class TestElement extends HTMLElement { });
        return components.whenDefined('test-element').then((component) => {
            expect(component.name).toEqual('TestElement');
        });
    });

    it('Should define custom element', () => {
        components.defineCustomElement('defined-element', class TestElement extends HTMLElement { });
        expect(components.definedElements['defined-element']).toBeDefined();
    });

    it('Should load html from a component with template', async () => {
        const component = {
            template: '<div>This is a dummy template.</div>'
        };

        const [loadedResource] = await components.loadResource(component);
        expect(loadedResource).toBeDefined();
        expect(loadedResource.textContent).toEqual('This is a dummy template.');
    });

    it('Should import link tag', () => {
        components.importStyle('test-style-url');
        const styleTag = document.head.querySelector('link[href="test-style-url"]')
        expect(styleTag).toBeTruthy();
    });

    xit('Should import style tag with css', () => {
        components.importStyleTag('test-component', '.testComponent: {background-color: blue}');
        const styleTag = document.head.querySelector('style[data-name="test-component"]');
        expect(styleTag).toBeTruthy();
        expect(styleTag.textContent).toEqual('.testComponent: {background-color: blue}');
    });

    it('Should find slots', () => {
        const template = `
            <div>
                Character name is:
                <component-slot data-name="name"></component-slot>
                Health status is:
                <component-slot data-name="health"></component-slot>
            </div>
        `;

        const element = document.createElement('div');
        element.innerHTML = template;
        const slots = components.findSlots(element);

        expect(slots['name']).toBeDefined();
        expect(slots['health']).toBeDefined();
    });

    it('Should transfer slot content from the element to the template', () => {
        const target = document.createElement('div');
        target.innerHTML = `
            <div>
                Character name is:
                <component-slot data-name="name"></component-slot>
                Health status is:
                <component-slot data-name="health"></component-slot>
            </div>
            `;
        const source = document.createElement('div');
        source.innerHTML = `
            <element-with-slots>
                <component-slot data-name="name"><div id="name">Test Component</div></component-slot>
                <component-slot data-name="health"><div id="health">10</div></component-slot>
            </element-with-slots>
            `;

        const templateSlots = {
            'name': [target.querySelector('[data-name="name"]')],
            'health': [target.querySelector('[data-name="health"]')],
        };
        const userSlots = {
            'name': [source.querySelector('[data-name="name"]')],
            'health': [source.querySelector('[data-name="health"]')],
        };

        // use for...of instead of for...in for better performance
        const userSlotsKeys = Object.keys(userSlots);

        for (let userSlot of userSlotsKeys) {
            components.replaceSlots(userSlots[userSlot], templateSlots[userSlot]);
        }

        const nameElement = target.querySelector('#name');
        const healthElement = target.querySelector('#health');
        // name
        expect(nameElement).toBeDefined();
        expect(nameElement.textContent).toEqual('Test Component');
        // health
        expect(healthElement).toBeDefined();
        expect(healthElement.textContent).toEqual('10');
    });

    it('Should transfer one element\'s content to another', () => {
        const target = document.createElement('div');
        target.innerHTML = `
            <div>
                <div id="name">Placeholder</div>
            </div>`;
        const source = document.createElement('div');
        source.innerHTML = `
            <div>
                <div id="name">Name</div>
            </div>`;

        components.transferContent(source, target);

        expect(target.querySelector('#name').textContent).toEqual('Name');
    });

    it('Should not render connected elements multiple time', () => {
        const parentTemplate = '<div><component-slot data-name="content"></component-slot></div>'
        const childTemplate = '<div>Hello, <component-slot data-name="name"></component-slot></div>'

        class ParentEl extends HTMLElement {
            constructor() {
                super();
                this.template = parentTemplate;
                this.timesRendered = 0;
            }
            connectedCallback() {
                components.loadResource(this, this.template)
                    .then(([loadedTemplate]) => {
                        this.template = loadedTemplate;
                        if (components.renderOnce(this)) {
                            this.timesRendered += 1;
                        };
                    })
                    .catch(err => console.error(err));
            }
        }

        class ChildEl extends HTMLElement {
            constructor() {
                super();
                this.template = childTemplate;
                this.timesRendered = 0;
            }
            connectedCallback() {
                components.loadResource(this, this.template)
                    .then(([loadedTemplate]) => {
                        this.template = loadedTemplate;
                        if (components.renderOnce(this)) {
                            this.timesRendered += 1;
                        };
                    })
                    .catch(err => console.error(err));
            }
        }

        components.defineCustomElement('child-el', ChildEl);
        components.defineCustomElement('parent-el', ParentEl);

        document.body.innerHTML = `
        <parent-el>
        <div slot="content">
            <child-el>
                <div slot="name">
                    Mars
                    <parent-el>
                        <div slot="content">
                            <child-el>
                                <div slot="name">Jupiter</div>
                            </child-el>
                        </div>
                    </parent-el>
                    <parent-el>
                        <div slot="content">
                            <child-el>
                                <div slot="name">Saturn</div>
                            </child-el>
                        </div>
                    </parent-el>
                    <parent-el>
                        <div slot="content">
                            <child-el>
                                <div slot="name">
                                    Mercury
                                    <parent-el>
                                        <div slot="content">
                                            <child-el>
                                                <div slot="name">Earth</div>
                                            </child-el>
                                        </div>
                                    </parent-el>
                                </div>
                            </child-el>
                        </div>
                    </parent-el>
                </div>
            </child-el>
        </div>
    </parent-el>`

       waitForStyles(() => {
           const parentElements = document.querySelectorAll('parent-el');
           for (let i = 0; i < parentElements.length; i++) {
               expect(parentElements[i].timesRendered).toEqual(1);
           }

           const childElements = document.querySelectorAll('child-el');
           for (let i = 0; i < childElements.length; i++) {
               expect(childElements[i].timesRendered).toEqual(1);
           }
       });
    });

    it('Should not render connected elements multiple time', () => {
        const parentTemplate = '<div><component-slot data-name="content"></component-slot></div>'
        const childTemplate = '<div>Hello, <component-slot data-name="name"></component-slot></div>'

        class ParentEl extends HTMLElement {
            constructor() {
                super();
                this.template = parentTemplate;
                this.timesRendered = 0;
            }
            connectedCallback() {
                components.loadResource(this, this.template)
                    .then((response) => {
                        this.template = response[1];
                        if (components.render(this)) {
                            this.timesRendered += 1;
                        };
                    })
                    .catch(err => console.error(err));
            }
        }

        class ChildEl extends HTMLElement {
            constructor() {
                super();
                this.template = childTemplate;
                this.timesRendered = 0;
            }
            connectedCallback() {
                components.loadResource(this, this.template)
                    .then((response) => {
                        this.template = response[1];
                        if (components.render(this)) {
                            this.timesRendered += 1;
                        };
                    })
                    .catch(err => console.error(err));
            }
        }

        components.defineCustomElement('child-el', ChildEl);
        components.defineCustomElement('parent-el', ParentEl);

        document.body.innerHTML = `
        <parent-el>
        <div slot="content">
            <child-el>
                <div slot="name">
                    Mars
                    <parent-el>
                        <div slot="content">
                            <child-el>
                                <div slot="name">Jupiter</div>
                            </child-el>
                        </div>
                    </parent-el>
                    <parent-el>
                        <div slot="content">
                            <child-el>
                                <div slot="name">Saturn</div>
                            </child-el>
                        </div>
                    </parent-el>
                    <parent-el>
                        <div slot="content">
                            <child-el>
                                <div slot="name">
                                    Mercury
                                    <parent-el>
                                        <div slot="content">
                                            <child-el>
                                                <div slot="name">Earth</div>
                                            </child-el>
                                        </div>
                                    </parent-el>
                                </div>
                            </child-el>
                        </div>
                    </parent-el>
                </div>
            </child-el>
        </div>
    </parent-el>`

       waitForStyles(() => {
           const parentElements = document.querySelectorAll('parent-el');
           for (let i = 0; i < parentElements.length; i++) {
               expect(parentElements[i].timesRendered).toEqual(1);
           }

           const childElements = document.querySelectorAll('child-el');
           for (let i = 0; i < childElements.length; i++) {
               expect(childElements[i].timesRendered).toEqual(1);
           }
       });
    });
  });