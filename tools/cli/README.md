<!--Copyright (c) Coherent Labs AD. All rights reserved. -->
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
|create-project               |Create a new project from template.                 | `template>` `<directory>`|`coherent-guic-cli create-project webpack ./my-folder`|
|create-component |          Create a new component. | [name], [directory]| `coherent-guic-cli create my-component ./my-folder`|
|build | Build the component. Creates the distributable files located in the **/dist** folder. |  N/A     | `coherent-guic-cli build`|
|watch | Build the component and watch for file changes. Creates the distributable files located in the **/dist** folder and rebuilds them on change. | N/A |`coherent-guic-cli watch`|
|build-demo|     Build the demo. | N/A |`coherent-guic-cli build-demo`|
|start-demo |      Start a development server and host the demo with live reload for quick development iteration cycle. | N/A |`coherent-guic-cli start-demo`|
|--help, -h|      Show help. | N/A | `coherent-guic-cli --help`|

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
coherent-guic-cli create-component my-first-guic components
```

The create command accepts two positional arguments - the name of the component and its containing folder.
The name must:

- start with an ASCII lowercase letter (a-z)
- contain a hyphen
- not contain any ASCII uppercase letters
- not contain certain other characters such as `?  !  <  >  @  #  $  %  ^  &  *  (  )  +  [  ] ~`
- not be any of:
    - annotation-xml
    - color-profile
    - font-face
    - font-face-src
    - font-face-uri
    - font-face-format
    - font-face-name
    - missing-glyph
 
 The name of the component will be used for the registration of the custom HTML element and for the name of the component class. The create command will generate the following files:

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


# Building the Demo

Each component has `index.html` and `demo.js` files that demonstrate how to use it. You can create a production build of the demo using the `build-demo` command. It will generate the `bundle.js` and `index.html` files along with any other assets such as styles located in the **demo** folder. Load the `demo/demo.html` file in a web browser to see the component.

```
coherent-guic-cli build-demo
```

# Serve the Demo

You can start a development server that hosts the demo. This allows you to easily make changes and quickly see them applied on the demo page as the live reload will automatically update the page.

```
coherent-guic-cli start-demo
```