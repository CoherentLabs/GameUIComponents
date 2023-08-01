---
date: 2022-3-25
title: Dropzone
draft: false
weight: 8
---

Allows you to drag around elements on the screen.

## Usage

```
new dropzone(dropzoneOptions);
```

## Basic implementation

```
const square = new dropzone({ element: '.square', dropzones: ['.dropzone'] });
```

<object style="border: 2px solid black;" data="{{<staticUrl "interaction-manager/Dropzone/dropzone-drop.html">}}" width="1000" height="500"></object>

## dropzoneOptions

### element

Type:

```
type element = string
```

The element selector.

### dropzones

Type:

```
type dropzones = string[]
```

Array of dropzones that the element can be dropped into.

### dragClass

Type:

```
type dragClass = string
```

Class to be added to the dragged element.

### dropzoneActiveClass

Type:

```
type dropzoneActiveClass = string
```

Class to be added to the dropzone, whenever an element is dragged over it.

### dropType

Type:

```
type dropType = 'switch' | 'add' | 'shift' | 'none'
```

`default: 'add'`

The type of action to take, when you drop an element over a dropzone that already has elements inside.

| Type   | Description                                                   |
| ------ | ------------------------------------------------------------- |
| none   | Returns the dragged element to the initial position           |
| switch | Switches the dragged element with the element in the dropzone |
| add    | Adds the dragged element to the dropzone                      |
| shift  | Shifts the element to the nearest empty dropzone              |

**Example**

```
const square = new dropzone({ element: '.square1', dropzones: ['.dropzone1'], dropType: 'add' });
const square1 = new dropzone({ element: '.square2', dropzones: ['.dropzone2'], dropType: 'none' });
const square2 = new dropzone({ element: '.square3', dropzones: ['.dropzone3'], dropType: 'switch' });
const square3 = new dropzone({ element: '.square4', dropzones: ['.dropzone4'], dropType: 'shift' });
```

<object style="border: 2px solid black;" data="{{<staticUrl "interaction-manager/Dropzone/dropzone-drop-type.html">}}" width="1000" height="700"></object>

### onDragStart

Type:

```{.javascript}
type onDragStart = () => {}
```

Executes when you start dragging the element.

### onDragMove

Type:

```{.javascript}
type onDragMove = () => {}
```

Executes when you move the dragged element.

### onDragEnd

Type:

```{.javascript}
type onDragEnd = () => {}
```

Executes when you stop dragging the element.

### onDropZoneLeave

Type:

```{.javascript}
type onDropZoneLeave = () => {}
```

Executes when you drag an element out of a a dropzone

### onDropZoneEnter

Type:

```{.javascript}
type onDropZoneEnter = () => {}
```

Executes when you drag an element over a dropzone

### onDrop

Type:

```{.javascript}
type onDrop = (dropEventData) => {}
```

Executes when an element is dropped in a dropzone.

#### dropEventData

```{.javascript}
type dropEventData = {
    preventDefault: () => {} //preventDefault stops the element from being dropped. Useful when you want to have a backend handle the element move
    target: HTMLElement,
    dropzone: HTMLElement,
}
```

{{< alert icon="💡" text="Note: Using asynchronous operations inside the event callback will stop preventDefault from working. To workaround that, use dropType: 'ignore' to simulate the same effect." />}}

## Actions

You are able to drag elements using actions. Since every dropzone action is unique you can do the following:

```{.javascript}
const element = new dropzone({ element: '.square', dropzones: ['.dropzone'] });

actions.execute(element.actionName, {x: 100, y: 100, index: 0});
```

You will need to pass the x and y coordinates where you want the element to go and the index of the element.
