<!--Copyright (c) Coherent Labs AD. All rights reserved. Licensed under the MIT License. See License.txt in the project root for license information. -->
The tabs component is part of the Gameface custom components suite. As most of the components in this suite, it uses slots to allow dynamic content.

Installation
===================

`npm i coherent-gameface-tabs`

Usage
===================
The tabs component exports the following objects:
- bundle - production and development builds, ready for use in the browser
- { Tabs } - the source file that imports its dependencies

## Usage with the bundle modules:

* import the components library:

~~~~{.html}
<script src="./node_modules/coherent-gameface-components/dist/components.production.min.js"></script>
~~~~

* import the tabs component:

~~~~{.html}
<script src="./node_modules/coherent-gameface-tabs/dist/tabs.production.min.js"></script>
~~~~

* add the tabs component to your html:

~~~~{.html}
<gameface-tabs></gameface-tabs>
~~~~

This is all! Load the file in Gameface to see the tabs.

If you wish to import the modules using JavaScript you can remove the script tags
which import the components and the tabs from the node_modules folder and import them like this:

~~~~~{.js}
import components from 'coherent-gameface-components';
import { Tabs } from 'coherent-gameface-modal';
~~~~~

Note that this approach requires a module bundler like [Webpack](https://webpack.js.org/) or [Rollup](https://rollupjs.org/guide/en/) to resolve the
modules from the node_modules folder.

Customizing the Tabs
=========================

Use the slots to put customized background or label.

The tabs component has two slots:
- **tab** - this is where the tab headings are added.
- **panel** - this is where the corresponding panels are added.

Use the `<component-import>` to import the tabs. Put any custom slots as children of the `<component-import>`.

~~~~{.html}
<gameface-tabs>
    <tab-heading slot="tab">Chapter One</tab-heading>
    <tab-panel slot="panel">Chapter One Content</tab-panel>
    <tab-heading slot="tab">Chapter Two</tab-heading>
    <tab-panel slot="panel">Chapter Two Content</tab-panel>
    <tab-heading slot="tab">Chapter Three</tab-heading>
    <tab-panel slot="panel">Chapter Three Content</tab-panel>
    <tab-heading slot="tab">Chapter Four</tab-heading>
    <tab-panel slot="panel">Chapter Four Content</tab-panel>
</gameface-tabs>
~~~~


**You can put any custom styles inline or use class names and add an external file.**

The tabs component registers two more custom elements - The `<tab-heading>` and `<tab-panel>`. Every time you create an element of one of these types an index is assigned to it. This index ensures that your heading will be linked to its corresponding panel. This means that you can add new tabs and panels like this and they will work:

~~~~{.js}
const tab = document.createElement('tab-heading');
tab.innerText = 'My new tab.';
tab.slot = 'tab';
document.querySelector('[data-name="tab"]').appendChild(tab);

const panel = document.createElement('tab-panel');
panel.innerText = 'My new panel.';
panel.slot = 'panel';
document.querySelector('[data-name="panel"]').appendChild(panel);
~~~~

## Add the Styles

~~~~{.css}
<link rel="stylesheet" href="coherent-gameface-components-theme.css">
<link rel="stylesheet" href="styles.css">
~~~~

To overwrite the default styles, simply create new rules for the class names that
you wish to change and include them after the default styles.