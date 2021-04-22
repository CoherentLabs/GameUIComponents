<!--Copyright (c) Coherent Labs AD. All rights reserved. -->
The gameface-slider is part of the Gameface custom components suite. As most of the components in this suite it uses slots to allow dynamic content.


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
<script src="./node_modules/gameface-slider/umd/gameface-slider.production.min.js"></script>
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
import GamefaceSlider from 'gameface-slider';
~~~~

Note that this approach requires a module bundler like [Webpack](https://webpack.js.org/) or [Rollup](https://rollupjs.org/guide/en/) to resolve the
modules from the node_modules folder. Alternatively you can import them directly from node_modules:

~~~~{.js}
import components from './node_modules/coherent-gameface-components/umd/components.production.min.js';
import GamefaceSlider from './node_modules/gameface-slider/umd/gameface-slider.production.min.js';
~~~~

## Usage with CJS modules:

* Import the components library:

~~~~{.js}
const components = require('coherent-gameface-components');
const GamefaceSlider = require('gameface-slider');
~~~~

The CommonJS(CJS) modules are used in a NodeJS environment, be sure to use a module
bundler in order to be use them in a browser.