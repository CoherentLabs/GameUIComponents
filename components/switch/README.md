<!--Copyright (c) Coherent Labs AD. All rights reserved. Licensed under the MIT License. See License.txt in the project root for license information. -->

<a href="https://www.npmjs.com/package/coherent-gameface-switch"><img src="http://img.shields.io/npm/v/coherent-gameface-switch.svg?style=flat-square"/></a>

The gameface-switch is part of the Gameface custom components suite. As most of the components in this suite it uses slots to allow dynamic content.

Installation
===================

```
npm i coherent-gameface-switch
```

## Usage with UMD:

```{.html}
<script src="./node_modules/coherent-gameface-switch/dist/switch.production.min.js"></script>
```

-   add the gameface-switch component to your html:

```{.html}
<gameface-switch></gameface-switch>
```

This is all! Load the file in Gameface to see the switch.

## Usage with JavaScript:

If you wish to import the Switch using JavaScript you can remove the script tag and import it like this:

```{.js}
import { Switch } from 'coherent-gameface-switch';
```

or simply

~~~~{.js}
import 'coherent-gameface-switch';
~~~~

Note that this approach requires a module bundler like [Webpack](https://webpack.js.org/) or [Rollup](https://rollupjs.org/guide/en/) to resolve the
modules from the node_modules folder.

## Add the styles

~~~~{.html}
<link rel="stylesheet" href="coherent-gameface-components-theme.css">
<link rel="stylesheet" href="style.css">
~~~~
To overwrite the default styles, simply create new rules for the class names that you wish to change and include them after the default styles.

Load the HTML file in Gameface to see the switch.

## How to use

To use simply add

```{.html}
<gameface-switch></gameface-switch>
```

to your html file.

You can also add labels for your checked and unchecked values by using component-slot

```{.html}
<gameface-switch>
    <component-slot data-name="switch-unchecked">Off</component-slot>
    <component-slot data-name="switch-checked">On</component-slot>
</gameface-switch>
```

## Switch attributes

You can use the following attributes to customize the switch

| Attribute           | Type    | Default | Description                                | Notes                                                                                                                                                                                                                 |
| ------------------- | ------- | ------- | ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| type              | String  |        | The type of the switch       |  It can be without a type, `inset` or `text-inside`. If is set something else the type will fallback to the default.                                                                                                                                                                   |
| checked                | Boolean  | false       | If the switch is checked when rendered       |                                                                                                                                                                                                                       |
| disabled                 | Boolean  | false     | Disables the switch       |                                                                                                                                                                                                                       |

### v3.1.0

These attributes can be changed dynamically runtime via `setAttribute` or `switch[attrName] = value`. For example

```javascript
const switch = document.querySelector('gameface-switch');
switch.setAttribute('type', 'text-inside'); // or switch.type = 'text-inside';
switch.setAttribute('disabled', ''); // or switch.disabled = true;
switch.setAttribute('checked', ''); // or switch.checked = true;
```

## Examples

```{.html}
<gameface-switch type="inset" disabled checked>
    <component-slot data-name="switch-unchecked">Off</component-slot>
    <component-slot data-name="switch-checked">On</component-slot>
</gameface-switch>

<gameface-switch type="text-inside">
    <component-slot data-name="switch-unchecked">Off</component-slot>
    <component-slot data-name="switch-checked">On</component-slot>
</gameface-switch>

```

### Using the custom event

The switch component emits a custom `switch_toggle` event that you can listen for.

```
const switch = document.querySelector('switch');

switch.addEventListener('switch_toggle', ({detail}) => {
    doSomething(detail); //Where detail returns true or false based on the state of the switch
})
```
