---
date: 2022-3-25
title: Dropdown
draft: false
---

<!--Copyright (c) Coherent Labs AD. All rights reserved. Licensed under the MIT License. See License.txt in the project root for license information. -->
The gameface-dropdown is part of the Gameface custom components suite. As most of the components in this suite it uses slots to allow dynamic content.

Installation
===================

`npm i coherent-gameface-dropdown`

Usage
===================
The gameface-dropdown component comes with UMD and CJS builds.

## Usage with UMD modules:

* import the components library:

~~~~{.html}
<script src="./node_modules/coherent-gameface-components/umd/components.production.min.js"></script>
~~~~

* import the gameface-dropdown component:

~~~~{.html}
<script src="./node_modules/coherent-gameface-dropdown/umd/dropdown.production.min.js"></script>
~~~~

* add the gameface-dropdown component to your html:

~~~~{.html}
<gameface-dropdown></gameface-dropdown>
~~~~

To add options to the dropdown use the **option** slot:

~~~~{.html}
<gameface-dropdown id="my-dropdown">
    <dropdown-option slot="option">Cat</dropdown-option>
    <dropdown-option slot="option">Dog</dropdown-option>
    <dropdown-option slot="option">Giraffe</dropdown-option>
    <dropdown-option slot="option">Lion</dropdown-option>
</gameface-dropdown>
~~~~

Adding the `id` attribute is **required** for the dropdown to work correctly.

To manually select an option use the setSelected(`<optionIndex>`) function.
For example - to select the Giraffe option from the dropdown above call:

~~~~{.js}
const dropdown = document.getElementById('my-dropdown');
dropdown.setSelected(2);
~~~~

This is all! Load the file in Gameface to see the gameface-dropdown.

If you wish to import the modules using JavaScript you can remove the script tags
which import the components and the gameface-dropdown from the node_modules folder and import them like this:

~~~~{.js}
import components from 'coherent-gameface-components';
import GamefaceDropdown from 'coherent-gameface-dropdown';
~~~~

Note that this approach requires a module bundler like [Webpack](https://webpack.js.org/) or [Rollup](https://rollupjs.org/guide/en/) to resolve the
modules from the node_modules folder. Alternatively you can import them directly from node_modules:

~~~~{.js}
import components from './node_modules/coherent-gameface-components/umd/components.production.min.js';
import GamefaceDropdown from './node_modules/coherent-gameface-dropdown/umd/dropdown.production.min.js';
~~~~

## Usage with CJS modules:

* Import the components library:

~~~~{.js}
const components = require('coherent-gameface-components');
const GamefaceDropdown = require('coherent-gameface-dropdown');
~~~~

The CommonJS(CJS) modules are used in a NodeJS environment, be sure to use a module
bundler in order to be use them in a browser.


## Multiple Select

To enable multiple selection add a `multiple` attribute to the gameface-dropdown:

~~~~{.html}
<gameface-dropdown class="gameface-dropdown-component" multiple>
    <dropdown-option slot="option" >Cat1</dropdown-option>
    <dropdown-option slot="option">Parrot</dropdown-option>
</gameface-dropdown>
~~~~

By default the multiple select will have its options list expanded and it won't have
a header. If you would like to have a dropdown that looks like a single select, but
supports multiple selected elements - add the `collapsable` attribute along with the `multiple` attribute:

~~~~{.html}
<gameface-dropdown class="gameface-dropdown-component" multiple collapsable>
    <dropdown-option slot="option" >Cat1</dropdown-option>
    <dropdown-option slot="option">Parrot</dropdown-option>
</gameface-dropdown>
~~~~

### Features and Limitations

This is not a standard HTML select multiple. It is a custom HTML element that enables you to define a list of options.

- The `multiple` attribute makes it possible to select more than one option using the **Ctrl** key and the mouse.
	- All options can be selected with **Ctrl + A** combination.
- Set the `disabled` attribute to gameface-dropdown or a dropdown-option to disable it.
- Set the `selected` attribute to any dropdown-option to pre-select it.

These are some of the differences to the standard select that are partially or not yet supported:

- *Selecting multiple options via keyboard* - this is possible with Shift + Arrow Up/Left/Down/Right and Shift + Home/End.
- *Selecting a range of elements*.

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