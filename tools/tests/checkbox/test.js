/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

describe('Checkbox component', () => {
    afterAll(() => {
        let checkbox = document.querySelector('gameface-checkbox');

        if (checkbox) {
            checkbox.parentElement.removeChild(checkbox);
        }
    });

    beforeEach(function (done) {
        let checkbox = document.querySelector('gameface-checkbox');

        if (checkbox) {
            checkbox.parentElement.removeChild(checkbox);
        }

        const el = document.createElement('gameface-checkbox');
        console.log('append custom el')
        document.body.appendChild(el);

        // document.body.insertBefore(el, document.body.firstElementChild);

        setTimeout(() => {
            done()
        }, 1000)
    });

    it('Should be rendered', () => {
        assert(document.querySelector('gameface-checkbox') !== 'null', 'Checkbox was not rendered.');
    });

    it('Should toggle state when it\'s clicked', () => {
        const checkbox = document.getElementsByTagName('gameface-checkbox')[0];
        click(checkbox);
        const checkMark = checkbox.querySelector('[data-name="check-mark"]');
        assert(checkMark.style.display === 'none', 'Check mark is not hidden when the checkbox is not selected.');
        click(checkbox);
        assert(checkMark.style.display === 'block', 'Check mark is not visible when the checkbox is selected.');
    });
});
