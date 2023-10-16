const loadSwitch = ({ type, disabled, checked, checkText, uncheckText }) => {
    const attributes = [type ? `type=${type}` : '', disabled ? 'disabled' : '', checked ? 'checked' : ''];

    const labels = `
        <component-slot data-name="switch-unchecked">${uncheckText || ''}</component-slot>
        <component-slot data-name="switch-checked">${checkText || ''}</component-slot>
    `;

    const wrapper = document.createElement('div');
    wrapper.innerHTML = `<gameface-switch ${attributes.join(' ')}>${labels}</gameface-switch>`;

    document.body.appendChild(wrapper.firstChild);

    return new Promise((resolve) => {
        waitForStyles(resolve);
    });
};

// eslint-disable-next-line max-lines-per-function
describe('Switch Component', () => {
    afterEach(() => cleanTestPage('gameface-switch'));

    it('Should be rendered', async () => {
        await loadSwitch({});
        const switchToggle = document.querySelector('gameface-switch');
        assert.exists(switchToggle, 'Switch component is not added to DOM');
    });

    it('Should be checked', async () => {
        await loadSwitch({ checked: true });
        const switchToggle = document.querySelector('gameface-switch');
        const checkedSwitch = switchToggle.querySelector('.guic-switch-toggle-checked');
        const checkedHandle = switchToggle.querySelector('.guic-switch-toggle-handle-checked');
        assert.exists(checkedSwitch, 'Switch is not checked');
        assert.exists(checkedHandle, 'Switch handle is not checked');
    });

    it('Should check the switch', async () => {
        await loadSwitch({});
        const switchToggle = document.querySelector('gameface-switch');
        switchToggle.checked = true;
        const checkedSwitch = switchToggle.querySelector('.guic-switch-toggle-checked');
        const checkedHandle = switchToggle.querySelector('.guic-switch-toggle-handle-checked');
        assert.exists(checkedSwitch, 'Switch is not checked');
        assert.exists(checkedHandle, 'Switch handle is not checked');
    });

    it('Should check the switch via attribute', async () => {
        await loadSwitch({});
        const switchToggle = document.querySelector('gameface-switch');
        switchToggle.setAttribute('checked', '');
        const checkedSwitch = switchToggle.querySelector('.guic-switch-toggle-checked');
        const checkedHandle = switchToggle.querySelector('.guic-switch-toggle-handle-checked');
        assert.exists(checkedSwitch, 'Switch is not checked');
        assert.exists(checkedHandle, 'Switch handle is not checked');
    });

    it('Should be disabled', async () => {
        await loadSwitch({ disabled: true });
        const switchToggle = document.querySelector('gameface-switch');
        const disabledSwitch = switchToggle.querySelector('.guic-switch-toggle-disabled');
        assert.exists(disabledSwitch, 'Switch is not disabled');
    });

    it('Should disable switch', async () => {
        await loadSwitch({});
        const switchToggle = document.querySelector('gameface-switch');
        switchToggle.disabled = true;
        const disabledSwitch = switchToggle.querySelector('.guic-switch-toggle-disabled');
        assert.exists(disabledSwitch, 'Switch is not disabled');
    });

    it('Should disable switch via attribute', async () => {
        await loadSwitch({});
        const switchToggle = document.querySelector('gameface-switch');
        switchToggle.setAttribute('disabled', '');
        const disabledSwitch = switchToggle.querySelector('.guic-switch-toggle-disabled');
        assert.exists(disabledSwitch, 'Switch is not disabled');
    });

    it('Should be inset', async () => {
        await loadSwitch({ type: 'inset' });
        const switchToggle = document.querySelector('gameface-switch');
        const insetSwitch = switchToggle.querySelector('.guic-switch-toggle-inset');
        assert.exists(insetSwitch, 'Switch is not inset');
    });

    it('Should change type to inset', async () => {
        await loadSwitch({ type: 'text-inside' });
        const switchToggle = document.querySelector('gameface-switch');
        switchToggle.type = 'inset';
        await createAsyncSpec(() => {
            const insetSwitch = switchToggle.querySelector('.guic-switch-toggle-inset');
            assert.exists(insetSwitch, 'Switch is not inset');
        });
    });

    it('Should change type to inset via attribute', async () => {
        await loadSwitch({ type: 'text-inside' });
        const switchToggle = document.querySelector('gameface-switch');
        switchToggle.setAttribute('type', 'inset');
        await createAsyncSpec(() => {
            const insetSwitch = switchToggle.querySelector('.guic-switch-toggle-inset');
            assert.exists(insetSwitch, 'Switch is not inset');
        });
    });

    it('Should change type with invalid value and fallback to inset', async () => {
        await loadSwitch({ type: 'text-inside' });
        const switchToggle = document.querySelector('gameface-switch');
        switchToggle.type = 'invalid';
        await createAsyncSpec(() => {
            const insetSwitch = switchToggle.querySelector('.guic-switch-toggle-handle-default');
            assert.exists(insetSwitch, 'Switch is not default');
        });
    });

    it('Should have text inside', async () => {
        await loadSwitch({ type: 'text-inside' });
        const switchToggle = document.querySelector('gameface-switch');
        assert.equal(switchToggle.firstChild.childElementCount, 1);
    });

    it('Should change type to text inside', async () => {
        await loadSwitch({ type: 'inset' });
        const switchToggle = document.querySelector('gameface-switch');
        switchToggle.type = 'text-inside';
        await createAsyncSpec(() => {
            assert.equal(switchToggle.firstChild.childElementCount, 1);
        });
    });

    it('Should change type to text inside via attribute', async () => {
        await loadSwitch({ type: 'inset' });
        const switchToggle = document.querySelector('gameface-switch');
        switchToggle.type = 'text-inside';
        await createAsyncSpec(() => {
            assert.equal(switchToggle.firstChild.childElementCount, 1);
        });
    });

    it('Should have correct labels', async () => {
        const checkText = 'On';
        const uncheckText = 'Off';
        await loadSwitch({ checkText, uncheckText });
        const switchToggle = document.querySelector('gameface-switch');
        const checkedTextElement = switchToggle.querySelector('.guic-switch-toggle-true');
        const uncheckedTextElement = switchToggle.querySelector('.guic-switch-toggle-false');
        // The regex finds and replaces spaces and new lines that the textContent has
        assert.equal(checkedTextElement.textContent.replace(/[\n\r]+|[\s]{2,}/g, ' ').trim(), checkText);
        assert.equal(uncheckedTextElement.textContent.replace(/[\n\r]+|[\s]{2,}/g, ' ').trim(), uncheckText);
    });

    it('Should change state when clicked', async () => {
        await loadSwitch({});
        const switchToggle = document.querySelector('gameface-switch');
        switchToggle.onClick();
        const checkedSwitch = switchToggle.querySelector('.guic-switch-toggle-checked');
        const checkedHandle = switchToggle.querySelector('.guic-switch-toggle-handle-checked');
        assert.exists(checkedSwitch, 'Switch is not checked');
        assert.exists(checkedHandle, 'Switch handle is not checked');
    });

    it('Should not change state when clicked and disabled', async () => {
        await loadSwitch({ disabled: true });
        const switchToggle = document.querySelector('gameface-switch');
        switchToggle.firstChild.dispatchEvent(new MouseEvent('click'));
        const checkedSwitch = switchToggle.querySelector('.guic-switch-toggle-checked');
        const checkedHandle = switchToggle.querySelector('.guic-switch-toggle-handle-checked');
        assert.notExists(checkedSwitch, 'Switch is not checked');
        assert.notExists(checkedHandle, 'Switch handle is not checked');
    });

    it('Should emit custom event', (done) => {
        loadSwitch({}).then(() => {
            const switchToggle = document.querySelector('gameface-switch');
            switchToggle.addEventListener('switch_toggle', ({ detail }) => {
                assert.isTrue(detail);
                done();
            });

            switchToggle.onClick();
        });
    });
});

