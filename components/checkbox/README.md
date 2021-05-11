<!--Copyright (c) Coherent Labs AD. All rights reserved. -->
The checkbox is part of the Gameface custom components suite. As most of the components in this suite it uses slots to allow dynamic content.


Usage
===================
The checkbox component comes with UMD and CJS builds.

## Usage with UMD modules:

* import the components library:

~~~~{.html}
<script src="./node_modules/coherent-gameface-components/umd/components.production.min.js"></script>
~~~~

* import the checkbox component:

~~~~{.html}
<script src="./node_modules/coherent-gameface-checkbox/umd/checkbox.production.min.js"></script>
~~~~

* add the checkbox component to your html:

~~~~{.html}
<gameface-checkbox class="checkbox-component"></gameface-checkbox>
~~~~

This is all! Load the file in Gameface to see the checkbox.

If you wish to import the modules using JavaScript you can remove the script tags
which import the components and the checkbox from the node_modules folder and import them like this:

~~~~{.js}
import components from 'coherent-gameface-components';
import checkbox from 'coherent-gameface-checkbox';
~~~~

Note that this approach requires a module bundler like [Webpack](https://webpack.js.org/) or [Rollup](https://rollupjs.org/guide/en/) to resolve the
modules from the node_modules folder. Alternatively you can import them directly from node_modules:

~~~~{.js}
import components from './node_modules/coherent-gameface-components/umd/components.production.min.js';
import checkbox from './node_modules/coherent-gameface-checkbox/umd/checkbox.production.min.js';
~~~~

## Usage with CJS modules:

* Import the components library:

~~~~{.js}
const components = require('coherent-gameface-components');
const checkbox = require('coherent-gameface-checkbox');
~~~~

The CommonJS(CJS) modules are used in a NodeJS environment, be sure to use a module
bundler in order to be use them in a browser.


Customizing the Checkbox
=========================

The checkbox has three slots:
- **checkbox-background** - holds the check box itself
- **check-mark** - holds the check symbol
- **label** - holds the text of the checkbox; leave empty if no label is required

Use the slots to put customized background or label.

~~~~{.html}
<gameface-checkbox class="checkbox-component" data-url="checkbox">
    <component-slot data-name="checkbox-background">
        <div class="checkbox-background"></div>
    </component-slot>
    <component-slot data-name="label">
        <span class="label">Enable Music</span>
    </component-slot>
</gameface-checkbox>
~~~~


## Import the Styles

~~~~{.css}
<link rel="stylesheet" href="components-theme.css">
<link rel="stylesheet" href="style.css">
~~~~

**You can put any custom styles inline or use class names and add an external file.**