---
date: 2026-5-15
title: Slider
draft: false
---

<!--Copyright (c) Coherent Labs AD. All rights reserved. Licensed under the MIT License. See License.txt in the project root for license information. -->

<a href="https://www.npmjs.com/package/coherent-gameface-slider"><img src="http://img.shields.io/npm/v/coherent-gameface-slider.svg?style=flat-square"/></a>

<div style="background-color: rgba(255, 229, 100, 0.3); border-left: 5px solid #e5c100; padding: 15px; margin-bottom: 20px; border-radius: 4px;">
  <h3 style="margin-top: 0">⚠️ Package Deprecated</h3>
  <p style=" margin-bottom: 0;">
    This legacy package has been deprecated in favor of the updated Gameface UI suite. 
    Please switch to the official framework at <a href="https://gameface-ui.coherent-labs.com/" style=" font-weight: bold; text-decoration: underline;">Gameface UI</a>.
  </p>
</div>

The gameface-slider is part of the Gameface custom components suite. As most of the components in this suite it uses slots to allow dynamic content.

Installation
===================

```
npm i coherent-gameface-slider
```

## Usage with UMD:

* add the gameface-slider component to your html:

~~~~{.html}
<gameface-slider class="gameface-slider-component"></gameface-slider>
~~~~

This is all! Load the file in Gameface to see the gameface-slider.

## Usage with JavaScript:

If you wish to import the Slider using JavaScript you can remove the script tag and import it like this:

~~~~{.js}
import { Slider } from 'coherent-gameface-slider';
~~~~

or simply

~~~~{.js}
import 'coherent-gameface-slider';
~~~~

Note that this approach requires a module bundler like [Webpack](https://webpack.js.org/) or [Rollup](https://rollupjs.org/guide/en/) to resolve the
modules from the node_modules folder.

## Add the Styles

~~~~{.css}
<link rel="stylesheet" href="coherent-gameface-components-theme.css">
<link rel="stylesheet" href="styles/horizontal.css">
<link rel="stylesheet" href="styles/vertical.css">
~~~~

To overwrite the default styles, simply create new rules for the class names that
you wish to change and include them after the default styles.

## Updating the slider's state

You are able to dynamically update the slider state for the following properties:

* orientation - How the slider is oriented. Either 'horizontal' or 'vertical'.
* step - The scroll step of the slider that is used when scrolling with the mouse. The value provided should be a number. Negative values are also accepted and they can be used to invert the scroll direction.

You can set them via `setAttribute` or directly using the setters like `slider.orientation = 'horizontal'`.

For example:

```javascript
const slider = document.querySelector('gameface-slider');

slider.orientation = 'horizontal'; // or 'vertical'. If the passed value is not supported - the slider will fallback to default one - 'vertical'
// Or
slider.setAttribute('orientation', 'horizontal');

slider.step = 20; // If you want to invert the mouse wheel you can set negative value. For example -20.
// Or
slider.setAttribute('step', '20');
```

You can get the current orientation or step in the following way:

```javascript
console.log(slider.orientation);
console.log(slider.step);
```

You can also update the current handle position of the slider using the `scrollTo` method. It receives one argument that is the new position of the handle in percent.

```javascript
slider.scrollTo(50); // Will set the handle to position that is 50% of the available scroll bar area.
```

## Events

The `scrollTo` method dispatches a custom `slider-scroll` event, which can be listened to if something needs to be done on scroll

```javascript
document.querySelector('gameface-slider').addEventListener('slider-scroll', (event) => {
    const newHandlePosition = event.detail.handlePosition; // The new handle position
    //Do something here
})
```