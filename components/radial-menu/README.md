<!--Copyright (c) Coherent Labs AD. All rights reserved. Licensed under the MIT License. See License.txt in the project root for license information. -->

<a href="https://www.npmjs.com/package/coherent-gameface-radial-menu"><img src="http://img.shields.io/npm/v/coherent-gameface-radial-menu.svg?style=flat-square"/></a>

The radial-menu is part of the Gameface custom Components suite.

Installation
===================

```
npm i coherent-gameface-radial-menu
```

## Usage with UMD:

~~~~{.html}
<script src="./node_modules/coherent-gameface-radial-menu/dist/radial-menu.production.min.js"></script>
~~~~

* add the radial-menu Component to your html:

~~~~{.html}
<gameface-radial-menu></gameface-radial-menu>
~~~~

This is all! Load the file in Gameface to see the radial-menu.

## Usage with JavaScript:

If you wish to import the RadialMenu using JavaScript you can remove the script tag and import it like this:

~~~~{.js}
import { RadialMenu } from 'coherent-gameface-radial-menu';
~~~~

or simply

~~~~{.js}
import 'coherent-gameface-radial-menu';
~~~~

Note that this approach requires a module bundler like
[Webpack](https://webpack.js.org/) or [Rollup](https://rollupjs.org/guide/en/)
to resolve the modules from the node_modules folder.

# Features and Configuration

The radial menu has a few `data-`* attributes by which it is configured.

Here is an example with all available attributes:
```html
<gameface-radial-menu
    id="radial-menu-one"
	data-name="Radial Menu"
	data-change-event-name="radOneItemChanged"
	data-select-event-name="radOneItemSelected"
	data-open-key-code="SHIFT">
</gameface-radial-menu>
```

The `id` attribute is added so the radial menu instance can be accessed later
for providing the items to it. It is not required.

### Name

Set the name by providing `data-name="Example Name"`. This will be visualized
at the center of the menu.

### Assign Open Key

Set a key for opening the menu by directly providing a `keyCode` value to the
`data-open-key-code` attribute or use some of the defined names in the
components.KEYCODES object e.g. HOME, CTRL, SPACE.

### Populate Items

Create segments in the menu by providing an exposed array of items to the
instance of the targeted radial menu on the `items` property like so:
```js
const radialMenuOne = document.getElementById('radial-menu-one');
// Provide the items.
radialMenuOne.items = itemsModel.items;
```

### Slots

The `radial-menu-center` slot specifies the element in the middle of the menu. By default there is a circle background - bullseye and a text. You can customize them. Currently the slot in the template contains:

```html
<component-slot class="guic-radial-menu-center" data-name="radial-menu-center">
    <div class="guic-radial-menu-center-bullseye"></div>
    <div class="guic-radial-menu-center-text">Radial Menu</div>
</component-slot>
```

You can add an element with a background image for example:

```html
<gameface-radial-menu id="radial-menu-one">
    <div slot="radial-menu-center" class="radial-menu-center">
        <div class="radial-menu-center-bullseye"></div>
        <div class="radial-menu-center-image"></div>
    </div>
</gameface-radial-menu>
```

The the styles for `radial-menu-center-bullseye`, `radial-menu-center-image` and `radial-menu-center` are:

```css
.radial-menu-center-bullseye {
    position: absolute;
    width: 80%;
    height: 80%;
    background-color: #4a9cc5;
    border-radius: 50%;
}

.radial-menu-center-image {
    position: absolute;
    width: 80%;
    height: 80%;
    background-image: url('./images/GameMessage_AchievmentIcon.png');
    background-size: cover;
    background-repeat: no-repeat;
}

.radial-menu-center {
    position: absolute;
    width: 23.7vh;
    height: 23.7vh;
    display: flex;
    justify-content: center;
    align-items: center;
}
```

Note: Any additional elements in the **slot** should have a `position` property in order to be visible in this case i.e. to be higher in the stacking (context) order.

### Events

* Provide the name of the event that will be emitted by the component (instance)
when another item is highlighted to the `data-change-event-name` attribute.

* Provide the name of the event that will be emitted by the component (instance)
when an item is selected to the `data-select-event-name` attribute.

A basic approach which allows executing code through the event and the code or
the attached functions are decoupled from the component itself.

### Listener for Opening

If case there is a need to disable the radial menu from opening, just get the
component Element object and call `removeOpenKeyEvent()`.

Example:
```js
const radialMenuOne = document.getElementById('radial-menu-one');
radialMenuOne.removeOpenKeyEvent();
```

Then re-add the listener with `radialMenuOne.addOpenKeyEvent()` when needed.

In case the key with which the radial menu should be opened needs to change,
before adding the event, change the keyCode
with `radialMenuOne.openKeyCode = <number>`;

## Specifications Overview

* Event listeners for `mousemove`, `click`, `resize` and `keyup` are added on
opening the menu and removed when it is closed.

* The topmost item's segment id is 0 and the first item from the
provided array is created there.

* Multiple menus can be created.

* The menu is hidden with `visibility: hidden` so it is more light when it is
opened again.

## Add the Styles

~~~~{.css}
<link rel="stylesheet" href="coherent-gameface-components-theme.css">
<link rel="stylesheet" href="style.css">
~~~~

To overwrite the default styles, simply create new rules for the class names that
you wish to change and include them after the default styles.