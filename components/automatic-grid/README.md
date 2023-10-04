<!--Copyright (c) Coherent Labs AD. All rights reserved. Licensed under the MIT License. See License.txt in the project root for license information. -->

<a href="https://www.npmjs.com/package/coherent-gameface-automatic-grid"><img src="http://img.shields.io/npm/v/coherent-gameface-automatic-grid.svg?style=flat-square"/></a>

The automatic-grid is part of the Gameface custom components suite. As most of the components in this suite it uses slots to allow dynamic content.

Installation
===================

```
npm i coherent-gameface-automatic-grid
```

## Usage with UMD:

~~~~{.html}
<script src="./node_modules/coherent-gameface-automatic-grid/dist/automatic-grid.production.min.js"></script>
~~~~

* add the automatic-grid component to your html:

~~~~{.html}
<gameface-automatic-grid></gameface-automatic-grid>
~~~~

This is all! Load the file in Gameface to see the automatic-grid.

## Usage with JavaScript:

If you wish to import the AutomaticGrid using JavaScript you can remove the script tag and import it like this:

~~~~{.js}
import { AutomaticGrid } from 'coherent-gameface-automatic-grid';
~~~~

or simply

~~~~{.js}
import 'coherent-gameface-automatic-grid';
~~~~

Note that this approach requires a module bundler like [Webpack](https://webpack.js.org/) or [Rollup](https://rollupjs.org/guide/en/) to resolve the
modules from the node_modules folder.

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