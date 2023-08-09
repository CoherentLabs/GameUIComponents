<!--Copyright (c) Coherent Labs AD. All rights reserved. Licensed under the MIT License. See License.txt in the project root for license information. -->
The gameface-rangeslider is part of the Gameface custom components suite. As most of the components in this suite it uses slots to allow dynamic content.

Installation
===================

`npm i coherent-gameface-rangeslider`

Usage
===================
The gameface-rangeslider component exports two objects:
- bundle - production and development builds, ready for use in the browser
- RangeSlider - the source file that imports its dependencies

## Usage with the bundle modules:

* import the components library:

~~~~{.html}
<script src="./node_modules/coherent-gameface-components/dist/components.production.min.js"></script>
~~~~

* import the gameface-rangeslider component:

~~~~{.html}
<script src="./node_modules/coherent-gameface-rangeslider/dist/rangeslider.production.min.js"></script>
~~~~

* add the gameface-rangeslider component to your html:

~~~~{.html}
<gameface-rangeslider></gameface-rangeslider>
~~~~

This is all! Load the file in Gameface to see the rangeslider.

If you wish to import the modules using JavaScript you can remove the script tags
which import the components and the rangeslider from the node_modules folder and import them like this:

~~~~{.js}
import components from 'coherent-gameface-components';
import { RangeSlider } from 'coherent-gameface-rangeslider';
~~~~

Note that this approach requires a module bundler like [Webpack](https://webpack.js.org/) or [Rollup](https://rollupjs.org/guide/en/) to resolve the
modules from the node_modules folder.

## How to use

To use simply add
~~~~{.html}
<gameface-rangeslider></gameface-rangeslider>
~~~~

to your html file.

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
|custom-handle   | String  | ''  | Element selector  | Will find the element with the specified selector and will automatically render the slider value in it. This option will work when the two-handles option is set to false. |
|custom-handle-left   | String  | ''  | Element selector  | Will find the element with the specified selector and will automatically render the left slider value in it. This option will work when the two-handles option is set to true. |
|custom-handle-right   | String  | ''  | Element selector | Will find the element with the specified selector and will automatically render the right slider value in it. This option will work when the two-handles option is set to true.  |
|values   | Array  | []  | Uses an array for the rangeslider  | The array must be added in the following format '["value1", "value2"]' where the array is wrapped in single quotes and the values in double. If there is an Array the two-handles, min and max attributes are ignored   |

## Examples

~~~~{.html}
<gameface-rangeslider orientation="horizontal" min="56" max="255" grid thumb step="20"><gameface-rangeslider>

<gameface-rangeslider orientation="horizontal" min="56" max="255" grid thumb two-handles step="20"></gameface-rangeslider>

<gameface-rangeslider orientation="horizontal" grid thumb value="Hard" values='["Easy","Normal", "Hard", "Expert", "Nightmare"]' step="20"></gameface-rangeslider>

<gameface-rangeslider orientation="vertical" min="56" max="255" grid thumb step="20"><gameface-rangeslider>

~~~~