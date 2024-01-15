
const template = `<gameface-dropdown class="gameface-dropdown-component">
<dropdown-option slot="option">Cat</dropdown-option>
<dropdown-option slot="option">Dog</dropdown-option>
<dropdown-option slot="option">Giraffe</dropdown-option>
<dropdown-option slot="option">Lion</dropdown-option>
<dropdown-option slot="option" disabled>Pig</dropdown-option>
<dropdown-option slot="option">Eagle</dropdown-option>
<dropdown-option slot="option">Parrot</dropdown-option>
<dropdown-option slot="option">Last Parrot</dropdown-option>
</gameface-dropdown>`;

const dropdownSelector = '.dropdown-state-test-wrapper gameface-dropdown';

/**
 * Method initializing dropdown test page
 * @param {string} templateString
 * @returns {Promise<void>}
 */
function setupDropdownTestPage(templateString) {
    const el = document.createElement('div');
    el.className = 'dropdown-state-test-wrapper';
    el.innerHTML = templateString;

    document.body.appendChild(el);

    return new Promise((resolve) => {
        waitForStyles(resolve);
    });
}

// eslint-disable-next-line max-lines-per-function
describe('Dropdown State', () => {
    afterEach(() => {
        cleanTestPage('.dropdown-state-test-wrapper');
    });

    beforeEach(function (done) {
        setupDropdownTestPage(template).then(done).catch(err => console.error(err));
    });

    it('Should test disabled state of the dropdown', () => {
        // add disabled
        const dropdown = document.querySelector(dropdownSelector);
        dropdown.disabled = true;
        assert(dropdown.classList.contains('guic-dropdown-disabled') === true, 'Dropdown element is not disabled');
        assert(dropdown.disabled === true, 'Dropdown element is not disabled');

        // remove disabled
        dropdown.disabled = false;
        assert(dropdown.classList.contains('guic-dropdown-disabled') === false, 'Dropdown element is disabled');
        assert(dropdown.disabled === false, 'Dropdown element is disabled');
    });

    it('Should test collapsable state of the dropdown', () => {
        const dropdown = document.querySelector(dropdownSelector);

        dropdown.collapsable = true;
        assert(dropdown.querySelector('.guic-dropdown-header').style.display === 'flex', 'Element is not collapsable');
        assert(dropdown.collapsable === true, 'Element is not collapsable');

        dropdown.collapsable = false;
        assert(dropdown.querySelector('.guic-dropdown-header').style.display === 'none', 'Element is collapsable');
        assert(dropdown.collapsable === false, 'Element is collapsable');
    });

    it('Should test multiple state of the dropdown', async () => {
        const dropdown = document.querySelector(dropdownSelector);
        const options = dropdown.querySelectorAll('dropdown-option');

        dropdown.multiple = true;

        dropdown.onClickOption(mockEventObject(options[1], true, true));
        dropdown.onClickOption(mockEventObject(options[2], true, true));
        dropdown.onClickOption(mockEventObject(options[3], true, true));
        // length should be 4 because of the pre-selected option
        assert(dropdown.selectedList.length === 4, 'The dropdown did not select multiple options');
        assert(dropdown.multiple === true, 'The dropdown has no multiple select');

        dropdown.multiple = false;
        assert(dropdown.selectedList.length === 1, 'The dropdown did not select single option');
        assert(dropdown.multiple === false, 'The dropdown has multiple select');
    });

    it('Should test value state of the dropdown', () => {
        const SELECTED_VALUE = 'Giraffe';
        const dropdown = document.querySelector(dropdownSelector);
        const options = dropdown.querySelectorAll('dropdown-option');

        dropdown.value = SELECTED_VALUE;
        assert(options[2].className === 'guic-dropdown-option-active', `Option value was not ${options[2].value}`);
        assert(dropdown.value === SELECTED_VALUE, `Option value was not ${options[2].value}`);
    });

    it('Should test invalid value state of the dropdown', () => {
        const DEFAULT_SELECTED_VALUE = 'Cat';
        const dropdown = document.querySelector(dropdownSelector);
        const options = dropdown.querySelectorAll('dropdown-option');

        dropdown.value = 'invalid';
        assert(options[0].className === 'guic-dropdown-option-active', `Option '${DEFAULT_SELECTED_VALUE}' is not selected as default one.`);
        assert(dropdown.value === DEFAULT_SELECTED_VALUE, `Option value was not '${DEFAULT_SELECTED_VALUE}', it was ${dropdown.value}`);
    });
});
