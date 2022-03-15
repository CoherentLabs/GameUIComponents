const textFieldErrorMessages = new Map([
    ['tooLong', 'The value is too long. Maximum length is 20.'],
    ['tooShort', 'The value is too short. Minimal length is 5.'],
    ['rangeOverflow', 'The value is too big. Maximum is 200.'],
    ['rangeUnderflow', 'The value is too small. Minimum is 15.'],
    ['badURL', 'Please enter a valid URL. It should match the following pattern: /https://.*/.'],
    ['badEmail', 'Please enter a valid email. It should contain a @ symbol.']
]);

const textFieldValidationTestTemplate = `<gameface-form-control style="position: absolute;top: 200px;">
    <gameface-text-field id="text" name="text" label="User name:" type="text" value="thisisvalid" minlength="5" maxlength="20"></gameface-text-field>
    <gameface-text-field id="url" name="url" pattern="https://.*" label="Website:" value="https://localhost:9090" type="url"></gameface-text-field>
    <gameface-text-field id="email" name="email" label="Email:" type="email" value="text-field@test.com"></gameface-text-field>
    <gameface-text-field id="number" name="number" label="Age:" type="number" min="15" max="200" step="10" value="30"></gameface-text-field>
    <button class="form-element" id="submit" type="submit">Login</button>
</gameface-form-control>`;


/**
 * @param {HTMLElement} element
 * @returns {string}
 */
function getTextContent(element) {
    return element.textContent.replace(/(\n)+/g, '').trim();
}

/**
 * @param {string} elSelector
 * @param {string} errorType
 * @param {string} value
 * @returns {Promise<void>}
 */
async function badTextFieldValueTest(elSelector, errorType, value) {
    const input = document.querySelector(elSelector);
    input.value = value;
    click(document.querySelector('#submit'));

    return createAsyncSpec(() => {
        const tooltip = document.querySelector('gameface-form-control').tooltip;
        assert(tooltip.style.display !== 'none', 'Tooltip was not displayed!');

        const expected = textFieldErrorMessages.get(errorType);
        const received = getTextContent(tooltip);
        tooltip.hide();
        assert(received === expected, `The error message is not correct. Expected: ${expected}. Received: ${received}.`);
    });
}

/**
 * @returns {Promise<void>}
 */
function setupTextValidationTestPage() {
    const el = document.createElement('div');
    el.innerHTML = textFieldValidationTestTemplate;
    el.className = 'text-field-validation-test-wrapper';

    const currentElement = document.querySelector('.text-field-validation-test-wrapper');

    if (currentElement) {
        currentElement.parentElement.removeChild(currentElement);
    }

    document.body.appendChild(el);

    return new Promise((resolve) => {
        waitForStyles(resolve);
    });
}

describe('Text field validation', () => {
    afterAll(() => {
        const tooltips = document.querySelectorAll('gameface-tooltip');
        for (let i = 0; i < tooltips.length; i++) {
            tooltips[i].parentElement.removeChild(tooltips[i]);
        }

        cleanTestPage('.text-field-validation-test-wrapper');
    });

    beforeEach(async function () {
        return setupTextValidationTestPage();
    });

    it('Should show value too short error', async () => {
        return badTextFieldValueTest('#text', 'tooShort', 'Nam');
    });

    it('Should show value too long error', async () => {
        return badTextFieldValueTest('#text', 'tooLong', 'Name is too long, can not be more');
    });

    it('Should show invalid URL error', async () => {
        return badTextFieldValueTest('#url', 'badURL', 'invalid');
    });

    it('Should show bad email error', async () => {
        return badTextFieldValueTest('#email', 'badEmail', 'invalidemail');
    });

    it('Should number too small error', async () => {
        return badTextFieldValueTest('#number', 'rangeUnderflow', '3');
    });

    it('Should number too big error', async () => {
        return badTextFieldValueTest('#number', 'rangeOverflow', '300');
    });
});
