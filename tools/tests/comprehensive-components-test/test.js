/**
 * Basic layout (mostly) tests to make sure they are build correctly.
 */
/* global componentsTemplates */
// eslint-disable-next-line max-lines-per-function
describe('Comprehensive Components test', () => {
    /** Tooltip target element */
    function createTooltipTarget() {
        const tooltipTarget = document.createElement('div');
        tooltipTarget.className = 'target';
        tooltipTarget.textContent = 'Tooltip Target';
        document.body.appendChild(tooltipTarget);
    }

    /**
     * @param {string} template
     * @returns {Promise<void>}
     */
    function setupComponentsPage() {
        createTooltipTarget();

        const wrapper = document.createElement('div');
        wrapper.className = 'aio-test-wrapper';

        const concatenatedTemplates = Object.values(componentsTemplates).join('');
        wrapper.innerHTML = concatenatedTemplates;

        cleanTestPage('.aio-test-wrapper');

        document.body.appendChild(wrapper);

        return new Promise((resolve) => {
            waitForStyles(resolve, 4);
        });
    }

    afterAll(() => cleanTestPage('.aio-test-wrapper'));

    beforeAll(function (done) {
        setupComponentsPage().then(done).catch(err => console.error(err));
    });

    it('Accordion Menu', async () => {
        // Copied from accordion-menu test
        const waitForTransitionEnd = () => {
            const accordionMenu = document.querySelector('gameface-accordion-menu');

            return new Promise((resolve) => {
                accordionMenu.addEventListener('transitionend', resolve);
            });
        };

        const header = document.querySelector('gameface-accordion-header');
        click(header, { bubbles: true });
        await waitForTransitionEnd();
        const height = parseFloat(header.nextElementSibling.style.height);
        assert.equal(height, 0);
    });

    it('Automatic Grid', () => {
        // Copied (changed values according to template) from automatic-grid test
        const columns = document.querySelector('.guic-row').childElementCount;
        const rows = document.querySelectorAll('.guic-row').length;
        assert.equal(columns, 3);
        assert.equal(rows, 2);
    });

    it('Checkbox', () => {
        const checkbox = document.querySelector('gameface-checkbox');
        const checkboxMark = checkbox.querySelector('.guic-check-mark');
        const checkboxBackground = checkbox.querySelector('.guic-checkbox-background');
        const checkboxLabel = checkbox.querySelector('.guic-checkbox-label').textContent;
        const expectedLabelString = 'Enable Music';

        assert.exists(checkboxMark, 'Checkbox mark does not exist.');
        assert.exists(checkboxBackground, 'Background element does not exist.');
        assert.equal(checkboxLabel, expectedLabelString, `Label text should be ${expectedLabelString} but is ${checkboxLabel}`);

        click(checkbox);
        assert.equal(checkboxMark.parentElement.style.display, 'block', 'Checkbox is not triggered.');
    });

    it('Dropdown', () => {
        // Partially copied from dropdown test
        const dropdown = document.querySelector('gameface-dropdown');
        const dropdownOptions = document.querySelectorAll('dropdown-option');

        assert.equal(dropdownOptions.length, 2, 'Options are not populated or more than expected.');

        // Open
        const selectedOption = dropdown.querySelector('.guic-dropdown-selected-option');
        click(selectedOption);
        // Click second option
        const option = dropdown.allOptions[1];
        click(option, { bubbles: true });

        const expectedValue = 'Dog';

        return createAsyncSpec(() => {
            assert(selectedOption.textContent === expectedValue, `Changed value is not ${expectedValue}`);
        });
    });

    it('Menu', () => {
        const menuTextContent = document.querySelector('gameface-left-menu').textContent;

        assert.isTrue(menuTextContent.includes('Settings'), 'Menu label is not correct.');
        assert.isTrue(menuTextContent.includes('Keyboard'), 'Menu option text "Keyboard" is not present.');
        assert.isTrue(menuTextContent.includes('Mouse'), 'Menu option text "Mouse" is not present.');
    });

    it('Modal', () => {
        const modal = document.querySelector('gameface-modal');
        const modalBackdrop = modal.querySelector('.guic-modal-backdrop');
        const modalCloseButton = modal.querySelector('.guic-modal-close-x');
        const modalTextContent = modal.textContent;

        assert.exists(modalBackdrop, 'Backdrop element does not exist.');
        assert.exists(modalCloseButton, 'Close button does not exist.');

        assert.isTrue(modalTextContent.includes('Modal Header'), 'Modal header is not as expected.');
        assert.isTrue(modalTextContent.includes('Confirmation Text'), 'Confirmation label text is not as expected.');
        assert.isTrue(modalTextContent.includes('Yes'), '"Yes" button text is not as expected.');

        click(modalCloseButton);
        assert(modal.style.display === 'none', 'The modal is not hidden.');
    });

    it('Radio Button', () => {
        const radioButtons = document.querySelectorAll('radio-button');

        assert.include(radioButtons[0].textContent, 'Button 1', `Button 1 text is not as expected.`);
        assert.include(radioButtons[1].textContent, 'Button 2', `Button 2 text is not as expected.`);

        assert.equal(radioButtons[0].getAttribute('aria-checked'), 'false', 'Button 1 should not be checked by default according to the template.');
        click(radioButtons[0]);
        assert.equal(radioButtons[0].getAttribute('aria-checked'), 'true', 'Button 1 has not been checked by clicking.');
    });

    it('Rangeslider', () => {
        const expectedValue = 50;
        const bar = document.querySelector('.guic-horizontal-rangeslider-bar');
        const handle = document.querySelector('.guic-horizontal-rangeslider-handle');
        const thumb = document.querySelector('.guic-horizontal-rangeslider-thumb');

        assert.equal(parseFloat(bar.style.width), expectedValue, 'Bar width is not correct.');
        assert.equal(parseFloat(handle.style.left), expectedValue, 'Handle left position is not correct.');
        assert.equal(parseFloat(thumb.style.left), expectedValue, 'Thumb left position is not correct.');
        assert.equal(thumb.textContent, '2', 'Thumb value / text is not as expected.');
    });

    it('Slider', () => {
        const slider = document.querySelector('.standalone-slider').querySelector('gameface-slider');

        const arrowUp = slider.querySelector('.guic-slider-horizontal-arrow.up');
        const arrowDown = slider.querySelector('.guic-slider-horizontal-arrow.down');
        const handle = slider.querySelector('.guic-slider-horizontal-handle');

        assert.equal(slider.getAttribute('orientation'), 'horizontal', 'The orientation value is not correct.');
        assert.exists(arrowUp, 'Arrow Up element does not exist.');
        assert.exists(arrowDown, 'Arrow Down element does not exist.');
        assert.exists(handle, 'Handle element does not exist.');
    });

    it('Switch', () => {
        // Copied from switch test until the first empty line + the last 2 asserts
        const switchToggle = document.querySelector('gameface-switch');
        switchToggle.onClick();
        const checkedSwitch = switchToggle.querySelector('.guic-switch-toggle-checked');
        const checkedHandle = switchToggle.querySelector('.guic-switch-toggle-handle-checked');

        const toggleOffLabel = switchToggle.querySelector('.guic-switch-toggle-false').textContent;
        const toggleOnLabel = switchToggle.querySelector('.guic-switch-toggle-true').textContent;
        const handle = switchToggle.querySelector('.guic-switch-toggle-handle').textContent;

        assert.include(toggleOffLabel, 'Off', 'Off label is not correct.');
        assert.include(toggleOnLabel, 'On', 'On label is not correct.');
        assert.exists(handle, 'Handle element does not exist.');

        assert.exists(checkedSwitch, 'Switch is checked');
        assert.exists(checkedHandle, 'Switch handle is checked');
    });

    it('Tabs', () => {
        const tabHeadings = document.querySelectorAll('tab-heading');
        const tabPanels = document.querySelectorAll('tab-panel');

        assert.equal(tabHeadings[0].textContent, 'Chapter One', 'Tab #1 Heading label is not correct.');
        assert.equal(tabHeadings[1].textContent, 'Chapter Two', 'Tab #2 Heading label is not correct.');
        assert.equal(tabPanels[0].textContent, 'Chapter One Content', 'Panel #1 text is not correct.');
        assert.equal(tabPanels[1].textContent, 'Chapter Two Content', 'Panel #2 text is not correct.');
    });

    it('Text Field', () => {
        const textField = document.querySelector('gameface-text-field');
        const textFieldTextContent = textField.textContent;
        const inputValue = textField.querySelector('input').value;

        assert.isTrue(textFieldTextContent.includes('Label:'), 'Label text is not correct.');
        assert.isTrue(textFieldTextContent.includes('Placeholder'), 'Placeholder text is not correct.');
        assert.equal(inputValue, 'Value', 'Input value is not correct.');
    });

    it('Tooltip', () => {
        const tooltip = document.querySelector('gameface-tooltip');
        const target = document.querySelector('.target');
        click(target);

        return createAsyncSpec(() => {
            assert.include(tooltip.textContent, 'Message', 'Message missing or is not correct.');
            assert(tooltip.style.display !== 'none', 'Tooltip was not displayed.');
        });
    });

    it('Progress Bar', () => {
        // Similar in dedicated component test.
        const targetValue = 75;

        const progressBar = document.querySelector('gameface-progress-bar');
        // move compact on the page otherwie the 100% height create too much scroll
        progressBar.firstElementChild.style.height = '20px';
        const filler = document.querySelector('.guic-progress-bar-filler');
        progressBar.setProgress(targetValue);

        assert.equal(parseInt(filler.style.width), targetValue, `Progress Bar has not been set to ${targetValue}% width.`);
    });

    it('Radial Menu', () => {
        const radialMenu = document.querySelector('gameface-radial-menu');
        radialMenu.items = [{}, {}];

        const menuName = radialMenu.querySelector('.guic-radial-menu-center-text').textContent;
        const segmentsCount = radialMenu.querySelectorAll('.guic-radial-menu-item').length;

        assert.equal(menuName, 'Radial Menu Name', 'Name is not correct.');
        assert.equal(segmentsCount, 2, 'Segments are missing or not the expected amount.');
    });

    it('Scrollable Container', () => {
        const slider = document.querySelector('.scrollable-container-component-standalone').querySelector('gameface-slider');

        const arrowUp = slider.querySelector('.guic-slider-vertical-arrow.up');
        const arrowDown = slider.querySelector('.guic-slider-vertical-arrow.down');
        const handle = slider.querySelector('.guic-slider-vertical-handle');

        assert.equal(slider.getAttribute('orientation'), 'vertical', 'The orientation value is not correct.');
        assert.exists(arrowUp, 'Arrow Up element does not exist.');
        assert.exists(arrowDown, 'Arrow Down element does not exist.');
        assert.isNotNaN(parseFloat(handle.style.height), 'No height set to the handle.');
    });
});
