The gameface-rangeslider is part of the Gameface custom components suite. As most of the components in this suite it uses slots to allow dynamic content.


Usage
===================
The gameface-rangeslider component comes with UMD and CJS builds.

## Usage with UMD modules:

* import the components library:

~~~~{.html}
<script src="./node_modules/coherent-gameface-components/umd/components.production.min.js"></script>
~~~~

* import the gameface-rangeslider component:

~~~~{.html}
<script src="./node_modules/gameface-slider/umd/rangeslider.production.min.js"></script>
~~~~

* add the gameface-rangeslider component to your html:

~~~~{.html}
<gameface-rangeslider></gameface-slider>
~~~~

This is all! Load the file in Gameface to see the gameface-slider.

If you wish to import the modules using JavaScript you can remove the script tags
which import the components and the gameface-slider from the node_modules folder and import them like this:

~~~~{.js}
import components from 'coherent-gameface-components';
import RangeSlider from 'rangeslider';
~~~~

Note that this approach requires a module bundler like [Webpack](https://webpack.js.org/) or [Rollup](https://rollupjs.org/guide/en/) to resolve the
modules from the node_modules folder. Alternatively you can import them directly from node_modules:

~~~~{.js}
import components from './node_modules/coherent-gameface-components/umd/components.production.min.js';
import GamefaceSlider from './node_modules/gameface-slider/umd/rangeslider.production.min.js';
~~~~

## Usage with CJS modules:

* Import the components library:

~~~~{.js}
const components = require('coherent-gameface-components');
const RangeSlider = require('gameface-slider');
~~~~

The CommonJS(CJS) modules are used in a NodeJS environment, be sure to use a module
bundler in order to be use them in a browser.

## Add the Styles

~~~~{.css}
<link rel="stylesheet" href="components-theme.css">
<link rel="stylesheet" href="styles/horizontal.css">
<link rel="stylesheet" href="styles/vertical.css">
~~~~

To overwrite the default styles, simply create new rules for the class names that
you wish to change and include them after the default styles.

## How to use

To use simply add
~~~~{.html}
<gameface-rangeslider></gameface-slider>
~~~~

To your html file.

You can use the following attributes to customize the rangeslider

|Attribute   |Type   |Default   | Description   |Notes   |
|---|---|---|---|---|
|value   | Number   |0   | The initial value of the rangeslider   | If there is a min value set, it defaults to it   |
|min   | Number  | 0   | The minimum value of the rangeslider  |   |
|max   | Number  | 100  | The maximum value of the rangeslider  |   |
|step   | Number  | 1  | The step of the handle  |   |
|grid   | Boolean  | false  | Draws a grid with numbers or array entries  | To enable it you just need to put 'grid' as attribute   |
|thumb   | Boolean  | false  | Draws a thumb with a value for each handle  | To enable it you just need to put 'thumb' as attribute   |
|two-handles   | Boolean  | false  | Creates two handles to specify a range  | To enable it you just need to put 'two-handles' as attribute. If enabled the value attribute is ignored   |
|values   | Array  | []  | Uses an array for the rangeslider  | The array must be added in the following format '["value1", "value2"]' where the array is wrapped in single quotes and the values in double. If there is an Array the two-handles, min and max attributes are ignored   |

## Examples

~~~~{.html}
<gameface-rangeslider orientation="horizontal" min="56" max="255" grid thumb step="20"><gameface-rangeslider>

<gameface-rangeslider orientation="horizontal" min="56" max="255" grid thumb two-handles step="20"></gameface-rangeslider>

<gameface-rangeslider orientation="horizontal" grid thumb value="Hard" values='["Easy","Normal", "Hard", "Expert", "Nightmare"]' step="20"></gameface-rangeslider>

<gameface-rangeslider orientation="vertical" min="56" max="255" grid thumb step="20"><gameface-rangeslider>

~~~~