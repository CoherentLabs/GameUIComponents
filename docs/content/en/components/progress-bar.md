---
date: 2023-10-11
title: Progress bar
draft: false
---

<!--Copyright (c) Coherent Labs AD. All rights reserved. Licensed under the MIT License. See License.txt in the project root for license information. -->

<a href="https://www.npmjs.com/package/coherent-gameface-progress-bar"><img src="http://img.shields.io/npm/v/coherent-gameface-progress-bar.svg?style=flat-square"/></a>

The progress-bar is part of the Gameface custom components suite.

Installation
===================

```
npm i coherent-gameface-progress-bar
```

## Usage with UMD:

~~~~{.html}
<script src="./node_modules/coherent-gameface-progress-bar/dist/progress-bar.production.min.js"></script>
~~~~

* add the progress-bar component to your html:

~~~~{.html}
<gameface-progress-bar></gameface-progress-bar>
~~~~

Configuration and usage is explained further down the document. 

## Usage with JavaScript:

If you wish to import the ProgressBar using JavaScript you can remove the script tag and import it like this:

~~~~{.js}
import { ProgressBar } from 'coherent-gameface-progress-bar';
~~~~

or simply

~~~~{.js}
import 'coherent-gameface-progress-bar';
~~~~

Note that this approach requires a module bundler like
[Webpack](https://webpack.js.org/) or [Rollup](https://rollupjs.org/guide/en/)
to resolve the modules from the node_modules folder.

# Configuration and Usage

The progress-bar has `data-animation-duration` attribute by which the animation
duration between the start and the end target value is set. The value is
expected to be a number and it is used as milliseconds.

The attribute is optional and if not provided, there will be no animation when
setting the new progress.

Here is an example:
```html
<gameface-progress-bar
	data-animation-duration="2000">
</gameface-progress-bar>
```

## Add the Styles

~~~~{.css}
<link rel="stylesheet" href="coherent-gameface-components-theme.css">
<link rel="stylesheet" href="style.css">
~~~~

To overwrite the default styles, simply create new rules for the class names
that you wish to change and include them after the default styles.

Load the HTML file in Gameface to see the progress-bar.

## Usage

Taking into account the example code above and then:

```js
const progressBar = document.querySelector('gameface-progress-bar');
// and set the progress with:
progressBarOne.setProgress(100);
```

## Specifications Overview

- The progress can be set in ascending or descending order.
- Works with and without an animation (through the `data-animation-duration`
  attribute on the HTML element). 
- Provide values between 0 and 100. This is the target `%` to which the bar will
animate.
