---
date: 2022-3-25
title: Pan and Zoom
draft: false
weight: 10
---

Allows you to zoom in on an element.

## Usage

```{.javascript}
new zoom(zoomOptions)
```

## Basic implementation

```{.javascript}
const grid = new zoom({ element: '.grid' });
```

<object style="border: 2px solid black;" data="{{<staticUrl "interaction-manager/Zoom/pan-zoom.html">}}" width="1000" height="600"></object>

## zoomOptions

### element

Type:

```{.javascript}
type element = string
```

The element selector.

### minZoom

Type:

```{.javascript}
type minZoom = number
```

`default: 0.1`

How much you can zoom out of the element.

### maxZoom

Type:

```{.javascript}
type maxZoom = number
```

`default: Inifinity`

How much you can zoom in on the element.

### zoomFactor

Type:

```{.javascript}
type zoomFactor = number
```

`default: 0.1`

By how much to zoom in or out of the element.

### onZoom

Type:

```{.javascript}
type onZoom = () => {}
```

Executes when the element zooms in or out.

## Actions

You are able to zoom elements using actions. Since every zoom action is unique you can do the following:

```{.javascript}
const element = new zoom({ element: '.grid' });

actions.execute(element.actionName, {x: 100, y: 100, zoomDirection: -1});
```

Where you need to provide the x and y coordinates of the element, where you want to zoom to and the zoomDirection which can be -1 for zoom out and 1 for zoom in.
