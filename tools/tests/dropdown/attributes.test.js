
const attributesTemplate = `<gameface-dropdown class="gameface-dropdown-component">
<dropdown-option slot="option">Cat</dropdown-option>
<dropdown-option slot="option">Dog</dropdown-option>
<dropdown-option slot="option">Giraffe</dropdown-option>
<dropdown-option slot="option">Lion</dropdown-option>
<dropdown-option slot="option" disabled>Pig</dropdown-option>
<dropdown-option slot="option">Eagle</dropdown-option>
<dropdown-option slot="option">Parrot</dropdown-option>
<dropdown-option slot="option">Last Parrot</dropdown-option>
</gameface-dropdown>`;

const dropdownSelector = '.dropdown-attributes-test-wrapper gameface-dropdown';

/**
 * Method initializing dropdown test page
 * @param {string} templateString
 * @returns {Promise<void>}
 */
function setupDropdownAttributesTestPage(templateString) {
    const el = document.createElement('div');
    el.className = 'dropdown-attributes-test-wrapper';
    el.innerHTML = templateString;

    cleanTestPage('.dropdown-attributes-test-wrapper');

    document.body.appendChild(el);

    return new Promise((resolve) => {
        waitForStyles(resolve);
    });
}

// eslint-disable-next-line max-lines-per-function
describe('Dropdown Attributes', () => {
    afterAll(() => {
        cleanTestPage('.dropdown-attributes-test-wrapper');
    });

    beforeEach(function (done) {
        setupDropdownAttributesTestPage(attributesTemplate).then(done).catch(err => console.error(err));
    });

    it('Should add and remove disabled attribute', () => {
        // add disabled
        const dropdown = document.querySelector(dropdownSelector);
        dropdown.setAttribute('disabled', '');
        assert(dropdown.classList.contains('guic-dropdown-disabled') === true, 'Dropdown element is not disabled');

        // remove disabled
        dropdown.removeAttribute('disabled');
        assert(dropdown.classList.contains('guic-dropdown-disabled') === false, 'Dropdown element is disabled');
    });

    it('Should add and remove collapsable attribute', () => {
        const dropdown = document.querySelector(dropdownSelector);

        dropdown.setAttribute('collapsable', '');
        assert(dropdown.querySelector('.guic-dropdown-header').style.display === 'flex', 'Element is not collapsable');

        dropdown.removeAttribute('collapsable');
        assert(dropdown.querySelector('.guic-dropdown-header').style.display === 'none', 'Element is collapsable');
    });

    it('Should add and remove multiple attribute', async () => {
        const dropdown = document.querySelector(dropdownSelector);
        const options = dropdown.querySelectorAll('dropdown-option');

        dropdown.setAttribute('multiple', '');

        dropdown.onClickOption(mockEventObject(options[1], true, true));
        dropdown.onClickOption(mockEventObject(options[2], true, true));
        dropdown.onClickOption(mockEventObject(options[3], true, true));
        // length should be 4 because of the pre-selected option
        assert(dropdown.selectedList.length === 4, 'The dropdown did not select multiple options');
    });

    it('Should select and deselect an option using attributes', () => {
        const dropdown = document.querySelector(dropdownSelector);
        const options = dropdown.querySelectorAll('dropdown-option');

        options[2].setAttribute('selected', '');
        assert(options[2].classList.contains('guic-dropdown-option-active') === true, 'Option was not selected');

        options[2].removeAttribute('selected');
        assert(options[2].classList.contains('guic-dropdown-option-active') === false, 'Option was not deselected');
    });

    it('Should disable and enable an option using attributes', () => {
        const dropdown = document.querySelector(dropdownSelector);
        const options = dropdown.querySelectorAll('dropdown-option');

        options[2].setAttribute('disabled', '');
        assert(options[2].classList.contains('guic-dropdown-option-disabled') === true, 'Option was not disabled');

        options[2].removeAttribute('disabled');
        assert(options[2].classList.contains('guic-dropdown-option-disabled') === false, 'Option was disabled');
    });

    it('Should set value using attributes', () => {
        const dropdown = document.querySelector(dropdownSelector);
        const options = dropdown.querySelectorAll('dropdown-option');

        const textContent = options[2].textContent;
        options[2].setAttribute('value', 'Hello');
        assert(options[2].value === 'Hello', `Option value was not Hello, it was ${options[2].value}`);

        options[2].removeAttribute('value');
        assert(options[2].value === textContent, `Option value was not its text content (${textContent}), it was ${options[2].value}`);
    });
});
