---
date: 2024-9-05
title: Toast
draft: false
---

<!--Copyright (c) Coherent Labs AD. All rights reserved. Licensed under the MIT License. See License.txt in the project root for license information. -->

The gameface-toast is part of the Gameface custom components suite. As most of the components in this suite it uses slots to allow dynamic content.

Installation
===================

```
npm i coherent-gameface-toast
```

## Usage with UMD:

* import the toast component:

~~~~{.html}
<script src="./node_modules/coherent-gameface-toast/dist/toast.production.min.js"></script>
~~~~

* add the toast component to your html:

~~~~{.html}
<gameface-toast gravity="top" position="center" timeout="3000">
    <div slot="message">Hello!</div>
</gameface-toast>
~~~~

## Usage with JavaScript:

If you wish to import the toast using JavaScript you can remove the script tag and import it like this:

~~~~{.js}
import { toast } from 'coherent-gameface-toast';
~~~~

or simply

~~~~{.js}
import 'coherent-gameface-toast';
~~~~

Note that this approach requires a module bundler like [Webpack](https://webpack.js.org/) or [Rollup](https://rollupjs.org/guide/en/) to resolve the
modules from the node_modules folder.

## Add the Styles

~~~~{.css}
<link rel="stylesheet" href="coherent-gameface-components-theme.css">
<link rel="stylesheet" href="style.css">
~~~~

To overwrite the default styles, simply create new rules for the class names that
you wish to change and include them after the default styles.

**You can put any custom styles inline or use class names and add an external file.**

### Classes you can override

| Class Name | What it styles |
|------------|----------------|
|guic-toast-container|The containers the toasts are nested inside|
|guic-toast| The toast component itself|
|guic-toast-message|The message slot styles|
|guic-toast-close-btn|The style while pressing the button|
|guic-toast-top/bottom/right/left/center|The styles used on the containers for the positioning of the toasts|

### Overriding the animations

There are 2 default animations set:

- **Slide Up/Down Animation**: By default, the toast uses slide-up and slide-down animations when shown. This behavior can be overridden by applying a custom class and defining your own animations. Alternatively, you can modify the existing animations named `guic-toast-slide-up` and `guic-toast-slide-down` in your CSS. For example:
  ```css
  .custom-toast-class {
      animation-name: customSlideUp;
  }
  @keyframes customSlideUp {
      from { transform: translateY(100%); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
  }
- **Fade Out Animation**: The default fade-out animation can be overridden by using the `guic-toast-hide` class along with a custom animation named `guic-toast-fade-out`. Ensure that any custom animations maintain the same name (`guic-toast-fade-out`) as the component’s `hide` method is specifically designed to listen for this animation's end event. Here’s how you could define a custom fade-out animation:
  ```css
  .custom-toast-class.guic-toast-hide {
      animation-name: guic-toast-fade-out; /* Use the same name for compatibility */
      animation-duration: 0.8s; /* Custom duration */
  }
  @keyframes guic-toast-fade-out {
      from { opacity: 1; }
      to { opacity: 0; }
  }
  ```

Specifying the content
=========================

Use the `message` slot to specify the message of the toast.

~~~~{.html}
<gameface-toast gravity="top" position="left">
    <div slot="message">Toast on top left</div>
</gameface-toast>
~~~~

Use the `close-btn` slot to include a close button in your toast:

~~~~{.html}
<gameface-toast class="styled-toast" gravity="top" position="right" timeout="5000">
  <div slot="message">Hello</div>
  <div slot="close-btn">x</div>
</gameface-toast>
~~~~

Keep in mind that you **must** provide some content inside the slot, otherwise the close functionality of the button won't work. That's because the slot relies on content being present to attach the closing logic. If you omit the `close-btn` slot, you'll need to manually handle the toast's removal (if the timeout attribute is not set).

Full list of the available attributes can be found [here](#Attributes).

## How to use

To use the toast component you must first add the element in your html:

```{.html}
<gameface-toast gravity="top" position="right" timeout="5000">
  <div slot="message">I am a positioned toast!</div>
  <div slot="close-btn">x</div>
</gameface-toast>
```
### Showing the toast

To display the toast you have 2 options:
1. Manually getting the toast with js and calling the toast method `show()`
2. Using the `target` attribute to specify a target element by providing an element selector as its value. When the target element is clicked the `show()` method will be called on the toast.

After the first call of the `show()` method six containers will be created to host the toasts. The initialization of the containers will happen only the first time an instance of the toast component has been shown. These containers specify each place the toast can appear on and are implemented to allow for an easier way to stack toasts.

### Hiding the toast

In most use cases toasts go away on their own after a while. 

There are 2 different ways you can close the toast component:
1. Using the `timeout` attribute.
2. Using the `close-btn` slot.

Both can be present or absent at the same time. It depends only on which one you specify. The close button takes precedence over the timeout, meaning if a user clicks on it, the toast will immediately close, and it won't wait for the timeout to run out.

### Attributes

| Attribute | Type      | Default | Accepted values             | Description                                                                                         |
| --------- | --------- | ------- | ----------------------------| --------------------------------------------------------------------------------------------------- |
| position  | string    | left    | `left`, `right`, `center`   | Specify the horizontal position of the toast                                                        |
| gravity   | String    | top     | `top`, `bottom`             | Specify the vertical position of the toast                                                          |
| timeout   | Number    | N/A     | Any positive integer        | Specify the time after which the `hide` method of the toast will be triggered                       |
| target    | DOMString | N/A     | Any                         | Specify the element which when clicked on will trigger the `show` method of the toast               |

### Properties

| Property | Type          | Description                                        |
|----------|---------------|----------------------------------------------------|
| message  | getter/setter | Gets or sets the HTML content of the message slot. |
| position | getter/setter | Gets or sets the toast's position. Returns the last set position and allows updating to a new position. |
| gravity  | getter/setter | Gets or sets the toast's gravity. Returns the last set gravity and allows updating to a new gravity. |
| target   | getter/setter | The getter returns a reference to the currently set target DOM element. The setter accepts a string selector, which it uses to find and set a new target DOM element in the document. If the selector does not match any elements, an error is logged and the target is not updated. |

### Methods

| Method | Parameters | Description                                            |
|--------|------------|--------------------------------------------------------|
| show   | None       | Initializes and displays the toast. This includes appending the toast to a container based on its `gravity` and `position`, handling timeout logic, initializing the close button, and adding a class to make the toast visible. Does not create containers if they are already created. If the toast is already visible calling `show()` again wouldn't reshow the toast. To do that call the `hide` method first. |
| hide   | None       | Hides the toast by removing the visibility class and then removing the toast element from the DOM. |
