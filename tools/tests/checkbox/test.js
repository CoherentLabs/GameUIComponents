describe('Checkbox component', function() {
    beforeAll(() => {
        document.body.innerHTML = '<gameface-checkbox></gameface-checkbox>';
    });

    it('Should be rendered', () => {
        expect(document.querySelector('.checkbox-wrapper')).toBeTruthy();
    });

    it('Should toggle state when it\'s clicked', () => {
        const checkbox = document.getElementsByTagName('gameface-checkbox')[0];
        checkbox.click();
        const checkMark = checkbox.querySelector('[data-name="check-mark"]');
        expect(checkMark.style.display).toEqual('none');
        checkbox.click();
        expect(checkMark.style.display).toEqual('');
    });
});
