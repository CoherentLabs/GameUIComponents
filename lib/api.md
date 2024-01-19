## Classes

<dl>
<dt><a href="#BaseComponent">BaseComponent</a></dt>
<dd><p>BaseComponent
The base class from which all other components inherit shared logic</p>
</dd>
<dt><a href="#Validator">Validator</a></dt>
<dd><p>This is the base class that holds all functionality shared between custom components
and native elements</p>
</dd>
<dt><a href="#NativeElementValidator">NativeElementValidator</a></dt>
<dd><p>The NativeElementValidator uses the methods from the Validator class
All native elements tha don&#39;t support methods like isFormElement, tooLong, tooShort
etc.. will be wrapped in this class in order to enable us to validate native and
custom elements using the same methods.</p>
</dd>
<dt><a href="#CustomElementValidator">CustomElementValidator</a></dt>
<dd><p>The CustomElementValidator is inherited by custom elements in order to gain the
validation function from the Validator class.
This class can not be used to wrap the native elements as it inherits the
HTMLElement which can not be instantiated using the new keyword.</p>
</dd>
<dt><a href="#TextFieldValidator">TextFieldValidator</a></dt>
<dd><p>Class that implements the commong validation methods for the text fields</p>
</dd>
<dt><a href="#GamefaceComponents">GamefaceComponents</a></dt>
<dd><p>Class that defines the Gameface components</p>
</dd>
<dt><a href="#ComponentSlot">ComponentSlot</a></dt>
<dd><p>Class that will handle gameface components slot element</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#isNativeTextField">isNativeTextField(element)</a> ⇒ <code>boolean</code></dt>
<dd><p>Checks if the passed element is a native text field</p>
</dd>
</dl>

<a name="BaseComponent"></a>

## BaseComponent
BaseComponentThe base class from which all other components inherit shared logic

**Kind**: global class  

