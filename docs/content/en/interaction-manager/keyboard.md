---
date: 2022-3-25
title: Keyboard
draft: false
weight: 4
---

The keyboard object provides an easy to use way to set up keys to perform different actions in your UI. It also allows you to create key combinations with ease. It also provides two properties for adding and removing key actions

## .on([keyAction])

Sets up a key action. You can add multiple actions with a single `.on` call.

```{.javascript}
interactionManager.keyboard.on([keyAction])
```

### keyAction

#### keys

Type:

```{.javascript}
type keys = string[] | number[]
```

The `keys` array are the keys that will trigger the callback. Putting multiple keys will treat them as a key combination.

For example, the following code will trigger the callback when pressing 'A', 'B' and 'C' keys on the keyboard at the same time

```{.javascript}
keyboard.on({
    keys: ['A', 'B', 'C'],
    callback: () => {},
})
```

Apart from using strings for keys, you can also use keycodes or the 'KEYS' global object.

```{.javascript}
keyboard.on({
    keys: [65, 66, 67],
    callback: () => {},
})
```

```{.javascript}
keyboard.on({
    keys: [KEYS.A, KEYS.B, KEYS.C],
    callback: () => {},
})
```

#### callback

Type:

```{.javascript}
type callback = (() => void) | string
```

The `callback` property is the function that will be triggered when the keys from the `keys` array are pressed.

You can either write your function inside the object

```{.javascript}
keyboard.on({
    keys: ['A', 'B', 'C'],
    callback: () => doSomething(),
});
```

or if you have a registered action, you can pass it here

```{.javascript}
keyboard.on({
    keys: ['A', 'B', 'C'],
    callback: 'registered-action',
});
```

#### type

Type:

```{.javascript}
type type = ('press' | 'hold' | 'lift)
```

The `type` property shows the type of key interaction that the callback will be triggered on.

This example will trigger the callback on a key press. If you press and hold the key it will only trigger once.

```{.javascript}
keyboard.on({
    keys: ['A', 'B', 'C'],
    callback: () => doSomething(),
    type: 'press'
});
```

This example will trigger the callback when you hold the key. If you press the key and release it immediately it won't trigger anything.

```{.javascript}
keyboard.on({
    keys: ['A', 'B', 'C'],
    callback: () => doSomething(),
    type: 'hold'
});
```

This example will trigger the callback when you lift your finger from the key. The callback will only trigger when you release the keys.

```{.javascript}
keyboard.on({
    keys: ['A', 'B', 'C'],
    callback: () => doSomething(),
    type: 'lift'
});
```

## .off([keys])

Removes an already set up key combination.

### keys

The keys array is an array of the keys involved in a key combination that you want to remove

For example if you have set up to use the 'A', 'B' and 'C' keys in a combination, you can remove the action by doing:

```{.javascript}
keyboard.off(['A', 'B', 'C'])
```

If you have added the key combination as keycodes or using the KEYS global object you need to remove them the same way:

```{.javascript}
keyboard.off([65, 66, 67])
```

```{.javascript}
keyboard.off([KEYS.A, KEYS.B, KEYS.C])
```
