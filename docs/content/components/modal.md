---
title: "Modal"
date: 2020-10-08T14:00:45Z
draft: false
---


The modal is part of the Gameface custom components suite. As most of the components in this suite it uses slots to allow dynamic content.


Usage
===================
First you need to import the components library:

~~~~{.html}
<script src="components.js"></script>
~~~~

The modal has three slots:
- **header** - located on the top of the modal; it usually contains the heading
- **body** - located in the center; this is where the main content is put
- **footer** - located at the bottom; this is where the action buttons are placed

**Add class="close" to any button that should close the modal.**

Use the `<component-import>` to import the modal. Put any custom slots as children of the `<component-import>`.

~~~~{.html}
<component-import data-url="modal">
    <component-slot data-name="header">
        <div class="header">
            Character name selection
        </div>
    </component-slot>
    <component-slot data-name="body">
        <div class="confirmation-text">Are you sure you want to save this name?</div>
    </component-slot>
    <component-slot data-name="footer">
        <div class="actions">
            <button class="close button confirm controls" onclick="onConfirm()">Yes</button>
            <button class="close button discard controls">No</button>
        </div>
    </component-slot>
</component-import>
~~~~


**You can put any custom styles inline or use class names and add an external file.** 
