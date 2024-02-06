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

## Attributes

### animation-duration

The progress-bar has `animation-duration` attribute by which the animation
duration between the start and the end target value is set. The value must be a positive number and it is used as milliseconds.

The attribute is optional and if not provided, there will be no animation when
setting the new progress.

Here is an example:
```html
<gameface-progress-bar animation-duration="2000"></gameface-progress-bar>
```

You can update it using the [setAttribute method](https://developer.mozilla.org/en-US/docs/Web/API/Element/setAttribute):

```js
document.querySelector('gameface-progress-bar').setAttribute('animation-duration', 1000);
```

You can also set it using JS:

```js
const progressBarOne = document.getElementById('progress-bar-one');
progressBarOne.animDuration = 5000;
```

Note that updating the `animation-duration` will start the animation from the beginning!

### target-value

It specifies the progress that should be reached in percents.
You can use it as an HTML attribute:

```html
<gameface-progress-bar animation-duration="1000" target-value="60"></gameface-progress-bar>
```

You can update it using the [setAttribute method](https://developer.mozilla.org/en-US/docs/Web/API/Element/setAttribute):

```js
document.querySelector('gameface-progress-bar').setAttribute('target-value', 100);
```

Or set it using JS [object property accessors](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Property_accessors):

```js
const progressBarOne = document.getElementById('progress-bar-one');
progressBarOne.targetValue = 100;
```

## Add the Styles

~~~~{.css}
<link rel="stylesheet" href="coherent-gameface-components-theme.css">
<link rel="stylesheet" href="style.css">
~~~~

To overwrite the default styles, simply create new rules for the class names
that you wish to change and include them after the default styles.

## Specifications Overview

- The progress can be set in ascending or descending order.
- Works with and without an animation (through the `data-animation-duration` attribute on the HTML element).
- Provide values between 0 and 100. This is the target `%` to which the bar will animate.
