import { CustomElementValidator, NativeElementValidator} from 'coherent-gameface-components';

function valid(element) {
    const hasError = !element.isFormElement() || element.tooLong() ||
        element.tooShort() && element.valueMissing() && element.nameMissing() &&
        element.customError();

        return !hasError;
}

function validateElement(element) {
    if (!(element instanceof CustomElementValidator)) element = new NativeElementValidator(element);

    return valid(element);
}

// function hasValidationErrors(element) {
//     const validationResults = !validateElement(element);
//     const errors = [];

//     for (let errorType of Object.keys(validationResults)) {
//         if(validationResults[errorType]) result.errors.push(errorType);
//     }

//     return errors.length ? {element: element, errors: errors} : false;
// };

function validate(formElements) {
    const invalidElements = [];

    formElements.forEach(el => {
        const validationErrors = valid(el);
        if (validationErrors) invalidElements.push(validationErrors);
    });
}

/**
 * Handles error. Show tooltip and add error style.
 * Allow customization to make COH-15431 easier
 * 
 * @param {CustomErrorConfig} config? - a list of properties that can customize the error feedback
 * @param {HTMLElement} - the element which has to show the error
*/
function onError(config) {}


export {
    validate,
    validateElement
}