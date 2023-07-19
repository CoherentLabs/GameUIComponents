<!--Copyright (c) Coherent Labs AD. All rights reserved. Licensed under the MIT License. See License.txt in the project root for license information. -->
The gameface-slider is part of the Gameface custom components suite. As most of the components in this suite it uses slots to allow dynamic content.

Installation
===================

`npm i coherent-gameface-slider`

Usage
===================
The gameface-slider component exports the following objects:
- bundle - production and development builds, ready for use in the browser
- Slider - the source file that imports its dependencies

## Usage with the bundle modules:

* import the components library:

~~~~{.html}
<script src="./node_modules/coherent-gameface-components/dist/components.production.min.js"></script>
~~~~

* import the gameface-slider component:

~~~~{.html}
<script src="./node_modules/coherent-gameface-slider/dist/slider.production.min.js"></script>
~~~~

* add the gameface-slider component to your html:

~~~~{.html}
<gameface-slider class="gameface-slider-component"></gameface-slider>
~~~~

This is all! Load the file in Gameface to see the gameface-slider.

If you wish to import the modules using JavaScript you can remove the script tags
which import the components and the gameface-slider from the node_modules folder and import them like this:

~~~~{.js}
import components from 'coherent-gameface-components';
import { Slider } from 'coherent-gameface-slider';
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