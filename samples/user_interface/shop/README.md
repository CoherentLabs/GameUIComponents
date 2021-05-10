<!--Copyright (c) Coherent Labs AD. All rights reserved. -->
# Creating a Shop Screen Using GameUI Components

If you haven't yet built components before, go to the repository
root folder and run:
```
npm i
npm run rebuild
```

This will generate the needed dependencies defined in the package.json of the
Shop sample. It is already created for convenience.

All the needed GameUI Components can be installed using the Node
package manager. In this Shop sample page the Grid and Modal components will be
used. To install them, simply run `npm i` in the
GameUIComponents\samples\user_interface\\**shop** folder.

The Modal component exports a custom element and the Grid will provide CSS
styles to help the creation of a grid, much like Bootstrap or Skeleton CSS.

The documentation for the components is located in
GameUIComponents\components\<component_name>

The coherent-gameface-components is the library that enables the components.
It provides the base for the components.

## Overview

The UI in the page is going to consist of: 

- Top section - grid
- Shop items list - grid
	- Modal for each item 

## Files

- style.css
- shop.html
- script.js
- package.json
- images (folder)

## Include Needed Scripts and Styles

The top section is going to be separated into two grid columns, the shop items
list below into 6 columns, for 6 items on a row, and the modal to be displayed
when double clicking or hitting Enter on a selected item.

Import the Grid stylesheet in the `<head>`:
```<link rel="stylesheet" href="node_modules/coherent-gameface-grid/dist/grid.production.min.css">```

Then the Components library:
```
<script src="node_modules/coherent-gameface-components/umd/components.development.js"></script>
```

## Top Section / Grid

The grid class names are well recognized and include `row` and `col-`* in
their names.

So the Top section is going to be separated in two parts - the left for the Shop
title with the current time, and the right one will hold the available credits:

```
<div class="top-section">
	<div class="guic-row top-section-row">
		<div class="guic-col-8 top-section-left-col">
			<!-- ... -->
		</div>
		<div class="guic-col-4 top-section-right-col">
			<!-- ... -->
		</div>
	</div>
</div>
```

In this case the grid row can be used to fill 100% of the available space of the
body and empty cols can be used to push the other content cols from both sides
or the `guic-row` can be restyled to have less with which is the approach
used here.

## Shop Items List / Grid

So to have 6 elements on each row, the `guic-col-2` will be used for each
item element:

```
<div class="guic-row shop-items">
	<div class="guic-col-2">
		<div class="shop-item">
			...
		</div>
	</div>
</div>
```

and this will repeat until there are 3 rows per 6 items.

Since the `.guic-row` is a flex element with `flex-wrap: wrap`, when there is
no more space for the next item, it will wrap on the next row.

## Purchase Confirmation Window / Modal

The modal is going to include the name of the item in the modal's header,
the body to have a confirmation message and the footer - Yes and No buttons.  

After the Shop items list element the Modal component can be used like so:
```
<gameface-modal style="display: none;">
	<div slot="header">Item Name</div>
	<div slot="body">
		<div class="modal-confirmation-text">Are you sure you want to buy this item?</div>
	</div>
	<div slot="footer">
		<div class="modal-actions">
			<button class="close modal-button">Yes</button>
			<button class="close modal-button">No</button>
		</div>
	</div>
</gameface-modal>
```

Since the custom `<gameface-modal>` element is created further down in the body,
the Modal's component script and script.js should be included after it,
so the elements are available:
```
<script src="node_modules/coherent-gameface-modal/umd/modal.development.js"></script>
<script src="./script.js"></script>
```

Include the style.css file below also so the modal and grid styles overriding
is possible:
```<link rel="stylesheet" href="style.css">```

## Mouse Selection and Keyboard Navigation 

Since this is a simplified example, the mouse selection is as simple as:
```
for (let i = 0; i < shopItemsCount; i++) {
	shopItems[i].addEventListener('click', () => {
		shopItems[activeItemSlot].classList.remove('shop-item-active');
		activeItemSlot = i;
		shopItems[activeItemSlot].classList.add('shop-item-active');
	});
}
```

The keyboard navigation is much like the same but with some wrapping done
when needed. Check out the `// Keyboard navigation` part in the script.js for
more details.

## Confirmation Window / Modal

In this sample the Modal component is not extended since this would require to
modify the component itself.
The functions manipulating the modal element are added for showcasing it in
this sample only.

Ultimately when using the Modal component in a real
project, the functions should be added as methods by directly extending
the Modal Component.

```
const modal = document.querySelector('gameface-modal');
const modalHeader = modal.querySelector('.header').firstElementChild;

const openModal = (title) => {
	modalHeader.textContent = title;
	modal.style.display = 'flex';
};

const isModalOpen = () => {
	return modal.style.display === 'flex';
}
```

So to open the modal, for each item, a double click event is to be added:
```
shopItems[i].addEventListener('dblclick', (event) => {
	openModal();
});
```

The `isModalOpen` function is used for the keyboard navigation to prevent the
selection if the modal is opened.


## Conclusion

There is a button in the top left corner which leads to the main / menu page.
You can navigate to the options / settings page from there also which uses
many more components.

This is how the GameUI Modal component and Grid can be used to create a simple
shop page.
