---
date: 2023-10-12
title: Modal
draft: false
---

<!--Copyright (c) Coherent Labs AD. All rights reserved. Licensed under the MIT License. See License.txt in the project root for license information. -->

<a href="https://www.npmjs.com/package/coherent-gameface-modal"><img src="http://img.shields.io/npm/v/coherent-gameface-modal.svg?style=flat-square"/></a>

The modal is part of the Gameface custom components suite. As most of the components in this suite it uses slots to allow dynamic content.

Installation
===================

```
npm i coherent-gameface-modal
```

## Usage with UMD:

~~~~{.html}
<script src="./node_modules/coherent-gameface-modal/dist/modal.production.min.js"></script>
~~~~

* add the modal component to your html:

~~~~{.html}
<gameface-modal></gameface-modal>
~~~~

This is all! Load the file in Gameface to see the modal.

## Usage with JavaScript:

If you wish to import the Modal using JavaScript you can remove the script tag and import it like this:

~~~~~{.js}
import { Modal } from 'coherent-gameface-modal';
~~~~~

or simply

~~~~{.js}
import 'coherent-gameface-modal';
~~~~

Note that this approach requires a module bundler like [Webpack](https://webpack.js.org/) or [Rollup](https://rollupjs.org/guide/en/) to resolve the
modules from the node_modules folder.

Customizing the Modal
=========================

The modal has three slots:
- **header** - located on the top of the modal; it usually contains the heading
- **body** - located in the center; this is where the main content is put
- **footer** - located at the bottom; this is where the action buttons are placed

**Add class="close" to any button that should close the modal.**

Use the slots to put customized background or label.

~~~~{.html}
<gameface-modal>
    <div slot="header">
            Character name selection
    </div>
    <div slot="body">
        <div class="confirmation-text">Are you sure you want to save this name?</div>
    </div>
    <div slot="footer">
        <div class="actions">
            <button id="confirm" class="close guic-modal-button confirm controls">Yes</button>
            <button class="close guic-modal-button discard controls">No</button>
        </div>
    </div>
</gameface-modal>
~~~~

## Add the Styles

~~~~{.css}
<link rel="stylesheet" href="coherent-gameface-components-theme.css">
<link rel="stylesheet" href="style.css">
~~~~

To overwrite the default styles, simply create new rules for the class names that
you wish to change and include them after the default styles.

**You can put any custom styles inline or use class names and add an external file.** 
