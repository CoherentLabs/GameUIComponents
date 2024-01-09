---
date: 2024-1-12
title: Carousel
draft: false
---

<!--Copyright (c) Coherent Labs AD. All rights reserved. Licensed under the MIT License. See License.txt in the project root for license information. -->

<a href="https://www.npmjs.com/package/coherent-gameface-carousel"><img src="http://img.shields.io/npm/v/coherent-gameface-carousel.svg?style=flat-square"/></a>

The `coherent-gameface-carousel` is part of the Gameface custom components suite. As most of the components in this suite it uses slots to allow dynamic content.

Usage
===================
The `coherent-gameface-carousel` component comes with UMD and CJS builds.

## Usage with UMD modules:

~~~~{.html}
<script src="./node_modules/coherent-gameface-carousel/dist/carousel.production.min.js"></script>
~~~~

* add the `coherent-gameface-carousel` component to your html:

~~~~{.html}
<gameface-carousel>
    <div slot="carousel-content">0</div>
    <div slot="carousel-content">1</div>
    <div slot="carousel-content">2</div>
    <div slot="carousel-content">3</div>
    <div slot="carousel-content">4</div>
    <div slot="carousel-content">5</div>
    <div slot="carousel-content">6</div>
    <div slot="carousel-content">7</div>
</gameface-carousel>
~~~~

This is all! Load the file in Gameface to see the `coherent-gameface-carousel`.

## Usage with JavaScript:

If you wish to import the modules using JavaScript you can remove the script tags
which import the components and the `coherent-gameface-carousel` from the `node_modules` folder and import them like this:

~~~~{.js}
import { Carousel } from 'coherent-gameface-carousel';
~~~~

or simply

~~~~{.js}
import 'coherent-gameface-carousel';
~~~~

Note that this approach requires a module bundler like [Webpack](https://webpack.js.org/) or [Rollup](https://rollupjs.org/guide/en/) to resolve the
modules from the node_modules folder.


Public API
===================

# Properties

### currentItemIndex

This is the index of the active item. It returns a number. You can set it and the carousel will scroll to the specified element. You must pass a number corresponding to an existing item in the carousel.

~~~{.js}
document.querySelector('gameface-carousel').currentItemIndex = 0;
~~~

### items

Returns an array of HTMLElements - the carousel items. Setting it will **replace all** current items with the ones from the array.

~~~{.js}
document.querySelector('gameface-carousel').items = [HTMLElementInstance, HTMLElementInstance1, HTMLElementInstanceN, ...];
~~~

### currentPage

Returns the index of the currently active page. Setting it will scroll the carousel to specified page.

~~~{.js}
document.querySelector('gameface-carousel').currentPage = 1;
~~~

### 

# Available Slots
### carousel-content

The carousel supports a dynamic slot that is supposed to hold its items - `carousel-content`. To add an item into this slot specify its slot attribute:

~~~~{.html}
<div slot="carousel-content">7</div>
~~~~

All elements that have this slot attribute will be initially added to the carousel.

### carousel-next and carousel-previous

These slots are reserved for the navigation controls that change the currently active carousel items. By default they are right and left pointing arrows. Set the slot attribute to `next` or `previous` to an element to use custom navigation controls:

~~~~{.html}
<gameface-carousel>
    <button slot="carousel-next">Next</div>
    <button slot="carousel-previous">Prev</div>
<gameface-carousel>
~~~~

# Adding items to the carousel
`addItem(element, index)`

Use the `addItem` method to add a new item:

## Parameters

- `element` - the new carousel item that should be added
- `[index]` - the index at which to add the new item

~~~~{.js}
const carouselItem = document.createElement('div');
carouselItem.textContent = 'Hello, there!';

document.querySelector('gameface-carousel').addItem(cItem);
~~~~

# Removing items from the carousel

`removeItem(index)`

Use the `removeItem` method to remove an item:

## Parameters

- `[index]` - the index of the item that is to be removed, if omitted - will remove the first element

~~~~{.js}
document.querySelector('gameface-carousel').removeItem();
~~~~

# Updating the page size

Use the `pageSize` setter to change the number of simultaneously visible elements.

~~~~{.js}
document.querySelector('gameface-carousel').pageSize = 3;
~~~~

# Limitations

Currently all items in the carousel must have the same width and height otherwise the component will not be properly resized.