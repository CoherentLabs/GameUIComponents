---
date: 2023-10-11
title: Stepper
draft: false
---

<!--Copyright (c) Coherent Labs AD. All rights reserved. Licensed under the MIT License. See License.txt in the project root for license information. -->

<a href="https://www.npmjs.com/package/coherent-gameface-stepper"><img src="http://img.shields.io/npm/v/coherent-gameface-stepper.svg?style=flat-square"/></a>

The stepper is part of the Gameface custom components suite. As most of the components in this suite it uses slots to allow dynamic content.

Installation
===================

`npm i coherent-gameface-stepper`

## Usage with UMD:

~~~~{.html}
<script src="./node_modules/stepper/dist/stepper.production.min.js"></script>
~~~~

* add the stepper component to your html:

~~~~{.html}
<stepper class="stepper-component"></stepper>
~~~~

This is all! Load the file in Gameface to see the stepper.

## Usage with JavaScript:

If you wish to import the Stepper using JavaScript you can remove the script tag and import it like this:

~~~~{.js}
import { Stepper } from 'coherent-gameface-stepper';
~~~~

or simply

~~~~{.js}
import 'coherent-gameface-stepper';
~~~~

Note that this approach requires a module bundler like [Webpack](https://webpack.js.org/) or [Rollup](https://rollupjs.org/guide/en/) to resolve the
modules from the node_modules folder.

## Add the styles

~~~~{.html}
<link rel="stylesheet" href="coherent-gameface-components-theme.css">
<link rel="stylesheet" href="style.css">
~~~~
To overwrite the default styles, simply create new rules for the class names that you wish to change and include them after the default styles.

### Classes you can override
| Class Name | What it styles |
|------------|----------------|
|guic-stepper|The stepper element|
|guic-stepper-button| The buttons that control the stepper|
|guic-stepper-button:hover|The style while hovering on the button|
|guic-stepper-button:active|The style while pressing the button|
|guic-stepper-left::after| The left button. Change the content to change the button type or add an image|
|guic-stepper-right::after| The right button. Change the content to change the button type or add an image|
|guic-stepper-value|The container of the value of the stepper|


Load the HTML file in Gameface to see the stepper.

## How to use

To use add to your html code the following

```{.html}
<gameface-stepper>
    <gameface-stepper-item>Easy</gameface-stepper-item>
    <gameface-stepper-item>Medium</gameface-stepper-item>
    <gameface-stepper-item>Hard</gameface-stepper-item>
    <gameface-stepper-item>Expert</gameface-stepper-item>
    <gameface-stepper-item>Legendary</gameface-stepper-item>
    <gameface-stepper-item>Impossible</gameface-stepper-item>
</gameface-stepper>
```

Add your stepper options using the `<gameface-stepper-item>` element. If there is one or no values, it will default to `true` and `false`.

To set a default selected value add the `selected` attribute to the `<gameface-stepper-item>` element, otherwise it will select the first option.

```{.html}
    <gameface-stepper-item selected>Easy</gameface-stepper-item>
```

### Controling the stepper from the JavaScript code

To control the stepper you must select using JS and then use the `next` and `prev` methods.

For example this is how you would control it using the keyboard left and right arrow keys:

```{.js}
const stepper = document.querySelector('gameface-stepper');

document.addEventListener('keydown', (e) => {
    if (e.keyCode === 37) {
        stepper.prev();
    }

    if (e.keyCode === 39) {
        stepper.next();
    }
});
```