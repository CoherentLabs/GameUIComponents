<!--Copyright (c) Coherent Labs AD. All rights reserved. Licensed under the MIT License. See License.txt in the project root for license information. -->
The gameface-form-control is part of the Gameface custom components suite. As most of the components in this suite, it uses slots to allow dynamic content.

# Installation

`npm i coherent-gameface-form-control`

# Usage

The gameface-form-control component comes with UMD and CJS builds.

## Usage with UMD modules:

* import the components library:

```html
<script src="./node_modules/coherent-gameface-components/umd/components.production.min.js"></script>
```

* import the gameface-form-control component:

```html
<script src="./node_modules/coherent-gameface-form-control/umd/form-control.production.min.js"></script>
```

This is all! Load the file in Gameface to see the gameface-form-control.

```html
<gameface-form-control></gameface-form-control>
```

If you wish to import the modules using JavaScript you can replace the script tags
with import statements like this:

```javascript
import components from 'coherent-gameface-components';
import GamefaceFormControl from 'coherent-gameface-form-control';
```

Note that this approach requires a module bundler like [Webpack](https://webpack.js.org/) or [Rollup](https://rollupjs.org/guide/en/) to resolve the
modules from the node_modules folder. Alternatively, you can import them directly from node_modules:

```javascript
import components from './node_modules/coherent-gameface-components/umd/components.production.min.js';
import GamefaceFormControl from './node_modules/coherent-gameface-form-control/umd/form-control.production.min.js';
```

## Usage with CJS modules:

* Import the components library:

```javascript
const components = require('coherent-gameface-components');
const GamefaceFormControl = require('coherent-gameface-form-control');
```

The CommonJS(CJS) modules are used in a NodeJS environment, be sure to use a module
bundler to use them in a browser.

# Form control attributes

| Attribute | Required | Values        | Default value | Usage                                                                                                                                                                            |
| --------- | -------- | ------------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `method`  | Yes      | `GET`, `POST` | `GET`           | Used to specify the HTTP method that will be used to send data when the form is submitted. **If the attribute is not added or with no valid value the form won't be published.** |
| `action`  | No       | Any valid URL | `./`          | Used to specify where the form will send the data. **If the attribute is not added the data will be sent to the current page URL.**                                              |

### Examples

* `<gameface-form-control method="GET" action="http://localhost:12345/login"></gameface-form-control>` - Submitting this form will create a `GET` request with the form data and send it to the server that is available on `http://localhost:12345/login`.
* `<gameface-form-control method="POST"></gameface-form-control>` - Submitting this form will create a `POST` request with the form data and send it to the current page location.
* `<gameface-form-control></gameface-form-control>` - Submitting this form will produce a warning and the request will be aborted.

# Form control events

## Inline event handlers

| Event      | Value    | Usage                                                                                                                                         |
| ---------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `onload`   | Function | Will call the function that is added from the attribute's value when the form request has been completed, whether with success or not.             |
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

| Event     | Usage                                                                                           |
| --------- | ----------------------------------------------------------------------------------------------- |
| `loadend` | Will be triggered when the form request has completed, whether with success or not.             |
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
            <div class="checkbox-background"></div>
        </component-slot>
        <component-slot data-name="label">
            <span class="label">Music</span>
        </component-slot>
    </gameface-checkbox>
    <gameface-checkbox name="user-interests" value="coding">
        <component-slot data-name="checkbox-background">
            <div class="checkbox-background"></div>
        </component-slot>
        <component-slot data-name="label">
            <span class="label">Coding</span>
        </component-slot>
    </gameface-checkbox>
    <gameface-checkbox name="user-interests">
        <component-slot data-name="checkbox-background">
            <div class="checkbox-background"></div>
        </component-slot>
        <component-slot data-name="label">
            <span class="label">Nothing</span>
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
    <span class="label">Normal</span>
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
    <span class="label">Normal</span>
    <gameface-dropdown name="option1" class="gameface-dropdown-component" id="dropdown-default">
        <dropdown-option value="1" slot="option">One</dropdown-option>
        <dropdown-option value="2" slot="option">Two</dropdown-option>
    </gameface-dropdown>
    <span class="label">No values</span>
    <gameface-dropdown name="option2" class="gameface-dropdown-component" id="dropdown-default">
        <dropdown-option slot="option">One</dropdown-option>
        <dropdown-option slot="option">Two</dropdown-option>
    </gameface-dropdown>
    <button type="submit">Submit</button>
</gameface-form-control>
```

Clicking on the submit button will make a `POST` request to `http://localhost:3000/options` with body `{"option1":1,"option2":"One"}`.


# Validation

The form control supports validation. These are the attributes that you can use:


|Name|Purpose|Supported Elements|
|---|---|---|
| required | Used to indicate that a value is required. Will show an error if the element doesn't have value. | Input, Textarea, Checkbox, Switch, Radio Button | 
| minlength | Used to indicate the minimum length of a text field. | Input |
| maxlength | Used to indicate the minimum length of a text field.| Input |
| min | Used to indicate the minimum value of a number input | Input |
| max | Used to indicate the maximum value of a number input | Input |