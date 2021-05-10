<!--Copyright (c) Coherent Labs AD. All rights reserved. -->
#Creating a Main Page of Game User Interface

To create the main page of the game ui in this sample you'll need to install the gameface-menu component. To do so run:

`npm i gameface-menu`

The gameface menu exports several custom elements. The gameface-left-menu
is a menu that is anchored to the left of the screen. We'll use it to create the main menu.

The menu component is configured with menu-item elements. We'll add four menu options:

```
<gameface-left-menu class="left-menu">
    <menu-item slot="menu-item">
        <div class="option">New Game</div>
    </menu-item>
    <menu-item slot="menu-item">
        <div class="option">Social</div>
    </menu-item>
    <menu-item slot="menu-item">
        <div class="option">Options</div>
    </menu-item>
    <menu-item slot="menu-item">
        <div class="option">Quit Game</div>
    </menu-item>
</gameface-left-menu>
```

We'll also add some css rules that will overwrite the default menu styles:

```
.left-menu {
    font-size: 26px;
    top: 30vh;
    left: 20vh;
    background-color: transparent;
}

.left-menu menu-item {
    padding: 0px;
}

menu-item:hover {
    background-color: #707070;
}

menu-item {
    background-color: transparent;
}

.option {
    width: 300px;
    border-bottom-style: solid;
    border-bottom-color: #dadada;
    text-align: center;
    padding-bottom: 5px;
    padding-top: 5px;
}
```

We'll add another menu that is located in the bottom right of the screen. For that we'll use the gameface-bottom-menu component:

```
<gameface-bottom-menu class="bottom-menu">
    <menu-item slot="menu-item">About</menu-item>
    <menu-item slot="menu-item">Store</menu-item>
    <menu-item slot="menu-item">Friends</menu-item>
    <menu-item slot="menu-item">Join Co-Op</menu-item>
</gameface-bottom-menu>
```

We'll add some more styles to better position the bottom menu:

```
gameface-bottom-menu.bottom-menu {
    right: 50px;
    background-color: transparent;
}
```

Finally, we'll add some styles to the body:

```
body {
    background-color: grey;
    width: 100%;
    height: 100%;
    margin: 0px;
    padding: 0px;
    color: #dadada;
}
```