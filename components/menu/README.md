<!--Copyright (c) Coherent Labs AD. All rights reserved. -->
The gameface-menu is part of the Gameface custom components suite. As most of the components in this suite it uses slots to allow dynamic content.


Usage
===================
The gameface-menu component comes with UMD and CJS builds.

## Usage with UMD modules:

* import the components library:

~~~~{.html}
<script src="./node_modules/coherent-gameface-components/umd/components.production.min.js"></script>
~~~~

* import the menu component:

~~~~{.html}
<script src="./node_modules/gameface-menu/umd/gameface-menu.production.min.js"></script>
~~~~

* add the menu component to your html:

~~~~{.html}
<gameface-menu></gameface-menu>
~~~~

This is all! Load the file in Gameface to see the menu.

If you wish to import the modules using JavaScript you can remove the script tags
which import the components and the gameface-menu from the node_modules folder and import them like this:

~~~~{.js}
import components from 'gameface-components';
import menu from 'gameface-menu';
~~~~

Note that this approach requires a module bundler like [Webpack](https://webpack.js.org/) or [Rollup](https://rollupjs.org/guide/en/) to resolve the
modules from the node_modules folder. Alternatively you can import them directly from node_modules:

~~~~{.js}
import components from './node_modules/coherent-gameface-components/umd/components.production.min.js';
import menu from './node_modules/gameface-menu/umd/gameface-menu.production.min.js';
~~~~

## Usage with CJS modules:

* Import the components library:

~~~~{.js}
const components = require('coherent-gameface-components');
const gameface-menu = require('gameface-menu');
~~~~

The CommonJS(CJS) modules are used in a NodeJS environment, be sure to use a module
bundler in order to be use them in a browser.


## Usage in the HTML:

The menu component exposes several custom HTML elements:
* `<gameface-menu>` - the menu component, it has one slot name menu-item; this is
where the menu elements go to; by default it is anchored to the top.
* `<menu-item>` - the menu item; provides navigation and onevent handlers

* `<gameface-left-menu>` - a gameface menu that is anchored to the left
* `<gameface-right-menu>` - a gameface menu that is anchored to the right
* `<gameface-bottom-menu>` - a gameface menu that is anchored to the bottom

~~~~{.html}
<gameface-menu>
    <menu-item slot="menu-item">Start Game</menu-item>
    <menu-item slot="menu-item">Settings</menu-item>
    <menu-item slot="menu-item">Credits</menu-item>
</gameface-menu>
~~~~

This will create a horizontal menu component. Use the orientation attribute to
change the layout of the menu to vertical:

~~~~{.html}
<gameface-menu orientation="vertical">
    <menu-item slot="menu-item">Start Game</menu-item>
    <menu-item slot="menu-item">Settings</menu-item>
    <menu-item slot="menu-item">Credits</menu-item>
</gameface-menu>
~~~~

The supported orientation values are horizontal and vertical.

And you can use one of the anchored menus for easier positioning.

The `<menu-item>` element supports all onevent handlers. If you want to execute a
function on click add it as you would normally add it to an HTMLElement:


~~~~{.html}
<gameface-menu orientation="vertical">
    <menu-item slot="menu-item" onclick="console.log('Clicked on Start Game.')">Start Game</menu-item>
</gameface-menu>
~~~~

or pass a function

~~~~{.html}
<script>
function onStartGame() {
    console.log('Clicked on Start Game.);
}
</script>

<gameface-menu orientation="vertical">
    <menu-item slot="menu-item" onclick="onStartGame()">Start Game</menu-item>
</gameface-menu>
~~~~


## Nesting Menus

You can put a `<gameface-menu>` element as a child of `<menu-item>` of you want to have a
sub-menu. The nested menu will be automatically displayed on click of the parent menu-item.
It will also be automatically positioned.

~~~~{.html}
<gameface-menu>
    <menu-item slot="menu-item">Start Game</menu-item>
    <menu-item slot="menu-item">
        Settings
        <gameface-menu id="settings" orientation="vertical">
            <menu-item slot="menu-item">Graphics</menu-item>
            <menu-item slot="menu-item">Keyboard</menu-item>
            <menu-item slot="menu-item">Mouse</menu-item>
        </gameface-menu>
    </menu-item>
    <menu-item slot="menu-item">Credits</menu-item>
</gameface-menu>
~~~~

## Import the Styles

These are the styles required for all menus:

~~~~{.css}
<link rel="stylesheet" href="components-theme.css">
<link rel="stylesheet" href="menus/menu.css">
<link rel="stylesheet" href="menus/bottom/bottom.css">
<link rel="stylesheet" href="menus/left/left.css">
<link rel="stylesheet" href="menus/right/right.css">
~~~~