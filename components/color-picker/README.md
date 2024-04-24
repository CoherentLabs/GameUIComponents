<a href="https://www.npmjs.com/package/coherent-gameface-color-picker"><img src="http://img.shields.io/npm/v/coherent-gameface-color-picker.svg?style=flat-square"/></a>

The gameface-color-picker is part of the Gameface custom components suite. As most of the components in this suite it uses slots to allow dynamic content.


Installation
===================

```
npm i coherent-gameface-color-picker
```

Usage
===================
The color-picker component comes with UMD builds.

## Usage with UMD modules:

* import the color-picker component:

~~~~{.html}
<script src="./node_modules/color-picker/dist/color-picker.production.min.js"></script>
~~~~

* add the gameface-color-picker component to your html:

~~~~{.html}
<gameface-color-picker class="color-picker-component"></gameface-color-picker>
~~~~

This is all! Load the file in Gameface to see the color-picker.

## Usage with JavaScript:

If you wish to import the modules using JavaScript you can remove the script tags
which import the components and the color-picker from the node_modules folder and import them like this:

~~~~{.js}
import {ColorPicker} from 'coherent-gameface-color-picker';
~~~~

or simply

~~~~{.js}
import 'coherent-gameface-color-picker';
~~~~

Note that this approach requires a module bundler like [Webpack](https://webpack.js.org/) or [Rollup](https://rollupjs.org/guide/en/) to resolve the
modules from the node_modules folder.

## How to use

To use simply add
~~~~{.html}
<gameface-color-picker></gameface-color-picker>
~~~~

### Setting up the initial color of the picker

To set the initial color of the color picker, you can use the `value` attribute and set it to a color in any of the following formats `HEX`, `HEXA`, `RGB`, `RGBA`, `HSL` and `HSLA`.

Example:
~~~~{.html}
<gameface-color-picker value="#FF0000"></gameface-color-picker>
~~~~

### Setting the color dynamically

To set the color dynamically you can either set the attribute directly using the `DOM APIs`

```javascript
const colorPicker = document.querySelector('gameface-color-picker');

colorPicker.setAttribute('value', ${newValue});
```
 
or directly by changing the `value` property

```javascript
colorPicker.value = ${newValue}
```

The `newValue` should be a color string of one of the following formats `HEX`, `HEXA`, `RGB`, `RGBA`, `HSL` and `HSLA`

### Listening for changes in the color picker

To listen for changes in the color picker you can attach an event listener to the `colorchange` event

```javascript
const colorPicker = document.querySelector('gameface-color-picker');

colorPicker.addEventListener('colorchange', () => {
    // Do something
})
```