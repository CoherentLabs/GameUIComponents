---
date: 2022-3-08
title: "Scrollable-container"
draft: false
---

<!--Copyright (c) Coherent Labs AD. All rights reserved. Licensed under the MIT License. See License.txt in the project root for license information. -->
The gameface-scrollable-container is part of the Gameface custom components suite. As most of the components in this suite it uses slots to allow dynamic content.

Installation
===================

`npm i coherent-gameface-scrollable-container`

Usage
===================
The gameface-scrollable-container component comes with UMD and CJS builds.

## Usage with UMD modules:

* import the components library:

~~~~{.html}
<script src="./node_modules/coherent-gameface-components/umd/components.production.min.js"></script>
~~~~

* import the gameface-scrollable-container component:

~~~~{.html}
<script src="./node_modules/coherent-gameface-scrollable-container/umd/scrollable-container.production.min.js"></script>
~~~~

* add the gameface-scrollable-container component to your html:

~~~~{.html}
<gameface-scrollable-container class="scrollable-container-component"></gameface-scrollable-container>
~~~~

This is all! Load the file in Gameface to see the gameface-scrollable-container.

If you wish to import the modules using JavaScript you can remove the script tags
which import the components and the gameface-scrollable-container from the node_modules folder and import them like this:

~~~~{.js}
import components from 'coherent-gameface-components';
import GamefaceScrollableContainer from 'coherent-gameface-scrollable-container';
~~~~

Note that this approach requires a module bundler like [Webpack](https://webpack.js.org/) or [Rollup](https://rollupjs.org/guide/en/) to resolve the
modules from the node_modules folder. Alternatively you can import them directly from node_modules:

~~~~{.js}
import components from './node_modules/coherent-gameface-components/umd/components.production.min.js';
import GamefaceScrollableContainer from './node_modules/coherent-gameface-scrollable-container/umd/scrollable-container.production.min.js';
~~~~

## Usage with CJS modules:

* Import the components library:

~~~~{.js}
const components = require('coherent-gameface-components');
const GamefaceScrollableContainer = require('coherent-gameface-scrollable-container');
~~~~

The CommonJS(CJS) modules are used in a NodeJS environment, be sure to use a module
bundler in order to use them in a browser.

## Manually showing and resizing the scrollbar

If the scrollable container is hidden, you'll need to manually re-initialize the scrollbar once you show the scrollable container.
The scrollable container has a method called **showScrollBar**. It accepts the scrollbar as an argument:

~~~~{.js}
const scrollableContainer = document.querySelector('.guic-scrollable-container');
scrollableContainer.showScrollBar(scrollableContainer.scrollbar);
~~~~

To resize the scrollbar call the **resize** function of the scrollbar and pass it the
scrollable container as an argument:

~~~~{.js}
const scrollableContent = scrollableContainer.querySelector('[name="scrollable-content"]');
const scrollableContainer = document.querySelector('.guic-scrollable-container');

scrollableContainer.scrollbar.resize(scrollableContent);
~~~~

The scrollableContainer has a method called **shouldShowScrollbar** which checks if the scrollable content is bigger than the scrollable container and if it is - it shows the scrollbar. Use this if you are not sure if you have to show the scrollbar:

~~~~{.js}
const scrollableContainer = document.querySelector('.guic-scrollable-container');
scrollableContainer.shouldShowScrollbar();
~~~~

If you need to hide the scrollbar - use the **hideScrollBar method** and pass it the scrollbar as an argument:

~~~~{.js}
const scrollableContainer = document.querySelector('.guic-scrollable-container');
scrollableContainer.hideScrollBar(scrollableContainer.scrollbar);
~~~~

## Automatically showing and resizing the scrollbar

To automatically show, hide and resize the scrollbar set the `automatic` attribute to the `<gameface-scrollable-container>` element. This will initiate an observer that will monitor the `scrollable-container` for changes so that it can automatically re-adjust itself if it has to. *Keep in mind that a [mutationObserver](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver) can affect the performance of your UI. Consider manually re-adjusting the scrollbar if its content will change multiple tiles in a frame.*

`<gameface-scrollable-container class="scrollable-container-component fixed-width" automatic>`

## Add the Styles

~~~~{.css}
<link rel="stylesheet" href="coherent-gameface-components-theme.css">
<link rel="stylesheet" href="style.css">
<link rel="stylesheet" href="node_modules/coherent-gameface-slider/styles/horizontal.css">
<link rel="stylesheet" href="node_modules/coherent-gameface-slider/styles/vertical.css">
~~~~

To overwrite the default styles, simply create new rules for the class names that
you wish to change and include them after the default styles.