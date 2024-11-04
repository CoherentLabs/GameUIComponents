---
date: 2022-3-25
title: Gamepad
draft: false
weight: 5
---

The gamepad object allows for easier gamepad set up. It uses the Gamepad API to create helper functions to listen for button presses or joystick movement.

To start listening for connected gamepads, you first need to enable it. To do that you need to set the following:

```{.javascript}
gamepad.enabled = true;
```

to disable the gamepad, just change the `enabled` property to `false`.

## Changing the polling interval

In order to get the correct information from the Gamepad API, we need to poll the data at an interval. By default this interval is 200ms, but you can change it by doing

```{.javascript}
gamepad.pollingInterval = 400;
```
Which will change the interval to 400ms. 

## .on([gamepadAction])

The `.on` call allows you to set up listeners for your gamepad actions.

### gamepadAction

#### actions

Type:

```{.javascript}
type actions = string[] | number[]
```

The actions array is an array of buttons or joystick actions that will trigger a callback.

You can use either the button number or an alias for the buttons. For the users convenience there are playstation and xbox specific aliases available.

| Number | Generic Alias        | Playstation Alias       | Xbox Alias            |
| ------ | -------------------- | ----------------------- | --------------------- |
| 0      | face-button-down     | playstation.x           | xbox.a                |
| 1      | face-button-right    | playstation.circle      | xbox.b                |
| 2      | face-button-left     | playstation.square      | xbox.x                |
| 3      | face-button-top      | playstation.triangle    | xbox.y                |
| 4      | left-sholder         | playstation.l1          | xbox.lb               |
| 5      | right-sholder        | playstation.r1          | xbox.rb               |
| 6      | left-sholder-bottom  | playstation.l2          | xbox.lt               |
| 7      | right-sholder-bottom | playstation.r2          | xbox.rt               |
| 8      | select               | playstation.share       | xbox.view             |
| 9      | start                | playstation.options     | xbox.menu             |
| 10     | left-analogue-stick  | playstation.l3          | xbox.left-thumbstick  |
| 11     | right-analogue-stick | playstation.r3          | xbox.right-thumbstick |
| 12     | pad-up               | playstation.d-pad-up    | xbox.d-pad-up         |
| 13     | pad-down             | playstation.d-pad-down  | xbox.d-pad-down       |
| 14     | pad-left             | playstation.d-pad-left  | xbox.d-pad-left       |
| 15     | pad-right            | playstation.d-pad-right | xbox.d-pad-right      |
| 16     | center-button        | playstation.center      | xbox.center           |

For example:

```{.javascript}
gamepad.on({
    actions: ['pad-down', 'right-shoulder'],
    callback: () => {},
});
```

will trigger the callback when the down pad and the right shoulder button are pressed at the same time.

You can also use joystick aliases to trigger callbacks on specific joystick movements.

For example:

```{.javascript}
gamepad.on({
    actions: ['left.joystick'],
    callback: () => {},
});
```

will trigger the callback when the left joystick moves.

There are also aliases for specific directions available:

```{.javascript}
gamepad.on({
    actions: ['left.joystick.down'],
    callback: () => {},
});
```

will trigger the callback when the left joystick is moved down.

The available aliases are

```{.javascript}
[
    'right.joystick',
    'left.joystick',
    'left.joystick.down',
    'left.joystick.up',
    'left.joystick.left',
    'left.joystick.right',
    'right.joystick.down',
    'right.joystick.up',
    'right.joystick.left',
    'right.joystick.right',
]
```

{{< alert icon="❗" text="Currently it's not possible to combine a joystick action with another joystick or button action" />}}

#### type

Type

```{.javascript}
type type = ('press' | 'hold')
```

The type of action to execute. 

Choosing `press` will trigger the action once if you press and then release the button. Using `hold` on the other hand will trigger the action constantly until you release the button.

The default value for type is `hold`.

{{< alert icon="❗" text="Currently it's not possible to set a type 'press' on a joystick action" />}}

#### callback

Type:

```{.javascript}
type callback = ([{pressed, touched, value}]) => {} | ([axisX, axisY]) => {} | string
```

The function that will execute when a gamepad action is triggered.

```{.javascript}
gamepad.on({
    actions: ['face-button-down'],
    callback: ([button]) => doSomething(button.pressed, button.touched, button.value),
});
```

```{.javascript}
gamepad.on({
    actions: ['left.joystick'],
    callback: ([axisX, axisY]) => doSomething(axisX, axisY),
});
```

If you are using an action for buttons, you can get the [GamepadButton](https://developer.mozilla.org/en-US/docs/Web/API/GamepadButton) objects for each button that is pressed. If you are using a joystick action, you can get the x and y coordinates of the joystick.

If you already have a registered action you can use it instead of a function:

```{.javascript}
gamepad.on({
    actions: ['face-button-down'],
    callback: 'registered-action',
});
```

## .off([actions])

Removes a registered gamepad action.

```{.javascript}
gamepad.off(['left.joystick']);
```

You will need to provide the exact actions you have registered in order to remove them.

For example if you have registered an action using a `playstation` alias, you will also need to remove it using the same alias.