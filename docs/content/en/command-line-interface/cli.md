---
date: 2022-3-25
title: Command Line Interface
draft: false
---

<!--Copyright (c) Coherent Labs AD. All rights reserved. Licensed under the MIT License. See License.txt in the project root for license information. -->

The coherent-guic-cli is a tool that helps you create and develop components from the GameUIComponents suite. It can also setup a development environment with live reload that will allow you to easily create a UI using the components.

# Getting Started

To install the cli open a console and type:

```
npm i -g coherent-guic-cli
```

This will install the cli as a global module and will make it available from everywhere.

## Available Commands

|Command   |Description   |Arguments   |Usage   |
|---|---|---|---|
|create-project               |Create a new project from template                 | `<template>` `<directory>`|`coherent-guic-cli create-project webpack ./my-folder`|
|create | [name], [directory] |           Create a new component | `coherent-guic-cli create my-component ./my-folder`|
|build |[--watch]        | start the server|`coherent-guic-cli build`|
|start:demo| N/A|              Start a development server and host the demo|`coherent-guic-cli start:demo`|
|build:demo| [--dev] |      Create a production bundle of the demo. |`coherent-guic-cli build:demo`|
|--help| N\A |      show help. |`coherent-guic-cli --help`|

## Usage

### Setting up an Environment

If you want to create a UI using the components - use the `create-project` command. It allows you to setup a project that uses [Webpack](https://webpack.js.org/) or [Vite](https://vitejs.dev/). Open a console and type:

```
coherent-guic-cli create-project webpack ./my-folder
```

or

```
coherent-guic-cli create-project vite ./my-folder
```

This will automatically install all dependencies. After the project is ready - navigate to `my-folder` and type

```
npm run dev
```

this will start a development server with live reload enabled for both project types - webpack and vite.

`<template>` can be `webpack` or `vite`.

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

You can use the CLI to create and develop custom components like the [Checkbox](https://coherentlabs.github.io/GameUIComponents/en/examples/checkbox/). It will setup the required environment for the development of a custom component. Use the create command to create a component:

```
coherent-guic-cli create my-first-guic components
```

The create command accepts two positional arguments - the name of the component and its containing folder. The name of the component will be used for the registration of the custom HTML element and for the name of the component class. The create command will generate the following files:

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

The registered custom element can be used like this:

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

Note that the `gameface` prefix is added to the component name and to the containing folder.

To build the component run:

1. `npm i` in the component's folder to install the dependencies.
2. `coherent-guic-cli build` to bundle the source of the component
3. `coherent-guic-cli build:demo` and load the demo.html folder or
4. `coherent-guic-cli start:demo` to start a development server that will host the demo page and watch for changes
