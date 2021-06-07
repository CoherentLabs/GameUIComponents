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


function setupMultipleDropdownTestPage(template) {
    const el = document.createElement('div');
    el.className = 'multiple-dropdown-test-wrapper';
    el.innerHTML = template;

    const currentElement = document.body.querySelector('.multiple-dropdown-test-wrapper');
    if (currentElement) {
        currentElement.parentElement.removeChild(currentElement);
    }

    document.body.appendChild(el);

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



describe('Multiple Dropdown Test', () => {
    afterAll(() => {
        const currentElement = document.querySelector('.multiple-dropdown-test-wrapper');

        if (currentElement) {
            currentElement.parentElement.removeChild(currentElement);
        }
    });

    describe('Multiple Dropdown Component', () => {
        beforeEach(function (done) {
            setupMultipleDropdownTestPage(multipleDropdownTemplate).then(done).catch(err => console.error(err));
        });

        it('Should have its options list expanded', () => {
            assert(document.querySelector('.options-container').classList.contains('hidden') === false,
                'Options container is not hidden.');
        });

        it('Should select multiple elements', () => {
            const dropdownWrapper = document.querySelector('.multiple-dropdown-test-wrapper');
            const dropdown = dropdownWrapper.querySelector('gameface-dropdown');
            const options = dropdown.querySelectorAll('dropdown-option');

            options[1].onClick({ target: options[1], ctrlKey: true });
            options[2].onClick({ target: options[2], ctrlKey: true });

            assert(dropdown.selectedOptions.length === 3,
                `Expected selected options length to be 3, got ${dropdown.selectedOptions.length}.`);
        });
    });

    describe('Multiple Dropdown Component', () => {
        beforeEach(function (done) {
            setupMultipleDropdownTestPage(multipleDropdownTemplate).then(done).catch(err => console.error(err));
        });

        it('Should deselect multiple elements', () => {
            const dropdownWrapper = document.querySelector('.multiple-dropdown-test-wrapper');
            const dropdown = dropdownWrapper.querySelector('gameface-dropdown');
            const options = dropdown.querySelectorAll('dropdown-option');

            options[1].onClick({ target: options[1], ctrlKey: true });
            options[2].onClick({ target: options[2], ctrlKey: true });

            options[1].onClick({ target: options[1], ctrlKey: true });
            options[2].onClick({ target: options[2], ctrlKey: true });

            assert(dropdown.selectedOptions.length === 1,
                `It didn't select only one element. Expected selected options length to be 1, got ${dropdown.selectedOptions.length}.`);
        });
    });

    describe('Multiple Dropdown Component', () => {
        beforeEach(function (done) {
            setupMultipleDropdownTestPage(multipleDropdownTemplate).then(done).catch(err => console.error(err));
        });

        it('Should select multiple elements and then select 1', () => {
            const dropdownWrapper = document.querySelector('.multiple-dropdown-test-wrapper');
            const dropdown = dropdownWrapper.querySelector('gameface-dropdown');
            const options = dropdown.querySelectorAll('dropdown-option');

            options[1].onClick({ target: options[1], ctrlKey: true });
            options[2].onClick({ target: options[2], ctrlKey: true });
            options[3].onClick({ target: options[2], ctrlKey: true });
            options[0].onClick({ target: options[0] });

            assert(dropdown.selectedOptions.length === 1,
                `It didn't select only one element. Expected selected options length to be 1, got ${dropdown.selectedOptions.length}.`);
        });
    });

    describe('Multiple Dropdown Component', () => {
        beforeEach(function (done) {
            setupMultipleDropdownTestPage(multipleDropdownCollapsableTemplate).then(done).catch(err => console.error(err));
        });

        it('Should hide the options list if it is collapsable', function () {
            const dropdownWrapper = document.querySelector('.multiple-dropdown-test-wrapper');
            const dropdown = dropdownWrapper.querySelector('gameface-dropdown');
            const options = dropdown.querySelectorAll('dropdown-option');

            options[1].onClick({ target: options[1], ctrlKey: true });

            click(document);
            assert(dropdown.querySelector('.options-container').classList.contains('hidden') === true,
                `Options container is not hidden.`);
        });
    });
});