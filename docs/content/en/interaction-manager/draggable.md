---
date: 2022-3-25
title: Draggable
draft: false
weight: 7
---

Allows you to drag around elements on the screen.

## Usage

```{.javascript}
new draggable(draggableOptions);
```

## Basic implementation

```{.javascript}
const square = new draggable({ element: '.square' });
```

<object style="border: 2px solid black;" data="{{<staticUrl "interaction-manager/Draggable/drag-around-screen.html">}}" width="1000" height="500"></object>

## dragableOptions

### element

Type:

```{.javascript}
type element = string
```

The element selector.

### restrictTo

Type:

```{.javascript}
type restrictTo = string;
```

Restricts the dragged element to another element. That way the dragged element won't go out of the other element bounds.

**Example**

```{.javascript}
const square = new draggable({ element: '.square', restrictTo: '.container' });
```

<object style="border: 2px solid black;" data="{{<staticUrl "interaction-manager/Draggable/restrict-drag-to-container.html">}}" width="1000" height="600"></object>

### dragClass

Type:

```{.javascript}
type dragClass = string
```

Class to be added to the dragged element.

### lockAxis

Type:

```{.javascript}
type lockAxis = 'x' | 'y'
```

Locks the dragged element to either the x or y axis.

**Example**

```{.javascript}
const square1 = new draggable({ element: '.square1', lockAxis: 'x' });
const square2 = new draggable({ element: '.square2', lockAxis: 'y' });
```

<object style="border: 2px solid black;" data="{{<staticUrl "interaction-manager/Draggable/drag-lock-axis.html">}}" width="1000" height="600"></object>

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

## Actions

You are able to drag elements using actions. Since every draggable action is unique you can do the following:

```{.javascript}
const element = new draggable({ element: '.square'});

actions.execute(element.actionName, {x: 100, y: 100, index: 0}); 
```

You will need to pass the x and y coordinates where you want the element to go and the index of the element.
