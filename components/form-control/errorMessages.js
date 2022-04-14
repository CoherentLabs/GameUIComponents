export default new Map([
    ['notAForm', () => 'This element is not part of a form.'],
    ['tooLong', element => `The value is too long. Maximum length is ${element.getAttribute('maxlength')}.`],
    ['tooShort', element => `The value is too short. Minimal length is ${element.getAttribute('minlength')}.`],
    ['rangeOverflow', element => `The value is too big. Maximum is ${element.getAttribute('max')}.`],
    ['rangeUnderflow', element => `The value is too small. Minimum is ${element.getAttribute('min')}.`],
    ['valueMissing', () => 'The value is required.'],
    ['nameMissing', () => 'The elements does not have a name attribute and will not be submitted'],
    ['badURL', element => `Please enter a valid URL. It should match the following pattern: /${element.pattern || element.getAttribute('pattern')}/.`],
    ['badEmail', () => `Please enter a valid email. It should contain a @ symbol.`],
    ['customError', error => `The following error has ocurred: ${error}.`],
]);
