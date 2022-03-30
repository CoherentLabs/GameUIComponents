---
date: 2022-3-25
title: Switch
draft: false
---

<!--Copyright (c) Coherent Labs AD. All rights reserved. Licensed under the MIT License. See License.txt in the project root for license information. -->
The gameface-switch is part of the Gameface custom components suite. As most of the components in this suite it uses slots to allow dynamic content.

Usage
===================

The gameface-switch component comes with UMD and CJS builds.

## Installation
`npm i coherent-gameface-switch`

## Usage with UMD modules:

-   import the components library:

```{.html}
<script src="./node_modules/coherent-gameface-components/umd/components.production.min.js"></script>
```

-   import the gameface-switch component:

```{.html}
<script src="./node_modules/coherent-gameface-switch/umd/switch.production.min.js"></script>
```

-   add the gameface-switch component to your html:

```{.html}
<gameface-switch></gameface-switch>
```

This is all! Load the file in Gameface to see the switch.

If you wish to import the modules using JavaScript you can remove the script tags
which import the components and the switch from the node_modules folder and import them like this:

```{.js}
import components from 'coherent-gameface-components';
import switch from 'coherent-gameface-switch';
```

Note that this approach requires a module bundler like [Webpack](https://webpack.js.org/) or [Rollup](https://rollupjs.org/guide/en/) to resolve the
modules from the node_modules folder. Alternatively you can import them directly from node_modules:

```{.js}
import components from './node_modules/coherent-gameface-components/umd/components.production.min.js';
import switch from './node_modules/coherent-gameface-switch/umd/switch.production.min.js';
```

## Usage with CJS modules:

-   Import the components library:

```{.js}
const components = require('coherent-gameface-components');
const switch = require('coherent-gameface-switch');
```

The CommonJS(CJS) modules are used in a NodeJS environment, be sure to use a module
bundler in order to be use them in a browser.

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

You can use the following attributes to customize the switch

| Attribute           | Type    | Default | Description                                | Notes                                                                                                                                                                                                                 |
| ------------------- | ------- | ------- | ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| type              | String  | default       | The type of the switch       | It can be default, inset or text-inside                                                                                                                                                                       |
| checked                | Boolean  | false       | If the switch is checked when rendered       |                                                                                                                                                                                                                       |
| disabled                 | Boolean  | false     | Disables the switch       |                                                                                                                                                                                                                       |
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
