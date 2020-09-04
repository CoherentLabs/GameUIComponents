The tabs component is part of the Gameface custom components suite. As most of the components in this suite, it uses slots to allow dynamic content.


Usage
===================
First you need to import the components library:

~~~~{.html}
<script src="components.js"></script>
~~~~

The tabs component has two slots:
- **tab** - this is where the tab headings are added.
- **panel** - this is where the corresponding panels are added.

Use the `<component-import>` to import the tabs. Put any custom slots as children of the `<component-import>`.

~~~~{.html}
<component-import data-url="tabs">
    <tab-heading slot="tab">Chapter One</tab-heading>
    <tab-panel slot="panel">Chapter One Content</tab-panel>
    <tab-heading slot="tab">Chapter Two</tab-heading>
    <tab-panel slot="panel">Chapter Two</tab-panel>
    <tab-heading slot="tab">Chapter Three</tab-heading>
    <tab-panel slot="panel">Chapter Three</tab-panel>
</component-import>
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