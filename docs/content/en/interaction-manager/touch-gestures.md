---
date: 2023-3-25
title: Touch Gestures
draft: false
weight: 11
---

Allows you to easily use some of the most common Touch Gestures like - tap, hold, drag, swipe, pinch/stretch and zoom.

## tap

Put and lift the finger from the screen quickly

Usage

```{.javascript}
touchGestures.tap(tapOptions)
```

### tapOptions

#### element

Type:

```{.javascript}
type element = string || HTMLElement
```

The element or element selector to attach the tap.

#### callback

Type:

```{.javascript}
type callback = () => {}
```

The function called on tap

#### tapsNumber

Type:

```{.javascript}
type tapsNumber = number
```

`default = 1`

The number of taps to trigger the callback

#### tapTime

Type:

```{.javascript}
type tapTime = number
```

`default = 200`

Time in milliseconds between putting down and lifting the finger from the screen.

#### betweenTapsTime

Type:

```{.javascript}
type betweenTapsTime = number
```

`default = 500`

Time in milliseconds between sequential taps.

## hold

Put and lift the finger after a set amount of time

Usage

```{.javascript}
touchGestures.hold(holdOptions)
```

### holdOptions

#### element

Type:

```{.javascript}
type element = string || HTMLElement
```

The element or element selector to attach the hold.

#### callback

Type:

```{.javascript}
type callback = () => {}
```

The function called when the hold time is up.

#### time

Type:

```{.javascript}
type time = number
```

`default = 1000`

Time in milliseconds for the hold to complete.

## drag

Put a finger on the screen and move it around to drag. Drag stops when the finger is lifted.

Usage

```{.javascript}
touchGestures.drag(dragOptions)
```

### dragOptions

#### element

Type:

```{.javascript}
type element = string || HTMLElement
```

The element or element selector to attach the drag.

#### onDragStart

Type:

```{.javascript}
type callback = ({
    x: number,
    y: number,
    target: HTMLElement,
    currentTarget: HTMLElement
}) => {}
```

The function called when you start dragging

#### onDrag

Type:

```{.javascript}
type callback = ({
    x: number,
    y: number,
}) => {}
```

The function called when you drag

#### onDragEnd

Type:

```{.javascript}
type callback = ({
    x: number,
    y: number,
}) => {}
```

The function called when you stop dragging

## swipe

Put a finger on the screen and move it in a set direction quickly and then lift it

Usage

```{.javascript}
touchGestures.swipe(swipeOptions)
```

### swipeOptions

#### element

Type:

```{.javascript}
type element = string || HTMLElement
```

The element or element selector to attach the swipe.

#### callback

Type:

```{.javascript}
type callback = (direction = string) => {}
```

The function called when the swipe is done.

The direction of the swipe can be the following: `top`, `bottom`, `left`, `right`, `top-left`, `top-right`, `bottom-left` and `bottom-right`

#### touchNumber

Type:

```{.javascript}
type touchNumber = number
```

`default = 1`

The number of fingers required to perform the swipe.

## pinch

Put two fingers on the screen and start moving them in opposite directions. Bring them together to pinch and apart to stretch.

Usage

```{.javascript}
touchGestures.pinch(pinchOptions)
```

### pinchOptions

#### element

Type:

```{.javascript}
type element = string || HTMLElement
```

The element or element selector to attach the pinch.

#### callback

Type:

```{.javascript}
type callback = (pinchDelta = string) => {}
```

The function called on pinch/stretch. The `pinchDelta` is either `40` for stretching or `-40` for pinching.

## rotate

Put two fingers on the screen and start moving them in a clockwise or counter-clockwise direction.

Usage

```{.javascript}
touchGestures.rotate(rotateOptions)
```

### rotateOptions

#### element

Type:

```{.javascript}
type element = string || HTMLElement
```

The element or element selector to attach the rotate.

#### callback

Type:

```{.javascript}
type callback = (angle = number) => {}
```

The function called on rotate. Provides an angle between 0 and 360 degrees.


## Removing gestures

To remove a gesture you will need to save it to a variable and then call the `remove()` method.

For Example

```{.javascript}
const tap = touchGestures.tap({
    element: '.tap-container',
    callback: () => {}
})

tap.remove();
```

## Enabling touch gestures for the other Interaction Manager modules

Touch gestures are available in the other IM modules, however they need to be enabled. The process for each one is the same, you just need to do `IMmodule.touchEnabled = true` to enable them. Or set it to `false` to disable them.

For Example

```{.javascript}
const square = new draggable({ element: '.square' });

square.touchEnabled = true // You can now drag the square around using your fingers

square.touchEnabled = false // To remove the touch events
```