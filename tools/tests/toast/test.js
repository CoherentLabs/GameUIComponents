const toastTemplate = `
<gameface-toast gravity="top" position="center" timeout="10" target='.target' style="background-color: cyan; padding: 10px; animation-duration: 10ms;">
<div slot="message">Message on top center</div>
<div slot="close-btn">x</div>
</gameface-toast>
<div class='target' style='padding: 10px; border: 1px solid black; background-color: #6e6d6d;'>Click me to open a toast!</div>`;

/** */
function removeToasts() {
    const toasts = document.querySelectorAll('gameface-toast');
    for (let i = 0; i < toasts.length; i++) {
        toasts[i].parentElement.removeChild(toasts[i]);
    }
}

/**
 * @param {string} template
 * @returns {Promise<void>}
 */
function setupToastTestPage(template) {
    const el = document.createElement('div');
    el.className = 'test-wrapper';
    el.innerHTML = template;

    cleanTestPage('.test-wrapper');

    document.body.appendChild(el);

    return new Promise((resolve) => {
        waitForStyles(resolve);
    });
}

// eslint-disable-next-line max-lines-per-function
describe('Toast component', () => {
    afterAll(() => cleanTestPage('.test-wrapper'));
    afterEach(() => removeToasts());

    beforeEach(async () => {
        await setupToastTestPage(toastTemplate);
    });

    it('Should be visible after show method is called', () => {
        const toast = document.querySelector('gameface-toast');
        toast.show();
        const isVisible = window.getComputedStyle(toast).visibility === 'visible';

        assert.isTrue(isVisible, 'Toast isn\'t visible.');
    });

    it('Should initialize position containers', () => {
        const toastContainers = document.querySelectorAll('.guic-toast-container');
        assert.exists(toastContainers, 'Toast containers haven\'t been initialized or are undefined.');
    });

    it('Should initialize position containers for all possible sides', () => {
        const toastContainers = document.querySelectorAll('.guic-toast-container');
        assert.lengthOf(toastContainers, 6, 'Toast containers count does not match the expected number.');
    });

    it('Should place toast in the correct container', () => {
        const toast = document.querySelector('gameface-toast');
        toast.show();
        const correctPosition = toast.parentElement.classList.contains('guic-toast-top', 'guic-toast-center');

        assert.isTrue(correctPosition, 'Toast isn\'t in the right container');
    });

    it('Should not be visible after hide method is called', async () => {
        const toast = document.querySelector('gameface-toast');
        let isStillInDom = true;

        toast.show();
        toast.hide();

        // eslint-disable-next-line no-undef
        await timeout(() => {
            isStillInDom = document.body.contains(toast);
        }, 50);

        assert.isFalse(isStillInDom, 'Toast should be hidden.');
    });

    it('Should be hidden by the close button', async () => {
        const toast = document.querySelector('gameface-toast');
        const closeBtn = toast.querySelector('.guic-toast-close-btn');
        let isStillInDom = true;
        toast.show();
        click(closeBtn);

        // eslint-disable-next-line no-undef
        await timeout(() => {
            isStillInDom = document.body.contains(toast);
        }, 50);

        assert.isFalse(isStillInDom, 'Toast should be hidden.');
    });

    it('Should not be hidden if close button is empty', () => {
        const toast = document.querySelector('gameface-toast');
        const closeBtn = toast.querySelector('.guic-toast-close-btn');
        closeBtn.firstElementChild.innerHTML = '';

        toast.show();
        click(closeBtn);
        // Check if the toast is still in the DOM
        const isStillInDom = document.body.contains(toast);

        assert.isTrue(isStillInDom, 'Toast should not be hidden.');
    });

    it('Should be displayed on click', () => {
        const toast = document.querySelector('gameface-toast');
        const target = document.querySelector('.target');
        click(target);

        assert.isTrue(toast.classList.contains('guic-toast-show'), 'Toast was not displayed');
    });

    it('Should change the toast\'s message (string).', () => {
        const newValue = 'Value Changed!';
        const toast = document.querySelector('gameface-toast');
        toast.message = newValue;

        assert(toast.message === newValue, 'Toast message failed to change.');
    });

    it('Should change toast\'s location', () => {
        const toast = document.querySelector('gameface-toast');
        const newPosition = 'right';
        const newGravity = 'bottom';

        toast.gravity = newGravity;
        toast.position = newPosition;
        toast.message = `Toast on ${newGravity} ${newPosition}`;
        toast.show();

        const locationHasChanged = toast.gravity === newGravity && toast.position === newPosition;
        assert.isTrue(locationHasChanged, 'Toast location failed to change.');
    });

    it('Should be hidden after specified timeout', async () => {
        const toast = document.querySelector('gameface-toast');
        toast.show();
        let isStillInDom = true;
        // eslint-disable-next-line no-undef
        await timeout(() => {
            isStillInDom = document.body.contains(toast);
        }, 50);
        assert.isFalse(isStillInDom, 'Toast should not be visible after the timout has run out.');
    });
});

if (engine?.isAttached) {
    describe('Toast Component (Gameface Data Binding Test)', () => {
        const templateName = 'model';

        const template = `
        <div data-bind-for="array:{{${templateName}.array}}">
        <gameface-toast target=".target" position="right" gravity="top" timeout="2000">
            <div slot="message">Toast</div>
        </gameface-toast>

        <div class="target">target</div>
        </div>`;

        afterAll(() => cleanTestPage('.test-wrapper'));

        beforeEach(async () => {
            await setupDataBindingTest(templateName, template, setupToastTestPage);
        });

        it(`Should have populated 2 elements`, () => {
            const expectedCount = 2;
            const toastCount = document.querySelectorAll('gameface-toast').length;
            assert.equal(toastCount, expectedCount, `Toasts found: ${toastCount}, should have been ${expectedCount}.`);
        });
    });
}
