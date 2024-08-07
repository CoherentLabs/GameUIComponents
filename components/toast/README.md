<!--Copyright (c) Coherent Labs AD. All rights reserved. Licensed under the MIT License. See License.txt in the project root for license information. -->

The gameface-toast is part of the Gameface custom components suite. As most of the components in this suite it uses slots to allow dynamic content.


Usage
===================
The gameface-toast component comes with UMD and CJS builds.

## Usage with UMD modules:

* import the gameface-toast component:

~~~~{.html}
<script src="./node_modules/gameface-toast/umd/gameface-toast.production.min.js"></script>
~~~~

* add the gameface-toast component to your html:

~~~~{.html}
<gameface-toast class="gameface-toast-component"></gameface-toast>
~~~~

This is all! Load the file in Gameface to see the gameface-toast.

If you wish to import the modules using JavaScript you can remove the script tags
which import the components and the gameface-toast from the node_modules folder and import them like this:

~~~~{.js}
import gameface-toast from 'gameface-toast';
~~~~

Note that this approach requires a module bundler like [Webpack](https://webpack.js.org/) or [Rollup](https://rollupjs.org/guide/en/) to resolve the
modules from the node_modules folder.
