The modal is part of the Gameface custom components suite. It uses component slots to allow dynamic content.


Usage
===================
Using the custom `<component-import>` element.
After you install the components library and the modal component add the components library to your project:

~~~~{.html}
<script src="components.js"></script>
~~~~

The modal has three slots:
- **header** - located on the top of the modal; it usually contains the heading
- **body** - located in the center; this is where the main content is put
- **footer** - located at the bottom; this is where the action buttons are placed

**Add class="close" to any button that should close the modal.**

Define your instance of the modal component in a separate file:

my-modal.html
~~~~{.html}
<gameface-modal>
    <component-slot data-name="header">This is header.</component-slot>
    <component-slot data-name="body">
        <div>This is body.</div>
    </component-slot>
    <component-slot data-name="footer">
        <div>Are you sure you want to cancel?</div>
        <button class="close">Yes</button>
        <button>No</button>
    </component-slot>
</gameface-modal>
~~~~

In the same folder add the loading script in a `script.js` file:

~~~~{.js}
components.whenDefined('gameface-modal').then(() => {
    components.loadHTML('my-modal.html').then((html) => {
        document.body.appendChild(html);
    });
});
~~~~

**Add any custom styles in the same folder. The default styles name is `style.css`.**

To import your modal add the `<component-import>` element to your html:

~~~~{.html}
  <component-import data-url="my-modal"></component-import>
~~~~

Add this as many times as you need to display your component.

