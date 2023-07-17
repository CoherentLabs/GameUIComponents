/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export const SERVER_PORT = 12345;
export const RESPONSE_CONTAINER_ID = 'form-response';

export const formsIds = {
    LOGIN_FORM: 'login-form',
    REGISTER_FORM: 'register-form',
    PREVENT_SUBMIT_FORM: 'prevent-submit',
    CHECKBOXES_FORM: 'checkboxes-form',
    RADIO_FORM: 'radio-form',
    SWITCH_FORM: 'switch-form',
    DROPDOWN_FORM: 'dropdown-form',
};

export const FORM_ADDITIONAL_STYLES = `
body {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
}

.form-wrapper {
    margin: 5px;
    padding: 10px;
    width: 300px;
    border-width: 3px;
    border-style: solid;
    border-top-color: var(--default-color-blue);
    border-left-color: var(--default-color-blue);
    border-right-color: var(--default-color-blue);
    border-bottom-color: var(--default-color-blue);
    border-radius: 10px;
}

.form-element {
    margin-bottom: 5px;
}

.horizontal-rangeslider-wrapper {
    width: 80% !important;
    margin-left: 31px !important;
}

.selected {
    width: 100% !important;
}

.options-container {
    width: auto !important;
    height: auto !important;
}

.options,
.dropdown {
    width: 100% !important;
}

gameface-dropdown {
    width: 100% !important;
    left: 0 !important;
    top: 0 !important;
    margin-left: 0 !important;
}

.response {
    white-space: pre-wrap;
    overflow-wrap: break-word;
}`;

export const ERROR_MESSAGES = new Map([
    ['notAFormElement', 'This element is not part of a form.'],
    ['tooLong', 'The value is too long. Maximum length is 5.'],
    ['tooShort', 'The value is too short. Minimal length is 3.'],
    ['rangeOverflow', 'The value is too big. Maximum is 30.'],
    ['rangeUnderflow', 'The value is too small. Minimum is 10.'],
    ['valueMissing', 'The value is required.'],
    ['nameMissing', 'The elements does not have a name attribute and will not be submitted.'],
]);

export const SERVER_TIMEOUT = 5000;
