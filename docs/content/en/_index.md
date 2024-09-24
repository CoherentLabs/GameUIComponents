---
date: 2024-9-24
title: Components for Game User Interface
draft: false
---

<!--Copyright (c) Coherent Labs AD. All rights reserved. -->

This is a suite of custom elements designed specifically for [Gameface](https://coherent-labs.com/products/coherent-gameface/). All components can also be used in Google Chrome. All components are npm packages available in the npm registry. Use `npm i coherent-gameface-<component-name>` to install any of them. You can also build them from source.

# Preview components demos

Navigate to the root directory and run:

    npm install

This will install a webpack server as well as all other dependencies. After that run:

    npm run build

This will build all components. After that run:

    npm run build:demo

This will build all the demos for all the components. Then you can navigate to the demo folder of any component and run the html file either in Gameface or Chrome.

# Samples

The samples are more complex examples of how to create a complete user interface using the components. They are located in samples/user_interface. There are three pages - main, settings and shop. To run any of them navigate to their folder an run `npm i` to install the dependencies. After that load the *.html file in Chrome. Keep in mind that each page has a link to one of the others and if you haven't installed the dependencies there, it will not work as expected. To avoid this make sure you execute `npm i` in all folders.

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
2. build all components and their demos
NPM will use the links to install the dependencies, not the public npm packages. This means that if a component depends on another, the dependency will be installed from the source, making it easy to test local changes. For example - the dropdown component depends on the scrollable container. If you make changes to the scrollable-container and run `npm run build:dev` you'll be able to observe the changes that you did to the scrollable-container in the demo of dropdown, because it uses the local package created by the build:dev command. If you inspect the scrollable-container package located in the dropdown's node_modules you'll see that it is a symbolic link that references the source of the scrollable container located in the components folder.

The `npm run build:dev` command will build all components. If you are not changing all of them you don't need to rebuild them every time. You can build individual components using the coherent game UI components CLI. This is a command line tool that enables you to create, build and watch for changes, making the development iterations faster and easier. You can read more about it in the [documentation](https://github.com/CoherentLabs/GameUIComponents/tree/master/tools/cli#getting-started).

After you install it, navigate to a component, for example components/dropdown and run: `coherent-guic-cli build`
**Make sure you've installed the dependencies before that using either npm run build:dev, npm i or npm run link**
**Refer to the [commands](#available-commands) table for more info on each command.**

# Creating new components

All components are npm modules. Your component doesn't have to be an npm module. If you need to use it in your project only, you can skip the steps which make a component an npm module. However if at some point you decide that you want to make your component an npm module - follow the steps below to see how to do it.

## Structure of a Component

All Gameface JavaScript components are custom HTML elements. Each component has:
* a JavaScript source file - the custom element's definition; where all the logic is implemented
* a JavaScript index file - the entry file
* a template.html file - the component's template;
* a CSS file - the component's styles
* a package.json file
* a README markdown file - short documentation explaining what the component does and how it's used
* an index.html file - the demo file
* a demo.html file - the demo's source file
* a demo folder - folder containing an example of the component

## Using without bundling

If you don't want to add your component to the GameUIComponent suite you can use it without building and packaging it as npm module. However, you'll still have to use the components library as dependency. Initialize an npm project using

    npm init

and install the components library:

    npm i coherent-gameface-components

After that create an index.html and index.js files. Import the components library and the component's definition file using script tag:

```html
<script src="node_modules/coherent-gameface-components/umd/components.development.js"></script>
<script src="script.js"></script>
```

Add the custom component to the page:

```html
<gameface-checkbox></<gameface-checkbox>
```

The JavaScript definition is a simple class which extends the HTMLElement. The template can be loaded asynchronously using XHR. Set the URL member of the component in the constructor to load the template via XHR.


Using XHR
```javascript
class Checkbox extends BaseComponent {
    constructor() {
        super();

        // the URL specifies the path to the template file
        this.url = '/components/checkbox/template.html';
    }
}
```

Use the `loadResource` method from the components library to load the template:

```javascript
class Checkbox extends BaseComponent {
    connectedCallback() {
        components.loadResource(this)
            .then(this.init)
            .catch(err => console.error(err));
    }
}
```

The `setupTemplate` method internally checks if the custom element is still connected to the DOM and ready to be used. Its first argument is `data` - the result returned from the `loadResource` method. Its second parameter is a callback that will be executed if the checks in the setup template were successful. If they were not - you'll see a message in the debugger console - 'DEBUG: component Checkbox was not initialized because it was disconnected from the DOM!'. Make sure to call the `renderOnce(this);` method of the components library in the `setupTemplate` callback. This will attach the template to the custom component replacing all slots with their slottable items (if there are any). Here is also where you should define custom members or event listeners.

```javascript
class Checkbox extends BaseComponent {
    init(data) {
        this.setupTemplate(data, () => {
            components.renderOnce(this);

            // init members and event listeners here
            this.addEventListener('click', this.toggleChecked);
            this.checked = this.hasAttribute('checked');
            this.disabled = this.disabled ? true : false;
        });
    }

    connectedCallback() {
        components.loadResource(this)
            .then(this.init)
            .catch(err => console.error(err));
    }
}
```

Here's the full example of a custom Checkbox component:

```javascript
class Checkbox extends BaseComponent {
    constructor() {
        super();
        this.url = '/components/checkbox/template.html';
    }

    init(data) {
        this.setupTemplate(data, () => {
            components.renderOnce(this);

            // init members and event listeners here
            this.addEventListener('click', this.toggleChecked);
            this.checked = this.hasAttribute('checked');
            this.disabled = (this.disabled) ? true : false;
        });
    }

    connectedCallback() {
        components.loadResource(this)
            .then(this.init)
            .catch(err => console.error(err));
    }

    components.defineCustomElement('gameface-checkbox', Checkbox);
}
```

Use the `<link>` tags to import style files.

```html
<link rel="stylesheet" href="../coherent-gameface-components-theme.css">
<link rel="stylesheet" href="../style.css">
```

To test the component start an http server at the root and open index.html. If you use [http-server](https://www.npmjs.com/package/http-server) go to /checkbox and run:

    http-server

Navigate to `localhost:<port>` and check your component.

# Adding component to the components suite

If you want to contribute to the components library and add a new component you need to add the required files in the correct folders. Make sure they can be successfully bundled and are documented.

* All components are placed in the /components folder.
* The folders are named using lower case and camel-case for longer names.
* All names should be prefixed with `gameface-` - `gameface-some-component` instead of `some-component`

`components.defineCustomElement('gameface-some-component', SomeComponent);`

**Note that only the name of the custom element and the name of the npm package in package.json must be prefixed.**

You can use the [coherent-guic-cli](https://github.com/CoherentLabs/GameUIComponents/tree/master/tools/cli#getting-started) to build a single component. Follow the steps bellow to see how to manually build all components if you don't want to use the CLI.

The `build` command generates UMD and CJS bundles of the component. The module bundler that is used is [Rollup](https://rollupjs.org/guide/en/). That means we can use `import` and `export` statements and rollup will automatically resolve all modules. Now we can import all dependencies at the top of the script.js file:

```javascript
import components from 'coherent-gameface-components';
import template from './template.html';
```

And we can export the checkbox at the bottom:

```javascript
export { Checkbox };
```

This example uses module loader to import the template - set the template as a property of the component:

```javascript
this.template = template;
```

The loadResource method can work both with URL and an imported template. You can conveniently switch between XHR and the imported template as the syntax is the same. This is how the component's definition looks like:

```javascript
import components from 'coherent-gameface-components';
import template from './template.html';

class Checkbox extends BaseComponent {
    constructor() {
        super();
        this.template = template;
    }

    init(data) {
        this.setupTemplate(data, () => {
            components.renderOnce(this);

            // init members and event listeners here
            this.addEventListener('click', this.toggleChecked);
            this.checked = this.hasAttribute('checked');
            this.disabled = this.disabled ? true : false;
        });
    }

    connectedCallback() {
        components.loadResource(this)
            .then(this.init)
            .catch(err => console.error(err));
    }

    components.defineCustomElement('gameface-checkbox', Checkbox);

    export { Checkbox };
}

Check the [full implementation](https://github.com/CoherentLabs/GameUIComponents/blob/master/components/checkbox/script.js) and the [demo](https://github.com/CoherentLabs/GameUIComponents/tree/master/components/checkbox/demo) on [the GitHub repository](https://github.com/CoherentLabs/GameUIComponents/tree/master/components/checkbox)

Because all components are npm packages you need to add an entry index.js file. This is the file that would be loaded when you import your component from node_modules like this:

```javascript
import { Checkbox } from 'gameface-checkbox';
```

It should export either the development or the production CJS bundle:

```javascript
if (process.env.NODE_ENV === 'production') {
    module.exports = require('./dist/checkbox.production.min.js');
} else {
    module.exports = require('./dist/checkbox.development.js');
}
```

Each component has a demo page. It is located in the component's folder.The demo.js file imports all dependencies and Webpack bundles them into one `bundle.js` file.

```javascript
// import the source of the current component
import './script.js'; 
// import any other dependencies
import 'coherent-gameface-switch'; 
import 'coherent-gameface-form-control';
```

The demo.html file should import the bundle.js and use the custom element:

```html
<body>
    <gameface-checkbox></gameface-checkbox>
    <script src="./bundle.js"></script>
</body>
```

Note that the demo files should have the names demo.js and index.html for the JavaScript and html files respectively.
Make sure all files have the LICENSE notice at the top. Run `npm run add:copyright` to automatically add copyright notice to all files.

To build the component run:

```
    npm run rebuild
```

The newly created bundles are located in checkbox/dist folder. To test if everything works open the demo.html file located in the `demo/` folder.
Add a README.md file to the component folder and add a documentation page to the docs/ folder.

# Adding styles

The styles of a component are located in the same location as its source in a `style.css` file. You can use different file name and folder structure if it makes sense. For example [the styles of the slider component](https://github.com/CoherentLabs/GameUIComponents/tree/master/components/slider/styles) are located in a separate folder and they have names corresponding to the type of slider they style.
**Make sure to prefix all selectors with `guic-` to avoid overwriting global selectors with common names**. The prefix is an abbreviation of Game UI Components.
Import the styles using a `link` tag in the file where you use the custom component:

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

* We added a pre-commit hook that is set up by the `husky` and `load-staged` modules. When committing changes the hook will run the linter on the staged files to make sure everything is fine. If the lint check fails the commit will be discarded so the errors be fixed first. When the errors are fixed you can try again to make a commit.
* To fix all the errors from the lint check you can run `npm run lint:fix`. Make sure that they are correctly fixed!
* If you want to check anytime if you have some linter errors you can run `npm run lint:errors`. If you want to check for warnings as well you can run `npm run lint:all`. We advise you to use `lint:all` command!
* You can install a [VSCode extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) that will run the linter in the background while you are coding. This will save you time fixing the errors at the end.
* We added a GitHub action that will be triggered when you make a pull request. It will run the linter each time you make a change to the pull request to make sure everything is fine with the code.

# Configuring the Python environment

Currently, we still rely on [**Python2.7**](https://www.python.org/downloads/release/python-272/) for the execution of our scripts.
This means that if you get weird errors, you probably have to double-check if you have Python2.7 installed on your system.

In case you have previously installed Python3 only, to ensure that when `python` is called in a console environment, you must make sure that your Python2 installation location is included in your `Path` environment variable before the Python3 installation.

Also, a common way to be able to call both Python2 and Python3 executions of scripts is to navigate to your Python3 install location (after configuring the `Path` environment variable as described above) and symlink your `python.exe` in the same directory and name it `python3.exe`.
This way you will be able to easily call a script like so - `python3 somescript.py` - and let it be executed by Python3

You can also opt for a [virtualenv setup](https://help.dreamhost.com/hc/en-us/articles/215489338-Installing-and-using-virtualenv-with-Python-2).

# Update versions in the package.json files of components

When you update a component or the component library source then you need to bump the version in the package.json so they can be published automatically. However, some components depend on others so you need to bump the component dependencies versions as well.

Because we are using the `^` notation, updating the dependencies versions should be done when you do a major version update of the main package because it won't be backward compatible anymore. Check the next sections for examples.

## When you don't need to update the dependencies versions

### Patch update

```diff
{
    "name": "coherent-gameface-components",
-    "version": "1.4.0"
+    "version": "1.4.1"
}
```

```diff
{
    "name": "coherent-gameface-slider",
    "version": "1.3.0"
    ...
    "dependencies": {
        "coherent-gameface-components": "^1.4.0"
    }
}
```

In this case, you don't need to update the coherent-gameface-components dependency in the gameface-slider package.json file because `npm i` will install the latest minor or patch version of the components library.

### Minor update 

```diff
{
    "name": "coherent-gameface-components",
-    "version": "1.4.0"
+    "version": "1.5.0"
}
```

```diff
{
    "name": "coherent-gameface-slider",
    "version": "1.3.0"
    ...
    "dependencies": {
        "coherent-gameface-components": "^1.4.0"
    }
}
```

In this case, you don't need to update the coherent-gameface-components dependency in the gameface-slider package.json file because `npm i` will install the latest minor or patch version of the components library.

### Major update

```diff
{
    "name": "coherent-gameface-components",
-    "version": "1.4.0"
+    "version": "2.0.0"
}
```

```diff
{
    "name": "coherent-gameface-slider",
-    "version": "1.3.0"
+    "version": "2.0.0"
    ...
    "dependencies": {
-        "coherent-gameface-components": "^1.4.0"
+        "coherent-gameface-components": "^2.0.0"
    }
}
```

In this case, you need to update the coherent-gameface-components dependency in the slider package.json file because it is a major update and it is not backwards compatible.

**Also see that here the version of the slider is updated as well!**

## Auto update versions

Instead of manually updating all the versions of the dependencies when you have a major update you can directly use the `update-versions.js` script for that purpose.

To use it first change the major version of all the modules that are updated (`coherent-gameface-component` for example as above) and then run `npm run update-versions` in the repo root.

The script is going to check all the new updated versions and then iterate through all the components and reflect the update in the version of the dependencies as it is done manually [here](#major-update).

## Generating releases when a new package version is published

We are using an automated workflow that when a PR is merged to master and there are packages with updated versions they will be tagged to git, released on the github page with releases with relevant changelog, and published to npm.

There are specifics about how the release notes(or changelog) are generated. In order for them to be properly generated and their content to be relevant to the merged changes, you need to follow the next steps:

1. **Always tag your PRs with the listed tags.** If the PR does not have any tags, **no release notes will be generated** so don't miss this step if you want your changes to be described when they are released.
   1. ignore-for-release - This tag is used when you want your changes from the PR to **not** be generated to the release notes. Use it when your changes are not affecting any component (for example if you have changed the readme of the repo or the script of a repo tool, or any .yml file, etc.).
   2. major - This tag is used when you want your changes from the PR to be generated under the '**Breaking changes**' section of the release
   3. minor - This tag is used when you want your changes from the PR to be generated under the '**Features**' section of the release
   4. patch - This tag is used when you want your changes from the PR to be generated under the '**Bugfixes**' section of the release
   5. dependencies - This tag is used when you want your changes from the PR to be generated under the '**Dependency updates**' section of the release. This tag is mostly used by the dependabot.
   6. Any other tag will be skipped and will not take effect when generating release notes
2. Make sure your PR title is descriptive enough. It will be used when the release notes are generated and will be added as a change entry to the notes. Also, when you are making a review to another person, review the PR title as well as it is going to be added to the release notes.
3. Update the version in the package.json so the PR title is added as a release note to the released version. **If there are no updated package.json files mering the PR will not trigger the tagging, generating release notes, making a release to git and publishing the packages to npm.** If you are sure that the PR changes should not be added to any release **always** add the `ignore-for-release` tag to the PR.

When the action ends it may produce new release/s to repo. You can navigate to them from [this](https://github.com/CoherentLabs/GameUIComponents/releases) page and edit their content/notes/changelog.
For example, this should be done when breaking change release is done and there are a lot of details for the users that should be visible in the release notes.
