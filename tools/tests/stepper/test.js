const loadStepper = (options, value = '') => {
    const optionElements = options.map((option) => {
        return `<gameface-stepper-item>${option.name}</gameface-stepper-item>`;
    });

    const wrapper = document.createElement('div');
    wrapper.innerHTML = `<gameface-stepper${value ? ` value="${value}"` : ''}>${optionElements.join('\n')}</gameface-stepper>`;

    document.body.appendChild(wrapper.firstChild);

    return new Promise((resolve) => {
        waitForStyles(resolve);
    });
};

const STEPPER_OPTIONS = [{ name: 'Option 1' }, { name: 'Option 2' }, { name: 'Option 3' }];

const STEPPER_OPTIONS_SELECTED = [{ name: 'Option 1' }, { name: 'Option 2', selected: true }, { name: 'Option 3' }];

// eslint-disable-next-line max-lines-per-function
describe('Stepper Component', () => {
    afterEach(() => cleanTestPage('gameface-stepper'));

    it('Should be rendered', async () => {
        await loadStepper(STEPPER_OPTIONS);
        const stepper = document.querySelector('gameface-stepper');
        assert.exists(stepper, 'Stepper component is added to DOM');
    });

    it('Should have correct options', async () => {
        await loadStepper(STEPPER_OPTIONS);
        const stepper = document.querySelector('gameface-stepper');
        const options = stepper.items;
        assert.equal(options.length, 3);
        for (let i = 0; i < options.length; i++) {
            assert.equal(options[i], STEPPER_OPTIONS[i].name);
        }
    });

    it('Should have correct selected option', async () => {
        const selected = STEPPER_OPTIONS_SELECTED.find(option => option.selected);
        await loadStepper(STEPPER_OPTIONS_SELECTED, selected.name);
        const stepper = document.querySelector('gameface-stepper');
        assert.equal(stepper.value, selected.name);
    });

    it('Should have correct selected index', async () => {
        const selectedIndex = STEPPER_OPTIONS_SELECTED.findIndex(option => option.selected);
        await loadStepper(STEPPER_OPTIONS_SELECTED, STEPPER_OPTIONS_SELECTED[selectedIndex].name);
        const stepper = document.querySelector('gameface-stepper');
        assert.equal(stepper.selectedIndex, selectedIndex);
    });

    it('Should render correct value', async () => {
        const selected = STEPPER_OPTIONS_SELECTED.find(option => option.selected);
        await loadStepper(STEPPER_OPTIONS_SELECTED, selected.name);
        const stepperValue = document.querySelector('.guic-stepper-value');
        assert.equal(stepperValue.textContent, selected.name);
    });

    it('Should select next option', async () => {
        await loadStepper(STEPPER_OPTIONS);
        const stepper = document.querySelector('gameface-stepper');
        stepper.next();
        assert.equal(stepper.value, STEPPER_OPTIONS[1].name);
    });

    it('Should select previous option', async () => {
        await loadStepper(STEPPER_OPTIONS_SELECTED);
        const stepper = document.querySelector('gameface-stepper');
        stepper.prev();
        assert.equal(stepper.value, STEPPER_OPTIONS[0].name);
    });

    it('Should not select previous option if first option is selected', async () => {
        await loadStepper(STEPPER_OPTIONS);
        const stepper = document.querySelector('gameface-stepper');
        stepper.prev();
        assert.equal(stepper.value, STEPPER_OPTIONS[0].name);
    });

    it('Should not select next option if last option is selected', async () => {
        await loadStepper(STEPPER_OPTIONS_SELECTED, STEPPER_OPTIONS_SELECTED[1].name);
        const stepper = document.querySelector('gameface-stepper');
        stepper.next();
        assert.equal(stepper.value, STEPPER_OPTIONS_SELECTED[2].name);
    });

    it('Should select next option on click', async () => {
        await loadStepper(STEPPER_OPTIONS);
        const stepper = document.querySelector('gameface-stepper');
        stepper.rightButton.dispatchEvent(new Event('click'));
        assert.equal(stepper.value, STEPPER_OPTIONS[1].name);
    });

    it('Should select previous option on click', async () => {
        await loadStepper(STEPPER_OPTIONS_SELECTED, STEPPER_OPTIONS_SELECTED[1].name);
        const stepper = document.querySelector('gameface-stepper');
        stepper.leftButton.dispatchEvent(new Event('click'));
        assert.equal(stepper.value, STEPPER_OPTIONS_SELECTED[0].name);
    });

    it('Should not change items array with when its value is invalid', async () => {
        await loadStepper(STEPPER_OPTIONS, STEPPER_OPTIONS[1].name);
        const stepper = document.querySelector('gameface-stepper');
        stepper.items = undefined;
        assert.equal(stepper.value, STEPPER_OPTIONS[1].name);
        assert.equal(stepper.selectedIndex, 1);
    });

    it('Should change items array where current value is invalid', async () => {
        await loadStepper(STEPPER_OPTIONS);
        const stepper = document.querySelector('gameface-stepper');
        stepper.items = ['Option 0', 'Option 2', 'Option 3'];
        assert.equal(stepper.value, 'Option 0');
        assert.equal(stepper.selectedIndex, 0);
    });

    it('Should change items array where current value is valid', async () => {
        await loadStepper(STEPPER_OPTIONS);
        const stepper = document.querySelector('gameface-stepper');
        stepper.items = ['Option 0', ...stepper.items];
        assert.equal(stepper.value, STEPPER_OPTIONS[0].name);
        assert.equal(stepper.selectedIndex, 1);
    });

    it('Should not change value of the stepper dynamically when it is invalid', async () => {
        await loadStepper(STEPPER_OPTIONS, STEPPER_OPTIONS[1].name);
        const stepper = document.querySelector('gameface-stepper');
        stepper.value = 'invalid';
        assert.equal(stepper.value, STEPPER_OPTIONS[1].name);
        assert.equal(stepper.selectedIndex, 1);
    });

    it('Should change value of the stepper dynamically', async () => {
        await loadStepper(STEPPER_OPTIONS, STEPPER_OPTIONS[1].name);
        const stepper = document.querySelector('gameface-stepper');
        stepper.value = STEPPER_OPTIONS[0].name;
        assert.equal(stepper.value, STEPPER_OPTIONS[0].name);
        assert.equal(stepper.selectedIndex, 0);
    });
});

