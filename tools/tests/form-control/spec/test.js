/* eslint-disable linebreak-style */
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { LOGIN_TEMPLATE, REGISTER_TEMPLATE, PREVENT_SUBMIT_TEMPLATE, CHECKBOXES_TEMPLATE, RADIO_TEMPLATE, SWITCH_TEMPLATE, DROPDOWN_TEMPLATE } from '../utils/templates';
import { formsIds, FORM_ADDITIONAL_STYLES, RESPONSE_CONTAINER_ID } from '../utils/constants';
import { submitForm, checkResponseData } from '../utils/actions';

export const formsTestNames = {
    LOGIN_FORM: 'Login form',
    REGISTER_FORM: 'Register form',
    PREVENT_SUBMIT_FORM: 'Prevent form from submiting',
    CHECKBOXES_FORM: 'Checkbox cases form',
    RADIO_FORM: 'Radio cases form',
    SWITCH_FORM: 'Switch cases form',
    DROPDOWN_FORM: 'Dropdown cases form',
};

const forms = [
    {
        testName: formsTestNames.LOGIN_FORM,
        id: formsIds.LOGIN_FORM,
        submitData: '{"username":"name","password":"pass","poll":"cats"}',
        submitDataInteraction: '{"username":"name","password":"pass","poll":"dogs"}',
        template: LOGIN_TEMPLATE,
    },
    {
        testName: formsTestNames.REGISTER_FORM,
        id: formsIds.REGISTER_FORM,
        submitData: '{"username":"name","password":"password","info":"user info","gender":"male","user-interests":["music","coding"],"skill-level":"Beginner"}',
        submitDataInteraction: '{"username":"name","password":"password","info":"user info","gender":"female","user-interests":"coding","skill-level":"Expert"}',
        template: REGISTER_TEMPLATE,
    },
    {
        testName: formsTestNames.PREVENT_SUBMIT_FORM,
        id: formsIds.PREVENT_SUBMIT_FORM,
        shouldPreventSubmit: true,
        submitData: 'Prevented default',
        template: PREVENT_SUBMIT_TEMPLATE,
    },
    {
        testName: formsTestNames.CHECKBOXES_FORM,
        id: formsIds.CHECKBOXES_FORM,
        submitData: '{"user-interests":["music","on"]}',
        submitDataInteraction: '{}',
        template: CHECKBOXES_TEMPLATE,
    },
    {
        testName: formsTestNames.RADIO_FORM,
        id: formsIds.RADIO_FORM,
        submitData: '{"option1":"1","option3":"on","option5":"3"}',
        submitDataInteraction: '{"option1":"2","option3":"on","option5":"3"}',
        template: RADIO_TEMPLATE,
    },
    {
        testName: formsTestNames.SWITCH_FORM,
        id: formsIds.SWITCH_FORM,
        submitData: '{}',
        submitDataInteraction: '{"option1":"option1-checked","option3":"on"}',
        template: SWITCH_TEMPLATE,
    },
    {
        testName: formsTestNames.DROPDOWN_FORM,
        id: formsIds.DROPDOWN_FORM,
        submitData: '{"option1":"1","option2":"Two","option4":"Two","option5":["Two","3"]}',
        // Expected options will change when the caching feature is reworked or removed.
        submitDataInteraction: '{"option1":"2","option2":"Two","option4":"Two","option5":"3"}',
        template: DROPDOWN_TEMPLATE,
    }
];

/**
 * Will setup the form control test page based on the form data
 * @param {Object} formData
 */
async function setupFormControlPage(formData) {
    const el = document.createElement('div');
    el.className = 'test-wrapper';
    el.innerHTML = formData.template;

    cleanTestPage('.test-wrapper');
    document.body.appendChild(el);

    // the .items setter triggers a DOM change, so we wait a bit to make
    // sure the DOM is ready.
    await createAsyncSpec();

    const formElement = document.getElementById(formData.id);

    formElement.addEventListener('loadend', (event) => {
        document.getElementById(RESPONSE_CONTAINER_ID).textContent = event.detail.target.response;
    });

    if (formData.shouldPreventSubmit) {
        formElement.addEventListener('submit', (event) => {
            event.preventDefault();
            document.getElementById(RESPONSE_CONTAINER_ID).textContent = 'Prevented default';
        });
    }
}

