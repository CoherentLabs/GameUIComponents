The color-picker is part of the Gameface custom components suite. As most of the components in this suite it uses slots to allow dynamic content.


Usage
===================
The color-picker component comes with UMD and CJS builds.

## Usage with UMD modules:

* import the color-picker component:

~~~~{.html}
<script src="./node_modules/color-picker/umd/color-picker.production.min.js"></script>
~~~~

* add the color-picker component to your html:

~~~~{.html}
<color-picker class="color-picker-component"></color-picker>
~~~~

This is all! Load the file in Gameface to see the color-picker.

If you wish to import the modules using JavaScript you can remove the script tags
which import the components and the color-picker from the node_modules folder and import them like this:

~~~~{.js}
import color-picker from 'color-picker';
~~~~

Note that this approach requires a module bundler like [Webpack](https://webpack.js.org/) or [Rollup](https://rollupjs.org/guide/en/) to resolve the
modules from the node_modules folder.
