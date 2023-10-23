The ${this.componentName} is part of the Gameface custom components suite. As most of the components in this suite it uses slots to allow dynamic content.


Usage
===================
The ${this.componentName} component comes with UMD and CJS builds.

## Usage with UMD modules:

* import the ${this.componentName} component:

~~~~{.html}
<script src="./node_modules/${this.componentName}/umd/${this.componentName}.production.min.js"></script>
~~~~

* add the ${this.componentName} component to your html:

~~~~{.html}
<${this.componentName} class="${this.componentName}-component"></${this.componentName}>
~~~~

This is all! Load the file in Gameface to see the ${this.componentName}.

If you wish to import the modules using JavaScript you can remove the script tags
which import the components and the ${this.componentName} from the node_modules folder and import them like this:

~~~~{.js}
import ${this.componentName} from '${this.componentName}';
~~~~

Note that this approach requires a module bundler like [Webpack](https://webpack.js.org/) or [Rollup](https://rollupjs.org/guide/en/) to resolve the
modules from the node_modules folder.
