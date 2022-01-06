/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

describe('Tabs Components', () => {
    afterAll(() => cleanTestPage('gameface-tabs'));

    beforeEach(function(done) {
        const currentElement = document.querySelector('gameface-tabs');

        if(currentElement) {
            currentElement.parentElement.removeChild(currentElement);
        }

        const el = document.createElement('gameface-tabs');
        document.body.appendChild(el);

        waitForStyles(() => {
            done();
        });
    });

    it('Should be rendered', () => {
        assert(document.querySelector('.guic-tabs-wrapper') !== null, 'Tabs component was not rendered.');
    });

    it('Should set tab to active on click', () => {
        const tabs = document.getElementsByTagName('tab-heading');
        const firstTab = tabs[0];
        const secondTab = tabs[1];
        click(firstTab, { bubbles: true });
        assert(document.querySelector('tab-panel[selected="true"]').textContent === `${firstTab.textContent} Content`,
            `First tab's content is not correct`);
        click(secondTab, { bubbles: true });
        assert(document.querySelector('tab-panel[selected="true"]').textContent === `${secondTab.textContent} Content`, `Second tab's content is not correct.`);
    });
});
