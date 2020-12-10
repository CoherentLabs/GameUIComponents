describe('Modal Component', () => {
    beforeAll(() => {
        document.body.innerHTML = '<gameface-modal></gameface-modal>';
    });

    it('Should be rendered', () => {
        expect(document.querySelector('.modal-wrapper')).toBeTruthy();
    });

    it('Should close when the close button is clicked', () => {
        const modal = document.getElementsByTagName('gameface-modal')[0];
        click(modal.querySelector('.close'));

        expect(modal.style.display).toEqual('none');
    });
});