const loadStepper = (options) => {
    const optionElements = options.map((option) => {
        return `<gameface-stepper-item ${option.selected ? 'selected' : ''}>${option.name}</gameface-stepper-item>`;
    });

    const wrapper = document.createElement('div');
    wrapper.innerHTML = `<gameface-stepper>${optionElements.join('\n')}</gameface-stepper>`;

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
        await loadStepper(STEPPER_OPTIONS_SELECTED);
        const stepper = document.querySelector('gameface-stepper');
        assert.equal(stepper.value, selected.name);
    });

    it('Should have correct selected index', async () => {
        const selected = STEPPER_OPTIONS_SELECTED.findIndex(option => option.selected);
        await loadStepper(STEPPER_OPTIONS_SELECTED);
        const stepper = document.querySelector('gameface-stepper');
        assert.equal(stepper.selectedIndex, selected);
    });

    it('Should render correct value', async () => {
        const selected = STEPPER_OPTIONS_SELECTED.find(option => option.selected);
        await loadStepper(STEPPER_OPTIONS_SELECTED);
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
        await loadStepper(STEPPER_OPTIONS_SELECTED);
        const stepper = document.querySelector('gameface-stepper');
        stepper.next();
        assert.equal(stepper.value, STEPPER_OPTIONS[2].name);
    });

    it('Should select next option on click', async () => {
        await loadStepper(STEPPER_OPTIONS);
        const stepper = document.querySelector('gameface-stepper');
        stepper.rightButton.dispatchEvent(new Event('click'));
        assert.equal(stepper.value, STEPPER_OPTIONS[1].name);
    });

    it('Should select previous option on click', async () => {
        await loadStepper(STEPPER_OPTIONS_SELECTED);
        const stepper = document.querySelector('gameface-stepper');
        stepper.leftButton.dispatchEvent(new Event('click'));
        assert.equal(stepper.value, STEPPER_OPTIONS[0].name);
    });
});
