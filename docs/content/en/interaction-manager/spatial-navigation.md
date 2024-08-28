---
date: 2022-3-25
title: Spatial Navigation
draft: false
weight: 6
---

A JavaScript-based implementation for Spatial Navigation with gamepad support

## Basic implementation

```{.javascript}
spatialNavigation.init(['.square']);
```

Click on an element and move the focus with your keyboard arrow keys: <object data="{{<staticUrl "interaction-manager/SpatialNavigation/grid-elements-focus.html">}}" width="1000" height="500"></object>

If you add a `disabled` property to a navigatable element it will skip it when moving the focus

<object data="{{<staticUrl "interaction-manager/SpatialNavigation/grid-elemens-disabled.html">}}" width="1050" height="700"></object>

## API

### init([navigatableElement])

Initializes the spatial navigation.

#### navigatableElement

The navigatableElement can either be a string with a element selector

```{.javascript}
spatialNavigation.init(['.square']);
```

or a navigatableArea object

```{.javascript}
spatialNavigation.init([
    { area: 'square-1', elements: ['.square1'] },
    { area: 'square-2', elements: ['.square2'] },
]);
```

This will create different areas to separate the navigation. If you pass only a selector, it will be saved to the default area.

<object data="{{<staticUrl "interaction-manager/SpatialNavigation/grid-elemens-areas.html">}}" width="1050" height="700"></object>

##### area

Type:

```{.javascript}
type area = string
```

The name of the area you want to be navigatable

##### elements

Type:

```{.javascript}
type elements = string[]
```

An array of the elements selectors that will be navigatable in this area.

### .deinit()

Removes the spatial navigation, listeners and actions.

### add([navigatableElements])

The same as `.init()` but only adds elements to areas and new areas. Use it after initialization.

```{.javascript}
spatialNavigation.add([{ area: 'area-1', elements: ['.element'] }]);
```

### remove(area)

```{.javascript}
type area = string
```

`default='default'`

Remove all of the elements from an area. It uses the area name as an argument, if you don't pass any arguments it will remove the elements from the default area.

```{.javascript}
spatialNavigation.remove('area-1');
```

### focusFirst(area)

```{.javascript}
type area = string
```

`default='default'`

Focuses on the first element of an area.

### focusLast(area)

```{.javascript}
type area = string
```

`default='default'`

Focuses on the last element of an area.

### switchArea(area)

```{.javascript}
type area = string
```

Switches to another area and focuses on the first element.

### clearFocus()

Unfocuses the currently focused element in a navigatable area.

### changeKeys()

```js
spatialNavigation.changeKeys({ up: 'W', down: 's', left: 'a', right: 'd' }, { changeDefault: true });
```

Sets new keys for spatial navigation.  

Accepts an optional options object as the second argument with one option: `changeDefault`. Defaults to `false`. If `true`, it overrides the default navigation keys with the provided ones.

## Actions

The spatial-navigation registers actions that move the focus. You can use these from your code directly with

```{.javascript}
action.execute('move-focus-down'); // moves the focus down
action.execute('move-focus-up'); // moves the focus up
action.execute('move-focus-left'); // moves the focus left
action.execute('move-focus-right'); // moves the focus right
```
