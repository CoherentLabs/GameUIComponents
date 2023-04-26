/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
/* global sinon */
const tooltipTemplate = `
<gameface-tooltip target=".target" on="click" position="bottom" off="click">
<div slot="message">Message on bottom</div>
</gameface-tooltip>
<gameface-tooltip id="default-to-top" target=".target" on="click" position="notexistingposition" off="click">
<div slot="message">Should be on top</div>
</gameface-tooltip>

<gameface-tooltip id="smart-position" target=".smart-position-target" on="click" position="top" off="click">
<div slot="message">Should be on top</div>
</gameface-tooltip>
<div class="target" style="background-color: #6e6d6d;position: absolute; top: 500px; left: 500px;width:100px;height:50px;">Hover over me</div>
<div class="smart-position-target" style="background-color: #6e6d6d;position: absolute; top: 20px; left: 30px;width:100px;height:50px;">click me</div>`;

const tooltipTemplateAsync = `
<gameface-tooltip target=".target" on="click" position="bottom" off="click" async>
<div slot="message">Loading...</div>
</gameface-tooltip>

<div class="target" style="background-color: #6e6d6d;position: absolute; top: 500px; left: 500px;width:100px;height:50px;">Hover over me</div>`;

/** */
function removeTooltips() {
    const tooltips = document.querySelectorAll('gameface-tooltip');
    for (let i = 0; i < tooltips.length; i++) {
        tooltips[i].parentElement.removeChild(tooltips[i]);
    }
}

/**
 * @param {boolean} shouldHideTooltip
 * @param {boolean} expected
 * @returns {Promise<void>}
 */
async function checkResizeHandler(shouldHideTooltip = false, expected = true) {
    const sandbox = sinon.createSandbox();
    const tooltip = document.querySelector('#smart-position');
    sandbox.spy(tooltip, 'resizeDebounced');

    await tooltip.show();
    if (shouldHideTooltip) tooltip.hide();

    window.dispatchEvent(new CustomEvent('resize'));

    return createAsyncSpec(() => {
        assert(tooltip.resizeDebounced.called === expected, 'The tooltip was not repositioned on window resize.');
    });
}

/**
 * @param {string} template
 * @returns {Promise<void>}
 */
async function setupTooltipTestPage(template) {
    const el = document.createElement('div');
    el.className = 'tooltip-test-wrapper';
    el.innerHTML = template;

    cleanTestPage('.tooltip-test-wrapper');

    document.body.appendChild(el);

    return new Promise((resolve) => {
        waitForStyles(resolve);
    });
}

// eslint-disable-next-line max-lines-per-function
describe('Tooltip component', () => {
    afterAll(() => cleanTestPage('.tooltip-test-wrapper'));
    afterEach(() => removeTooltips());

    beforeEach(async () => {
        await setupTooltipTestPage(tooltipTemplate);
    });

    it('Should be displayed on click', async () => {
        const target = document.querySelector('.target');
        click(target);

        return createAsyncSpec(() => {
            const tooltip = document.querySelector('gameface-tooltip');
            assert(tooltip.style.display !== 'none', 'Tooltip was not displayed.');
        });
    });

    it('Should be hidden on click', async () => {
        const target = document.querySelector('.target');
        click(target);
        click(target);

        return createAsyncSpec(() => {
            const tooltip = document.querySelector('gameface-tooltip');
            assert(tooltip.style.visibility !== 'hidden', 'Tooltip was not hidden.');
        }, 5);
    });

    it('Should be hidden on clicking outside of the tooltip', async () => {
        const target = document.querySelector('.target');
        click(target);

        const tooltip = document.querySelector('gameface-tooltip');

        await createAsyncSpec(() => {
            assert(tooltip.style.display !== 'none', 'Tooltip was not displayed.');
        }, 5);

        click(document.body, { bubbles: true });

        assert(tooltip.style.display === 'none', 'Tooltip was not closed on clicking outside of the tooltip.');
    });

    it('Should be displayed on top as a fallback', async () => {
        const target = document.querySelector('.target');
        click(target);

        return createAsyncSpec(() => {
            const tooltip = document.querySelector('#default-to-top');
            assert(tooltip.position === 'top', 'Tooltip was no displayed on top.');
        }, 5);
    });

    it('Should not be displayed on top as there is not enough space for the tooltip to be visible', async () => {
        const target = document.querySelector('.smart-position-target');
        click(target);

        return createAsyncSpec(() => {
            const tooltip = document.querySelector('#smart-position');
            assert(tooltip.position !== 'top', 'Tooltip was displayed on top.');
        }, 5);
    });

    it('Should change a tooltip message (string).', () => {
        const newValue = 'Value Changed!';
        const gamefaceTooltip = document.querySelector('gameface-tooltip');

        gamefaceTooltip.setMessage(newValue);

        assert(gamefaceTooltip.message === newValue, 'Tooltip message failed to change.');
    });

    it('Should change a tooltip message (function returning number).', () => {
        const expectedNumber = 1337;
        const gamefaceTooltip = document.querySelector('gameface-tooltip');

        gamefaceTooltip.setMessage(() => expectedNumber);

        assert(gamefaceTooltip.message === expectedNumber.toString(), 'Tooltip message failed to change.');
    });

    it('Should reposition itself on window resize', async () => {
        return checkResizeHandler();
    });

    it('Should not reposition itself on window resize if it is hidden', async () => {
        return checkResizeHandler(true, false);
    });
});

describe('Tooltip component (async mode)', () => {
    afterAll(() => cleanTestPage('.tooltip-test-wrapper'));
    afterEach(() => removeTooltips());

    beforeEach(async () => {
        await setupTooltipTestPage(tooltipTemplateAsync);
    });

    it('Should change a tooltip message (function returning a Promise).', async () => {
        const newValue = 'Value Changed! (Promise)';
        const gamefaceTooltip = document.querySelector('gameface-tooltip');

        // eslint-disable-next-line require-jsdoc
        function mockContentAsync() {
            return new Promise((resolve) => {
                requestAnimationFrame(() => {
                    resolve(newValue);
                });
            });
        }

        await gamefaceTooltip.setMessage(mockContentAsync);

        assert(gamefaceTooltip.message === newValue, 'Tooltip message failed to change.');
    });
});

/* global engine */
/* global setupDataBindingTest */
if (engine?.isAttached) {
    describe('Tooltip Component (Gameface Data Binding Test)', () => {
        const templateName = 'tooltip';

        const template = `
        <div data-bind-for="array:{{${templateName}.array}}">
        <gameface-tooltip target=".target" on="click" position="bottom" off="click">
            <div slot="message">tooltip</div>
        </gameface-tooltip>

        <div class="target">target</div>
        </div>`;

        afterAll(() => cleanTestPage('.tooltip-test-wrapper'));

        beforeEach(async () => {
            await setupDataBindingTest(templateName, template, setupTooltipTestPage);
        });

        it(`Should have populated 2 elements`, () => {
            const expectedCount = 2;
            const tooltipCount = document.querySelectorAll('gameface-tooltip').length;
            assert.equal(tooltipCount, expectedCount, `Tooltips found: ${tooltipCount}, should have been ${expectedCount}.`);
        });
    });
}
