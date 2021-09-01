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
        waitForStyles(resolve, 3);
    });
};

describe('Switch Component', () => {
    afterEach(() => {
        // Since we don't want to replace the whole content of the body using
        // innerHtml setter, we query only the current custom element and we replace
        // it with a new one; this is needed because the specs are executed in a random
        // order and sometimes the component might be left in a state that is not
        // ready for testing
        let switchToggle = document.querySelector('gameface-switch');

        if (switchToggle) {
            switchToggle.parentElement.removeChild(switchToggle);
        }
    });

    it('Should be rendered', async () => {
        await loadSwitch({});
        const switchToggle = document.querySelector('gameface-switch');
        assert.exists(switchToggle, 'Switch component is added to DOM');
    });

    it('Should be checked', async () => {
        await loadSwitch({ checked: true });
        const switchToggle = document.querySelector('gameface-switch');
        const checkedSwitch = switchToggle.querySelector('.switch-toggle-checked');
        const checkedHandle = switchToggle.querySelector('.switch-toggle-handle-checked');
        assert.exists(checkedSwitch, 'Switch is checked');
        assert.exists(checkedHandle, 'Switch handle is checked');
    });

    it('Should be disabled', async () => {
        await loadSwitch({ disabled: true });
        const switchToggle = document.querySelector('gameface-switch');
        const disabledSwitch = switchToggle.querySelector('.switch-toggle-disabled');
        assert.exists(disabledSwitch, 'Switch is disabled');
    });

    it('Should be inset', async () => {
        await loadSwitch({ type: 'inset' });
        const switchToggle = document.querySelector('gameface-switch');
        const insetSwitch = switchToggle.querySelector('.switch-toggle-inset');
        assert.exists(insetSwitch, 'Switch is inset');
    });

    it('Should have text inside', async () => {
        await loadSwitch({ type: 'text-inside' });
        const switchToggle = document.querySelector('gameface-switch');
        assert.equal(switchToggle.firstChild.childElementCount, 1);
    });

    it('Should have correct labels', async () => {
        const checkText = 'On';
        const uncheckText = 'Off';
        await loadSwitch({ checkText, uncheckText });
        const switchToggle = document.querySelector('gameface-switch');
        const checkedTextElement = switchToggle.querySelector('.switch-toggle-true');
        const uncheckedTextElement = switchToggle.querySelector('.switch-toggle-false');
        assert.equal(checkedTextElement.textContent.replace(/[\n\r]+|[\s]{2,}/g, ' ').trim(), checkText); //The regex finds and replaces spaces and new lines that the textContent has
        assert.equal(uncheckedTextElement.textContent.replace(/[\n\r]+|[\s]{2,}/g, ' ').trim(), uncheckText);
    });

    it('Should change state when clicked', async () => {
        await loadSwitch({});
        const switchToggle = document.querySelector('gameface-switch');
        switchToggle.onClick();
        const checkedSwitch = switchToggle.querySelector('.switch-toggle-checked');
        const checkedHandle = switchToggle.querySelector('.switch-toggle-handle-checked');
        assert.exists(checkedSwitch, 'Switch is checked');
        assert.exists(checkedHandle, 'Switch handle is checked');
    });

    it('Should not change state when clicked and disabled', async () => {
        await loadSwitch({ disabled: true });
        const switchToggle = document.querySelector('gameface-switch');
        switchToggle.firstChild.dispatchEvent(new MouseEvent('click'));
        const checkedSwitch = switchToggle.querySelector('.switch-toggle-checked');
        const checkedHandle = switchToggle.querySelector('.switch-toggle-handle-checked');
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
