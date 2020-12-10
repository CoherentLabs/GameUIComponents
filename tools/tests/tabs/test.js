describe('Tabs Components', () => {
    beforeAll(() => {
        document.body.innerHTML = '<gameface-tabs><gameface-tabs>';
    });

    it('Should be rendered', () => {
        expect(document.querySelector('.tabs-wrapper')).toBeTruthy();
    });

    xit('Should set tab to active on click', () => {
        const tabs = document.getElementsByTagName('tab-heading');
        const firstTab = tabs[0];
        const secondTab = tabs[1];
        click(firstTab, { bubbles: true });
        expect(document.querySelector('tab-panel[selected="true"]').textContent).toEqual(`${firstTab.textContent} Content`);
        click(secondTab, { bubbles: true });
        expect(document.querySelector('tab-panel[selected="true"]').textContent).toEqual(`${secondTab.textContent} Content`);
    });
})