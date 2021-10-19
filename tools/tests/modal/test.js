/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

describe('Modal Component', () => {
    beforeEach(function (done) {
        const el = document.createElement('gameface-modal');
        const currentElement = document.querySelector('gameface-modal');

        // Since we don't want to replace the whole content of the body using
        // innerHtml setter, we query only the current custom element and we replace
        // it with a new one; this is needed because the specs are executed in a random
        // order and sometimes the component might be left in a state that is not
        // ready for testing
        if(currentElement) {
            currentElement.parentElement.removeChild(currentElement);
        }

        document.body.appendChild(el);

        waitForStyles(() => {
            done();
        });
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
