<!--Copyright (c) Coherent Labs AD. All rights reserved. -->
# Components for Game User Interface

This is a suite of custom elements designed specifically for Gameface. All components can also be used in Google Chrome. You can preview them by starting the demo. You can serve the root directory and open the demo.html file using an http-server of your choice. Or use the default setup in the package.

Navigate to the root directory and run:

    npm install

This will install a webpack server. After that run:

    npm run build

This will build all components used in the demo. After that run:

    npm run start:demo

This will serve the files on http://localhost:8080. Load that url in the Gameface player or in Chrome and preview the components.
You can change the port in the webpack.config.js file.

Custom components examples.

Usage
===================

Start an http-server in the root of the repository. Set the startup page in Gameface to
**http://localhost:8080/examples/<example_name>/"** and launch it.

You can use [http-server](https://www.npmjs.com/package/http-server) or any http-server that you like. Make sure you serve all files. The files in **/lib** and **/components** should be accessible.



Creating new Components
===================

All components are npm modules. Your component doesn't have to be an npm module.
If you need to use it in your project only, you can skip the steps which make a
component an npm module. However if at some point you decide that you want to make
your component an npm module - follow the steps below to see how to do it.

These are the commands used to build and package the components.

To build all components run:

`npm run build`

This will create bundles with ready to use CJS and UMD modules.


To build the demo pages only run:

`npm run build:demo`

To clean all build and installation files run:

`npm run clean`

To create the npm packages run:

`npm run pack`

To package the components library only run:

`npm run pack:library`

To build and package everything run:

`npm run rebuild`

To start the tests run:

`npm run test`

If you haven't built the components or if you've made changes:

`npm run test -- --rebuild`

to create new bundles.

After you successfully execute `npm run tests` open the Gameface player or Chrome with "--url=http://localhost:9876/debug.html" to see the tests running.

## Structure of a Component
All components in the GameUIComponents suite are npm modules.

All Gameface JavaScript components are custom HTML elements. Each component has:
* a JavaScript source file - the custom element's definition; where all the logic is implemented
* a JavaScript index file - the entry file
* an HTML file - the component's template;
* a CSS file - the component's styles
* a package.json file
* a README markdown file - short documentation explaining what the component does and how it's used
* a demo folder - folder containing an example of the component

## Using without bundling

If you don't want to add your component to the GameUIComponent suite you can use it
without building and packaging it as npm module. However, you'll still have to use the
components library as dependency. Initialize an npm project using

`npm init`

and install the components library:

`npm i coherent-gameface-components` for npm version >= 5.0.0
and
`npm i --save coherent-gameface-components` for npm version < 5.0.0

After that create an index.html and index.js files.
Import the components library and the component's definition file using script tag:

```
<script src="node_modules/coherent-gameface-components/umd/components.development.js"></script>
<script src="script.js"></script>
```

Add the custom component to the page:

`<labeled-input></labeled-input>`

The JavaScript definition is a simple class which extends the HTMLElemnt. The
template is loaded using XHR. The url property of the component class shows the
path to the template html file. Use the <link> tags to import style files. Use the `loadResource` method to load
the template. When the template is loaded you can render the component.

```
class LabeledInput extends HTMLElement {
    constructor() {
        super();

        this.url = '/template.html';
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

components.defineCustomElement('labeled-input', LabeledInput);
```

To test the component start an http server at the root and open demo.html. If
you use http-server go to /labeled-input and run:

`http-server`

Navigate to localhost:<port> and check your component.

Adding component to the components suite
=========================================

If you want to contribute to the components library and add a new component you
need to add the required files in the correct folders. Make sure they can be
successfully bundled and add documentation.

All components are placed in the /components folder.
The folders are named using lower case and camel-case for longer names.
All names should be prefixed with `gameface-`. So now instead of labeled-input
the custom element should be named `gameface-labeled-input`:

`components.defineCustomElement('gameface-labeled-input', LabeledInput);`

The build command generates a UMD and a CJS bundles of the component. The module
bundler that is used is Rollup. This means that we can use `import` and `export` statements
and rollup will automatically resolve all modules. Now we can import all dependencies
at the top of the script.js file:

```
import components from 'coherent-gameface-components';
import template from './template.html';
```

And we can export the labeled input at the bottom:

`export { LabeledInput };`

Because the templates are imported as modules we no longer need to
load them using XHR.
Set the template as a property of the component:

`this.template = template;`

The loadResource method can both work with URL and an imported template. The usage
is the same so that it is more convenient to switch between XHR and imported template.
This is how the component's definition looks like after the changes:

```
import components from 'coherent-gameface-components';
import template from './template.html';

class LabeledInput extends HTMLElement {
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

components.defineCustomElement('gameface-labeled-input', LabeledInput);

export { LabeledInput };
```

Because all components are npm packages you need to add an entry index.js file.
This is the file that would be loaded when you import your component from node_modules
like this:

`import { LabeledInput } from 'gameface-labeled-input'`

It should export either the development or the production CJS bundle:

```
if (process.env.NODE_ENV === 'production') {
    module.exports = require('./cjs/gameface-labeled-input.production.min.js');
} else {
    module.exports = require('./cjs/gameface-labeled-input.development.js');
}
```

Each component has a demo page. It is placed in a /demo folder.
The JavaScript file of the demo should be bundled so that it can be easily checked with double click
or drag and drop without the need to manually setup an environment.

The demo.js file imports all dependencies so that Rollup can resolve and bundle them.

```
import components from 'coherent-gameface-components';
import LabeledInput from './umd/labeled-input.development.js'
```

The demo.html file should import the bundle.js and use the custom element:

```
<body>
    <gameface-labeled-input></gameface-labeled-input>
    <script src="./bundle.js"></script>
</body>
```

Note that the demo files should have the names demo.js and demo.html for the
JavaScript and html files respectively.

We have the definition, the demo, the entry file. All that is left in order to
build the component is to specify which files will be added to the npm package.
This is done in the package.json file using the files field:

```
  "files": [
    "LICENSE",
    "README.md",
    "demo.html",
    "index.js",
    "script.js",
    "cjs/",
    "umd/"
  ],
```
*Skip the files property if you want to include all files.*

Use the LICENSE template.

Now navigate to the components root folder and run:

`npm run rebuild`

The newly created bundles are located in labeled-input/umd and labeled-input/cjs
folders. To test if everything works open the demo.html file.

If everything works, add a README.md file to the component folder and add
a documentation page to the docs/ folder.
