<!--Copyright (c) Coherent Labs AD. All rights reserved. Licensed under the MIT License. See License.txt in the project root for license information. -->

<a href="https://www.npmjs.com/package/coherent-gameface-router"><img src="http://img.shields.io/npm/v/coherent-gameface-router.svg?style=flat-square"/></a>

The gameface-router is part of the components suite. It is not a custom element like most of the components in this suite. It is a JavaScript library similar to the components library.

Installation
===================

```
npm i coherent-gameface-router
```

Importing the Router
===================
The router component exports the following objects:
- bundle - production and development builds, ready for use in the browser
- Router
- Route
- BrowserHistory
- HashHistory

Refer to to **Available Modules** section for more information on what each exported variable is for.

## Usage with UMD:

~~~~{.html}
<script src="./node_modules/coherent-gameface-router/umd/router.production.min.js"></script>
~~~~

If you import the router using a script tag - a global variable *router* will be available.
You can access the Router, Route, BrowserHistory, HashHistory from it:

~~~~{.js}
const browserHistory = new router.BrowserHistory();
router.Route.use(browserHistory);

new router.Router({
    '/': 'home-page',
    '/start-game': '<div>Start Game</div>',
    '/heroes': '<div>Heroes Page</div>',
    '**': '<div>404</div>'
}, browserHistory);
~~~~

## Usage with JavaScript:

If you wish to import the Router using JavaScript you can remove the script tag and import it like this:

~~~~{.js}
import { Router } from 'coherent-gameface-router';
~~~~

or simply

~~~~{.js}
import 'coherent-gameface-router';
~~~~

