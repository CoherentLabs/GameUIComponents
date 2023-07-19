<!--Copyright (c) Coherent Labs AD. All rights reserved. Licensed under the MIT License. See License.txt in the project root for license information. -->
The tooltip is part of the Gameface custom components suite. As most of the components in this suite it uses slots to allow dynamic content.

Installation
===================

`npm i coherent-gameface-tooltip`

Usage
===================
The tooltip component exports the following objects:
- bundle - production and development builds, ready for use in the browser
- Tooltip - the source file that imports its dependencies

## Usage with the bundle modules:

* import the components library:

~~~~{.html}
<script src="./node_modules/coherent-gameface-components/dist/components.production.min.js"></script>
~~~~

* import the tooltip component:

~~~~{.html}
<script src="./node_modules/coherent-gameface-tooltip/dist/tooltip.production.min.js"></script>
~~~~

* add the tooltip component to your html:

~~~~{.html}
<gameface-tooltip target=".container">
    <div slot="message">Hello!</div>
</gameface-tooltip>
~~~~

If you wish to import the modules using JavaScript you can remove the script tags
which import the components and the tooltip from the node_modules folder and import them like this:

~~~~{.js}
import components from 'coherent-gameface-components';
import { Tooltip } from 'coherent-gameface-tooltip';
~~~~

Note that this approach requires a module bundler like [Webpack](https://webpack.js.org/) or [Rollup](https://rollupjs.org/guide/en/) to resolve the
modules from the node_modules folder.

Specifying the content
=========================

Use the message slot to specify the message of the tooltip.

Full list of the available attributes can be found [here](###Attributes).

~~~~{.html}
<gameface-tooltip target=".container" on="mouseenter" off="mouseleave" position="left">
    <div slot="message">Message on left</div>
</gameface-tooltip>
~~~~

You can also put more complex content like interactive controls such as buttons:

~~~~{.html}
<gameface-tooltip id="tutorial" target=".container" on="mouseenter" position="top" off="click">
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

You can add more flexibility using JavaScript. In the above example the tooltip will be closed on click anywhere inside it. If you wish to close it only if the customer clicks for the example on the `Next` button you can manually attach a listener and call the `hide` method of the tooltip:

~~~~{.js}
document.querySelector('.button').addEventListener('click', (e) => {
    document.querySelector('#tutorial').hide();
});
~~~~

## Add the Styles

~~~~{.css}
<link rel="stylesheet" href="coherent-gameface-components-theme.css">
<link rel="stylesheet" href="style.css">
~~~~

To overwrite the default styles, simply create new rules for the class names that
you wish to change and include them after the default styles.

**You can put any custom styles inline or use class names and add an external file.**

## How to use

Usually a tooltip is displayed as a result of an action performed on another element. For example, you need to show a tooltip with more data when you hover on an item in the inventory. To specify the trigger element use the `target` attribute. Its value is a query string used to get the element. Refer to the table below for the full list of attributes.

### Setting a message

To set or change the tooltip message, use the `setMessage` method.

When the `async` attribute is present in `<gameface-tooltip>`, a callback that returns a Promise must be provided to the `setMessage` method.
Async mode use case is shown in the demo page.

### Attributes

| Attribute | Type      | Default | Accepted values                  | Description                                                                                         |
| --------- | --------- | ------- | -------------------------------- | --------------------------------------------------------------------------------------------------- |
| target    | DOMString | N/A     | Any                              | Specify the element on which the tooltip should be displayed.                                       |
| on        | String    | click   | `click`, `mouseover`, etc.       | Specify the event which will trigger the show method of the tooltip                                 |
| off       | String    | click   | `click`,  `mouseover`, etc.      | Specify the event which will trigger the hide method of the tooltip                                 |
| position  | String    | top     | `top`, `bottom`, `left`, `right` | Specify the position of the tooltip relative to the element specified using the `target` attribute. |
| async     | N/A       | N/A     | N/A                              | Enable to use an asynchronous function to set the tooltip message with the `setMessage` method.     |

### Properties

| Property | Type      | Description                                    |
| -------- | --------- | ---------------------------------------------- |
| message  | getter    | Returns the `textContent` of the message slot. |

### Methods

| Method     | Accepted values                                               | Description                          |
| ---------- | ------------------------------------------------------------- | ------------------------------------ |
| setMessage | A string, number or functions returning a value or a Promise. | Sets or changes the tooltip message. |