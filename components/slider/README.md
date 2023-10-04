<!--Copyright (c) Coherent Labs AD. All rights reserved. Licensed under the MIT License. See License.txt in the project root for license information. -->

<a href="https://www.npmjs.com/package/coherent-gameface-slider"><img src="http://img.shields.io/npm/v/coherent-gameface-slider.svg?style=flat-square"/></a>

The gameface-slider is part of the Gameface custom components suite. As most of the components in this suite it uses slots to allow dynamic content.

Installation
===================

```
npm i coherent-gameface-slider
```

## Usage with UMD:

* add the gameface-slider component to your html:

~~~~{.html}
<gameface-slider class="gameface-slider-component"></gameface-slider>
~~~~

This is all! Load the file in Gameface to see the gameface-slider.

## Usage with JavaScript:

If you wish to import the Slider using JavaScript you can remove the script tag and import it like this:

~~~~{.js}
import { Slider } from 'coherent-gameface-slider';
~~~~

or simply

~~~~{.js}
import 'coherent-gameface-slider';
~~~~

Note that this approach requires a module bundler like [Webpack](https://webpack.js.org/) or [Rollup](https://rollupjs.org/guide/en/) to resolve the
modules from the node_modules folder.

## Add the Styles

~~~~{.css}
<link rel="stylesheet" href="coherent-gameface-components-theme.css">
<link rel="stylesheet" href="styles/horizontal.css">
<link rel="stylesheet" href="styles/vertical.css">
~~~~

To overwrite the default styles, simply create new rules for the class names that
you wish to change and include them after the default styles.