const Jasmine = require('jasmine');
const jasmine = new Jasmine();

const toastTemplate = `
<gameface-toast gravity="top" position="center" timeout="2000" target='.target'>
<div slot="message">Message on top center</div>
<div slot="close-btn">x</div>
</gameface-toast>
<div class='target'>Click me to open a toast!</div>`;

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
    afterAll(() => cleanTestPage('.tooltip-test-wrapper'));

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

    it('Should not be visible after hide method is called', () => {
        const toast = document.querySelector('gameface-toast');
        toast.show();
        toast.hide();
        // Check if the toast is still in the DOM
        const isStillInDom = document.body.contains(toast);

        assert.isFalse(isStillInDom, 'Toast should be hidden.');
    });

    it('Should be hidden by the close button', () => {
        const toast = document.querySelector('gameface-toast');
        const closeBtn = toast.lastElementChild;
        toast.show();
        click(closeBtn);
        // Check if the toast is still in the DOM
        const isStillInDom = document.body.contains(toast);

        assert.isFalse(isStillInDom, 'Toast should be hidden.');
    });

    it('Should not be hidden if close button is empty', () => {
        const toast = document.querySelector('gameface-toast');
        const closeBtn = toast.lastElementChild;
        closeBtn.innerHTML = '';
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

        assert(toast.style.visibility === 'visible', 'Toast was not displayed');
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

        toast.gravity = newPosition;
        toast.position = newGravity;
        toast.show();
        const locationHasChanged = toast.gravity === newGravity && toast.position === newPosition;

        assert.isTrue(locationHasChanged, 'Toast location failed to change.');
    });
});

describe('Toast component', () => {
    afterAll(() => cleanTestPage('.tooltip-test-wrapper'));

    beforeEach(async () => {
        await setupToastTestPage(toastTemplate);
        jasmine.clock().install();
    });

    afterEach(() => {
        jasmine.clock().uninstall();
    });

    it('Should be hidden after specified timeout', () => {
        const toast = document.querySelector('gameface-toast');
        // show sets the timeout for hiding
        toast.show();
        jasmine.clock().tick(2001);
        // Check if the toast is still in the DOM
        const isStillInDom = document.body.contains(toast);

        assert.isFalse(isStillInDom, 'Toast should not be visible after 2000 ms');
    });
});
