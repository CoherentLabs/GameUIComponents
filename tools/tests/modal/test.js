/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

describe('Modal Component', () => {
    beforeEach(function (done) {
        const el = document.createElement('gameface-modal');
        const currentElement = document.querySelector('gameface-modal');

        if(currentElement) {
            currentElement.parentElement.removeChild(currentElement);
        }

        document.body.appendChild(el);

        setTimeout(done, 2000);
    });

    afterAll(() => {
        const currentElement = document.querySelector('gameface-modal');

        if(currentElement) {
            currentElement.parentElement.removeChild(currentElement);
        }
    });

    it('Should be rendered', () => {
        assert(document.querySelector('.modal-wrapper') !== null, 'The modal was not rendered.');
    });

    it('Should close when the close button is clicked', () => {
        const modal = document.getElementsByTagName('gameface-modal')[0];
        click(modal.querySelector('.close'));

        assert(modal.style.display === 'none', 'The modal is not hidden.');
    });
});