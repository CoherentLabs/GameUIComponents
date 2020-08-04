
Component library which supports the creation and usage of custom elements. Provides a way to encapsulate a component specific functionality and reuse it. Similar to the [Web Components suite](https://developer.mozilla.org/en-US/docs/Web/Web_Components). Exposes a components object to the Global namespace.


API Reference
===================

<a name="GamefaceComponents"></a>

## GamefaceComponents
**Kind**: global class

* [GamefaceComponents](#GamefaceComponents)
    * [.importScript(url)](#GamefaceComponents+importScript)
    * [.loadHTML(url)](#GamefaceComponents+loadHTML) => <code>promise</code>
    * [.whenDefined(name)](#GamefaceComponents+whenDefined) => <code>promise</code>
    * [.defineCustomElement(name, element)](#GamefaceComponents+defineCustomElement)
    * [.importComponent(url)](#GamefaceComponents+importComponent)
    * [.loadResource(url)](#GamefaceComponents+loadResource) => <code>promise</code>
    * [.importStyle(url)](#GamefaceComponents+importStyle)
    * [.findSlots(parent, result)](#GamefaceComponents+findSlots) => <code>Object</code>
    * [.transferContent(source, target)](#GamefaceComponents+transferContent)

<a name="GamefaceComponents+importScript"></a>

### GamefaceComponents.importScript(url)
Create and add a script tag with given url.

**Kind**: instance method of [<code>GamefaceComponents</code>](#GamefaceComponents)

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | The path to the script. |

<a name="GamefaceComponents+loadHTML"></a>

### GamefaceComponents.loadHTML(url) => <code>promise</code>
Loads an html by given url.

**Kind**: instance method of [<code>GamefaceComponents</code>](#GamefaceComponents)
**Returns**: <code>promise</code> - - Resolved with the html as text.

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | The path to the html. |

<a name="GamefaceComponents+whenDefined"></a>

### GamefaceComponents.whenDefined(name) => <code>promise</code>
Saves the promise for each defined component.

**Kind**: instance method of [<code>GamefaceComponents</code>](#GamefaceComponents)
**Returns**: <code>promise</code> - - The previously saved promise it any or a new one.

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The name of the custom element. |

<a name="GamefaceComponents+defineCustomElement"></a>

### GamefaceComponents.defineCustomElement(name, element)
Defines a custom element.

**Kind**: instance method of [<code>GamefaceComponents</code>](#GamefaceComponents)

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The name of the element. |
| element | <code>Object</code> | The object which describes the element. |

<a name="GamefaceComponents+importComponent"></a>

### GamefaceComponents.importComponent(url)
It will automatically try to import `style.css` and `script.js`.

**Kind**: instance method of [<code>GamefaceComponents</code>](#GamefaceComponents)

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | The url of the component. |

<a name="GamefaceComponents+loadResource"></a>

### GamefaceComponents.loadResource(url) => <code>promise</code>
Uses an XMLHttpRequest to load an external file.

**Kind**: instance method of [<code>GamefaceComponents</code>](#GamefaceComponents)
**Returns**: <code>promise</code> - - A promise that is resolved with the file's text content.

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | The url of the file. |

<a name="GamefaceComponents+importStyle"></a>

### GamefaceComponents.importStyle(url)
Appends a `<link>` element which imports a given css file.

**Kind**: instance method of [<code>GamefaceComponents</code>](#GamefaceComponents)

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | The source to a given css file. |

<a name="GamefaceComponents+findSlots"></a>

### GamefaceComponents.findSlots(parent, result) => <code>Object</code>
Recursively finds the slot elements in a given element.

**Kind**: instance method of [<code>GamefaceComponents</code>](#GamefaceComponents)
**Returns**: <code>Object</code> - result

| Param | Type | Description |
| --- | --- | --- |
| parent | <code>HTMLElement</code> | The element which is searched for slots. |
| result | <code>object</code> | A key:value object containing the slot elements under their data-name as value: { <my-slot-name>: HTMLElement }. |

<a name="GamefaceComponents+transferContent"></a>

### GamefaceComponents.transferContent(source, target)
Transfers the slottable elements into their slots.

**Kind**: instance method of [<code>GamefaceComponents</code>](#GamefaceComponents)

| Param | Type | Description |
| --- | --- | --- |
| source | <code>HTMLElement</code> | The element containing the slottable elements. |
| target | <code>HTMLElement</code> | The element containing the slots elements. |

