---
title: "Radio Button"
date: 2020-10-08T14:00:45Z
draft: false
---

<!--Copyright (c) Coherent Labs AD. All rights reserved. -->

The radio-button is part of the Gameface custom components suite.

Usage
===================
The radio-button component comes with UMD and CJS builds.

## Usage with UMD modules:

* import the components library:

~~~~{.html}
<script src="./node_modules/coherent-gameface-components/umd/components.production.min.js"></script>
~~~~

* import the radio-button component:

~~~~{.html}
<script src="./node_modules/coherent-gameface-radio-button/umd/coherent-gameface-radio-button.production.min.js"></script>
~~~~

* add the radio-button group and button custom Elements to your html:

~~~~{.html}
<gameface-radio-group>
	<radio-button slot="radio-button"></radio-button>
	<radio-button slot="radio-button"></radio-button>
</gameface-radio-group>
~~~~

Configuration and usage is explained further down the document. 

Import using ES modules:

~~~~{.js}
import components from 'coherent-gameface-components';
import radioButton from 'coherent-gameface-radio-button';
~~~~

Note that this approach requires a module bundler like
[Webpack](https://webpack.js.org/) or [Rollup](https://rollupjs.org/guide/en/)
to resolve the modules from the node_modules folder.

## Usage with CJS modules:

* Import the components library:

~~~~{.js}
const components = require('coherent-gameface-components');
const radioButton = require('coherent-gameface-radio-button');
~~~~

The CommonJS(CJS) modules are native for NodeJS environment, be sure to use a
module bundler in order to be able to import the components in a browser.

# Configuration and Usage

The radio-button has `value` and `checked` getters and setters.
Also each radio button has its own radio group element which is convenient.

Here is an example:
```html
<gameface-radio-group>
	<radio-button slot="radio-button">Tab Targeting</radio-button>
	<radio-button slot="radio-button" checked>Action Combat</radio-button>
</gameface-radio-group>
```

## Add the Styles

~~~~{.css}
<link rel="stylesheet" href="coherent-gameface-components-theme.css">
<link rel="stylesheet" href="style.css">
~~~~

To overwrite the default styles, simply create new rules for the class names
that you wish to change and include them after the default styles.

Load the HTML file in Gameface to see the radio-button.
You can also see an example in the demo folder of the component.

## Usage

On top of using the `radioButton.checked` and `radioButton.checked` you can
get one of the `<gameface-radio-group>` Elements and call `radioGroup.allButtons`
which will return an Array of all `<radio-button>` Elements.

When a radio-button as a `checked` attribute, this will be the initially checked
button.

Mouse focusing works as well as keyboard navigation and focusing using the
arrow keys and Enter or Space keys.