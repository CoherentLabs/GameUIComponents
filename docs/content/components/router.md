---
title: "Router"
date: 2021-03-08T14:00:45Z
draft: false
---

The gameface-router is part of the components suite. It is not a custom element like most of the components in this suite. It is a JavaScript library 
similar to the components library.


Importing the Router
===================
The router component comes with UMD and CJS builds.

## With UMD modules:

* import the components library:

~~~~{.html}
<script src="./node_modules/coherent-gameface-components/umd/components.production.min.js"></script>
~~~~

* import the gameface-router component:

~~~~{.html}
<script src="./node_modules/gameface-router/umd/router.production.min.js"></script>
~~~~

If you wish to import the modules using JavaScript you can remove the script tags
which import the components and the gameface-router from the node_modules folder and import them like this:

~~~~{.js}
import components from 'coherent-gameface-components';
import { Router } from 'gameface-router';
~~~~

Note that this approach requires a module bundler like [Webpack](https://webpack.js.org/) or [Rollup](https://rollupjs.org/guide/en/) to resolve the
modules from the node_modules folder. Alternatively you can import them directly from node_modules:

~~~~{.js}
import components from './node_modules/coherent-gameface-components/umd/components.production.min.js';
import { Router } from './node_modules/gameface-router/umd/router.production.min.js';
~~~~

## With CJS modules:

* Import the components library:

~~~~{.js}
const components = require('coherent-gameface-components');
const gameface-router = require('gameface-router');
~~~~

The CommonJS(CJS) modules are used in a NodeJS environment, be sure to use a module
bundler in order to be use them in a browser.

Available Modules
===================

Along with the router comes the BrowserHistory package, a custom element called `<gameface-route>` and another custom element called `<router-view>`.

### The Browser History

The BrowserHistory is a thin wrapper around the HTML5 history object. It provides methods that
help the router keep better track of the state of the history.

### The Route Element

The `<gameface-route>` custom element is a special link element that
navigates to a specified page. It updates the BrowserHistory and in result of this
the router updates the page.

The `<gameface-route>` has an attribute called **to**. It specifies the path to the
page it is supposed to navigate to.

~~~~{.js}
<gameface-route to="/start-game">Start Game</gameface-route>
~~~~

### The RouterView Element

The `<router-view>` element is a placeholder for the components that will be rendred
upon navigation. Put the `<router-view>` somewhere in the document:

~~~~{.js}
<gameface-route to="/start-game">Start Game</gameface-route>
<router-view></router-view>
~~~~


Usage
===================

You can import the Router, Route and the BrowserHistory like this:

~~~~{.js}
import { Router, Route, BrowserHistory } from 'gameface-router';
~~~~

Route is a helper class that sets up the `<gameface-route>` element.

The router **can not** work without history, it is mandatory, so the first thing
you need to do is to instantiate the history:

~~~~{.js}
const myBrowserHistory = new BrowserHistory();
~~~~

The `<gameface-route>` also depends on the history. To initialize it do:

~~~~{.js}
Route.use(myBrowserHistory);
~~~~

The router is configured using an object of { 'route': 'component-name' } pairs:

~~~~{.js}
const config = {
    '/': 'home-page',
    '/start-game': 'start-game-page',
    '/heroes': 'heroes-page',
};

const router = new Router(config, browserHistory);
~~~~

And the second parameter is the history. The components in the configuration are
the names of custom element. When the router navigates to '/start-game' it will
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

const router = new Router(config, browserHistory);
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

const router = new Router(config, browserHistory);
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
const router = new Router({}, myBrowserHistory, preventNavigation);
~~~~

**Just like the history, only the main router can receive a preventNavigation callback.**


## Manually Updating the History

You can manually set new entries to the history stack. For example to setup the
initial page:

~~~~{.js}
const state = { current: '/', id: browserHistory.currentRouteId };
const title = 'home';
browserHistory.pushState(state, title, '/');
~~~~

`BrowserHistory.pushState` accepts the same parameter the standard [history.pushState](https://developer.mozilla.org/en-US/docs/Web/API/History/pushState) accepts.


**Directly updating the global history object will not trigger the router, if you want to navigate manually, use the BrowserHistory instance.**

This is all the information you need to setup the router. For more detailed example check
the demo located the /demo folder.