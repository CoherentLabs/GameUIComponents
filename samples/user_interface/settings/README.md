<!--Copyright (c) Coherent Labs AD. All rights reserved. -->
#Creating a Settings Screen Using GameUIComponents

All GameUI components are node modules. This means that they can be installed
using the node package manager - npm. We'll use all components in this sample, so
we'll need to installed them. To do this simply run

`npm i` for each of them.

```
npm i coherent-gameface-components
npm i coherent-gameface-checkbox
npm i coherent-gameface-grid
npm i coherent-gameface-modal
npm i coherent-gameface-tabs
npm i gameface-menu
npm i gameface-scrollable-container
```

Each of these components export either a custom element or a suite of class names
that provide CSS rules that will help you style your user interface.

The coherent-gameface-components is the library that enables the components.
It provides the base for the components.

The UI that we'll create is going to have three main pages that will be
accessible through a menu component that we'll use for navigation. The three pages will be:

- Graphics
- Gameplay & Controls
- Interface

The Graphics page will be separated in two tabs - Base and Advanced settings.
The rest of the pages will have various controls that will enable the customization
of the settings mentioned above.

The coherent-gameface-grid enables us to define rows and columns with different
width. A row can be split into 12 equal parts. The class names are `guic-row` and
`guic-col-n`, where n is a number from 1 to 12.

Before we can use any of the components we must import them. To do so, add these
script tags to the **bottom** of the screen:

```
<script src="node_modules/coherent-gameface-components/umd/components.development.js"></script>
<script src="node_modules/gameface-menu/umd/menu.development.js"></script>
<script src="node_modules/gameface-scrollable-container/umd/scrollable-container.development.js"></script>
<script src="node_modules/coherent-gameface-tabs/umd/tabs.development.js"></script>
<script src="node_modules/coherent-gameface-checkbox/umd/checkbox.development.js"></script>
```

The grid should be imported using link tag in the head of the document:

```
    <link rel="stylesheet" href="node_modules/coherent-gameface-grid/dist/grid.production.min.css">
```

Now that all components are imported we can use them.
First, let's add a row:

```
<div class="guic-row"></div>
```

We'll need a little space for the menu on the left and a larger space for the content. Let's reserve 2 columns for the small space and 10 for the larger:

```
<div class="guic-row">
    <div class="guic-col-2"></div>
    <div class="guic-col-10"></div>
</div>
```

The menu component can be configured entirely through HTML. The options in the menu are specified using the custom menu-item elements exported by the menu component. Put this menu in the smaller column:

```
<gameface-menu class="left-menu" orientation="vertical">
        <menu-item slot="menu-item" id="graphics">Graphics</menu-item>
        <menu-item slot="menu-item" id="gameplay-controls">Gameplay & Controls</menu-item>
        <menu-item slot="menu-item" id="interface">Interface</menu-item>
</gameface-menu>
```

Note, that they have id attributes. We'll use them for the navigation. In order to keep this guide simple, we'll implement the simplest navigation. We'll use the ids of the menu items and the ids of their corresponding panels to match them. The naming convention that we'll use is:
- menu item with id "name" is linked to panel with id "name-panel"
If the id of a menu item is "interface", its corresponding panel will have an id equal to "interface-panel". And we'll do that for all menu-items:

```
const menuItems = document.querySelectorAll('menu-item');
for (let i = 0; i < menuItems.length; i++) {
    menuItems[i].addEventListener('click', (e) => {
        const panel = document.getElementById(`${e.currentTarget.id}-panel`);
        const activePanel = document.querySelector('.active-panel');
        activePanel.classList.remove('active-panel');
        activePanel.classList.add('inactive-panel');
        panel.classList.add('active-panel');
    });
}
```

The `active-panel` and `inactive-panel` class names define CSS rules that change the display property of an element. We'll use them to toggle the visibility of the active and inactive panels.

The first panel that we'll add is the one for the graphics options:

```
<div class="guic-row">
    <div class="guic-col-2"><gameface-menu></<gameface-menu></div>
    <div class="guic-col-10">
        <div id="graphics-panel" class="active-panel">
        </div>
    </div>
</div>
```

As we said, the graphics settings will be separated and for that we'll use tabs. Each tab heading has its corresponding tab panel. We'll have two headings and two panels:


```
<gameface-tabs>
    <tab-heading slot="tab">Base Settings</tab-heading>
    <tab-panel slot="panel"></tab-panel>
    <tab-heading slot="tab">Advanced Settings</tab-heading>
    <tab-panel slot="panel"></tab-panel>
</gameface-tabs>
```

The settings will be in the tab-panel elements. The gameface-checkbox is a custom element. We'll need to align it with the rest of the elements. For that we'll use the gameface-grid. Each option will be placed in a row and the option's element will be separated with columns.

```
<div class="guic-row">
    <div class="guic-col-4">Full Screen</div>
    <div class="guic-col-offset-7 guic-col-1">
        <gameface-checkbox class="checkbox-component">
            <component-slot data-name="label"></component-slot>
        </gameface-checkbox>
    </div>
</div>
```

We won't use the default label of the checkbox because it is right next to the box
and we want to align the text to the left and the controls to the right. The label will be placed in the `guic-col-4` element and the checkbox control will be in a smaller column, but it will have a big offset, this will automatically place it on
the right of the screen.

We'll use the same structure for all other controls. Here's how we'll use the slider:

```
<div class="guic-row option">
    <div class="guic-col-4">Environment Detail</div>
    <div class="guic-col-1 value">20</div>
    <div class="guic-col-7">
        <gameface-slider orientation="horizontal"></gameface-slider>
    </div>
</div>
```

Note, that here we have an element that will hold the slider's value.

Use different combinations of rows and columns to construct the layout you want.

We also need to add a scrollable container. It will automatically display a scrollbar if the content does not fit in its container.


Let's add it to the Interface panel. The scrollable container has one slot which contains the content which could overflow.

```
<div id="interface-panel" class="inactive-panel">
    <scrollable-container>
    <component-slot data-name="scrollable-content"></component-slot>
    </scrollable-container>
</div>
```

This is how you can use the GameUI components to create a user interface. Check the full example for more complex structure with a lot of components.