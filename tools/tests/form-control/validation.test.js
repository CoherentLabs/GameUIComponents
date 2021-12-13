/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

const errorMessages = new Map([
    ['notAFormElement', 'This element is not part of a form.'],
    ['tooLong', 'The value is too long. Maximum length is 5.'],
    ['tooShort', 'The value is too short. Minimal length is 3.'],
    ['rangeOverflow', 'The value is too big. Maximum is 30.'],
    ['rangeUnderflow', 'The value is too small. Minimum is 10.'],
    ['valueMissing', 'The value is required.'],
    ['nameMissing', 'The elements does not have a name attribute and will not be submitted.'],
]);


function getTextContent(element) {
    return element.textContent.replace(/(\n)+/g, '').trim();
}

async function badValueTest(elSelector, errorType, value) {
    const input = document.querySelector(elSelector);
    input.value = value;

    click(document.querySelector('#submit'));

    return createAsyncSpec(() => {
        const tooltip = document.querySelector('gameface-form-control').tooltip;
        assert(tooltip.style.display !== 'none', 'Tooltip was not displayed!');

        const expected = errorMessages.get(errorType);
        const received = getTextContent(tooltip);
        tooltip.hide();
        assert(received === expected, `The error message is not correct. Expected: ${expected}. Received: ${received}.`);
    });
}


function setupFormValidationTestPage() {
    const template = `
    <gameface-form-control>
        <input id="role" name="role" value="some name" required />
        <input minlength="3" maxlength="5" name="username" value="Valid" type="text" id="username" />
        <input type="number" min="10" max="30" value="15" name="age" type="text" id="age" />
        <input type="text" value="missing name" id="no-name" />
        <button class="form-element" id="submit" type="submit">Login</button>
    </gameface-form-control>
    `;

    const el = document.createElement('div');
    el.innerHTML = template;
    el.className = 'form-validation-test-wrapper';
    el.style.position = 'absolute';
    el.style.top = '200px';
    el.style.left = '200px';

    let currentElement = document.querySelector('.form-validation-test-wrapper');

    if (currentElement) {
        currentElement.parentElement.removeChild(currentElement);
    }

    document.body.appendChild(el);

    return new Promise(resolve => {
        waitForStyles(resolve);
    });
}


describe('Form validation', () => {
    afterAll(() => {
        const tooltips = document.querySelectorAll('gameface-tooltip');
        for(let i = 0; i < tooltips.length; i++) {
            tooltips[i].parentElement.removeChild(tooltips[i]);
        }

        let currentElement = document.querySelector('.form-validation-test-wrapper');

        if (currentElement) {
            currentElement.parentElement.removeChild(currentElement);
        }
    });

    beforeEach(function (done) {
        setupFormValidationTestPage().then(done);
    });

    it('Should show value missing error', async() => {
        return badValueTest('#role', 'valueMissing', '');
    });

    it('Should show value too long error', async() => {
        return badValueTest('#username', 'tooLong', 'This is too long');
    });

    it('Should show value too short error', async() => {
        return badValueTest('#username', 'tooShort', 'Th');
    });

    it('Should show value too small - range underflow.', async() => {
        return badValueTest('#age', 'rangeUnderflow', 5);
    });

    it('Should show value too big - range overflow.', async() => {
        return badValueTest('#age', 'rangeOverflow', 40);
    });

    it('Should not validate elements that do not have name.', async() => {
        const input = document.querySelector('#no-name');
        input.value = '20';

        click(document.querySelector('#submit'));

        return createAsyncSpec(() => {
            const tooltip = document.querySelector('gameface-form-control').tooltip;
            assert(tooltip === undefined, 'Tooltip should be displayed!');
        });
    });
});