/* eslint-disable max-lines-per-function */
if (engine?.isAttached) {
    describe('Switch Component (Gameface Data Binding Test)', () => {
        const createSwitch = (template) => {
            const wrapper = document.createElement('div');
            wrapper.className = 'test-wrapper';
            wrapper.innerHTML = template;

            cleanTestPage('.test-wrapper');

            document.body.appendChild(wrapper);

            return new Promise((resolve) => {
                waitForStyles(resolve);
            });
        };

        afterAll(() => cleanTestPage('.test-wrapper'));

        it(`Should have populated 2 elements`, async () => {
            const templateName = 'model';

            const template = `
            <div data-bind-for="array:{{${templateName}.array}}">
                <gameface-switch>
                    <component-slot data-name="switch-unchecked">Unchecked text</component-slot>
                    <component-slot data-name="switch-checked">Checked text</component-slot>
                </gameface-switch>
            </div>`;
            await setupDataBindingTest(templateName, template, createSwitch);
            const expectedCount = 2;
            const switchCount = document.querySelectorAll('gameface-switch').length;
            assert.equal(switchCount, expectedCount, `Switches found: ${switchCount}, should have been ${expectedCount}.`);
        });

        it(`Should dynamically change the state of switch`, async () => {
            const template = `
            <gameface-switch data-bind-custom-attribute-switch="{{model}}">
                <component-slot data-name="switch-unchecked">Unchecked text</component-slot>
                <component-slot data-name="switch-checked">Checked text</component-slot>
            </gameface-switch>`;

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

            engine.registerBindingAttribute('custom-attribute-switch', CustomAttribute);
            const model = { disabled: false, type: 'inset', checked: false };
            await setupDataBindingTest('model', template, createSwitch, model);
            const switchToggle = document.querySelector('gameface-switch');
            Object.keys(window.model).forEach(attrName => assert.equal(switchToggle[attrName], window.model[attrName], `The switch has a different ${attrName}. Received ${switchToggle[attrName]}. Expected ${window.model[attrName]}`));
            // We need first to change the type of the switch because it re-renders the whole component
            // And then change the checked state. Otherwise when changing `checked` state right after the type is changed it is possible
            // to not be changed because the switch has not be re-rendered yet.
            window.model.type = 'text-inside';
            engine.updateWholeModel(window.model);
            engine.synchronizeModels();
            await createAsyncSpec(() => {
                window.model.checked = true;
                engine.updateWholeModel(window.model);
                engine.synchronizeModels();
                Object.keys(window.model).forEach(attrName => assert.equal(switchToggle[attrName], window.model[attrName], `The switch has a different ${attrName}. Received ${switchToggle[attrName]}. Expected ${window.model[attrName]}`));
            });
        });
    });
}
