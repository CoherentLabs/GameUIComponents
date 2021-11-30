/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

const tooltipTemplate = `
<gameface-tooltip target=".target" on="click" position="bottom" off="click">
<div slot="message">Message on bottom</div>
</gameface-tooltip>
<gameface-tooltip id="default-to-top" target=".target" on="click" position="notexistingposition" off="click">
<div slot="message">Should be on top</div>
</gameface-tooltip>
<div class="target" style="background-color: #6e6d6d;position: absolute; top: 500px; left: 500px;width:100px;height:50px;">Hover over me</div>`;


function setupTooltipTestPage() {
    const el = document.createElement('div');
    el.className = 'tooltip-test-wrapper';
    el.innerHTML = tooltipTemplate;

    const currentElement = document.querySelector('.tooltip-test-wrapper');

    if (currentElement) {
        currentElement.parentElement.removeChild(currentElement);
    }

    document.body.appendChild(el);

    return new Promise(resolve => {
        waitForStyles(resolve);
    });
}


describe('Tooltip component', () => {
    afterAll(() => {
        const currentElement = document.querySelector('.tooltip-test-wrapper');

        if (currentElement) {
            currentElement.parentElement.removeChild(currentElement);
        }
    });

    afterEach(() => {
        const tooltips = document.querySelectorAll('gameface-tooltip');
        for(let i = 0; i < tooltips.length; i++) {
            tooltips[i].parentElement.removeChild(tooltips[i]);
        }
    });

    beforeEach(function (done) {
        setupTooltipTestPage().then(done).catch(err => console.error(err));
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
            assert(tooltip.style.visibility !== 'hidden', 'Tooltip was displayed.');
        }, 5);
    });

    it('Should be displayed on top as a fallback', async () => {
        const target = document.querySelector('.target');
        click(target);

        return createAsyncSpec(() => {
            const tooltip = document.querySelector('#default-to-top');
            assert(tooltip.position === 'top', 'Tooltip was no displayed on top.');
        }, 5);
    });
});