Note that this approach requires a module bundler like [Webpack](https://webpack.js.org/) or [Rollup](https://rollupjs.org/guide/en/) to resolve the
modules from the node_modules folder. Alternatively, you can import them directly from node_modules:

Available Modules
===================

Along with the router comes the BrowserHistory and HashHistory package, a custom element called `<gameface-route>` and another custom element called `<router-view>`.

### The Browser and Hash History

Both histories are a thin wrapper around the HTML5 history object. It provides methods that
help the router keep better track of the state of history. The main difference between them is that the BrowserHistory will use the history object to control the current path and the HashHistory will use the history object in collaboration with the `window.location.hash`. When the router path has changed:

* BrowserHistory will change the path directly in the page URL (for example - from 'C:/Test/' to 'C:/Test/start')
* HashHistory will append the hash symbol `#` to the current URL and then append the current router path (for example - from 'C:/Test/index.html' to 'C:/Test/index.html#/start')

#### When to use the browser or hash history?

If you have a component that is linked with a route path and inside this component, you are referring assets relative to the main directory then it is a good idea to use the HashHistory instead the BrowserHistory because it will preserve the current working directory (that is the directory of the index page) and the assets will be linked correctly to the component.

In any other scenario, the BrowserHistory can be used.

### The Route Element

The `<gameface-route>` custom element is a special link element that
navigates to a specified page. It updates the BrowserHistory or HashHistory and as a result of this,
the router updates the page.

The `<gameface-route>` has an attribute called **to**. It specifies the path to the page it is supposed to navigate to.

~~~~{.js}
<gameface-route to="/start-game">Start Game</gameface-route>
~~~~

You can specify a class name that will be added to the `<gameface-route>` element when it is active.
To do so define your style using css:

~~~~{.css}
.myActiveStyle {
    color: blue;
}
~~~~

And then add it as an attribute of the `<gameface-route>`:

`<gameface-route activeClass="myActiveStyle">`

You can apply the `activeClass` to multiple `<gameface-route>` elements by adding it to a container:

```
<div activeClass="myActiveStyle">
    <gameface-route to="/">Home</gameface-route>
    <gameface-route to="/play">Play</gameface-route>
    <gameface-route to="/settings">Settings</gameface-route>
</div>
```

If you have both `activeClass` on the wrapper an on some individual elements, those routes that don't have own `activeClass` will inherit it from the parent element and those that have will use their own:

```
<div activeClass="green">
    <gameface-route to="/">Home</gameface-route> // will be green
    <gameface-route activeClass="red" to="/play">Play</gameface-route> // will be red
    <gameface-route to="/settings">Settings</gameface-route> // will be green
</div>
```

If you don't add `activeClass` to the wrapper div and the route element then the default light blue color will be used.

### The RouterView Element

The `<router-view>` element is a placeholder for the components that will be rendered
upon navigation. Put the `<router-view>` somewhere in the document:

~~~~{.js}
<gameface-route to="/start-game">Start Game</gameface-route>
<router-view></router-view>
~~~~


Usage
===================

You can import the Router, Route, BrowserHistory, and the HashHistory like this:

~~~~{.js}
import { Router, Route, BrowserHistory, HashHistory } from 'coherent-gameface-router';
~~~~

Route is a helper class that sets up the `<gameface-route>` element.

The router **can not** work without history, it is mandatory, so the first thing
you need to do is to instantiate the history:

~~~~{.js}
const myHistory = new BrowserHistory();
or
const myHistory = new HashHistory();
~~~~

The `<gameface-route>` also depends on the history. To initialize it do:

~~~~{.js}
Route.use(myHistory);
~~~~

The router is configured using an object of { 'route': 'component-name | HTML' } pairs:

~~~~{.js}
const config = {
    '/': 'home-page',
    '/start-game': 'start-game-page',
    '/heroes': 'heroes-page',
};

You can also directly put the HTML that you want to be displayed:

const config = {
    '/': '<div>Home</div>',
    '/start-game': '<button>Start Game<button>',
};

const router = new Router(config, myHistory);
~~~~

And the second parameter is the history. The components in the configuration are
the names of the custom element. When the router navigates to '/start-game' it will
show the `<start-game-page>` element.

## Route Params & Wildcard Navigation

### Route Params

You can specify dynamic route parameters by using colon(:) in the path:

~~~~{.js}
const config = {
    '/': 'home-page',
    '/start-game': 'start-game-page',
    '/heroes': 'heroes-page',
    '/heroes/:id': 'hero-component',
};

const router = new Router(config, myHistory);
~~~~

Now, if the router navigates to a route '/heroes/support', the hero-component will
receive an object with the route parameter and its current value:
`element.params = { id: 'support' }`. The key used to save the route parameters is called `params` and the key for the parameter itself is the value after the **:**.

A route configuration:
'/start-game/:mode'
and a route:
'/start-game/ranked'

will pass a `params` object - { mode: 'ranked' }.

### Configuring a Wildcard Route

The wildcard route is used to specify which component to be displayed if the
router doesn't match any of the configured routes. It's the missing 404 page
displayed in websites when the server returns a "not found" response code - 404.

To configure the wildcard route use two asterisks(**) in the route:

~~~~{.js}
const config = {
    '/': 'home-page',
    '/start-game': 'start-game-page',
    '/heroes': 'heroes-page',
    '/heroes/:id': 'hero-component',
    '**': 'not-found-page'
};

const router = new Router(config, myHistory);
~~~~

## Nesting Routers

Sometimes if your UI has a lot of nesting levels, the routes can get long and it
can become hard to read and understand them, especially if you have a long list of routes:

~~~~{.js}
const config = {
    '/':                       'home-page',
    '/start-game':             'start-game-page',
    '/heroes':                 'heroes-page',
    '/heroes/:id':             'hero-page',
    '/heroes/:id/name':        'hero-name-page',
    '/heroes/:id/abilities':   'hero-abilities-page',
    '**':                      'not-found-page'
};
~~~~

To avoid this, you can nest routers. Instead of specifying all of your routes in a
single object, you can pass another router to a path and define the routes in the
nested router relative to its parent. For the example above, we can create a heroesRouter
which will handle all sub-routes of the heroes page:

~~~~{.js}
const heroesRouter = new Router({
    '/support':       'support-page',
    '/tanks':         'tanks-page',
    '/id:/name':      'hero-name-page'
    '/id:/abilities': 'hero-abilities-page'
});
~~~~

And we pass the heroesRouter to the main router:

~~~~{.js}
const config = {
    '/':            'home-page',
    '/start-game':  'start-game-page',
    '/heroes':      'heroes-page',
    '/heroes/:id':   heroesRouter,
    '**':           'not-found-page'
};
~~~~

**Note, that only the top router requires the history instance, you don't have to pass it to the nested router, they will receive it from the parent**


## Intercepting Navigation

If you would like to prevent the navigation at some point, you can pass a onBeforeNavigation function
that will be executed as the name suggests - before navigation. The onBeforeNavigation receives a callback
as a first parameter. This is the navigation callback that was intercepted. To continue the navigation you
must call the callback. The second parameter are the callback params:

~~~~{.js}
function preventNavigation (callback, params) => {
 // do nothing - will not navigate
 // callback.apply(null, params); - will navigate
}
~~~~

And pass this callback to the router:
~~~~{.js}
const router = new Router({}, myHistory, preventNavigation);
~~~~

**Just like the history, only the main router can receive a preventNavigation callback.**


## Manually updating the History

You can manually set new entries to the history stack. For example to setup the
initial page:

~~~~{.js}
const state = { current: '/', id: myHistory.currentRouteId };
const title = 'home';
myHistory.pushState(state, title, '/');
~~~~

`BrowserHistory.pushState` and `HashHistory.pushState` accepts the same parameter the standard [history.pushState](https://developer.mozilla.org/en-US/docs/Web/API/History/pushState) accepts.

**Directly updating the global history object will not trigger the router, if you want to navigate manually, use the BrowserHistory instance.**

You can also use the history methods for manually updating the history like `history.go`, `history.back`, `history.forward` - **This will work just in Chrome and not in GameFace!**

This is all the information you need to setup the router. For more detailed examples check
the demo located the /demo folder.

## Add the Styles

~~~~{.css}
<link rel="stylesheet" href="coherent-gameface-components-theme.css">
<link rel="stylesheet" href="style.css">
~~~~

To overwrite the default styles, simply create new rules for the class names that
you wish to change and include them after the default styles.