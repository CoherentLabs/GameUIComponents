/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/


const multipleDropdownTemplate = `<gameface-dropdown multiple class="gameface-dropdown-component">
<dropdown-option slot="option">Cat</dropdown-option>
<dropdown-option slot="option">Parrot</dropdown-option>
<dropdown-option slot="option">Parrot1</dropdown-option>
<dropdown-option slot="option">Parrot</dropdown-option>
</gameface-dropdown>`;

const multipleDropdownCollapsableTemplate = `<gameface-dropdown multiple collapsable class="gameface-dropdown-component">
<dropdown-option slot="option">Cat</dropdown-option>
<dropdown-option slot="option">Parrot</dropdown-option>
<dropdown-option slot="option">Parrot1</dropdown-option>
<dropdown-option slot="option">Parrot</dropdown-option>
</gameface-dropdown>`;


function setupDropdownTestPage(template) {
    const currentElement = document.body.querySelector('gameface-dropdown');
    if (currentElement) {
        currentElement.parentElement.removeChild(currentElement);
    }

    document.body.innerHTML = template;

    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, 1000);
    });
}

function dispatchKeyboardEvent(keyCode, element) {
    element.dispatchEvent(new KeyboardEvent('keydown', { keyCode: keyCode }));
}

const expectedValues = ['Cat', 'Parrot', 'Parrot1'];
const expectedValuesAfterDeselect = ['Cat', 'Parrot'];



describe('Multiple Dropdown Component', () => {
    beforeAll(async () => {
        await setupDropdownTestPage(multipleDropdownTemplate);
    });

    it('Should have its options list expanded', () => {
        expect(document.querySelector('.options-container').classList.contains('hidden') === false).toBeTruthy();
    });

    it('Should select multiple elements', () => {
        const dropdown = document.querySelector('gameface-dropdown');
        const options = dropdown.querySelectorAll('dropdown-option');

        options[1].onClick({target: options[1], ctrlKey: true});
        options[2].onClick({target: options[2], ctrlKey: true});

        expect(dropdown.selectedOptions.length === 3).toBeTruthy();
    });
});

describe('Multiple Dropdown Component', () => {
    beforeAll(async () => {
        await setupDropdownTestPage(multipleDropdownTemplate);
    });

    it('Should deselect multiple elements', () => {
        const dropdown = document.querySelector('gameface-dropdown');
        const options = dropdown.querySelectorAll('dropdown-option');

        options[1].onClick({target: options[1], ctrlKey: true});
        options[2].onClick({target: options[2], ctrlKey: true});

        options[1].onClick({target: options[1], ctrlKey: true});
        options[2].onClick({target: options[2], ctrlKey: true});

        expect(dropdown.selectedOptions.length === 1).toBeTruthy();
    });
});

describe('Multiple Dropdown Component', () => {
    beforeAll(async () => {
        await setupDropdownTestPage(multipleDropdownTemplate);
    });

    it('Should select multiple elements and then select 1', () => {
        const dropdown = document.querySelector('gameface-dropdown');
        const options = dropdown.querySelectorAll('dropdown-option');

        options[1].onClick({target: options[1], ctrlKey: true});
        options[2].onClick({target: options[2], ctrlKey: true});
        options[3].onClick({target: options[2], ctrlKey: true});
        options[0].onClick({target: options[0]});

        expect(dropdown.selectedOptions.length === 1).toBeTruthy();
    });
});

describe('Multiple Dropdown Component', () => {
    beforeAll(async () => {
        await setupDropdownTestPage(multipleDropdownCollapsableTemplate);
    });

    it('Should hide the options list if it is collapsable', () => {
        const dropdown = document.querySelector('gameface-dropdown');
        const options = dropdown.querySelectorAll('dropdown-option');

        options[1].onClick({target: options[1], ctrlKey: true});
        click(document);

        expect(dropdown.querySelector('.options-container').classList.contains('hidden')).toBeTruthy();
    });
});