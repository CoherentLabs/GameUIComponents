<!--Copyright (c) Coherent Labs AD. All rights reserved. Licensed under the MIT License. See License.txt in the project root for license information. -->

<a href="https://www.npmjs.com/package/coherent-gameface-radio-button"><img src="http://img.shields.io/npm/v/coherent-gameface-radio-button.svg?style=flat-square"/></a>

The radio-button is part of the Gameface custom components suite.

Installation
===================

```
npm i coherent-gameface-radio-button
```

## Usage with UMD:

~~~~{.html}
<script src="./node_modules/coherent-gameface-radio-button/dist/coherent-gameface-radio-button.production.min.js"></script>
~~~~

* add the radio-button group and button custom Elements to your html:

~~~~{.html}
<gameface-radio-group>
	<radio-button slot="radio-button"></radio-button>
	<radio-button slot="radio-button"></radio-button>
</gameface-radio-group>
~~~~

Configuration and usage is explained further down the document. 

## Usage with JavaScript:

If you wish to import the GamefaceRadioGroup using JavaScript you can remove the script tag and import it like this:

~~~~{.js}
import { GamefaceRadioGroup } from 'coherent-gameface-radio-button';
~~~~

or simply

~~~~{.js}
import 'coherent-gameface-radio-button';
~~~~

Note that this approach requires a module bundler like
[Webpack](https://webpack.js.org/) or [Rollup](https://rollupjs.org/guide/en/)
to resolve the modules from the node_modules folder.

## Add the Styles

~~~~{.css}
<link rel="stylesheet" href="coherent-gameface-components-theme.css">
<link rel="stylesheet" href="style.css">
~~~~

To overwrite the default styles, simply create new rules for the class names
that you wish to change and include them after the default styles.

Load the HTML file in Gameface to see the radio-button.
You can also see an example in the demo folder of the component.

# Configuration and Usage

## Radio Group Attributes

The `gameface-radio-group` element support the following attributes:

|Attribute   |Type   |Default   | Description |
|---|---|---|---|
|value  | String   |N/A   | The value of the selected radio button  |
|disabled  | Boolean   |false   |  Whether the whole group is disabled or not  |
|value  | String   | 'on'   | The value that will be returned from the `.value` getter |
|name  | String   | ''   | The name of the component|

## Radio Button Attributes

You can customize the radio button using the following attributes:

|Attribute   |Type   |Default   | Description |
|---|---|---|---|
|checked  | Boolean   |false   | Whether the component is checked or not   |
|disabled  | Boolean   |false   |  Whether the component is disabled or not  |
|controls-disabled  | [Boolean HTML Attribute](https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#boolean-attributes)   |false   |  If present - hides the controls of the buttons, making it possible to add your custom  |
|value  | String   | 'on'   | The value that will be returned from the `.value` getter |
|name  | String   | ''   | The name of the component|

### Initial Setup

You can configure the `<radio-button>`'s initial state declaratively by setting the attributes in the HTML:

```html
<gameface-radio-group>
	<radio-button slot="radio-button" disabled>Tab Targeting</radio-button>
	<radio-button slot="radio-button" checked value="yes" name="subtitles">Action Combat</radio-button>
</gameface-radio-group>
```

### Updating the Attributes

You can update the attributes using JavaScript or the [DOM APIs](https://developer.mozilla.org/en-US/docs/Web/API/Element/getAttribute).

#### With JavaScript:

```js
document.querySelector('gameface-radio-group').allButtons[0].<attribute> = <value>;
```

Where \
`<attribute> ::= disabled | checked | value | name` \
`<value> ::= true | false | string`

## Custom Buttons

You can add different styles for the radio buttons. Put the custom elements in the `radio-button-content` slot:

```html
<gameface-radio-group class="custom-buttons">
    <radio-button slot="radio-button" checked>
        <div slot="radio-button-content" class="inner-button"><span>OFF</span></div>
    </radio-button>
    <radio-button slot="radio-button">
        <div slot="radio-button-content" class="inner-button"><span>ON</span></div>
    </radio-button>
</gameface-radio-group>
```
You can put HTML elements or other components in the `radio-button-content` slot.

Add the `controls-disabled` attribute to the `<radio-button>` element to hide the default radio button style:

```html
<gameface-radio-group class="custom-buttons">
    <radio-button checked controls-disabled>
        <div slot="radio-button-content">OFF</div>
    </radio-button>
    <radio-button controls-disabled>
        <div slot="radio-button-content">ON</div>
    </radio-button>
</gameface-radio-group>
```

## Usage

On top of using the `radioButton.checked` and `radioButton.checked` you can
get one of the `<gameface-radio-group>` Elements and call `radioGroup.allButtons`
which will return an Array of all `<radio-button>` Elements.

When a radio-button has a `checked` attribute, this will be the initially checked
button.

Mouse focusing works as well as keyboard navigation and focusing using the
arrow keys and Enter or Space keys.

To select a `<radio-button>` using code, you can do the following:
```js
const radioGroup = document.querySelector('gameface-radio-group');
radioGroup.value = {{SOME_RADIO_BUTTON_VALUE}};
```

If the value you've set doesn't match any of the available radio button values it will return a warning. 

### Checking Previous or Next Button

You can select adjacent `<radio-button>` elements using the `<gameface-radio-group>` methods:
`checkPrev()` and `checkNext()`.

If there are one or more following elements with the `disabled` attribute, the methods will check 
the next available one.

To select the previous or next available `<radio-button>`, you can do the following:
```js
const radioGroup = document.querySelector('gameface-radio-group');
radioGroup.checkNext();
//or
radioGroup.checkPrev();
```

If there are no available elements to select, the currently checked one will remain selected.
