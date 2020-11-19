describe('Tabs Components', () => {
    beforeAll(() => {
        document.body.innerHTML = '<gameface-tabs><gameface-tabs>';
    });

    it('Should be rendered', () => {
        expect(document.querySelector('.tabs-wrapper')).toBeTruthy();
    });

    it('Should set tab to active on click', () => {
        const tabs = document.getElementsByTagName('tab-heading');
        const [firstTab, secondTab] = [...tabs];
        firstTab.click();
        expect(document.querySelector('tab-panel[selected="true"]').textContent).toEqual(`${firstTab.textContent} Content`);
        secondTab.click();
        expect(document.querySelector('tab-panel[selected="true"]').textContent).toEqual(`${secondTab.textContent} Content`);
    });
})