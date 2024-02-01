<!--Copyright (c) Coherent Labs AD. All rights reserved. Licensed under the MIT License. See License.txt in the project root for license information. -->

<a href="https://www.npmjs.com/package/coherent-gameface-rangeslider"><img src="http://img.shields.io/npm/v/coherent-gameface-rangeslider.svg?style=flat-square"/></a>

The gameface-rangeslider is part of the Gameface custom components suite. As most of the components in this suite it uses slots to allow dynamic content.

Installation
===================

```
npm i coherent-gameface-rangeslider
```

## Usage with UMD:

~~~~{.html}
<script src="./node_modules/coherent-gameface-rangeslider/dist/rangeslider.production.min.js"></script>
~~~~

* add the gameface-rangeslider component to your html:

~~~~{.html}
<gameface-rangeslider></gameface-rangeslider>
~~~~

This is all! Load the file in Gameface to see the rangeslider.

## Usage with JavaScript:

If you wish to import the RangeSlider using JavaScript you can remove the script tag and import it like this:

~~~~{.js}
import { RangeSlider } from 'coherent-gameface-rangeslider';
~~~~

or simply

~~~~{.js}
import 'coherent-gameface-rangeslider';
~~~~

Note that this approach requires a module bundler like [Webpack](https://webpack.js.org/) or [Rollup](https://rollupjs.org/guide/en/) to resolve the
modules from the node_modules folder.

## How to use

To use simply add
~~~~{.html}
<gameface-rangeslider></gameface-rangeslider>
~~~~

to your html file.

## Rangeslider attributes

You can use the following attributes to customize the rangeslider

|Attribute   |Type   |Default   | Description   |Notes   |
|---|---|---|---|---|
|value   | Number, Array (two handles)   |0   | The initial value of the rangeslider   | If the value attribute is not set it defaults to the min value if set set.   |
|min   | Number  | 0   | The minimum value of the rangeslider  |  **Not working when the `values` attribute is set.**  |
|max   | Number  | 100  | The maximum value of the rangeslider  |  **Not working when the `values` attribute is set.**  |
|step   | Number  | 1  | The step of the handle  | **Not working when the `values` attribute is set.**  |
|grid   | Boolean  | false  | Draws a grid with numbers or array entries  | To enable it you just need to put 'grid' as attribute   |
|pols-number | Number | 5 | The number of pols the grid has | To use this you need to have 'grid' attribute set |
|thumb   | Boolean  | false  | Draws a thumb with a value for each handle  | To enable it you just need to put 'thumb' as attribute   |
|two-handles   | Boolean  | false  | Creates two handles to specify a range  | To enable it you just need to put 'two-handles' as attribute. **If enabled the `value` attribute is ignored**. **Not working when the `values` attribute is set.**  |
|orientation   | String  | 'horizontal'  | Either 'horizontal' or 'vertical'  | Will change the orientation of the rangeslider to horizontal or vertical. |
|custom-handle   | String  | ''  | Element selector  | Will find the element with the specified selector and will automatically render the slider value in it. This option will work when the two-handles option is set to false. |
|custom-handle-left   | String  | ''  | Element selector  | Will find the element with the specified selector and will automatically render the left slider value in it. This option will work when the two-handles option is set to true. |
|custom-handle-right   | String  | ''  | Element selector | Will find the element with the specified selector and will automatically render the right slider value in it. This option will work when the two-handles option is set to true.  |
|values   | Array  | []  | Uses an array for the rangeslider  | The array must be added in the following format '["value1", "value2"]' where the array is wrapped in single quotes and the values in double. If there is an Array the two-handles, min and max attributes are ignored   |

### Examples

~~~~{.html}
<gameface-rangeslider orientation="horizontal" min="56" max="255" grid thumb step="20"><gameface-rangeslider>

<gameface-rangeslider orientation="horizontal" min="56" max="255" grid thumb two-handles step="20"></gameface-rangeslider>

<gameface-rangeslider orientation="horizontal" grid thumb value="Hard" values='["Easy","Normal", "Hard", "Expert", "Nightmare"]' step="20"></gameface-rangeslider>

<gameface-rangeslider orientation="vertical" min="56" max="255" grid thumb step="20"><gameface-rangeslider>

~~~~

## Dynamic attributes (v.3.1.0)

In version **3.1.0** are added the dynamic attributes of the rangeslider component. Each attribute from the [table](#rangeslider-attributes) can now be changed via JavaScript or by changing the attribute value of the `gameface-rangeslider` element. You can also add new attributes to the rangeslider runtime. The component is watching for changes so runtime it can be configured to behave differently.

### `value`

You can set the value of the rangeslider by doing

```javascript
const rangeslider = document.queryselector('gameface-rangeslider');
// either
rangeslider.value = ${newValue};
// or
rangeslider.setAttribute('value', ${newValue});
```

The `newValue` can be either a number or string when `values` attribute is set.

You can get the value of the rangeslider by doing

```javascript
const rangeslider = document.queryselector('gameface-rangeslider');
// either
console.log(rangeslider.value);
// or
console.log(rangeslider.getAttribute('value'));
```

#### Behaviors

If the `newValue` is invalid then the rangeslider is going to set the value to minimum.

* When the rangeslider works with number values (the `values` attribute is not set).
  * If the `newValue` is more that the maximum allowed then it will be set to maximum.
  * If the `step` attribute is used then setting the `value` is going to be pre-calculated to the next/previous value based on the `step` value. For example if the rangeslider has values from 0 to 100 and the `step` attribute value is 20 then setting `value` to 15 will be pre-calculated and set to 20. And if the `value` is 5 then will be set to 0.

* When the rangeslider works with values array (the `values` attribute is set).
  * You need to specify the `newValue` to be one from the `values` array. Otherwise it will be invalid and be set to the first value of the `values` array.

**For rangeslider that has `two-handles` enabled, setting the `value` is not possible for now.**

### `min`/`max`

**The `min` and `max` attributes are working just when the `values` attribute is not used.**

You can set them to the rangeslider by doing

```javascript
const rangeslider = document.queryselector('gameface-rangeslider');
// either
rangeslider.min = ${newValue}; // same for the `max`
// or
rangeslider.setAttribute('min', ${newValue}); // same for the `max`
```

The `newValue` should **always** be a number.

You can get the `min` or `max` of the rangeslider by doing

```javascript
const rangeslider = document.queryselector('gameface-rangeslider');
// either
console.log(rangeslider.min);
// or
console.log(rangeslider.getAttribute('min'));
```

#### Behaviors

**`min` and `max` are not taking effect when `values` attribute is set!**

Also when you change the `min` or `max` and the current `value` is less/greater than min/max it will be automatically be set to min/max value. This behavior works as well when the slider has two handles enabled by the `two-handles` attribute.

When the `min` or `max` are changed and if the `grid` of the rangeslider is enabled then it will be precalculated and re-rendered showing the new and true values of the slider.

### `step`

**The `step` attribute is not taking effect when the `values` attribute is used.**

You can set `step` to the rangeslider by doing

```javascript
const rangeslider = document.queryselector('gameface-rangeslider');
// either
rangeslider.step = ${newValue};
// or
rangeslider.setAttribute('step', ${newValue});
```

The `newValue` should **always** be a number.

You can get the `step` of the rangeslider by doing

```javascript
const rangeslider = document.queryselector('gameface-rangeslider');
// either
console.log(rangeslider.step);
// or
console.log(rangeslider.getAttribute('step'));
```

#### Behaviors

When the `step` is changed then the rangeslider will pre-calculate the current value to match the step conditions! This behavior works as well when the slider has two handles enabled by the `two-handles` attribute.

### `grid`

You can enable/disable the `grid` of the rangeslider by doing

```javascript
const rangeslider = document.queryselector('gameface-rangeslider');
// either
rangeslider.grid = ${newValue};
// or
rangeslider.setAttribute('grid', ${newValue});
```

The `newValue` should **always** be a boolean(`true` or `false`).

You can get the `grid` of the rangeslider by doing

```javascript
const rangeslider = document.queryselector('gameface-rangeslider');
// either
console.log(rangeslider.grid);
// or
console.log(rangeslider.getAttribute('grid'));
```

### `polsNumber`

You can set the `pols number` in the `grid` of the rangeslider by doing

```javascript
const rangeslider = document.queryselector('gameface-rangeslider');
// either
rangeslider.polsNumber = ${newValue};
// or
rangeslider.setAttribute('pols-number', ${newValue});
```

The `newValue` should **always** be a number above `1`

You can get the `grid` of the rangeslider by doing

```javascript
const rangeslider = document.queryselector('gameface-rangeslider');
// either
console.log(rangeslider.polsNumber);
// or
console.log(rangeslider.getAttribute('pols-number'));
```

### `thumb`

You can enable/disable the `thumb` of the rangeslider by doing

```javascript
const rangeslider = document.queryselector('gameface-rangeslider');
// either
rangeslider.thumb = ${newValue};
// or
rangeslider.setAttribute('thumb', ${newValue});
```

The `newValue` should **always** be a boolean(`true` or `false`).

You can get the `thumb` of the rangeslider by doing

```javascript
const rangeslider = document.queryselector('gameface-rangeslider');
// either
console.log(rangeslider.grid);
// or
console.log(rangeslider.getAttribute('thumb'));
```

### `two-handles`

**The `two-handles` attribute is not taking effect when `values` attribute is used.**

You can enable/disable the `two-handles` of the rangeslider by doing

```javascript
const rangeslider = document.queryselector('gameface-rangeslider');
// either
rangeslider.twoHandles = ${newValue};
// or
rangeslider.setAttribute('two-handles', ${newValue});
```

The `newValue` should **always** be a boolean(`true` or `false`).

You can get the `two-handles` of the rangeslider by doing

```javascript
const rangeslider = document.queryselector('gameface-rangeslider');
// either
console.log(rangeslider.twoHandles);
// or
console.log(rangeslider.getAttribute('two-handles'));
```

#### Behaviors

As the `value` is not taking effect when the `two-handles` is enabled then enabling it it will reset the current value to the min and max of the rangeslider. And if you disable the `two-handles` and there is a `value` it will be correctly set.

### `custom-handle`, `custom-handle-left`, `custom-handle-right`

**The `custom-handle` attribute is not taking effect when `two-handles` attribute is used.**
**The `custom-handle-left` and `custom-handle-right` attributes are not taking effect when `two-handles` attribute is not used.**

You can retarget the custom handle of the rangeslider by doing

```javascript
const rangeslider = document.queryselector('gameface-rangeslider');
// either
rangeslider.customHandle = ${newValue}; // works the same for the customHandleLeft and customHandleRight
// or
rangeslider.setAttribute('custom-handle', ${newValue}); // works the same for the custom-handle-left and custom-handle-right
```

The `newValue` should **always** be a string that represents a CSS selector (such as `#my-target`, `.my-target-class`, etc.).

You can get the custom handle/s DOM elements of the rangeslider by doing

```javascript
const rangeslider = document.queryselector('gameface-rangeslider');
// either
console.log(rangeslider.customHandle); // works the same for the customHandleLeft and customHandleRight
// or
console.log(rangeslider.getAttribute('custom-handle')); // works the same for the custom-handle-left and custom-handle-right
```

**Note that it will return the DOM element of the custom handle and not the selector!**

#### Behaviors

**For now when the `custom-handle/-left/-right` are changed then the new target is not going to receive the value of the slider until it has not changed!**

### `values`

You can add `values` of the rangeslider by doing

```javascript
const rangeslider = document.queryselector('gameface-rangeslider');
// either
rangeslider.values = ${newValue};
// or
rangeslider.setAttribute('values', ${newValue}); // For example rangeslider.setAttribute('values', '["Easy", "Hard", "Expert"]')
```

The `newValue` should **always** be an array with string values.

You can get the `values` of the rangeslider by doing

```javascript
const rangeslider = document.queryselector('gameface-rangeslider');
// either
console.log(rangeslider.values);
// or
console.log(rangeslider.getAttribute('values'));
```

#### Behaviors

If `values` are set then the rangeslider is going to be re-rendered based on the added `values`.

### `orientation`

You can add `orientation` of the rangeslider by doing

```javascript
const rangeslider = document.queryselector('gameface-rangeslider');
// either
rangeslider.orientation = ${newValue};
// or
rangeslider.setAttribute('orientation', ${newValue});
```

The `newValue` should **always** be either 'horizontal' or 'vertical'. Any other value will fallback to 'horizontal'.

You can get the `orientation` of the rangeslider by doing

```javascript
const rangeslider = document.queryselector('gameface-rangeslider');
// either
console.log(rangeslider.orientation);
// or
console.log(rangeslider.getAttribute('orientation'));
```
