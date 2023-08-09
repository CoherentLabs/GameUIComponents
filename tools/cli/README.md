<!--Copyright (c) Coherent Labs AD. All rights reserved. -->
coherent-guic-cli is a tool that helps you create and develop components of the GameUIComponents suite.

# Getting Started

To install the cli open a console and type:
`npm i -g coherent-guic-cli`

This will install the cli as a global module and will make it available from everywhere.

## Usage

### Setting up an Environment

You can use the `coherent-guic-cli` to create a project that uses GameUIComponents. It will setup the required tools to build and debug the code. Run
```
coherent-guic-cli create-project <template> <directory>
```

`<template>` can be either 'webpack' or 'vite'.

Example:
```
coherent-guic-cli create-project vite ./my-folder
```

This will create a new project inside `./my-folder` and will install the dependencies. After that you can navigate to the folder and start a development server:
```
cd ./my-folder
npm run dev
```

### Creating a Component
After the installation is complete open a console and run:

`coherent-guic-cli create my-first-guic components`

The create command accepts two positional arguments - the name of the component and its containing folder. The name of the component will be used for the registration of the custom HTML element and for the name of the component class. So the above command will generate the following files:

```
\components:
|
\---gameface-my-first-guic
    |   coherent-gameface-components-theme.css
    |   index.js
    |   package.json
    |   README.md
    |   script.js
    |   style.css
    |   template.html
    |
    \--demo
            demo.html
            demo.js
```

The registered custom element will look like this:

```html
<gameface-my-first-guic class="my-first-guic-component">
    <component-slot data-name="name">my-first-guic</component-slot>
</gameface-my-first-guic>
```

And the custom element's definition looks like this:

```js
class GamefaceMyFirstGuic extends BaseComponent {
   constructor() {
        super();
        this.template = template;
        this.init = this.init.bind(this);
    }

    init(data) {
        this.setupTemplate(data, () => {
            components.renderOnce(this);
            // attach event handlers here
        });
    }

    connectedCallback() {
        components.loadResource(this)
            .then(this.init)
            .catch(err => console.error(err));
    }
}
```

Note that the 'gameface' prefix is added to the component name and to the containing folder.

To build the component run:

1. `npm i` in the component's folder to install the dependencies.
2. `coherent-guic-cli build` to bundle the source of the component
3. `coherent-guic-cli build:demo` and load the demo.html folder or
4. `coherent-guic-cli start:demo` to start a development server that will host the demo page and watch for changes

## Commands:

* coherent-guic-cli create <name> <destination> - Creates a new component with
given name at a given destination folder.
* coherent-guic-cli build - Creates cjs and umd bundles of the component. The
bundles are created in a cjs/ and umd/ folders next to the component source.
* coherent-guic-cli build --watch - Pass --watch to watch for changes to the source
and rebuild.
* coherent-guic-cli build:demo - Create a production build of the demo that bundles
* coherent-guic-cli build:demo --dev - Pass the --dev option to create a development non-minified build
* coherent-guic-cli start:demo - Start a development server which hosts the demo