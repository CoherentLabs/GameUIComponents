---
date: 2022-3-25
title: Actions
draft: false
weight: 3
---

Allows to register actions that can be reused throughout your code.

## register(action, callback)

Registers the action

```javascript
actions.register('action-to-register', () => {})
```

### action

Type:

```javascript
type action = string
```

The name of the action you want to register.

### callback

Type:

```javascript
type callback = (value) => {}
```

The callback to be executed on this action. The arguments for the callback are provided from the `execute` method.

## execute(action, value)

Executes an action

### action

Type:

```javascript
type action = string
```

The name of the action you want to execute.

### value

Type:

```javascript
type value = any
```

Provides a value to the callback.

## remove(action)

Removes the action.

### action

Type:

```javascript
type action = string
```

The name of the action you want to remove.
