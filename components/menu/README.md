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
<gameface-menu class="gameface-menu-component"></gameface-menu>
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

The menu component exposes two custom HTML elements:
* <gameface-menu> - the menu component, it has one slot name menu-item; this is
where the menu elements go to
* <menu-item> - the menu item; provides navigation and onevent handlers

~~~~{.html}
<gameface-menu>
    <menu-item slot="menu-item">Start Game</menu-item>
    <menu-item slot="menu-item">Settings</menu-item>
    <menu-item slot="menu-item">Credits</menu-item>
</gameface-menu>
~~~~

This will produce a horizontal menu component. Use the orientation attribute to
change the layout of the menu to vertical:

~~~~{.html}
<gameface-menu orientation="vertical">
    <menu-item slot="menu-item">Start Game</menu-item>
    <menu-item slot="menu-item">Settings</menu-item>
    <menu-item slot="menu-item">Credits</menu-item>
</gameface-menu>
~~~~

The supported orientation values are horizontal and vertical.

The <menu-item> element supports the following attributes:
* callback - a JavaScript code that will be executed on click
* data-toggle - the id of a sub-menu that should be opened on click of this menu item
* hover - true or false - show and hide the sub-menu on `mouseover` and `mouseout` instead of on click


## Nesting Menus

You can put a <gameface-menu> element as a child of <menu-item> of you want to have a
sub-menu. Use the data-toggle attribute to specify which menu should be displayed on
click of a certain <menu-item>:

~~~~{.html}
<gameface-menu class="gameface-menu-component" orientation="horizontal">
    <menu-item slot="menu-item">Start Game</menu-item>
    <menu-item slot="menu-item" data-toggle="settings">
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