export default new Map([
    ['notAForm', () =>'This element is not part of a form.'],
    ['tooLong', (element) => `The value is too long. Maximum length is ${element.getAttribute('maxlength')}.`],
    ['tooShort', (element) => `The value is too short. Minimal length is ${element.getAttribute('minlength')}.`],
    ['rangeOverflow', (element) => `The value is too big. Maximum is ${element.getAttribute('max')}.`],
    ['rangeUnderflow', (element) => `The value is too small. Minimum is ${element.getAttribute('min')}.`],
    ['valueMissing', () => 'The value is required.'],
    ['nameMissing', () => 'The elements does not have a name attribute and will not be submitted'],
    ['customError', (error) => `The following error has ocurred: ${error}.`]
]);