<!--Copyright (c) Coherent Labs AD. All rights reserved. Licensed under the MIT License. See License.txt in the project root for license information. -->

<a href="https://www.npmjs.com/package/coherent-gameface-checkbox"><img src="http://img.shields.io/npm/v/coherent-gameface-checkbox.svg?style=flat-square"/></a>

The checkbox is part of the Gameface custom components suite. As most of the components in this suite it uses slots to allow dynamic content.

Installation
===================

```
npm i coherent-gameface-checkbox
```

## Usage with UMD:

~~~~{.html}
<script src="./node_modules/coherent-gameface-checkbox/dist/checkbox.production.min.js"></script>
~~~~

* add the checkbox component to your html:

~~~~{.html}
<gameface-checkbox class="checkbox-component"></gameface-checkbox>
~~~~

This is all! Load the file in Gameface to see the checkbox.

## Usage with JavaScript:

If you wish to import the Checkbox using JavaScript you can remove the script tag and import them like this:

~~~~{.js}
import { Checkbox } from 'coherent-gameface-checkbox';
~~~~

or simply

~~~~{.js}
import 'coherent-gameface-checkbox';
~~~~

Note that this approach requires a module bundler like [Webpack](https://webpack.js.org/) or [Rollup](https://rollupjs.org/guide/en/) to resolve the
modules from the node_modules folder.

Customizing the Checkbox
=========================

The checkbox has three slots:
- **checkbox-background** - holds the check box itself
- **check-mark** - holds the check symbol
- **checkbox-label** - holds the text of the checkbox; leave empty if no label is required

Use the slots to put customized background or label.

~~~~{.html}
<gameface-checkbox class="checkbox-component" data-url="checkbox">
    <component-slot data-name="checkbox-background">
        <div class="guic-checkbox-background"></div>
    </component-slot>
    <component-slot data-name="checkbox-label">
        <span class="guic-checkbox-label">Enable Music</span>
    </component-slot>
</gameface-checkbox>
~~~~

## Add the Styles

~~~~{.css}
<link rel="stylesheet" href="coherent-gameface-components-theme.css">
<link rel="stylesheet" href="style.css">
~~~~

To overwrite the default styles, simply create new rules for the class names that
you wish to change and include them after the default styles.

**You can put any custom styles inline or use class names and add an external file.**