if (engine?.isAttached) {
    // eslint-disable-next-line max-lines-per-function
    describe('Stepper Component (Gameface Data Binding Test)', () => {
        /**
         * @param {string} template
         * @returns {Promise<void>}
         */
        function setupStepper(template) {
            const el = document.createElement('div');
            el.innerHTML = template;

            cleanTestPage('gameface-stepper');

            document.body.appendChild(el);

            return new Promise((resolve) => {
                waitForStyles(resolve);
            });
        }

        afterAll(() => cleanTestPage('gameface-stepper'));

        it(`Should have populated 2 elements`, async () => {
            const templateName = 'model';

            const template = `
            <div data-bind-for="stepper:{{${templateName}.array}}">
                <gameface-stepper></gameface-stepper>
            </div>
            `;
            await setupDataBindingTest(templateName, template, setupStepper);
            const expectedCount = 2;
            const steppers = document.querySelectorAll('gameface-stepper');
            const stepperCount = steppers.length;
            assert.equal(stepperCount, expectedCount, `Steppers found: ${stepperCount}, should have been ${expectedCount}.`);
        });

        // eslint-disable-next-line max-lines-per-function
        it(`Should test stepper with data-binding attributes`, async () => {
            const templateName = 'model';

            const template = `
                <gameface-stepper data-bind-custom-attribute-stepper="{{model}}"></gameface-stepper>
            `;
            // eslint-disable-next-line require-jsdoc
            class CustomAttribute {
                // eslint-disable-next-line require-jsdoc
                init(element, model) {
                    Object.keys(model).forEach(attrName => element[attrName] = model[attrName]);
                }
                // eslint-disable-next-line require-jsdoc
                update(element, model) {
                    Object.keys(model).forEach(attrName => element[attrName] = model[attrName]);
                }
            }

            engine.registerBindingAttribute('custom-attribute-stepper', CustomAttribute);
            const model = {
                value: 'Option 2',
                items: ['Option 1', 'Option 2', 'Option 3'],
            };
            await setupDataBindingTest(templateName, template, setupStepper, model);
            const stepper = document.querySelector('gameface-stepper');
            Object.keys(window[templateName]).forEach(attrName => assert.equal(stepper[attrName], window[templateName][attrName], `The stepper has a different ${attrName}. Received ${stepper[attrName]}. Expected ${window[templateName][attrName]}`));
            window[templateName].items.push('Option 4');
            window[templateName].value = 'Option 4';
            engine.updateWholeModel(window[templateName]);
            engine.synchronizeModels();
            Object.keys(window[templateName]).forEach(attrName => assert.equal(stepper[attrName], window[templateName][attrName], `The stepper has a different ${attrName}. Received ${stepper[attrName]}. Expected ${window[templateName][attrName]}`));
        });
    });
}

