The automatic-grid is part of the Gameface custom components suite. As most of the components in this suite it uses slots to allow dynamic content.

Installation
===================

`npm i coherent-gameface-automatic-grid`

Usage
===================
The automatic-grid component comes with UMD and CJS builds.

## Usage with UMD modules:

* import the components library:

~~~~{.html}
<script src="./node_modules/coherent-gameface-components/umd/components.production.min.js"></script>
~~~~

* import the automatic-grid component:

~~~~{.html}
<script src="./node_modules/coherent-gameface-automatic-grid/umd/automatic-grid.production.min.js"></script>
~~~~

* add the automatic-grid component to your html:

~~~~{.html}
<gameface-automatic-grid></gameface-automatic-grid>
~~~~

This is all! Load the file in Gameface to see the automatic-grid.

If you wish to import the modules using JavaScript you can remove the script tags
which import the components and the automatic-grid from the node_modules folder and import them like this:

~~~~{.js}
import components from 'coherent-gameface-components';
import automatic-grid from 'coherent-gameface-automatic-grid';
~~~~

Note that this approach requires a module bundler like [Webpack](https://webpack.js.org/) or [Rollup](https://rollupjs.org/guide/en/) to resolve the
modules from the node_modules folder. Alternatively you can import them directly from node_modules:

~~~~{.js}
import components from './node_modules/coherent-gameface-components/umd/components.production.min.js';
import automatic-grid from './node_modules/coherent-gameface-automatic-grid/umd/automatic-grid.production.min.js';
~~~~

## Usage with CJS modules:

* Import the components library:

~~~~{.js}
const components = require('coherent-gameface-components');
const automatic-grid = require('coherent-gameface-automatic-grid');
~~~~

The CommonJS(CJS) modules are used in a NodeJS environment, be sure to use a module
bundler in order to be use them in a browser.


## Add the styles

~~~~{.html}
<link rel="stylesheet" href="coherent-gameface-components-theme.css">
<link rel="stylesheet" href="grid.production.min.css">
<link rel="stylesheet" href="style.css">
~~~~
To overwrite the default styles, simply create new rules for the class names that you wish to change and include them after the default styles.

Load the HTML file in Gameface to see the automatic-grid.


## How to use


To use the automatic-grid component add the following element to your html
~~~~{.html}
<gameface-automatic-grid class="automatic-grid-component"></gameface-automatic-grid>
~~~~

To add items to your grid you need to add componet-slot elements to the grid

~~~~{.html}
<gameface-automatic-grid class="automatic-grid-component">
    <component-slot data-name="item">Automatic Grid</component-slot>
</gameface-automatic-grid>
~~~~

You can use the following attributes to customize the automatic-grid

|Attribute   |Type   |Default   | Description   |Notes   |
|---|---|---|---|---|
|columns   | Number   |6   | The number of columns the grid has   | The maximum number of columns is 12   |
|rows   | Number   |5   | The number of rows the grid has   |   |
|draggable   | Boolean   |false   | If you can drag and drop items in the grid   |   |

Apart from that you can add the following attributes to the component-slot

|Attribute   |Type   |Default   | Description   |Notes   |
|---|---|---|---|---|
|col   | Number   |none   | The column the item is on   |   |
|row   | Number   |none   | The row the item is on    |   |


## Using with data-binding

If you want to iterate a list of items from a model in the automatic-grid, you can do the following in your JS:

~~~~{.js}
engine.whenReady.then(() => {
    const grid = document.querySelector('gameface-automatic-grid');
    
    grid.addItemsToCells();
});
~~~~

This will distribute the items from the model in the grid.