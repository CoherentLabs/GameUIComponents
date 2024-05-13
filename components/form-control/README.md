<!--Copyright (c) Coherent Labs AD. All rights reserved. Licensed under the MIT License. See License.txt in the project root for license information. -->

<a href="https://www.npmjs.com/package/coherent-gameface-form-control"><img src="http://img.shields.io/npm/v/coherent-gameface-form-control.svg?style=flat-square"/></a>

The gameface-form-control is part of the Gameface custom components suite. As most of the components in this suite, it uses slots to allow dynamic content.

Installation
===================

```
npm i coherent-gameface-form-control
```

## Usage with UMD:

```html
<script src="./node_modules/coherent-gameface-form-control/dist/form-control.production.min.js"></script>
```

This is all! Load the file in Gameface to see the gameface-form-control.

```html
<gameface-form-control></gameface-form-control>
```

## Usage with JavaScript:

If you wish to import the GamefaceFormControl using JavaScript you can replace the script tag with import statements like this:

```javascript
import { GamefaceFormControl } from 'coherent-gameface-form-control';
```

or simply

~~~~{.js}
import 'coherent-gameface-form-control';
~~~~

Note that this approach requires a module bundler like [Webpack](https://webpack.js.org/) or [Rollup](https://rollupjs.org/guide/en/) to resolve the
modules from the node_modules folder.

# Form control attributes

| Attribute | Required | Values        | Default value | Usage                                                                                                                                                                            |
| --------- | -------- | ------------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `method`  | Yes      | `GET`, `POST` | `GET`         | Used to specify the HTTP method that will be used to send data when the form is submitted. **If the attribute is not added or with no valid value the form won't be published.** |
| `action`  | No       | Any valid URL | `./`          | Used to specify where the form will send the data. **If the attribute is not added the data will be sent to the current page URL.**                                              |

You can update the attributes using the [DOM APIs](https://developer.mozilla.org/en-US/docs/Web/API/Element/getAttribute):

```js
document.querySelector('gameface-form-control').setAttribute('<attribute>', '<value>');
```

Where \
`<attribute> ::= method | action`

### Examples

* `<gameface-form-control method="GET" action="http://localhost:12345/login"></gameface-form-control>` - Submitting this form will create a `GET` request with the form data and send it to the server that is available on `http://localhost:12345/login`.
* `<gameface-form-control method="POST"></gameface-form-control>` - Submitting this form will create a `POST` request with the form data and send it to the current page location.
* `<gameface-form-control></gameface-form-control>` - Submitting this form will produce a warning and the request will be aborted.

# Form control events

## Inline event handlers

| Event      | Value    | Usage                                                                                                                                          |
| ---------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `onload`   | Function | Will call the function that is added from the attribute's value when the form request has been completed, whether with success or not.         |
| `onsubmit` | Function | Will call the function that is added from the attribute's value when the form is submitted and right before the request is made to the server. |

### Examples

Let us have the following functions:

```javascript
function onRequestEnd(event) {
    console.log("Request response: ", event.detail.target.response)
}

function preventSubmit(event) {
    event.preventDefault();
}
```

* `<gameface-form-control onload="onRequestEnd(event)" method="GET" action="http://localhost:12345/login"></gameface-form-control>` - `onRequestEnd` will log the response from the request.
* `<gameface-form-control onsubmit="preventSubmit(event)" method="GET" action="http://localhost:12345/login"></gameface-form-control>` - `preventSubmit` will prevent form from making request to the server when the form is submitted.

## Event handlers

| Event     | Usage                                                                                            |
| --------- | ------------------------------------------------------------------------------------------------ |
| `loadend` | Will be triggered when the form request has completed, whether with success or not.              |
| `submit`  | Will be triggered when the form is submitted and right before the request is made to the server. |

### Examples

Let us have the following form - `<gameface-form-control id="form" method="GET" action="http://localhost:12345/login"></gameface-form-control>`.

* Log the response from the request.

```javascript
const form = document.getElementById('form');
form.addEventListener('loadend', (event)=>{
    console.log("Request response: ",event.detail.target.response)
});
```

* Prevent form from submitting.

```javascript
const form = document.getElementById('form');
form.addEventListener('submit', (event) => {
    event.preventDefault();
});
```

# Form control elements

## Input

### Text inputs

`<input>` element is supported from the gameface form control just when it is holding text values input with type `text`, `password`, `email`, etc.

The `name` attribute will be used to specify the form-data key and the `value` will be used to specify the form data value of the input.

### Submit input

So far Gameface does not support input elements with the type `submit` although they can be defined in the DOM.

The form control will treat these elements like submit buttons and when they are clicked the form will be submitted.

### Other inputs

Any other input elements with type `range`, `color`, `date`, etc. are not supported.

### Example

```html
<gameface-form-control method="GET" action="http://localhost:12345/login">
    <span>User name:</span>
    <input type="text" name="user" value="name"/>
    <span>Password:</span>
    <input type="password" name="password" value="pass"/>
    <input type="text" name="emptyInput"/>
    <input type="submit" name="submitButton" value="It is input not a button"/>
</gameface-form-control>
```

Clicking on the input with type `submit` will make a `GET` request to `http://localhost:12345/login?user=name&password=pass&submitButton=It+is+input+not+a+button`.

### Notes

* The data from `<input type="submit"/>` will be included in the request if this input is clicked.
* The **name** attribute is required if you want your input to be included in the form data on submitting!

## Select

Native `<select>` element is not supported by Gameface. However, there is a polyfill that transforms `<select>` into a working dropdown in the Gameface. That dropdown element - `<custom-select>` is supported by the form control component.

The polyfill is located inside the Gameface package - `Samples/uiresources/Dropdown`.

### Example

```html
<gameface-form-control method="GET" action="http://localhost:12345/">
    <span>Select city</span>
    <select name="city">
        <option id="Chongqing" name="Chongqing" value="Chongqing">Chongqing</option>
        <option id="Shanghai" name="Shanghai" value="Shanghai">Shanghai</option>
        <option id="Beijing" name="Beijing" value="Beijing">Beijing</option>
        <option id="Lagos" name="Lagos" value="Lagos">Lagos</option>
    </select>
</gameface-form-control>
<script src="Samples/uiresources/Dropdown/custom-select.js">
```

## Textarea

`<textarea>` element is supported from the gameface form control.

The `name` attribute is **required** if you want the value to be included in the form data on submit.

The `name` attribute will be used to specify the form-data key and the `value` will be used to specify the form data value of the input.

### Example

```html
<gameface-form-control method="POST" action="http://localhost:12345/register">
    <span>User info:</span>
    <textarea name="info">Default value</textarea>
    <span>Additional info:</span>
    <textarea name="moreInfo"></textarea>
    <button type="submit">Submit form</button>
</gameface-form-control>
```

Clicking on the button will make a `POST` request to `http://localhost:12345/register` with the body `{"info":"Default value"}`.
`moreInfo` won't be included in the request body if its value is empty.

## Button

`<button>` element is supported from the gameface form control.

To make a button that submits the form you need to add the `type="submit"` attribute to the button.

If a button has `name` and `value` attributes their values will be included in the form data on submit if this button is clicked.

### Example

```html
<gameface-form-control method="GET" action="http://localhost:12345/buttons">
    <button id="button-with-data" name="button" value="data" type="submit">Submit form</button>
    <button id="button-with-no-data" type="submit">Submit form</button>
</gameface-form-control>
```

* Clicking on the button with id `button-with-data` will make a `GET` request to `http://localhost:12345/buttons?button=data`.
* Clicking on the button with id `button-with-no-data` will make a `GET` request to `http://localhost:12345/buttons`.

## Gameface checkbox

`<gameface-checkbox>` is a gameface component that represents a checkbox and it is supported by the gameface form control.

The `name` attribute is required if you want the checkbox to be included in the form data when submitted.

The `value` attribute is not required but if it is empty and the checkbox is checked then the value will be - `on` by default.

If the checkbox is checked then its `name` and `value` will be included in the form data on submit and vice versa if not.

### Example

```html
<gameface-form-control action="http://localhost:3000/interests" method="GET">
    <gameface-checkbox name="user-interests" value="music">
        <component-slot data-name="checkbox-background">
            <div class="guic-checkbox-background"></div>
        </component-slot>
        <component-slot data-name="checkbox-label">
            <span class="guic-checkbox-label">Music</span>
        </component-slot>
    </gameface-checkbox>
    <gameface-checkbox name="user-interests" value="coding">
        <component-slot data-name="checkbox-background">
            <div class="guic-checkbox-background"></div>
        </component-slot>
        <component-slot data-name="checkbox-label">
            <span class="guic-checkbox-label">Coding</span>
        </component-slot>
    </gameface-checkbox>
    <gameface-checkbox name="user-interests">
        <component-slot data-name="checkbox-background">
            <div class="guic-checkbox-background"></div>
        </component-slot>
        <component-slot data-name="checkbox-label">
            <span class="guic-checkbox-label">Nothing</span>
        </component-slot>
    </gameface-checkbox>
    <button type="submit">Submit</button>
</gameface-form-control>
```

Clicking on the submit button will make a `GET` request to `http://localhost:3000/interests?user-interests=music&user-interests=coding&user-interests=on`.

Unchecking the `Nothing` and `Coding` checkboxes and then submitting the form will make a `GET` request to `http://localhost:3000/interests?user-interests=music`.

## Gameface radio group/button

`<gameface-radio-group>` is a gameface component that represents a group with radio buttons that lets the user choose one from all and it is supported by the gameface form control.

The `name` attribute is required if you want the radio group to be included in the form data when submitted.

The `value` attribute is not required for the radio-button element but if it is empty and the radio button is checked then the value will be - `on` by default.

### Example

```html
<gameface-form-control action="http://localhost:3000/options" method="POST">
    <span>Normal:</span>
    <gameface-radio-group name="option1">
        <radio-button checked value="1">1</radio-button>
        <radio-button value="2">2</radio-button>
        <radio-button value="3">3</radio-button>
    </gameface-radio-group>
    <span>No value:</span>
    <gameface-radio-group name="option2">
        <radio-button value="1">1</radio-button>
        <radio-button checked>2</radio-button>
        <radio-button value="3">3</radio-button>
    </gameface-radio-group>
    <button type="submit">Submit</button>
</gameface-form-control>
```

Clicking on the submit button will make a `POST` request to `http://localhost:3000/options` with body `{"option1":1,"option2":"on"}`.

## Gameface switch

`<gameface-switch>` is a gameface component that represents a switch toggle button that lets the uses enable/disable the option and it is supported by the gameface form control.

The `name` attribute is required if you want the switch to be included in the form data when submitted.

The `value` attribute is not required for the switch element but if it is empty and the switch is enabled then the value will be - `on` by default.

### Example

```html
<gameface-form-control action="http://localhost:3000/options" method="POST">
    <span class="guic-checkbox-label">Normal</span>
    <gameface-switch name="option1" value="checked" type="text-inside">
        <component-slot data-name="switch-unchecked">No</component-slot>
        <component-slot data-name="switch-checked">Yes</component-slot>
    </gameface-switch>
    <span>No value:</span>
    <gameface-switch name="option2" type="text-inside">
        <component-slot data-name="switch-unchecked">No</component-slot>
        <component-slot data-name="switch-checked">Yes</component-slot>
    </gameface-switch>
    <button type="submit">Submit</button>
</gameface-form-control>
```

Enable both switch buttons.

Clicking on the submit button will make a `POST` request to `http://localhost:3000/options` with body `{"option1":1,"option2":"on"}`.

## Gameface dropdown

`<gameface-dropdown>` is a gameface component that represents the native select menu and it is supported by the gameface form control.

The `name` attribute is required if you want the dropdown to be included in the form data when submitted.

The `value` attribute is not required for the dropdown option element but if it is empty and the options are selected then the value will be the text content of the option by default.

### Example

```html
<gameface-form-control action="http://localhost:3000/options" method="POST">
    <span class="guic-checkbox-label">Normal</span>
    <gameface-dropdown name="option1" class="gameface-dropdown-component" id="dropdown-default">
        <dropdown-option value="1" slot="option">One</dropdown-option>
        <dropdown-option value="2" slot="option">Two</dropdown-option>
    </gameface-dropdown>
    <span class="guic-checkbox-label">No values</span>
    <gameface-dropdown name="option2" class="gameface-dropdown-component" id="dropdown-default">
        <dropdown-option slot="option">One</dropdown-option>
        <dropdown-option slot="option">Two</dropdown-option>
    </gameface-dropdown>
    <button type="submit">Submit</button>
</gameface-form-control>
```

Clicking on the submit button will make a `POST` request to `http://localhost:3000/options` with body `{"option1":1,"option2":"One"}`.

## Text Field

`<gameface-text-field>` is a component that allows you to use a text input of different types - text, email, password, number, etc.
It supports validation. For example, if you create a text field with the type:
* email - the built-in validation will check if the value has a `@` symbol and it will show an error if does not.
* url - the built-in validation will check a **pattern** as an attribute to the text field and its value should match this pattern. For example if the **url** should match certain domain name - `<gameface-text-field type="url" pattern="mydomain.*">`.
* password - the built-in validation will check **length** through the `minlength` and `maxlength` attributes.
* number - the built-in validation will check `min` and `max` attributes.
* text, password, search - the built-in validation will check **length** through the `minlength` and `maxlength` attributes.

### Example

```html
<gameface-form-control style="position: absolute;top: 200px;">
    <gameface-text-field id="text" name="text" label="User name:" type="text" value="thisisvalid" minlength="5" maxlength="20"></gameface-text-field>
    <gameface-text-field id="url" name="url" pattern="https://.*" label="Website:" value="https://localhost:9090" type="url"></gameface-text-field>
    <gameface-text-field id="email" name="email" label="Email:" type="email" value="text-field@test.com"></gameface-text-field>
    <gameface-text-field id="number" name="number" label="Age:" type="number" min="15" max="200" step="10" value="30"></gameface-text-field>
    <button class="form-element" id="submit" type="submit">Login</button>
</gameface-form-control>
```
# Validation

The form control supports validation. These are the attributes that you can use:

| Name      | Purpose                                                                                          | Supported Elements                              |
| --------- | ------------------------------------------------------------------------------------------------ | ----------------------------------------------- |
| required  | Used to indicate that a value is required. Will show an error if the element doesn't have value. | Input, Textarea, Checkbox, Switch, Radio Button |
| minlength | Used to indicate the minimum length of a text field.                                             | Input                                           |
| maxlength | Used to indicate the minimum length of a text field.                                             | Input                                           |
| min       | Used to indicate the minimum value of a number input                                             | Input                                           |
| max       | Used to indicate the maximum value of a number input                                             | Input                                           |
| pattern   | Used to specify a url pattern.                                                                   | TextField[type="url"]                           |
| required  | Used to specify that the element must have value.                                                | All form supported elements                     |

# Custom validation

The form control component supports custom validation as well. Its purpose is to customize the default methods for validation, error messages, or where to show them. The default methods for validating form are stored in a map where each method has a default message defined for it. These methods are checking if a form element meets the requirements to be valid that are defined by the attributes above. Here is a table describing each method name, its error, and its relevant form element attribute.

| Default validator method name | Error message                                                                            | Corresponding attribute | Additional info                                                                              |
| ---------------------- | ---------------------------------------------------------------------------------------- | ----------------------- | -------------------------------------------------------------------------------------------- |
| `notAForm`             | `This element is not part of a form.`                                                    | N/A                     | This validator validates if the element is part of the form control.                         |
| `nameMissing`          | `The element does not have a name attribute and will not be submitted`                  | N/A                     | This validator validates if a form element has valid name attribute set.                     |
| `tooLong`              | `The value is too long. Maximum length is ${element.getAttribute('maxlength')}.`         | `maxlength`             |
| `tooShort`             | `The value is too short. Minimal length is ${element.getAttribute('minlength')}.`        | `minlength`             |
| `rangeOverflow`        | `The value is too big. Maximum is ${element.getAttribute('max')}.`                       | `max`                   |
| `rangeUnderflow`       | `The value is too small. Minimum is ${element.getAttribute('min')}.`                     | `min`                   |
| `valueMissing`         | `The value is required.`                                                                 | `required`              |
| `badURL`               | `Please enter a valid URL. It should match the following pattern: /${element.pattern}/.` | N/A                     | This validator validates `<gameface-text-field>` component's value when its type is `url`.   |
| `badEmail`             | `Please enter a valid email. It should contain a @ symbol.`                              | N/A                     | This validator validates `<gameface-text-field>` component's value when its type is `email`. |

As you can see some validators have error messages that include some properties from the validated element. That is because each validator dynamically constructs the error messages using the currently validated form element.
## Custom form validation methods

`<gameface-form-control>` component has some methods for making custom validation possible.

| Method                             | Arguments                                      | Description                                                                                                                                                                                                             |
| ---------------------------------- | ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `setCustomValidators`              | `(name: string, validators: ValidatorsConfig)` | Will set custom defined validators related to the form elements with the corresponding `name` attribute.                                                                                                                |
| `removeCustomValidator`            | `(name: string)`                               | Will remove any custom validators related to the form element with the corresponding `name` attribute.                                                                                                                  |
| `removeCustomValidators`           | `(names: string[])`                            | Same as the `removeCustomValidator` but works with multiple `names`.                                                                                                                                                    |
| `setCustomDisplayErrorElement`     | `(name: string, selector: string)`             | Will change the default behavior of showing error messages. The `name` argument specifies the form element that will be modified. The `selector` specifies the element in which the error will be displayed. |
| `removeCustomDisplayErrorElement`  | `(name: string)`                               | Remove the custom error message element previously added using `setCustomDisplayErrorElement`. The `name` argument specifies the form element. The default tooltip will be used instead for displaying errors.              |
| `removeCustomDisplayErrorElements` | `(names: string[])`                            | Same as the `removeCustomDisplayErrorElement` method but works with multiple `names`.                                                                                                                                   |

## ValidatorsConfig

It is an object that has the following type:

```typescript
interface ValidatorsConfig {
    [ValidatorName: string]: {
        method?: (element: HTMLElement) => boolean | Promise<boolean>
        errorMessage?: (element: HTMLElement) => string
    }
}
```

With the `ValidatorName` key you define your custom validator name or you can use some of the default validator names to overwrite their behavior.

`method` is the function that is used to tell the form component if the currently validated element is valid. It receives that element and should return a boolean with the result about the validity of the element. You can use the **async** function to define the `method` property. To overwrite the default validators use `ValidatorName` that has the same name as the one you wish to change:

```javascript
form.setCustomValidators('username', {
    valueMissing: { // will use this one, no the default
        method: (element) => !element.value,
        errorMessage: () => 'The username is required! '
    }
})
```

`errorMessage` is the function that constructs the message if the validation of the form element fails. It receives that element so you can extract its attributes and return a more specific error message. The function should return a string. If this property is added to `ValidatorName` that is some of the default ones will overwrite the default validation message.

```javascript
form.setCustomValidators('username', {
    valueMissing: { 
        errorMessage: () => 'The username is required! ' // will use this error message, not the default that is "The value is required."
    }
})
```

## Example

Let us have the following form defined
```html
<gameface-form-control id="custom-validation-form">
    <gameface-text-field name="username" label="User name:" type="text" minlength="5" maxlength="20"></gameface-text-field>
    <span id="username-error"></span>
    <gameface-text-field name="url" label="Website:" type="url"></gameface-text-field>
    <gameface-text-field name="email" label="Email:" type="email"></gameface-text-field>
    <button class="form-element" type="submit">Register</button>
</gameface-form-control>
```

As you can see some attributes are used to validate the user name. The url and email will be validated by default.
We can add our custom validators using the methods exposed in the `gameface-form-control` component. **Note: Custom validation should be added after the form control bundle is added to the page.**

```javascript
// Custom validators should be set after the components library is added!

const form = document.getElementById('custom-validation-form');

let serverError = false, serverNotReachable = false;
//Will set custom validators for the form element with name attribute that has value - "username"
form.setCustomValidators('username', {
    //There is no required attribute to the form element so we can add validation about it here
    valueMissing: {
        method: (element) => !element.value,
        errorMessage: () => 'The username is required! '
    },
    //We can change the default message on the 'tooShort' preset validator
    tooShort: { errorMessage: (element) => `The username should have more than ${element.getAttribute('minlength')} symbols typed! `},
    //Async validator that checks if the user is already added to the database by making a request to the server
    usernameExists: {
        method: async (element) => {
            if (!element.value) return false;

            serverError = false;
            serverNotReachable = false;
            return new Promise((resolve) => {
                const xhr = new XMLHttpRequest();
                xhr.open('GET', `http://localhost:3000/user-exists?username=${element.value}`);
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                xhr.onload = (event) => resolve(event.target.response === 'true');
                xhr.onerror = () => {
                    serverError = true;
                    return resolve(true)
                }
                xhr.timeout = 1000;
                xhr.ontimeout = () => {
                    serverNotReachable = true;
                    return resolve(true)
                }
                xhr.send();
            })
        },
        errorMessage: (element) => {
            if (serverNotReachable) return 'Unable to reach the server! ';
            if (serverError) return 'Unable to reach the server due an error! ';

            return `"${element.value}" already used! Please use another one! `;
        }
    }
});
//By default the error will be visible in a tooltip displayed next to the form element
//We can change that behavior for the user name by selecting another element for this purpose
form.setCustomDisplayErrorElement('username', '#username-error');

//We can set a custom validation of the form element with a custom method and a message
form.setCustomValidators('url', {
    notStartingWithHttpProtocol: {
        method: (element) => !element.value.startsWith('http://') && !element.value.startsWith('https://'),
        errorMessage: () => 'The url should start with "http://" or "https://"!'
    }
});

form.setCustomValidators('email', {
    //We can remove the preset error message if the preset validator for email fails
    //That will also remove the tooltip because no error messages should be visible even if the check fails
    badEmail: {
        errorMessage: () => ''
    }
});
```

# Accessing the XMLHttpRequest

An XMLHttpRequest is created when a form is submitted. It is helpful to access this XHR in case you need to check the status of the request, the response, or if you want to do something on success/error. You can access this request through the properties of the form control:

```html
<gameface-form-control id="my-form" action="http://localhost:3000/options" method="POST">
    <input type="text" name="user" value="name" />
    <button type="submit">Submit</button>
</gameface-form-control>
```

```js

const form = document.getElementById('my-form');
const xhr = form.xhr;

xhr.addEventListener('progress', () => console.log('onProgress'));
xhr.addEventListener('load', () => console.log('load'));
xhr.addEventListener('error', () => console.log('error'));
xhr.addEventListener('abort', () => console.log('abort'));
```
