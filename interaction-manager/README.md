<!--Copyright (c) Coherent Labs AD. All rights reserved. Licensed under the MIT License. See License.txt in the project root for license information. -->

# Interaction Manager

The `coherent-gameface-interaction-manager` is a JS library for the most common UI interactions.

The library’s aim is to provide an easy implementation for things like gamepad controls, spatial-navigation, drag and drop, resizing, rotating and panzoom.

## Getting Started

To get started, you will first need to install the `coherent-gameface-interaction-manager` after that you can create different interactions based on your project needs.

For example to set up a draggable object, you just need to do:

```javascript
const square = new interactionManager.draggable({ element: '.square' });
```

## Features

The `coherent-gameface-interaction-manager` supports the following features:

-   Easy to set up and use keyboard combinations.
-   Quick gamepad setup with button and joystick handling.
-   Register and execute actions anywhere in your code. Fast way to share the same behavior between multiple inputs.
-   Spatial navigation with different navigatable areas and gamepad support.
-   Drag and drop with separate option for dropzones
-   Resize elements
-   Rotate elements
-   Pan and zoom

All of these features can be loaded individually from the `coherent-gameface-interaction-manager` library.

```javascript
import {keyboard, gamepad, actions, spatialNavigation, draggable, dropzone, resize, rotate, zoom} from 'coherent-gameface-interaction-manager`
```

You can also download and load them as individual scripts

```html
<script src="coherent-gameface-interaction-manager/dist/keyboard.min.js"></script>
```

## Documentation

For more information on how to use the `coherent-gameface-interaction-manager` you can refer to the [Documentation](https://coherentlabs.github.io/GameUIComponents/en/interaction-manager/installation/).