/**
 * Will set up all the form test cases
 */
function setFormsTestCases() {
    for (const formData of forms) {
        describe(formData.testName, () => {
            beforeAll(function (done) {
                setupFormControlPage(formData).then(done).catch(err => console.error(err));
            });

            it('Should be created', () => {
                assert(document.querySelector('gameface-form-control').id === formData.id, `The id of the form is not ${formData.id}.`);
            });

            it('Should be submitted', async () => {
                const waitForServerResponse = formData.shouldPreventSubmit ? false : true;
                await submitForm(document.querySelector('gameface-form-control'), waitForServerResponse);
                await checkResponseData(formData.submitData);
            });
        });
    }
}

/* eslint-disable max-lines-per-function */
/**
 * Will set up all the form test cases with interaction
 */
function setFormTestCasesWithInteraction() {
    for (const formData of forms) {
        if (!formData.submitDataInteraction) continue; // Skipping PREVENT_SUBMIT_FORM

        const formTestName = formData.testName;

        describe(formTestName, () => {
            beforeAll(function (done) {
                setupFormControlPage(formData).then(done).catch(err => console.error(err));
            });

            it('Should be created', () => {
                assert(document.querySelector('gameface-form-control').id === formData.id, `The id of the form is not ${formData.id}.`);
            });

            it('Should be interacted, submitted and form data should be as expected.', async () => {
                // Interact with elements
                switch (formTestName) {
                    case formsTestNames.LOGIN_FORM:
                        click(document.querySelectorAll('dropdown-option')[1]);
                        break;
                    case formsTestNames.REGISTER_FORM:
                        click(document.querySelectorAll('radio-button')[1]);
                        click(document.querySelector('gameface-checkbox'));
                        const rangeslider = document.querySelector('gameface-rangeslider');
                        const { x, width } = document.querySelector('.guic-horizontal-rangeslider').getBoundingClientRect();
                        rangeslider.onMouseDown({ clientX: x + width });
                        break;
                    case formsTestNames.CHECKBOXES_FORM:
                        const checkboxes = Array.from(document.querySelectorAll('gameface-checkbox'));
                        checkboxes.forEach(checkbox => click(checkbox));
                        break;
                    case formsTestNames.RADIO_FORM:
                        click(document.querySelectorAll('radio-button')[1]);
                        break;
                    case formsTestNames.SWITCH_FORM:
                        const switches = Array.from(document.querySelectorAll('gameface-switch'));
                        switches.forEach(switchElement => switchElement.onClick());
                        break;
                    case formsTestNames.DROPDOWN_FORM:
                        const dropdowns = document.querySelectorAll('gameface-dropdown');
                        const multipleSelectOptionTwo = dropdowns[4].querySelectorAll('dropdown-option')[1];

                        // Skips the last multiple selection dropdown which is tested after the for loop.
                        for (let i = 0; i < dropdowns.length - 1; i++) {
                            click(dropdowns[i].querySelectorAll('dropdown-option')[1]);
                        }
                        multipleSelectOptionTwo.onClick({ target: multipleSelectOptionTwo, ctrlKey: true });
                        break;
                }

                // Submit
                await submitForm(document.querySelector('gameface-form-control'));
                await checkResponseData(formData.submitDataInteraction);
            });
        });
    }
}

/* eslint-enable max-lines-per-function */

describe('Form control Tests', () => {
    beforeAll(() => {
        const head = document.head || document.getElementsByTagName('head')[0];
        const style = document.createElement('style');

        head.appendChild(style);
        style.appendChild(document.createTextNode(FORM_ADDITIONAL_STYLES));
    });

    afterAll(() => cleanTestPage('.test-wrapper'));

    setFormsTestCases();
    setFormTestCasesWithInteraction();
});
