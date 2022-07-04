---
date: 2022-3-25
title: Rotate
draft: false
weight: 9
---

Allows you to rotate an element.

## Usage

```javascript
new rotate(rotateOptions)
```

## Basic implementation

```javascript
const circle = new rotate({ element: '.circle1' });
```

<object style="border: 2px solid black;" data="../../interaction-manager/Rotate/rotate.html" width="1000" height="500"></object>

## rotateOptions

### element

Type:

```javascript
type element = string
```

The element selector.

### snapAngle

Type:

```javascript
type snapAngle = number
```

`default: 1`

The angle that the rotation snaps to.

### onRotation

Type:

```javascript
type onRotation = (angle) => {}
```

Executes when the element rotates.


## Actions

You are able to rotate elements using actions. Since every rotate action is unique you can do the following:

```javascript
const element = new rotate({ element: '.circle1' });

actions.execute(element.actionName, angle);
```
