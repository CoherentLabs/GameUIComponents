<!--Copyright (c) Coherent Labs AD. All rights reserved. Licensed under the MIT License. See License.txt in the project root for license information. -->
The gameface-rangeslider is part of the Gameface custom components suite. As most of the components in this suite it uses slots to allow dynamic content.

Installation
===================

`npm i coherent-gameface-rangeslider`

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
<script src="./node_modules/coherent-gameface-rangeslider/umd/rangeslider.production.min.js"></script>
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
import RangeSlider from 'coherent-gameface-rangeslider';
~~~~

Note that this approach requires a module bundler like [Webpack](https://webpack.js.org/) or [Rollup](https://rollupjs.org/guide/en/) to resolve the
modules from the node_modules folder. Alternatively you can import them directly from node_modules:

~~~~{.js}
import components from './node_modules/coherent-gameface-components/umd/components.production.min.js';
import GamefaceSlider from './node_modules/coherent-gameface-rangeslider/umd/rangeslider.production.min.js';
~~~~

## Usage with CJS modules:

* Import the components library:

~~~~{.js}
const components = require('coherent-gameface-components');
const RangeSlider = require('coherent-gameface-rangeslider');
~~~~

The CommonJS(CJS) modules are used in a NodeJS environment, be sure to use a module
bundler in order to be use them in a browser.

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

## Range-slider with data-binding

It is very convinient to control range-slider runtime via data-binding. For this puprose we exposed some custom binding attributes that are usefull when you have a model with data about range-slider/s and want to bound it with the component. Like that updating the model will update the range-slider component dynamically as well.

Check the next subsections so you get to know how to use these custom attributes.

### Bound range-slider value

The range-slider value can be controlled dynamically via the `data-bind-guic-rangeslider-value` attribute. When the value is changed in the model then the range-slider thumb will be automatically set to the right position based on value data.

For example you can use the attribute like that in the HTML:

```html
<range-slider data-bind-guic-rangeslider-value="{{model.rangeSliderValue}}"></range-slider>
```

and then you can initialize the model like that

```js
engine.on('Ready', () => {
    const model = {
        rangeSliderValue: [50]
    }

    engine.createJSModel('model', model);
    engine.synchronizeModels();
});
```

That example will directly set `50` as a value to the range-slider. After that you can runtime update the model and the range-slider will be updated as well.

```js
model.rangeSliderValue: [20];
engine.updateWholeModel(model);
engine.synchronizeModels();
```

**Note that the model value should have the following syntax: `[50]` or `['Option 1']`**.

* Array with a single numeric value - used for range-slider when the `two-handles` attribute is not used. For example `[50]`
* Array with a single string value - used for range-slider when the `values` attribute is used. For example if the `values` attribute is `"['Option 1', 'Option 2', 'Option 3']"` then the `['Option 2']` will set the second option as a current value to the range-slider.

```html
<range-slider data-bind-guic-rangeslider-value="{{model.rangeSliderValue}}" values="['Option 1', 'Option 2', 'Option 3']"></range-slider>
<script>
    const model = {
        rangeSliderValue: ['Option 2']
    }

    engine.createJSModel('model', model);
    engine.synchronizeModels();
</script>
```

### Limitations

* Currently setting two values when the range-slider has `two-handles` attribute is not supported! For example `[50, 60]` as value will not work.
* When the range-slider has `value` attribute and the `data-bind-guic-rangeslider-value` it will use the bound value with higher priority and will discard the one in the normal attribute.

### Other bound range-slider attributes

Range-slider also support a few more bound attributes that can configure it through the data binding model. However, these attribute are currently not supporting update so updating the model runtime won't update those bound attributes.
They are usefull for initial configuration of the range-slider via the data from the model.

For example you can define a model with configuration for a multiple range-sliders components and use `data-bind-for` to instantiate all of them dynamically in the UI.

```html
<gameface-rangeslider
    data-bind-for="rangeSlider:{{model.rangeSliders}}"
    data-bind-guic-rangeslider-max="{{rangeSlider.max}}"
    data-bind-guic-rangeslider-min="{{rangeSlider.min}}"
    data-bind-guic-rangeslider-value="{{rangeSlider.value}}"
    data-bind-guic-rangeslider-grid="{{rangeSlider.grid}}"
    data-bind-guic-rangeslider-thumb="{{rangeSlider.thumb}}"
></gameface-rangeslider>
<script>
    const model = {
        rangeSliders: [
            {
                max: 70,
                min: 10,
                value: [50]
            },
            {
                max: 150,
                min: 0,
                grid: true,
                thumb: true,
                value: [100]
            }
        ]
    }

    engine.createJSModel('model', model);
    engine.synchronizeModels();
</script>
```
