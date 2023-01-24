---
date: 2022-3-25
title: Resize
draft: false
weight: 9
---

Allows you to resize an element.

## Usage

```{.javascript}
new resize(resizeOptions);
```

## Basic implementation

```{.javascript}
const square = new resize({ element: '.square' });
```

<object style="border: 2px solid black;" data="{{<staticUrl "interaction-manager/Resize/resize.html">}}" width="1000" height="500"></object>

## resizeOptions

### element

Type:

```{.javascript}
type element = string
```

The element selector.

### edgeWidth

Type:

```{.javascript}
type edgeWidth = number
```

`default: 5`

The width of the edge that you can grab.

### widthMin

Type:

```{.javascript}
type widthMin = number
```

`default: 50`

The minimum width that element can be resized to.

### widthMax

Type:

```{.javascript}
type widthMax = number
```

`default: window.innerWidth`

The maximum width that element can be resized to.

### heightMin

Type:

```{.javascript}
type heightMin = number
```

`default: 50`

The minimum height that element can be resized to.

### heightMax

Type:

```{.javascript}
type heightMax = number
```

`default: window.innerHeight`

The maximum height that element can be resized to.

### onWidthChange

Type:

```{.javascript}
type onWidthChange = (width) => {}
```

Executes when the element width changes

### onHeightChange

Type:

```{.javascript}
type onHeightChange = (height) => {}
```

Executes when the element height changes.

## Actions

You are able to resize elements using actions. Since every resize action is unique you can do the following:

```{.javascript}
const element = new resize({ element: '.square' });

actions.execute(element.heightAction, height);

actions.execute(element.widthAction, width);
```
