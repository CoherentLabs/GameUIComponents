/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

describe('Checkbox component', () => {
    beforeAll(() => {
        document.body.innerHTML = '<gameface-checkbox></gameface-checkbox>';
    });

    it('Should be rendered', () => {
        expect(document.querySelector('.checkbox-wrapper')).toBeTruthy();
    });

    it('Should toggle state when it\'s clicked', () => {
        const checkbox = document.getElementsByTagName('gameface-checkbox')[0];
        click(checkbox);
        const checkMark = checkbox.querySelector('[data-name="check-mark"]');
        expect(checkMark.style.display).toEqual('none');
        click(checkbox);
        expect(checkMark.style.display).toEqual('block');
    });
});
