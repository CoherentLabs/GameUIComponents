---
date: 2022-3-25
title: Accordion menu
draft: false
---

<!--Copyright (c) Coherent Labs AD. All rights reserved. Licensed under the MIT License. See License.txt in the project root for license information. -->

The accordion-menu is part of the Gameface custom components suite. As most of the components in this suite it uses slots to allow dynamic content.

# Usage

Some experimental change to check the action.
Some experimental change to check the action.
Some experimental change to check the action.
Some experimental change to check the action.
The accordion-menu component comes with UMD and CJS builds.
The accordion-menu component comes with UMD and CJS builds.
The accordion-menu component comes with UMD and CJS builds.
The accordion-menu component comes with UMD and CJS builds.
The accordion-menu component comes with UMD and CJS builds.
The accordion-menu component comes with UMD and CJS builds.
The accordion-menu component comes with UMD and CJS builds.
The accordion-menu component comes with UMD and CJS builds.
The accordion-menu component comes with UMD and CJS builds.

# Installation

`npm i coherent-gameface-accordion-menu`

## Usage with UMD modules:

- import the components library:

```{.html}
<script src="./node_modules/coherent-gameface-components/umd/components.production.min.js"></script>
```

- import the accordion-menu component:

```{.html}
<script src="./node_modules/coherent-gameface-accordion-menu/umd/accordion-menu.production.min.js"></script>
```

- add the gameface-accordion-menu component to your html along with the gameface-accordion-panel, gameface-accordion-header and gameface-accordion-content:

```{.html}
<gameface-accordion-menu></gameface-accordion-menu>
```

This is all! Load the file in Gameface to see the accordion-menu.

If you wish to import the modules using JavaScript you can remove the script tags which import the components and the accordion-menu from the node_modules folder and import them like this:

```{.js}
import components from 'coherent-gameface-components';
import accordionMenu from 'coherent-gameface-accordion-menu';
```

Note that this approach requires a module bundler like [Webpack](https://webpack.js.org/) or [Rollup](https://rollupjs.org/guide/en/) to resolve the modules from the node_modules folder. Alternatively you can import them directly from node_modules:

```{.js}
import components from './node_modules/coherent-gameface-components/umd/components.production.min.js';
import accordionMenu from './node_modules/coherent-gameface-accordion-menu/umd/accordion-menu.production.min.js';
```

## Usage with CJS modules:

- Import the components library:

```{.js}
const components = require('coherent-gameface-components');
const accordionMenu = require('coherent-gameface-accordion-menu');
```

The CommonJS(CJS) modules are used in a NodeJS environment, be sure to use a module bundler in order to be use them in a browser.

## Add the styles

```{.html}
<link rel="stylesheet" href="coherent-gameface-components-theme.css">
<link rel="stylesheet" href="style.css">
```

To overwrite the default styles, simply create new rules for the class names that you wish to change and include them after the default styles.

Load the HTML file in Gameface to see the accordion-menu.

## How to use

To use the accordion-menu component add the following element to your html

```{.html}
<gameface-accordion-menu></gmeface-accordion-menu>
```

To add panels that will expand on click you need to add gameface-accordion-panel.

```{.html}
<gameface-accordion-menu >
    <gameface-accordion-panel slot="accordion-panel">
        <gameface-accordion-header>Long Text</gameface-accordion-header>
        <gameface-accordion-content>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eius, in! At nesciunt earum ea deserunt architecto animi quod
            neque dicta asperiores. Error aliquid facilis hic in culpa quisquam temporibus aliquam. 
        </gameface-accordion-content>
    </gameface-accordion-panel>
</gameface-accordion-menu>
```

You can add a gameface-accordion-panel for each panel in the accordion menu, it needs to contain a gameface-accordion-header and gameface-accordion-content components to display properly. The gameface-accordion-header is the part of the panel that is always visible and the gameface-accordion-content is hidden and gets expanded.

You can use the following attributes to customize the accordion-menu

|Attribute   |Type   |Default   | Description |
|---|---|---|---|
|multiple  | Boolean   |false   | If you can expand multiple panels at once   |

You can also add the following attributes to the gameface-accordion-panel

|Attribute   |Type   |Default   | Description   |
|---|---|---|---|
|disabled  | Boolean   |false   | If the panel is disabled. You can't expand or shrink disabled panels  |
|expanded   | Boolean   |false   | If the panel is expanded on load    |
