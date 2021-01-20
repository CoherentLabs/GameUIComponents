The gameface-scrollable-container is part of the Gameface custom components suite. As most of the components in this suite it uses slots to allow dynamic content.


Usage
===================
The gameface-scrollable-container component comes with UMD and CJS builds.

## Usage with UMD modules:

* import the components library:

~~~~{.html}
<script src="./node_modules/coherent-gameface-components/umd/components.production.min.js"></script>
~~~~

* import the gameface-scrollable-container component:

~~~~{.html}
<script src="./node_modules/gameface-scrollable-container/umd/gameface-scrollable-container.production.min.js"></script>
~~~~

* add the gameface-scrollable-container component to your html:

~~~~{.html}
<gameface-scrollable-container class="gameface-scrollable-container-component"></gameface-scrollable-container>
~~~~

This is all! Load the file in Gameface to see the gameface-scrollable-container.

If you wish to import the modules using JavaScript you can remove the script tags
which import the components and the gameface-scrollable-container from the node_modules folder and import them like this:

~~~~{.js}
import components from 'coherent-gameface-components';
import GamefaceScrollableContainer from 'gameface-scrollable-container';
~~~~

Note that this approach requires a module bundler like [Webpack](https://webpack.js.org/) or [Rollup](https://rollupjs.org/guide/en/) to resolve the
modules from the node_modules folder. Alternatively you can import them directly from node_modules:

~~~~{.js}
import components from './node_modules/coherent-gameface-components/umd/components.production.min.js';
import GamefaceScrollableContainer from './node_modules/gameface-scrollable-container/umd/gameface-scrollable-container.production.min.js';
~~~~

## Usage with CJS modules:

* Import the components library:

~~~~{.js}
const components = require('coherent-gameface-components');
const GamefaceScrollableContainer = require('gameface-scrollable-container');
~~~~

The CommonJS(CJS) modules are used in a NodeJS environment, be sure to use a module
bundler in order to use them in a browser.