* [BaseComponent](#BaseComponent)
    * [.instanceType](#BaseComponent+instanceType)
    * [.setupTemplate(data, callback)](#BaseComponent+setupTemplate) ⇒ <code>undefined</code>
    * [.isStatePropValid(name, value)](#BaseComponent+isStatePropValid) ⇒ <code>boolean</code>

<a name="BaseComponent+instanceType"></a>

### baseComponent.instanceType
Return the type of the class

**Kind**: instance property of [<code>BaseComponent</code>](#BaseComponent)  
<a name="BaseComponent+setupTemplate"></a>

### baseComponent.setupTemplate(data, callback) ⇒ <code>undefined</code>
Called when the template of a component was loaded.

**Kind**: instance method of [<code>BaseComponent</code>](#BaseComponent)  

| Param | Type |
| --- | --- |
| data | <code>object</code> | 
| callback | <code>function</code> | 

<a name="BaseComponent+isStatePropValid"></a>

### baseComponent.isStatePropValid(name, value) ⇒ <code>boolean</code>
Validate if a value can be set on the state.

**Kind**: instance method of [<code>BaseComponent</code>](#BaseComponent)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | the name of the property. |
| value | <code>any</code> | the value that has to be checked. |

<a name="Validator"></a>

## Validator
This is the base class that holds all functionality shared between custom componentsand native elements

**Kind**: global class  

* [Validator](#Validator)
    * _instance_
        * [.instanceType](#Validator+instanceType)
    * _static_
        * [.isFormElement(element)](#Validator.isFormElement) ⇒ <code>boolean</code>
        * [.tooLong()](#Validator.tooLong) ⇒ <code>boolean</code>
        * [.tooShort()](#Validator.tooShort) ⇒ <code>boolean</code>
        * [.rangeOverflow()](#Validator.rangeOverflow) ⇒ <code>boolean</code>
        * [.rangeUnderflow()](#Validator.rangeUnderflow) ⇒ <code>boolean</code>
        * [.valueMissing(element)](#Validator.valueMissing) ⇒ <code>boolean</code>
        * [.nameMissing(element)](#Validator.nameMissing) ⇒ <code>boolean</code>
        * [.isRequired(element)](#Validator.isRequired) ⇒ <code>boolean</code>
        * [.customError()](#Validator.customError) ⇒ <code>boolean</code>
        * [.willSerialize(element)](#Validator.willSerialize) ⇒ <code>boolean</code>

<a name="Validator+instanceType"></a>

### validator.instanceType
Return the type of the class

**Kind**: instance property of [<code>Validator</code>](#Validator)  
<a name="Validator.isFormElement"></a>

### Validator.isFormElement(element) ⇒ <code>boolean</code>
Check if element is child of a form

**Kind**: static method of [<code>Validator</code>](#Validator)  

| Param | Type |
| --- | --- |
| element | <code>HTMLElement</code> | 

<a name="Validator.tooLong"></a>

### Validator.tooLong() ⇒ <code>boolean</code>
Check if element value is bigger than element maxlength

**Kind**: static method of [<code>Validator</code>](#Validator)  
<a name="Validator.tooShort"></a>

### Validator.tooShort() ⇒ <code>boolean</code>
Check if element value is less than element minlength

**Kind**: static method of [<code>Validator</code>](#Validator)  
<a name="Validator.rangeOverflow"></a>

### Validator.rangeOverflow() ⇒ <code>boolean</code>
Checks if the value of an element is bigger than its max attribute

**Kind**: static method of [<code>Validator</code>](#Validator)  
<a name="Validator.rangeUnderflow"></a>

### Validator.rangeUnderflow() ⇒ <code>boolean</code>
Checks if the value of an element is smaller than its min attribute

**Kind**: static method of [<code>Validator</code>](#Validator)  
<a name="Validator.valueMissing"></a>

### Validator.valueMissing(element) ⇒ <code>boolean</code>
Check if element is required and its value is missing

**Kind**: static method of [<code>Validator</code>](#Validator)  

| Param | Type |
| --- | --- |
| element | <code>HTMLElement</code> | 

<a name="Validator.nameMissing"></a>

### Validator.nameMissing(element) ⇒ <code>boolean</code>
Check if element name is missing

**Kind**: static method of [<code>Validator</code>](#Validator)  

| Param | Type |
| --- | --- |
| element | <code>HTMLElement</code> | 

<a name="Validator.isRequired"></a>

### Validator.isRequired(element) ⇒ <code>boolean</code>
Check if an element is required

**Kind**: static method of [<code>Validator</code>](#Validator)  

| Param | Type |
| --- | --- |
| element | <code>HTMLElement</code> | 

<a name="Validator.customError"></a>

### Validator.customError() ⇒ <code>boolean</code>
Checks if there is a custom error for the element

**Kind**: static method of [<code>Validator</code>](#Validator)  
<a name="Validator.willSerialize"></a>

### Validator.willSerialize(element) ⇒ <code>boolean</code>
Checks if element is going to be serialized.If an element doesn't have a name it will not be serialized.Used to determine if an element should be validated.

**Kind**: static method of [<code>Validator</code>](#Validator)  

| Param | Type |
| --- | --- |
| element | <code>HTMLElement</code> | 

<a name="NativeElementValidator"></a>

## NativeElementValidator
The NativeElementValidator uses the methods from the Validator classAll native elements tha don't support methods like isFormElement, tooLong, tooShortetc.. will be wrapped in this class in order to enable us to validate native andcustom elements using the same methods.

**Kind**: global class  
<a name="CustomElementValidator"></a>

## CustomElementValidator
The CustomElementValidator is inherited by custom elements in order to gain thevalidation function from the Validator class.This class can not be used to wrap the native elements as it inherits theHTMLElement which can not be instantiated using the new keyword.

**Kind**: global class  
<a name="TextFieldValidator"></a>

## TextFieldValidator
Class that implements the commong validation methods for the text fields

**Kind**: global class  

* [TextFieldValidator](#TextFieldValidator)
    * [.tooLong(element)](#TextFieldValidator.tooLong) ⇒ <code>boolean</code>
    * [.tooShort(element)](#TextFieldValidator.tooShort) ⇒ <code>boolean</code>
    * [.rangeOverflow(element)](#TextFieldValidator.rangeOverflow) ⇒ <code>boolean</code>
    * [.rangeUnderflow(element)](#TextFieldValidator.rangeUnderflow) ⇒ <code>boolean</code>
    * [.isBadURL(element)](#TextFieldValidator.isBadURL) ⇒ <code>boolean</code>
    * [.isBadEmail(element)](#TextFieldValidator.isBadEmail) ⇒ <code>boolean</code>

<a name="TextFieldValidator.tooLong"></a>

### TextFieldValidator.tooLong(element) ⇒ <code>boolean</code>
Most of the custom elements will not need this check however,we call all validation methods in order to determine if an element is valid.Each element that needs this check implements it itself.

**Kind**: static method of [<code>TextFieldValidator</code>](#TextFieldValidator)  

| Param | Type |
| --- | --- |
| element | <code>HTMLElement</code> | 

<a name="TextFieldValidator.tooShort"></a>

### TextFieldValidator.tooShort(element) ⇒ <code>boolean</code>
Most of the custom elements will not need this check however,we call all validation methods in order to determine if an element is valid.Each element that needs this check implements it itself.

**Kind**: static method of [<code>TextFieldValidator</code>](#TextFieldValidator)  

| Param | Type |
| --- | --- |
| element | <code>HTMLElement</code> | 

<a name="TextFieldValidator.rangeOverflow"></a>

### TextFieldValidator.rangeOverflow(element) ⇒ <code>boolean</code>
Most of the custom elements will not need this check however,we call all validation methods in order to determine if an element is valid.Each element that needs this check implements it itself.

**Kind**: static method of [<code>TextFieldValidator</code>](#TextFieldValidator)  

| Param | Type |
| --- | --- |
| element | <code>HTMLElement</code> | 

<a name="TextFieldValidator.rangeUnderflow"></a>

### TextFieldValidator.rangeUnderflow(element) ⇒ <code>boolean</code>
Most of the custom elements will not need this check however,we call all validation methods in order to determine if an element is valid.Each element that needs this check implements it itself.

**Kind**: static method of [<code>TextFieldValidator</code>](#TextFieldValidator)  

| Param | Type |
| --- | --- |
| element | <code>HTMLElement</code> | 

<a name="TextFieldValidator.isBadURL"></a>

### TextFieldValidator.isBadURL(element) ⇒ <code>boolean</code>
Checks if the text field with type url has a valid url by its pattern

**Kind**: static method of [<code>TextFieldValidator</code>](#TextFieldValidator)  

| Param | Type |
| --- | --- |
| element | <code>HTMLElement</code> | 

<a name="TextFieldValidator.isBadEmail"></a>

### TextFieldValidator.isBadEmail(element) ⇒ <code>boolean</code>
Checks if the text field element with type email is valid

**Kind**: static method of [<code>TextFieldValidator</code>](#TextFieldValidator)  

| Param | Type |
| --- | --- |
| element | <code>HTMLElement</code> | 

<a name="GamefaceComponents"></a>

## GamefaceComponents
Class that defines the Gameface components

**Kind**: global class  

* [GamefaceComponents](#GamefaceComponents)
    * [.importScript(url)](#GamefaceComponents+importScript)
    * [.loadHTML(url)](#GamefaceComponents+loadHTML) ⇒ <code>promise</code>
    * [.whenDefined(name)](#GamefaceComponents+whenDefined) ⇒ <code>promise</code>
    * [.defineCustomElement(name, element)](#GamefaceComponents+defineCustomElement)
    * [.importComponent(url)](#GamefaceComponents+importComponent)
    * [.removeSlashes(path)](#GamefaceComponents+removeSlashes) ⇒ <code>string</code>
    * [.removeNewLines(template)](#GamefaceComponents+removeNewLines) ⇒ <code>string</code>
    * [.removeCopyrightNotice(template)](#GamefaceComponents+removeCopyrightNotice) ⇒ <code>string</code>
    * [.resolveWithTemplate(component)](#GamefaceComponents+resolveWithTemplate) ⇒ <code>Promise.&lt;HTMLElement&gt;</code>
    * [.loadResource(component)](#GamefaceComponents+loadResource) ⇒ <code>promise</code>
    * [.requestResource(url)](#GamefaceComponents+requestResource) ⇒ <code>promise</code>
    * [.findSlots(parent, parentElName, result)](#GamefaceComponents+findSlots) ⇒ <code>Object</code>
    * [.replaceSlots(source, target)](#GamefaceComponents+replaceSlots)
    * [.transferContent(source, target)](#GamefaceComponents+transferContent)
    * [.renderOnce(element)](#GamefaceComponents+renderOnce) ⇒ <code>boolean</code>
    * [.render(element)](#GamefaceComponents+render)
    * [.transferChildren(element, targetContainerSelector, children)](#GamefaceComponents+transferChildren)
    * [.waitForFrames(callback, count)](#GamefaceComponents+waitForFrames) ⇒ <code>any</code>
    * [.isBrowserGameface()](#GamefaceComponents+isBrowserGameface) ⇒ <code>boolean</code>
    * [.isNumberPositiveValidation(propName, value)](#GamefaceComponents+isNumberPositiveValidation) ⇒ <code>boolean</code>

<a name="GamefaceComponents+importScript"></a>

### gamefaceComponents.importScript(url)
Create and add a script tag with given url.

**Kind**: instance method of [<code>GamefaceComponents</code>](#GamefaceComponents)  

| Param | Type |
| --- | --- |
| url | <code>string</code> | 

<a name="GamefaceComponents+loadHTML"></a>

### gamefaceComponents.loadHTML(url) ⇒ <code>promise</code>
Loads an html by given url.

**Kind**: instance method of [<code>GamefaceComponents</code>](#GamefaceComponents)  
**Returns**: <code>promise</code> - resolved with the html as text.  

| Param | Type |
| --- | --- |
| url | <code>string</code> | 

<a name="GamefaceComponents+whenDefined"></a>

### gamefaceComponents.whenDefined(name) ⇒ <code>promise</code>
Creates a promise which resolves when a custom element was defined.Saves the promise for each defined component.

**Kind**: instance method of [<code>GamefaceComponents</code>](#GamefaceComponents)  
**Returns**: <code>promise</code> - - the previously saved promise it any or a new one  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | the name of the custom element |

<a name="GamefaceComponents+defineCustomElement"></a>

### gamefaceComponents.defineCustomElement(name, element)
Defines a custom element.

**Kind**: instance method of [<code>GamefaceComponents</code>](#GamefaceComponents)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | the name of the element. |
| element | <code>Object</code> | the object which describes the element. |

<a name="GamefaceComponents+importComponent"></a>

### gamefaceComponents.importComponent(url)
Imports a component by given url.It will automatically try to import style.css and script.js if thesefiles' names were not explicitly specified.

**Kind**: instance method of [<code>GamefaceComponents</code>](#GamefaceComponents)  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | the url of the component |

<a name="GamefaceComponents+removeSlashes"></a>

### gamefaceComponents.removeSlashes(path) ⇒ <code>string</code>
Removes back and forward slashes from string

**Kind**: instance method of [<code>GamefaceComponents</code>](#GamefaceComponents)  

| Param | Type |
| --- | --- |
| path | <code>string</code> | 

<a name="GamefaceComponents+removeNewLines"></a>

### gamefaceComponents.removeNewLines(template) ⇒ <code>string</code>
Remove new lines from the beginning of templates,because template.firstChild.cloneNode will clone an emptystring and will return an empty template.

**Kind**: instance method of [<code>GamefaceComponents</code>](#GamefaceComponents)  

| Param | Type |
| --- | --- |
| template | <code>string</code> | 

<a name="GamefaceComponents+removeCopyrightNotice"></a>

### gamefaceComponents.removeCopyrightNotice(template) ⇒ <code>string</code>
Removes the copyright notice from the template

**Kind**: instance method of [<code>GamefaceComponents</code>](#GamefaceComponents)  
**Returns**: <code>string</code> - the template without the copyright notice  

| Param | Type |
| --- | --- |
| template | <code>string</code> | 

<a name="GamefaceComponents+resolveWithTemplate"></a>

### gamefaceComponents.resolveWithTemplate(component) ⇒ <code>Promise.&lt;HTMLElement&gt;</code>
Used when the element has already been rendered.Return the already rendered template instead ofloading and slotting its elements.

**Kind**: instance method of [<code>GamefaceComponents</code>](#GamefaceComponents)  
**Returns**: <code>Promise.&lt;HTMLElement&gt;</code> - - a promise that will resolve with the rendered template  

| Param | Type | Description |
| --- | --- | --- |
| component | <code>HTMLElement</code> | the component that was rendered |

<a name="GamefaceComponents+loadResource"></a>

### gamefaceComponents.loadResource(component) ⇒ <code>promise</code>
Uses an XMLHttpRequest to load an external file.

**Kind**: instance method of [<code>GamefaceComponents</code>](#GamefaceComponents)  
**Returns**: <code>promise</code> - - a promise that is resolved with the file's text content.  

| Param | Type | Description |
| --- | --- | --- |
| component | <code>string</code> | the url of the file. |

<a name="GamefaceComponents+requestResource"></a>

### gamefaceComponents.requestResource(url) ⇒ <code>promise</code>
Execute an XMLHttpRequest to load a resource by url.

**Kind**: instance method of [<code>GamefaceComponents</code>](#GamefaceComponents)  
**Returns**: <code>promise</code> - - promise which resolves with the loaded resource  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | the path to the resource |

<a name="GamefaceComponents+findSlots"></a>

### gamefaceComponents.findSlots(parent, parentElName, result) ⇒ <code>Object</code>
Recursively finds the slot elements in a given element.

**Kind**: instance method of [<code>GamefaceComponents</code>](#GamefaceComponents)  
**Returns**: <code>Object</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| parent | <code>HTMLElement</code> | the element which is searched for slots. |
| parentElName | <code>string</code> |  |
| result | <code>object</code> | a key:value object containing the slot elements under their data-name as value: { <my-slot-name>: HTMLElement } |

<a name="GamefaceComponents+replaceSlots"></a>

### gamefaceComponents.replaceSlots(source, target)
Will replace the slot element

**Kind**: instance method of [<code>GamefaceComponents</code>](#GamefaceComponents)  

| Param | Type |
| --- | --- |
| source | <code>Array.&lt;HTMLElement&gt;</code> | 
| target | <code>HTMLElement</code> | 

<a name="GamefaceComponents+transferContent"></a>

### gamefaceComponents.transferContent(source, target)
Transfers the slottable elements into their slots.

**Kind**: instance method of [<code>GamefaceComponents</code>](#GamefaceComponents)  

| Param | Type | Description |
| --- | --- | --- |
| source | <code>HTMLElement</code> | the element containing the slottable elements. |
| target | <code>HTMLElement</code> | the element containing the slots elements. |

<a name="GamefaceComponents+renderOnce"></a>

### gamefaceComponents.renderOnce(element) ⇒ <code>boolean</code>
Renderes an element only if it wasn't rendered before that

**Kind**: instance method of [<code>GamefaceComponents</code>](#GamefaceComponents)  
**Returns**: <code>boolean</code> - - true if it was rendered, false if not  

| Param | Type |
| --- | --- |
| element | <code>HTMLElement</code> | 

<a name="GamefaceComponents+render"></a>

### gamefaceComponents.render(element)
Renders an element's content into its template.

**Kind**: instance method of [<code>GamefaceComponents</code>](#GamefaceComponents)  

| Param | Type | Description |
| --- | --- | --- |
| element | <code>HTMLElement</code> | the element into which to render the content |

<a name="GamefaceComponents+transferChildren"></a>

### gamefaceComponents.transferChildren(element, targetContainerSelector, children)
Used to render.

**Kind**: instance method of [<code>GamefaceComponents</code>](#GamefaceComponents)  

| Param | Type | Description |
| --- | --- | --- |
| element | <code>HTMLElement</code> | the element which will be rendered |
| targetContainerSelector | <code>string</code> | the selector of the parent element |
| children | <code>Array.&lt;HTMLElement&gt;</code> | the child elements that need to go into the parent |

<a name="GamefaceComponents+waitForFrames"></a>

### gamefaceComponents.waitForFrames(callback, count) ⇒ <code>any</code>
Delay the execution of a callback function by n amount of frames.Used to retrieve the computed styles of elements.

**Kind**: instance method of [<code>GamefaceComponents</code>](#GamefaceComponents)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| callback | <code>function</code> |  | the function that will be executed. |
| count | <code>number</code> | <code>3</code> | the amount of frames that the callback execution should be delayed by. |

<a name="GamefaceComponents+isBrowserGameface"></a>

### gamefaceComponents.isBrowserGameface() ⇒ <code>boolean</code>
Checks if the current user agent is Cohtml

**Kind**: instance method of [<code>GamefaceComponents</code>](#GamefaceComponents)  
<a name="GamefaceComponents+isNumberPositiveValidation"></a>

### gamefaceComponents.isNumberPositiveValidation(propName, value) ⇒ <code>boolean</code>
Check if a value is a number and if not - log an error

**Kind**: instance method of [<code>GamefaceComponents</code>](#GamefaceComponents)  
**Returns**: <code>boolean</code> - - true if it is a number or a string that can be cast to number, false if not  

| Param | Type | Description |
| --- | --- | --- |
| propName | <code>string</code> | the name of the property that needs to be validated |
| value | <code>any</code> |  |

<a name="ComponentSlot"></a>

## ComponentSlot
Class that will handle gameface components slot element

**Kind**: global class  
<a name="isNativeTextField"></a>

## isNativeTextField(element) ⇒ <code>boolean</code>
Checks if the passed element is a native text field

**Kind**: global function  

| Param | Type |
| --- | --- |
| element | <code>HTMLElement</code> | 

