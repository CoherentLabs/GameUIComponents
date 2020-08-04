The checkbox is part of the Gameface custom components suite. As most of the components in this suite It uses slots to allow dynamic content.


Usage
===================
Using the custom `<component-import>` element.
After you install the components library and the checkbox component add the components library to your project:

~~~~{.html}
<script src="components.js"></script>
~~~~

The checkbox has three slots:
- **checkbox-wrapper** - holds the check box itself
- **check-mark** - holds the check symbol
- **label** - holds the text of the checkbox; leave empty if no label is required

Define your instance of the checkbox component in a separate file:

~~~~{.html}
<gameface-checkbox>
    <component-slot data-name="checkbox-wrapper"><div class="checkbox-wrapper"></div></component-slot>
    <component-slot data-name="check-mark"><div class="check-mark"></div></component-slot>
    <component-slot data-name="label"><span class="label">Enable Music</span></component-slot>
</gameface-checkbox>
~~~~


In the same folder add the loading script in a `script.js` file:

~~~~{.js}
components.whenDefined('gameface-checkbox').then(() => {
    components.loadHTML('my-checkbox/index.html').then((html) => {
        document.body.appendChild(html);
    });
});
~~~~

**Add any custom styles in the same folder. The default styles name is `style.css`.**

To import your modal add the `<component-import>` element to your html:

~~~~{.html}
    <component-import data-url="my-checkbox"></component-import>
~~~~