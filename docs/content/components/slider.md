---
date: 2022-3-25
title: Slider
draft: false
---

<!--Copyright (c) Coherent Labs AD. All rights reserved. Licensed under the MIT License. See License.txt in the project root for license information. -->
The gameface-slider is part of the Gameface custom components suite. As most of the components in this suite it uses slots to allow dynamic content.

Installation
===================

`npm i coherent-gameface-slider`

Usage
===================
The gameface-slider component comes with UMD and CJS builds.

## Usage with UMD modules:

* import the components library:

~~~~{.html}
<script src="./node_modules/coherent-gameface-components/umd/components.production.min.js"></script>
~~~~

* import the gameface-slider component:

~~~~{.html}
<script src="./node_modules/coherent-gameface-slider/umd/slider.production.min.js"></script>
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
import GamefaceSlider from 'coherent-gameface-slider';
~~~~

Note that this approach requires a module bundler like [Webpack](https://webpack.js.org/) or [Rollup](https://rollupjs.org/guide/en/) to resolve the
modules from the node_modules folder. Alternatively you can import them directly from node_modules:

~~~~{.js}
import components from './node_modules/coherent-gameface-components/umd/components.production.min.js';
import GamefaceSlider from './node_modules/coherent-gameface-slider/umd/slider.production.min.js';
~~~~

## Usage with CJS modules:

* Import the components library:

~~~~{.js}
const components = require('coherent-gameface-components');
const GamefaceSlider = require('coherent-gameface-slider');
~~~~

The CommonJS(CJS) modules are used in a NodeJS environment, be sure to use a module
bundler in order to be use them in a browser.

## Add the Styles

~~~~{.css}
<link rel="stylesheet" href="coherent-gameface-components-theme.css">
<link rel="stylesheet" href="styles/horizontal.css">
<link rel="stylesheet" href="styles/vertical.css">
~~~~

To overwrite the default styles, simply create new rules for the class names that
you wish to change and include them after the default styles.