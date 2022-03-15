/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// eslint-disable-next-line max-lines-per-function
describe('Components Library', () => {
    afterAll(() => cleanTestPage('.components-library-test'));

    it('Should be exposed to the global namespace', () => {
        assert(window.components !== null, 'The components global was not defined.');
    });

    it('Should import script tag', () => {
        components.importScript('test-url');
        const scriptTag = document.querySelector('script[src="test-url"]');
        assert(scriptTag !== null, 'The script tag was not imported.');
    });

    it('Should resolve a promise when a component is defined', async () => {
        components.defineCustomElement('test-element', class TestElement extends HTMLElement { });
        return components.whenDefined('test-element').then((component) => {
            assert(component.name === 'TestElement',
                `The whenDefined promise was not resolved with the correct name; expected TestElement, received ${component.name}.`);
        });
    });

    it('Should define custom element', () => {
        components.defineCustomElement('defined-element', class TestElement extends HTMLElement { });
        assert(components.definedElements['defined-element'] !== undefined, 'defined-element was not defined.');
    });

    it('Should load html from a component with template', async () => {
        const component = {
            template: '<div>This is a dummy template.</div>',
        };

        const loadedResource = await components.loadResource(component);
        assert(loadedResource !== undefined, 'Resource was not loaded.');
        assert(loadedResource.template.textContent === 'This is a dummy template.', 'The template of the loaded resource is not correct.');
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

        assert(slots['name'] !== undefined, 'Slot "name" was not found.');
        assert(slots['health'] !== undefined, 'Slot "health" was not found.');
    });

    // eslint-disable-next-line max-lines-per-function
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
            name: [target.querySelector('[data-name="name"]')],
            health: [target.querySelector('[data-name="health"]')],
        };
        const userSlots = {
            name: [source.querySelector('[data-name="name"]')],
            health: [source.querySelector('[data-name="health"]')],
        };

        // use for...of instead of for...in for better performance
        const userSlotsKeys = Object.keys(userSlots);

        for (const userSlot of userSlotsKeys) {
            components.replaceSlots(userSlots[userSlot], templateSlots[userSlot]);
        }

        const nameElement = target.querySelector('#name');
        const healthElement = target.querySelector('#health');
        // name
        assert(nameElement !== undefined, 'Element #name was not found in the current component.');
        assert(nameElement.textContent === 'Test Component', 'The content of the #name element is not correct.');
        // health
        assert(healthElement !== undefined, 'Element #health was not found in the current component.');
        assert(healthElement.textContent === '10', 'The content of the  #health element is not correct.');
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

        assert(target.querySelector('#name').textContent === 'Name', 'The content of the slotted element is not correct.');
    });

    // eslint-disable-next-line max-lines-per-function
    it('Should not render connected elements multiple time', async () => {
        const parentTemplate = '<div><component-slot data-name="content"></component-slot></div>';
        const childTemplate = '<div>Hello, <component-slot data-name="name"></component-slot></div>';
        /* eslint-disable require-jsdoc */
        class ParentEl extends HTMLElement {
            constructor() {
                super();
                this.template = parentTemplate;
                this.timesRendered = 0;
            }
            connectedCallback() {
                components.loadResource(this, this.template)
                    .then((result) => {
                        this.template = result.template;
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
                    .then((result) => {
                        this.template = result.template;
                        if (components.renderOnce(this)) {
                            this.timesRendered += 1;
                        };
                    })
                    .catch(err => console.error(err));
            }
        }
        /* eslint-enable require-jsdoc */

        components.defineCustomElement('child-el', ChildEl);
        components.defineCustomElement('parent-el', ParentEl);

        const testWrapper = document.createElement('div');
        testWrapper.className = 'components-library-test';

        testWrapper.innerHTML = `
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
        </parent-el>`;

        document.body.appendChild(testWrapper);
        return createAsyncSpec(() => {
            const parentElements = document.querySelectorAll('parent-el');
            for (let i = 0; i < parentElements.length; i++) {
                assert(parentElements[i].timesRendered === 1, `Parent element ${parentElements[i]} was rendered more than once.`);
            }
            const childElements = document.querySelectorAll('child-el');
            for (let i = 0; i < childElements.length; i++) {
                assert(childElements[i].timesRendered === 1, `Child element ${childElements[i]} was rendered more than once.`);
            }
        });
    });
});
