---
title: "Checkbox"
date: 2020-10-08T14:00:45Z
draft: false
---

<!--Copyright (c) Coherent Labs AD. All rights reserved. -->

The checkbox is part of the Gameface custom components suite. As most of the components in this suite it uses slots to allow dynamic content.


Usage
===================
First you need to import the components library:

~~~~{.html}
<script src="components.js"></script>
~~~~

The checkbox has three slots:
- **checkbox-background** - holds the check box itself
- **check-mark** - holds the check symbol
- **label** - holds the text of the checkbox; leave empty if no label is required

Use the `<component-import>` to import the checkbox. Put any custom slots as children of the `<component-import>`.

~~~~{.html}
<component-import class="checkbox-component" data-url="checkbox">
    <component-slot data-name="checkbox-background">
        <div class="checkbox-background"></div>
    </component-slot>
    <component-slot data-name="label">
        <span class="label">Enable Music</span>
    </component-slot>
</component-import>
~~~~


**You can put any custom styles inline or use class names and add an external file.**