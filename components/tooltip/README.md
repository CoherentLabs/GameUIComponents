<!--Copyright (c) Coherent Labs AD. All rights reserved. Licensed under the MIT License. See License.txt in the project root for license information. -->
The tooltip is part of the Gameface custom components suite. As most of the components in this suite it uses slots to allow dynamic content.

Installation
===================

`npm i coherent-gameface-tooltip`

Usage
===================
The tooltip component comes with UMD and CJS builds.

## Usage with UMD modules:

* import the components library:

~~~~{.html}
<script src="./node_modules/coherent-gameface-components/umd/components.production.min.js"></script>
~~~~

* import the tooltip component:

~~~~{.html}
<script src="./node_modules/coherent-gameface-tooltip/umd/tooltip.production.min.js"></script>
~~~~

* add the tooltip component to your html:

~~~~{.html}
<gameface-tooltip for=".container">
    <div slot="message">Hello!</div>
</gameface-tooltip>
~~~~

Usually a tooltip is displayed as a result of an action performed on another element. For example you need to show a tooltip with more data when you hover over an item in the inventory. To specify the trigger element use the for attribute. Its value is a query string used to get the element. Refer to the table bellow for full list of attributes.


| Attribute   | Type   | Default   | Description   |
|---|---|---|---|
|for|DOMString|N/A|Specify the element on which the tooltip should be displayed.|
|on|String|click|Specify the event which will trigger the show method of the tooltip |
|off|String|click|Specify the event which will trigger the hide method of the tooltip |
|position|String|top|Specify the position of the tooltip relative to the element specified using the `for` attribute. Possible values are `top`, `bottom`, `left` and `right`|


If you wish to import the modules using JavaScript you can remove the script tags
which import the components and the tooltip from the node_modules folder and import them like this:

~~~~{.js}
import components from 'coherent-gameface-components';
import Tooltip from 'coherent-gameface-tooltip';
~~~~

Note that this approach requires a module bundler like [Webpack](https://webpack.js.org/) or [Rollup](https://rollupjs.org/guide/en/) to resolve the
modules from the node_modules folder. Alternatively you can import them directly from node_modules:

~~~~{.js}
import components from './node_modules/coherent-gameface-components/umd/components.production.min.js';
import Tooltip from './node_modules/coherent-gameface-tooltip/umd/tooltip.production.min.js';
~~~~

## Usage with CJS modules:

* Import the components library:

~~~~{.js}
const components = require('coherent-gameface-components');
const Tooltip = require('coherent-gameface-tooltip');
~~~~

The CommonJS(CJS) modules are used in a NodeJS environment, be sure to use a module
bundler in order to be use them in a browser.


Specifying the content
=========================

Use the message slot to specify the message of the tooltip.

~~~~{.html}
<gameface-tooltip for=".container" on="mouseenter" off="mouseleave" position="left">
    <div slot="message">Message on left</div>
</gameface-tooltip>
~~~~

You can also put more complex content like interactive controls such as buttons:

~~~~{.html}
<gameface-tooltip for=".container" on="mouseenter" position="top" off="click">
    <div slot="message">
        <div class="msg-container">
            <div class="title">Wellcome!</div>
            <div class="text">
                Hello, this is your first tutorial.
                Click the next button to continue.
            </div>
            <div class="button">Next</div>
        </div>
    </div>
</gameface-tooltip>
~~~~


## Add the Styles

~~~~{.css}
<link rel="stylesheet" href="coherent-gameface-components-theme.css">
<link rel="stylesheet" href="style.css">
~~~~

To overwrite the default styles, simply create new rules for the class names that
you wish to change and include them after the default styles.

**You can put any custom styles inline or use class names and add an external file.**