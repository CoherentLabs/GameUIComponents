/**
 * @param {Object} param
 * @returns {Promise<void>}
 */
async function loadToast({ position, timeout, target, closeButton }) {
    const attributes = [
        position ? `position="${position}"` : '',
        timeout ? `timeout="${timeout}"` : '',
        target ? `target="${target}"` : '',
    ];

    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
    <div class='test-wrapper'>
    <gameface-toast ${attributes.join(' ')} style="background-color: cyan; padding: 10px; animation-duration: 10ms;" >
    <div slot="message">Hello</div>
    <div slot="close-btn">${closeButton ? closeButton : 'x'}</div>
    </gameface-toast>
    ${target ? `<div class="${target.split('.')[1]}" style="padding: 10px; border: 1px solid black; background-color: #6e6d6d;">Click me to open a toast!</div>` : ''}
    </div>`;

    document.body.appendChild(wrapper.children[0]);

    return new Promise((resolve) => {
        waitForStyles(resolve, 4);
    });
}

/**
 */
function setupAnimationListener() {
    document.addEventListener('animationend', (event) => {
        if (event.animationName === 'guic-toast-fade-out') {
            const customEvent = new CustomEvent('animationCompleted');
            document.dispatchEvent(customEvent);
        }
    });
}

/** */
function removeToasts() {
    const toasts = document.querySelectorAll('gameface-toast');
    for (let i = 0; i < toasts.length; i++) {
        toasts[i].parentElement.removeChild(toasts[i]);
    }
}

/**
 * Simulates opening and closing the toast
 * @param {HTMLElement} toast The toast component
*/
function openAndCloseToast(toast) {
    const closeButton = toast.querySelector('.guic-toast-close-btn');
    toast.show();
    click(closeButton);
}

// eslint-disable-next-line max-lines-per-function
describe('Toast component', () => {
    afterEach(() => {
        removeToasts();
        cleanTestPage('.test-wrapper');
    });
    beforeEach(() => setupAnimationListener());

    it('Should be visible after show method is called', async () => {
        await loadToast({});
        const toast = document.querySelector('gameface-toast');
        toast.show();
        const isVisible = toast.classList.contains('guic-toast-show');

        assert.isTrue(isVisible, 'Toast isn\'t visible.');
    });

    it('Should initialize position containers', async () => {
        await loadToast({});
        const toastContainers = document.querySelectorAll('.guic-toast-container');

        assert.exists(toastContainers, 'Toast containers haven\'t been initialized or are undefined.');
        assert.lengthOf(toastContainers, 6, 'Toast containers count does not match the expected number.');
    });

    it('Should place toast in the correct container', async () => {
        await loadToast({ position: 'top-center' });
        const toast = document.querySelector('gameface-toast');
        toast.show();
        const correctPosition = toast.parentElement.classList.contains('guic-toast-top', 'guic-toast-center');

        assert.isTrue(correctPosition, 'Toast isn\'t in the right container');
    });

    it('Should not be visible after hide method is called', async () => {
        await loadToast({});
        const toast = document.querySelector('gameface-toast');
        let isStillInDom = true;

        toast.show();
        toast.hide();

        // eslint-disable-next-line no-undef
        document.addEventListener('animationCompleted', () => {
            isStillInDom = document.body.contains(toast);
            assert.isFalse(isStillInDom, 'Toast should be hidden.');
        });
    });

    it('Should be hidden by the close button', async () => {
        await loadToast({ position: 'bottom-right', target: 'target' });
        const toast = document.querySelector('gameface-toast');
        let isStillInDom = true;

        openAndCloseToast(toast);

        document.addEventListener('animationCompleted', () => {
            isStillInDom = document.body.contains(toast);
            assert.isFalse(isStillInDom, 'Toast should be hidden.');
        });
    });

    it('Should not be able to click close button if empty', async () => {
        await loadToast({ closeButton: '' });
        const toast = document.querySelector('gameface-toast');

        openAndCloseToast(toast);

        document.addEventListener('animationCompleted', () => {
            const isStillInDom = document.body.contains(toast);
            assert.isTrue(isStillInDom, 'Toast should not be hidden.');
        });
    });

    it('Should be displayed on click', async () => {
        const targetSelector = '.target';
        await loadToast({ target: targetSelector });

        const toast = document.querySelector('gameface-toast');
        const target = document.querySelector(targetSelector);

        click(target);

        assert.isTrue(toast.classList.contains('guic-toast-show'), 'Toast was not displayed');
    });

    it('Should change the toast\'s message (string).', async () => {
        const newValue = 'Value Changed!';
        await loadToast({});
        const toast = document.querySelector('gameface-toast');
        toast.message = newValue;

        assert(toast.message === newValue, 'Toast message failed to change.');
    });

    it('Should change toast\'s location', async () => {
        const newPosition = 'bottom-right';
        await loadToast({ position: 'top-center' });
        const toast = document.querySelector('gameface-toast');

        toast.position = newPosition;

        const locationHasChanged = toast.position === newPosition;
        assert.isTrue(locationHasChanged, 'Toast location failed to change.');
    });

    it('Should be hidden after specified timeout', async () => {
        await loadToast({ timeout: 10 });
        const toast = document.querySelector('gameface-toast');
        toast.show();
        let isStillInDom = true;
        // eslint-disable-next-line no-undef

        document.addEventListener('animationCompleted', () => {
            isStillInDom = document.body.contains(toast);
            assert.isFalse(isStillInDom, 'Toast should not be visible after the timout has run out.');
        });
    });
});

if (engine?.isAttached) {
    describe('Toast Component (Gameface Data Binding Test)', () => {
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
                waitForStyles(resolve, 4);
            });
        }

        const templateName = 'model';

        const template = `
        <div data-bind-for="array:{{${templateName}.array}}">
        <gameface-toast target=".target" position="top-right" timeout="2000">
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
