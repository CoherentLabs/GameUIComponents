---
date: 2022-3-31
title: Components for Game User Interface
draft: false
---

<!--Copyright (c) Coherent Labs AD. All rights reserved. -->

This is a suite of custom elements designed specifically for [Gameface](https://coherent-labs.com/products/coherent-gameface/). All components can also be used in Google Chrome. You can preview them by starting the demo. You can serve the root directory and open the demo.html file using an http-server of your choice. Or use the default setup in the package. All components are npm packages available in the npm registry. Use `npm i coherent-gameface-<component-name>` to install any of them. You can also build them from source.

# Running the demo

To run the demo you need to navigate to the root directory and run:

```
npm install
```

This will install a webpack server as well as all other dependencies. After that run:

```
npm run build
```

This will build all components. After that run:

```
npm run start:demo
```

This will serve the files on http://localhost:8080. Load that url in the Gameface player or in Chrome and preview the components. You can change the port in the webpack.config.js file.

# Samples

The samples are more complex examples of how to create a complete user interface using the components. They are located in samples/user_interface. There are three pages - main, settings and shop. To run any of them navigate to their folder an run `npm i` to install the dependencies. After that load the \*.html file in Chrome. Keep in mind that each page has a link to one of the others and if you haven't installed the dependencies there, it will not work as expected. To avoid this make sure you execute `npm i` in all folders.

# Available Commands

These are the commands used to build and package the components.

|Command   |Description   |Arguments   |Usage   |
|---|---|---|---|
|rebuild               |Do a clean install of all dependencies and build everything.                 |N/A|`npm run rebuild`|
|build                 |Build all components - create their demo, umd and cjs bundles.               |[--no-install -ni][--no-install], [--library][--library] |`npm run build -- --no-install --library`|
|build:demo            |Build only the demos of all components.                                      |N/A|`npm run build:demo`|
|build:library         |Build only the components library.                                           |N/A|`npm run build:library`|
|build:dev             |Build the components using only the local packages. Will install dependencies only from source, not the npm registry. |N/A|`npm run build:dev`|
|build:documentation   |Build the components, the demos and the documentation.                       |[--rebuild][--rebuild], [--component][--component]|`npm run build:documentation -- --component checkbox`, `npm run build:documentation -- --rebuild`|
|check:copyright       |Will check the files inside the *components* folder for copyright notice.    |N/A|`npm run check:copyright`|
|add:copyright       |Will add copyright notice to files inside the *components* folder that are missing it. |N/A|`npm run add:copyright`|
|start:demo            |Serve the demo project.                                                      |N/A|`npm run start:demo`|
|test                  |Start Karma server on localhost:`<port>`/debug.html                             |N/A|`npm run test`|
|test:Chrome           |Start Karma server and run the tests in Google Chrome.                       |N/A|`npm run test:Chrome`|
|pack                  |Bundle the components to npm packages ready for publish.                     |N/A|`npm run pack`|
|pack:library          |Create npm package of the component library.                                 |N/A|`npm run pack:library`|
|link                  |Create links for all components to test with local packages only[^1].        |N/A|`npm run link`|
|unlink                |Remove all global links that exist for components. To remove the local packages use `npm run clean`.|N/A|`npm run link`|
|clean                 |Remove all existing bundles, packages and installed dependencies.            |N/A|`npm run clean`|

[^1]: The components will not use the local packages created from source, not the ones from the npm registry. Useful when you are doing changes the core library or to any of the existing components and you want to test your changes. Remember to build with the **--no-install** option when using links as otherwise the build will perform `npm install` which will overwrite the links.

[--no-install]: ## "skip the npm install step"
[--library]: ## "builds only the components library"
[--rootDir]: ## "the folder in which to perform recursive npm install"
[--component]: ## "the name of the folder of the component that you want to build the documentation for"
[--rebuild]: ## "rebuild all the components"

After you successfully execute `npm run tests` open the Gameface player or Chrome with "--url=http://localhost:9876/debug.html" to see the tests running.

# Building from source

To build the components from this repository use the `npm run build:dev` command. This will:

1. create symlinks for all components
2. build all components and their demos - NPM will use the links to install the dependencies, not the public npm packages. This means that if a component depends on another, the dependency will be installed from the source, making it easy to test local changes. For example - the dropdown component depends on the scrollable container. If you make changes to the scrollable-container and run `npm run build:dev` you'll be able to observe the changes that you did to the scrollable-container in the demo of dropdown, because it uses the local package created by the build:dev command. If you inspect the scrollable-container package located in the dropdown's node_modules you'll see that it is a symbolic link that references the source of the scrollable container located in the components folder.

The `npm run build:dev` command will build all components. If you are not changing all of them you don't need to rebuild them every time. You can build individual components using the coherent game UI components CLI. This is a command line tool that enables you to create, build and watch for changes, making the development iterations faster and easier. You can read more about it in the [documentation](https://github.com/CoherentLabs/GameUIComponents/tree/master/tools/cli#getting-started).

After you install it, navigate to a component, for example components/dropdown and run: `coherent-guic-cli build` **Make sure you've installed the dependencies before that using either npm run build:dev, npm i or npm run link** **Refer to the [commands](#available-commands) table for more info on each command.**

# Creating new components

All components are npm modules. Your component doesn't have to be an npm module. If you need to use it in your project only, you can skip the steps which make a component an npm module. However if at some point you decide that you want to make your component an npm module - follow the steps below to see how to do it.

## Structure of a Component

All Gameface JavaScript components are custom HTML elements. Each component has:

- a JavaScript source file - the custom element's definition; where all the logic is implemented
- a JavaScript index file - the entry file
- an HTML file - the component's template;
- a CSS file - the component's styles
- a package.json file
- a README markdown file - short documentation explaining what the component does and how it's used
- a demo folder - folder containing an example of the component

## Using without bundling

If you don't want to add your component to the GameUIComponent suite you can use it without building and packaging it as npm module. However, you'll still have to use the components library as dependency. Initialize an npm project using

```
npm init
```

and install the components library:

```
npm i coherent-gameface-components
```

After that create an index.html and index.js files. Import the components library and the component's definition file using script tag:

```html
<script src="node_modules/coherent-gameface-components/umd/components.development.js"></script>
<script src="script.js"></script>
```

Add the custom component to the page:

```html
<gameface-checkbox></<gameface-checkbox>
```

The JavaScript definition is a simple class that extends the HTMLElement. The template can be loaded asynchronously using XHR. Set the URL member of the component in the constructor to load the template via XHR.

```{.javascript}
class Checkbox extends HTMLElement {
    constructor() {
        super();

        this.url = '/components/checkbox/template.html';
    }

    connectedCallback() {
        components.loadResource(this)
            .then((result) => {
                this.template = result.template;
                components.renderOnce(this);
            })
            .catch(err => console.error(err));
    }
}

components.defineCustomElement('gameface-checkbox', Checkbox);
```

To test the component start an http server at the root and open index.html. If you use http-server go to /checkbox and run:

```
http-server
```

Navigate to `localhost:<port>` and check your component.

# Adding component to the components suite

If you want to contribute to the components library and add a new component, you need to add the required files in the correct folders. Make sure they can be successfully bundled and are documented.

- All components are placed in the /components folder.
- The folders are named using lower case and camel-case for longer names.
- All names should be prefixed with `gameface-`. So now instead of some-component
- the custom element should be named `gameface-some-component`:

`components.defineCustomElement('gameface-some-component', SomeComponent);`

**Note that only the name of the custom element and the name of the npm package in package.json must be prefixed.**

You can use the [coherent-guic-cli](https://github.com/CoherentLabs/GameUIComponents/tree/master/tools/cli#getting-started) to build single component. Follow the steps bellow to see how to manually build all components if you don't want yo use the CLI.

The `build` command generates UMD and CJS bundles of the component. The module bundler that is used is [Rollup](https://rollupjs.org/guide/en/). That means we can use `import` and `export` statements and rollup will automatically resolve all modules. Now we can import all dependencies at the top of the script.js file:

```{.javascript}
import components from 'coherent-gameface-components';
import template from './template.html';
```

And we can export the checkbox at the bottom:

```{.javascript}
export { Checkbox };
```

This example uses a module loader to import the template - set the template as a property of the component:

```{.javascript}
this.template = template;
```

The `loadResource` method can work both with URL and an imported template. You can conveniently switch between XHR and imported template as the syntax is the same. This is how the component's definition looks like:

```{.javascript}
import components from 'coherent-gameface-components';
import template from './template.html';

class Checkbox extends HTMLElement {
    constructor() {
        super();

        this.template = template;
    }

    connectedCallback() {
        components.loadResource(this)
            .then((result) => {
                this.template = result.template;
                components.renderOnce(this);
            })
            .catch(err => console.error(err));
    }
}

components.defineCustomElement('gameface-checkbox', Checkbox);
export { Checkbox };
```

Because all components are npm packages you need to add an entry index.js file. This is the file that would be loaded when you import your component from node_modules like this:

```{.javascript}
import { Checkbox } from 'gameface-checkbox';
```

It should export either the development or the production CJS bundle:

```{.javascript}
if (process.env.NODE_ENV === 'production') {
    module.exports = require('./cjs/checkbox.production.min.js');
} else {
    module.exports = require('./cjs/checkbox.development.js');
}
```

Each component has a demo page. It is placed in a /demo folder. The JavaScript file of the demo should be bundled so that it can be easily checked with double click or drag and drop without the need to manually setup an environment. The demo.js file imports all dependencies so that Rollup can resolve and bundle them.

```{.javascript}
import components from 'coherent-gameface-components';
import checkbox from '../umd/checkbox.development.js'
```

The demo.html file should import the bundle.js and use the custom element:

```html
<body>
    <gameface-checkbox></gameface-checkbox>
    <script src="./bundle.js"></script>
</body>
```

Note that the demo files should have the names demo.js and demo.html for the JavaScript and html files respectively. Make sure all files have the LICENSE notice at the top. Run `npm run add:copyright` to automatically add copyright notice to all files.

To build the component run:

```
npm run rebuild
```

The newly created bundles are located in checkbox/umd and checkbox/cjs folders. To test if everything works open the demo.html file.

If everything works, add a README.md file to the component folder and add a documentation page to the docs/ folder.

# Adding styles

The styles of a component are located in the same location as its source in a `style.css` file. You can use different file name and folder structure if it makes sense. For example [the styles of the slider component](https://github.com/CoherentLabs/GameUIComponents/tree/master/components/slider/styles) are located in a separate folder and they have names corresponding to the type of slider they style. **Make sure to prefix all selectors with `guic-` to avoid overwriting global selectors with common names**. The prefix is an abbreviation of Game UI Components. Import the styles using a `link` tag in the file where you use the custom component:

```html
<link rel="stylesheet" href="style.css">
```

# Adding flexibility through slots

The [<slot>](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/slot) HTML element is a placeholder inside a web component that you can fill with your own markup, which lets you create separate DOM trees and present them together. This component system provides a custom element called <component-slot> which replaces the standard <slot> element, but keeps the main idea. Slots are usable in cases where a dynamic content must be placed in a specific place in the HTML. In the example of the <checkbox> if template is:

```html
<div>
    <div class="check-mark"></div>
    <component-slot data-name="label">Click me!</component-slot>
</div>
```

the label is the dynamic part. If the label is not specified - the default one will be used, this allows the component to be used like this:

```html
<gameface-checkbox></gameface-checkbox>
```

and the `renderOnce` method will replace this with:

```html
<gameface-checkbox>
    <div>
        <div class="check-mark"></div>
        <component-slot data-name="label">Click me!</component-slot>
    </div>
</gameface-checkbox>
```

If the label is specified the data-name="label" will be replaced with the element passed to that slot:

```html
<gameface-checkbox>
    <component-slot data-name="label">
        <div class="some-custom-fancy-label-wrapper">
            <div class="more-wrappers">My custom label</div>
        </div>
    </component-slot>
</gameface-checkbox>
```

will be replaced with:

```html
<gameface-checkbox>
    <div>
        <div class="check-mark"></div>
        <component-slot data-name="label">
            <div class="some-custom-fancy-label-wrapper">
                <div class="more-wrappers">My custom label</div>
            </div>
        </component-slot>
    </div>
</gameface-checkbox>
```

**See the full checkbox component [here](https://github.com/CoherentLabs/GameUIComponents/tree/master/components/checkbox).**

Slots can be very powerful when a component has more complicated template, especially if there are nested components. For example the dropdown component has a scrollable-container (another component) in its template and all options (list items) of the dropdown, which are passed through slots as they are dynamic go into the scrollable container:

```html
<div class="dropdown">
    <div class="dropdown-header">
        <div class="selected">Select an option</div>
        <div class="custom-select-arrow"></div>
    </div>
    <div class="options-container hidden">
        <gameface-scrollable-container class="scrollable-container-component">
            <div slot="scrollable-content" data-name="scrollable-content">
                <div class="options">
                    <!--all options go here-->
                    <component-slot data-name="option"></component-slot>
                </div>
            </div>
        </gameface-scrollable-container>
    </div>
</div>
```

The usage of the component looks a lot simpler:

```html
<gameface-dropdown class="gameface-dropdown-component">
    <dropdown-option slot="option">Cat1</dropdown-option>
    <dropdown-option slot="option" disabled>Cat1</dropdown-option>
    <dropdown-option slot="option" disabled>Cat1</dropdown-option>
    <dropdown-option slot="option">Cat3</dropdown-option>
</gameface-dropdown>
```

And when the component is rendered and all elements are slotted the final markup will look like this:

```html
<div class="dropdown">
    <div class="dropdown-header">
        <div class="selected">Select an option</div>
        <div class="custom-select-arrow"></div>
    </div>
    <div class="options-container hidden">
        <gameface-scrollable-container class="scrollable-container-component">
            <div slot="scrollable-content" data-name="scrollable-content">
                <div class="options">
                    <dropdown-option slot="option">Cat1</dropdown-option>
                    <dropdown-option slot="option" disabled>Cat1</dropdown-option>
                    <dropdown-option slot="option" disabled>Cat1</dropdown-option>
                    <dropdown-option slot="option">Cat3</dropdown-option>
                </div>
            </div>
        </gameface-scrollable-container>
    </div>
</div>
```

# Testing

All tests are located in tools/tests. For more information on how to create and run a test refer to the [documentation](https://github.com/CoherentLabs/GameUIComponents/blob/master/tools/tests/README.md).

# Publishing components to npm

Before you publish make sure:

1. The component builds - the umd and cjs packages are successfully generated.
2. All tests pass.
3. There is a README.md with useful information about how to use the component.
4. The name of the component is correct (prefixed with coherent-gameface-).
5. The demo is bundled.
6. There is a public documentation committed in the docs folder.
7. Add the rest of the team's npm accounts to collaborators using the [npm owners add](https://docs.npmjs.com/cli/v7/commands/npm-owner) command or through [npmjs.com](npmjs.com).

Manually update the version of the component in package.json and run

[`npm publish`](https://docs.npmjs.com/cli/v7/commands/npm-publish)

# Components style guide

To prevent errors, improve the code quality and readability, to make maintainable and consistent code we decided to add a style guide to the repository. We defined all the rules by setting an [eslinter](https://eslint.org/) that will force all the developers to respect the style guide when developing JavaScript features. To make sure that "clean" code is committed we added additional actions:

- We added a pre-commit hook that is set up by the `husky` and `load-staged` modules. When committing changes the hook will run the linter on the staged files to make sure everything is fine. If the lint check fails the commit will be discarded so the errors be fixed first. When the errors are fixed you can try again to make a commit.
- To fix all the errors from the lint check you can run `npm run lint:fix`. Make sure that they are correctly fixed!
- If you want to check anytime if you have some linter errors you can run `npm run lint:errors`. If you want to check for warnings as well you can run `npm run lint:all`. We advise you to use `lint:all` command!
- You can install a [VSCode extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) that will run the linter in the background while you are coding. This will save you time fixing the errors at the end.
- We added a GitHub action that will be triggered when you make a pull request. It will run the linter each time you make a change to the pull request to make sure everything is fine with the code.
