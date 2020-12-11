coherent-guic-cli is a tool that helps you create and develop components
part of the GameUIComponents suite.

# Getting Started

To install the cli open a console and type:
`npm i -g coherent-guic-cli`

This will install the cli as a global module and will make it available from 
everywhere.

## Usage
After the installation is complete open a console and type:

`coherent-guic-cli create my-first-guic components`

The create command accepts two positional arguments - the name of the component
and its containing folder. The name of the component will be used for the registration
of the custom HTML element and for the name of the component class. So the above
command will generate the following files:

```
\components:
|
\---gameface-my-first-guic
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

```
<gameface-my-first-guic class="my-first-guic-component">
    <component-slot data-name="name">my-first-guic</component-slot>
</gameface-my-first-guic>
```

And the custom element's class look line this:

```
class GamefaceMyFirstGuic extends HTMLElement {
    constructor() {
        super();
        this.template = template;
        this.url = '/components/gameface-my-first-guic/template.html';
    }
    ...
}
```

Note that the 'gameface' prefix is added to the component name and to the containing folder.

To build the component run:

1. `npm i` in the component's folder to install the dependencies.
2. `coherent-guic-cli build` to bundle the source of the component
3. `coherent-guic-cli build:demo` and load the demo.html folder or
4. `coherent-guic-cli start:demo` to start a development server that will host the
demo page and will watch for changes

## Commands:

* coherent-guic-cli create <name> <destination> - Creates a new component with
given name at a given destination folder.
* coherent-guic-cli build - Creates cjs and umd bundles of the component. The
bundles are created in a cjs/ and umd/ folders next to the component source.
* coherent-guic-cli build --watch - Pass --watch to watch for changes to the source
and rebuild.
* coherent-guic-cli build:demo - Create a production build of the demo that bundles
the game ui components library, the component and the demo.
* coherent-guic-cli start:demo - Start a development server which hosts the demo
and listens for changes and automatically rebuilds the demo.