<!--Copyright (c) Coherent Labs AD. All rights reserved. Licensed under the MIT License. See License.txt in the project root for license information. -->

<a href="https://www.npmjs.com/package/coherent-gameface-text-field"><img src="http://img.shields.io/npm/v/coherent-gameface-text-field.svg?style=flat-square"/></a>

The gameface-text-field is part of the Gameface custom components suite. As most of the components in this suite, it uses slots to allow dynamic content.

Installation
===================

```
npm i coherent-gameface-text-field
```

## Usage with UMD:

```html
<script src="./node_modules/coherent-gameface-text-field/dist/text-field.production.min.js"></script>
```

* add the gameface-text-field component to your HTML:

```html
<gameface-text-field type="text"></gameface-text-field>
```

This is all! Load the file in Gameface to see the text field.

## Usage with JavaScript:

If you wish to import the TextField using JavaScript you can remove the script tag and import it like this:

```javascript
import { TextField } from 'coherent-gameface-text-field';
```

or simply

~~~~{.js}
import 'coherent-gameface-text-field';
~~~~

Note that this approach requires a module bundler like [Webpack](https://webpack.js.org/) or [Rollup](https://rollupjs.org/guide/en/) to resolve the
modules from the node_modules folder.

# Text field attributes

Attributes are used for configuration when the `gameface-text-field` component is initialized like `<gameface-text-field type="password"></gameface-text-field>` that will display text field for typing a password inside.

## Common attributes

| Attribute                | Required | Accepted values                                        | Default value | Usage                                                                                                                       |
| ------------------------ | -------- | ------------------------------------------------------ | ------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `type`                   | No       | `text`, `password`, `email`, `number`, `search`, `url` | `text`        | Used to specify the text field type. More about the text field type you can check in the next [section](#text-field-types). |
| `value`                  | No       | Strings                                                | `''`          | Used to specify the default value of the text field.                                                                        |
| `disabled`               | No       | N/A                                                    | N/A           | Used to specify if the text field is disabled. If it is then its `value` could not be selected or edited.                   |
| `readonly`               | No       | N/A                                                    | N/A           | Used to specify if the text field is read only. If it is then its `value` could not be edited but can be selected.          |
| `label`                  | No       | Strings                                                | `''`          | Used to specify the label of the text field.                                                                                |
| `placeholder`            | No       | Strings                                                | `''`          | Used to specify the placeholder of the text field that will be displayed when the value is empty.                           |
| `control-disabled` | No       | N/А                                                    | N/A           | Used to specify hide the control when the type of the text field is `search` or `number`.                                   |

### v.3.1.0

**`text-field-control-disabled` attribute has been changed to `control-disabled`.**

## Text type related attributes

The next attributes are working with all the `<gameface-text-field>` types **without** the `number` type.

| Attribute   | Required | Accepted values                | Default value | Usage                                                                     |
| ----------- | -------- | ------------------------------ | ------------- | ------------------------------------------------------------------------- |
| `maxlength` | No       | Strings that are valid numbers | N/A           | Used to specify the maximum symbols from the text field the can be typed. |
| `minlength` | No       | Strings that are valid numbers | N/A           | Used to specify the minimum symbols from the text field the can be typed. |

## Number type related attributes

The next attributes are working just when the `gameface-text-field` type is `number`.

| Attribute | Required | Accepted values                | Default value | Usage                                                                                                                               |
| --------- | -------- | ------------------------------ | ------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `min`     | No       | Strings that are valid numbers | N/A           | Used to specify the numerical lower limit of the text field. **The number control won't overstep the lower limit when it is used.** |
| `max`     | No       | Strings that are valid numbers | N/A           | Used to specify the numerical upper limit of the text field. **The number control won't overstep the upper limit when it is used.** |
| `step`    | No       | Strings that are valid numbers | 1             | Used to specify the step of the text field that will be done when the number control is used.                                       |

# Text field types

The type of the text field is defined by the `type` attribute.

* `text` - The text field will accept any string input.
* `password` - The text field will accept any string input but it will be masked with the `*` character.
* `email` - The text field will accept any string input. When the text field is used inside a `gameface-form-control` component it will be validated on submit if its value is a valid email (a string that includes the `@` symbol).
* `url` - The text field will accept any string input. When the text field is used inside a `gameface-form-control` component it will be validated on submit if its value is a valid url.
* `search` - The text field will accept any string input. The text field will display additional control (cross button) that can be used to clear the input value.
* `number` - The text field will accept any number input. The text field will display additional control (arrow up and down) that can be used to increase/decrease the value with the `step` specified. By default, the arrows will change the value with `step` that is `1`. **The number type does not support the `e` symbol!**

# Input events to a gameface text input

You can add input specific events directly to the `gameface-text-field` element like `input`, `change`, `focus`, `blur` by the `addEventListener` interface.

# Change gameface text field attributes runtime

You can change all the attributes from the tables above ([common attributes](#common-attributes), [text type related attributes](#text-type-related-attributes), [number type related attributes](#number-type-related-attributes)) runtime and they will take effect over the text-field behavior.
For example you can change the type of the text-field via the `type` attribute value:

```javascript
const textField = document.querySelector('gameface-text-field');
textField.setAttribute('type', 'number');
textField.setAttribute('value', '10'); // You can also set a new value of the text-field like this.
```

# Change gameface text field properties programmatically

To change runtime the type of the text field for example you can:

1. Get the text field element like `const textField = document.querySelector('gameface-text-field')`.
2. Change the type like `textField.type = 'password'`.

All the available properties that can be changed runtime are:

* `type` - will change the text field's type. `textField.type = 'number'`.
* `value` - will change the text field's value. `textField.value = 'some different value'`.
* `disabled` - will enable/disable the text field. `textField.disabled = true` will disable the field and `textField.disabled = false` will enable it again.
* `readonly` - will make the text field readonly. `textField.readonly = true` will make the field readonly and `textField.readonly = false` will enable it again.
* `label` - will change the text field's label. `textField.label = 'User name:'`.
* `placeholder` - will change the text field's placeholder. `textField.placeholder = 'Type your username here'`.
* `controlDisabled` - will hide/show text field control for type - `search` and `number`. `textField.controlDisabled = true` will hide the control and `textField.controlDisabled = false` will show the control.
* `maxlength` - will change the max length of the text field. `textField.maxlength = 10`.
* `minlength` - will change the min length of the text field. `textField.minlength = 2`.
* `max` - will change the maximum limit of the text field when the type is `number`. `textField.max = 10`.
* `min` - will change the minimum limit of the text field when the type is `number`. `textField.min = 1`.
* `step` - will change the step of the text field when the type is `number`. `textField.step = 0.5`.

### v.3.1.0

**`inputControlDisabled` property has been changed to `controlDisabled`.**

# Example

You can check the `demo.html` where can be found a lot of examples with the `gameface-text-field`. There you can find:

* How to use all the available `gameface-text-field` attributes.
* How to customize the default `gameface-text-field` elements.
* How to use events with `gameface-text-field`.
