<!--Copyright (c) Coherent Labs AD. All rights reserved. Licensed under the MIT License. See License.txt in the project root for license information. -->

<a href="https://www.npmjs.com/package/coherent-gameface-dropdown"><img src="http://img.shields.io/npm/v/coherent-gameface-dropdown.svg?style=flat-square"/></a>

The gameface-dropdown is part of the Gameface custom components suite.

Installation
===================

```
npm i coherent-gameface-dropdown
```

## Usage with UMD:

~~~~{.html}
<script src="./node_modules/coherent-gameface-dropdown/dist/dropdown.production.min.js"></script>
~~~~

* add the gameface-dropdown component to your html:

~~~~{.html}
<gameface-dropdown></gameface-dropdown>
~~~~

To add options to the dropdown use the **dropdown-option** custom element:

~~~~{.html}
<gameface-dropdown>
    <dropdown-option>Cat</dropdown-option>
    <dropdown-option>Dog</dropdown-option>
    <dropdown-option>Giraffe</dropdown-option>
    <dropdown-option>Lion</dropdown-option>
</gameface-dropdown>
~~~~

To manually select an option use the dropdown `value` setter.
For example - to select the Giraffe option from the dropdown above call:

~~~~{.js}
const dropdown = document.getElementById('my-dropdown');
dropdown.value = 'Giraffe';
~~~~

This is all! Load the file in Gameface to see the gameface-dropdown.

## Usage with JavaScript:

If you wish to import the GamefaceDropdown using JavaScript you can remove the script tag and import it like this:

~~~~{.js}
import { GamefaceDropdown } from 'coherent-gameface-dropdown';
~~~~

or simply

~~~~{.js}
import 'coherent-gameface-dropdown';
~~~~

Note that this approach requires a module bundler like [Webpack](https://webpack.js.org/) or [Rollup](https://rollupjs.org/guide/en/) to resolve the
modules from the node_modules folder.


## Dropdown Attributes

You can modify the dropdown and its options using HTML attributes. The `gameface-dropdown` supports:

|Attribute   |Type   |Default   | Description |
|---|---|---|---|
|multiple  | Boolean   |false   | Makes the dropdown multiple, enabling selecting more than one option   |
|collapsable  | Boolean   |true   |  Specifies if the options' list should be always visible  |
|disabled  | Boolean   | false   | Makes the dropdown disabled |

## Working with the Dropdown

### Events

Monitor if an option has been changed using the custom `change` event that the `<gameface-dropdown>` dispatches:

```js
document.querySelector('gameface-dropdown').addEventListener('change', (event) => {
    const selectedOption = event.detail.target;
    console.log(selectedOption.value);
});
```

### Initial Setup

You can configure the Dropdown's initial state declaratively setting the attributes in the HTML:

```html
<gameface-dropdown multiple collapsable disabled>
    <dropdown-option>Cat1</dropdown-option>
    <dropdown-option disabled>Cat2</dropdown-option>
</gameface-dropdown>
```

### Updating the attributes

You can get or set the `multiple`, `collapsable` and `disabled` attributes of the dropdown using either JavaScript or the [DOM APIs](https://developer.mozilla.org/en-US/docs/Web/API/Element/getAttribute):

#### With JavaScript

```js
document.querySelector('gameface-dropdown').<attribute> = <value>;
```

#### With DOM APIs

```js
document.querySelector('gameface-dropdown').setAttribute('<attribute>', '<value>');
document.querySelector('gameface-dropdown').removeAttribute('<attribute>');
```

Where \
`<attribute> ::= multiple | collapsable | disabled` \
`<value> ::= true | false`


## Dropdown Option Attributes
Also these options are added as setters to the dropdown so you can runtime change the dropdown using JavaScript. For example:


|Attribute   |Type   |Default   | Description |
|---|---|---|---|
|value  | String   |""   | Sets a custom value to the option different from its text content   |
|selected  | Boolean   |false   |  Makes an option selected  |
|disabled  | Boolean   | false   | Makes the option disabled |

The `<option>`'s attributes can be changed the same way the `<gameface-dropdown>`'s options are updated - with JavaScript or DOM APIs.

*Note that attempting to remove an attribute from an option that does not have this attribute will have no effect! For example an option could be selected and not have the selected attribute, as selecting an option using the mouse will update only its internal selected property.*

To add or remove an attribute use the [setAttribute](https://developer.mozilla.org/en-US/docs/Web/API/Element/setAttribute) or the [removeAttribute](https://developer.mozilla.org/en-US/docs/Web/API/Element/removeAttribute) method.


## Multiple Select

To enable multiple selection add a `multiple` attribute to the gameface-dropdown:

~~~~{.html}
<gameface-dropdown class="gameface-dropdown-component" multiple>
    <dropdown-option>Cat1</dropdown-option>
    <dropdown-option>Parrot</dropdown-option>
</gameface-dropdown>
~~~~

By default the multiple select will have its options list expanded and it won't have
a header. If you would like to have a dropdown that looks like a single select, but
supports multiple selected elements - add the `collapsable` attribute along with the `multiple` attribute:

~~~~{.html}
<gameface-dropdown class="gameface-dropdown-component" multiple collapsable>
    <dropdown-option>Cat1</dropdown-option>
    <dropdown-option>Parrot</dropdown-option>
</gameface-dropdown>
~~~~

## Add the Styles

~~~~{.css}
<link rel="stylesheet" href="coherent-gameface-components-theme.css">
<link rel="stylesheet" href="style.css">
<link rel="stylesheet" href="node_modules/coherent-gameface-scrollable-container/style.css">
<link rel="stylesheet" href="node_modules/coherent-gameface-slider/styles/horizontal.css">
<link rel="stylesheet" href="node_modules/coherent-gameface-slider/styles/vertical.css">
~~~~

To overwrite the default styles, simply create new rules for the class names that
you wish to change and include them after the default styles.

### Features and Limitations

This is not a standard HTML select multiple. It is a custom HTML element that enables you to define a list of options.

- The `multiple` attribute makes it possible to select more than one option using the **Ctrl** key and the mouse.
- All options can be selected with **Ctrl + A** combination.
- Set the `disabled` attribute to `gameface-dropdown` or a `dropdown-option` to disable it.
- Set the `selected` attribute to any dropdown-option to pre-select it.

These are some of the differences to the standard select that are partially or not yet supported:

- *Selecting multiple options via keyboard* - this is possible with Shift + Arrow Up/Left/Down/Right and Shift + Home/End.
- *Selecting a range of elements*.