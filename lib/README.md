<!--Copyright (c) Coherent Labs AD. All rights reserved. -->
Component library which supports the creation and usage of custom elements. Provides a way to encapsulate a component specific functionality and reuse it. Similar to the [Web Components suite](https://developer.mozilla.org/en-US/docs/Web/Web_Components). Exports a `Components` class that can be instantiated.

Installation
===================

```
npm i coherent-gameface-components
```

Usage
===================

Import and instantiate the library
```
import { Components } from 'coherent-gameface-components';
const components = new Components();
```
### GamefaceComponents.loadResource(component) => <code>Promise</code>
Create and add a script tag with given url.

The `loadResource` method is used to load a component's template file. It receives the component as an argument and returns a Promise that resolves with the prepared template. This is usually done in the `connectedCallback`:

```
connectedCallback() {
    components.loadResource(this)
        .then(this.init)
        .catch(err => console.error(err));
}
```

<a name="GamefaceComponents+loadResource"></a>

**Kind**: instance method of [<code>GamefaceComponents</code>](#GamefaceComponents)
**Returns**: <code>promise</code> - Resolved with the prepared template.

| Param | Type | Description |
| --- | --- | --- |
| component | <code>CustomElement Instance</code> | Reference to the custom element. |

<a name="GamefaceComponents+whenDefined"></a>

### GamefaceComponents.renderOnce(component) => <code>boolean</code>

**Kind**: instance method of [<code>GamefaceComponents</code>](#GamefaceComponents)
**Returns**: <code>boolean</code> - `false` if the element was already rendered, `true` if it was not.

| Param | Type | Description |
| --- | --- | --- |
| component | <code>CustomElement instance</code> | Reference to the custom component. |

<a name="GamefaceComponents+defineCustomElement"></a>

### GamefaceComponents.defineCustomElement(name, element)
Defines a custom element.

**Kind**: instance method of [<code>GamefaceComponents</code>](#GamefaceComponents)

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The name of the element. |
| element | <code>Object</code> | The object which describes the element. |


# Exported Classes

## BaseComponent

The base component from which all custom elements inherit. Implements all common functionality such as `instanceType` getter and `setupTemplate` method.

<a name="GamefaceComponents+instanceType"></a>

### BaseComponent.instanceType => <code>string</code>

Returns the type of the instance as a string literal.

<a name="GamefaceComponents+setupTemplate"></a>

### BaseComponent.setupTemplate(data, callback) => <code>void</code>

Sets the template of the component and invokes a given callback when ready.

**Kind**: instance method of [<code>GamefaceComponents</code>](#GamefaceComponents)
**Returns**: <code>void</code>

| Param | Type | Description |
| --- | --- | --- |
| data | <code>string</code> | The result from loadResource. |
| callback | <code>function</code> | Called when the template is set up. |


## Validator

A static class used to validate UI elements. It it the most basic type of validator exported by the components library. Implements the following methods:

### Validator.isFormElement(element) => <code>boolean</code>

Checks if the given element is part of a form.

### Validator.tooLong() => <code>boolean</code>
### Validator.tooShort() => <code>boolean</code>
### Validator.rangeOverflow() => <code>boolean</code>
### Validator.rangeUnderflow() => <code>boolean</code>
### Validator.customError() => <code>boolean</code>
### Validator.isBadURL() => <code>boolean</code>
### Validator.isBadEmail() => <code>boolean</code>

Empty implementations, always return `false`.

### Validator.valueMissing(element) => <code>boolean</code>

Checks if the given elements has a required attribute and if its value is missing.

### Validator.nameMissing(element) => <code>boolean</code>

Checks if the element has a name attribute.

### Validator.isRequired(element) => <code>boolean</code>

Checks if the element has a required attribute.

### Validator.willSerialize(element) => <code>boolean</code>

Checks if the element is going to be serialized, if it is valid.


## NativeElementValidator

A class that implements the same methods as the `Validator` class but overwrites the ones specific to a native HTML element such as an `<input>`.

### NativeElementValidator.tooLong() => <code>boolean</code>
### NativeElementValidator.tooShort() => <code>boolean</code>
### NativeElementValidator.rangeOverflow() => <code>boolean</code>
### NativeElementValidator.rangeUnderflow() => <code>boolean</code>
### NativeElementValidator.isBadURL() => <code>boolean</code>
### NativeElementValidator.isBadEmail() => <code>boolean</code>

Checks if the element is native text field and calls the native element's specific implementation of one of the above listed methods. If the element is not native - uses the same named method from the `Validator` class.

### NativeElementValidator.isFormElement() => <code>boolean</code>
### NativeElementValidator.customError() => <code>boolean</code>
### NativeElementValidator.nameMissing() => <code>boolean</code>
### NativeElementValidator.valueMissing() => <code>boolean</code>
### NativeElementValidator.isRequired() => <code>boolean</code>
### NativeElementValidator.willSerialize() => <code>boolean</code>

Uses the implementation from the `Validator` class.


## CustomElementValidator

All components that need validation extend this class. It inherits the BaseComponent making all that extend the CustomElementValidator `CustomElement` instances. Uses all validation methods from the `Validator` class.


## TextFieldValidator

A static class that implements text field specific validation methods:

### TextFieldValidator.tooLong(element) => <code>boolean</code>
### TextFieldValidator.tooShort(element) => <code>boolean</code>

Check if the value of the text field contains more or less symbols than the value of its `maxLength` and `minLength` attribute respectively. Returns `false` if the element has no `maxLength` or `minLength` attribute.

**Kind**: static method of [<code>TextFieldValidator</code>](##TextFieldValidator)
**Returns**: <code>boolean</code>

| Param | Type | Description |
| --- | --- | --- |
| element | <code>HTMLElement</code> | The text field instance. |

### TextFieldValidator.tooShort(element) => <code>boolean</code>

Checks if the value of the text field contains less symbols than the value of its `minLength` attribute. Returns `false` if the element has no `minLength` attribute.

**Kind**: static method of [<code>TextFieldValidator</code>](##TextFieldValidator)
**Returns**: <code>boolean</code>

| Param | Type | Description |
| --- | --- | --- |
| element | <code>HTMLElement</code> | The text field instance. |

### TextFieldValidator.rangeOverflow(element) => <code>boolean</code>
### TextFieldValidator.rangeUnderflow(element) => <code>boolean</code>

Checks if the value of the element is bigger or smaller than its `max` or `min` attribute respectively. Useful for sliders. Returns `false` if the element has no `max` or `min` attribute.

**Kind**: static method of [<code>TextFieldValidator</code>](##TextFieldValidator)
**Returns**: <code>boolean</code>

| Param | Type | Description |
| --- | --- | --- |
| element | <code>HTMLElement</code> | The text field instance. |

### TextFieldValidator.isBadURL(element) => <code>boolean</code>

Checks if the text of an element is a valid URL by testing its value against the element's pattern attribute using regular expression matching. Returns `false` if the element's type is not 'url' or if it doesn't have a `pattern` attribute.

**Kind**: static method of [<code>TextFieldValidator</code>](##TextFieldValidator)
**Returns**: <code>boolean</code>

| Param | Type | Description |
| --- | --- | --- |
| element | <code>HTMLElement</code> | The text field instance. |

### TextFieldValidator.isBadEmail(element) => <code>boolean</code>

Validates if the value of a text field is a valid email by checking if it contains a `@` symbol. Returns `false` if the element's type attribute is not `email`.

**Kind**: static method of [<code>TextFieldValidator</code>](##TextFieldValidator)
**Returns**: <code>boolean</code>

| Param | Type | Description |
| --- | --- | --- |
| element | <code>HTMLElement</code> | The text field instance. |