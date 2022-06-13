---
date: 2022-3-25
title: Resize
draft: false
weight: 9
---

Allows you to resize an element.

## Usage

```
new resize(resizeOptions);
```

## Basic implementation

```
const square = new resize({ element: '.square' });
```

<object style="border: 2px solid black;" data="../../interaction-manager/Resize/resize.html" width="1000" height="500"></object>

## resizeOptions

### element

Type:

```
type element = string
```

The element selector.

### edgeWidth

Type:

```
type edgeWidth = number
```

`default: 5`

The width of the edge that you can grab.

### widthMin

Type:

```
type widthMin = number
```

`default: 50`

The minimum width that element can be resized to.

### widthMax

Type:

```
type widthMax = number
```

`default: window.innerWidth`

The maximum width that element can be resized to.

### heightMin

Type:

```
type heightMin = number
```

`default: 50`

The minimum height that element can be resized to.

### heightMax

Type:

```
type heightMax = number
```

`default: window.innerHeight`

The maximum height that element can be resized to.

### onWidthChange

Type:

```
type onWidthChange = (width) => {}
```

Executes when the element width changes

### onHeightChange

Type:

```
type onHeightChange = (height) => {}
```

Executes when the element height changes.

## Actions

You are able to resize elements using actions. Since every resize action is unique you can do the following:

```
const element = new resize({ element: '.square' });

actions.execute(element.heightAction, height);

actions.execute(element.widthAction, width);
```
