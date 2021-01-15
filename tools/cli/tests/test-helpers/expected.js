/**
 * These are the expected sources of the generated component files.
 * This file can be automatically generated but for now it's manually updated.
 * If we update the component's files we need to update this file as well.
 * The expected source is mapped to the file by its name and extension concatenated
 * without a dot. The strings are trimmed and all spaces and newline characters
 * are removed when comparing to avoid differences due to spaces. This enables us
 * to format the source here so that it's more readable.
*/

exports.demohtml = `
    <!DOCTYPE html>
    <html lang="en">
    <body>
        <gameface-test-name class="gameface-test-name-component">
            <component-slot data-name="name">gameface-test-name</component-slot>
        </gameface-test-name>

        <script src="./bundle.js"></script>
    </body>
    </html>
`;

exports.demojs = `
    import components from 'coherent-gameface-components';
    import GamefaceTestName from '../umd/gameface-test-name.development.js';
    import {pm} from 'postmessage-polyfill';
    import {fetch as fetchPolyfill} from 'whatwg-fetch';

    window.postMessage = function(message) {
        pm({
            origin: 'http://127.0.0.1/:3000',
            target: window,
            data: message
        });
    };
`;

exports.indexjs = `
    if (process.env.NODE_ENV === 'production') {
        module.exports = require('./cjs/gameface-test-name.production.min.js');
    } else {
        module.exports = require('./cjs/gameface-test-name.development.js');
    }
`;

exports.packagejson = `
{
    "name": "gameface-test-name",
    "version": "1.0.0",
    "description": "A component for Coherent Labs Gameface.",
    "main": "script.js",
    "repository": {
      "type": "git",
      "url": "https://github.com/CoherentLabs/GameUIComponents/tree/master/components/gameface-test-name"
    },
    "keywords": [
      "UI",
      "Component"
    ],
    "files": [
      "index.js",
      "package.json",
      "README.md",
      "script.js",
      "style.css",
      "template.html",
      "demo/",
      "cjs/",
      "umd/"
    ],
    "dependencies": {
      "coherent-gameface-components": "file:coherent-gameface-components-1.0.0.tgz",
      "postmessage-polyfill": "1.0.0",
      "whatwg-fetch": "3.4.1"
    },

    "author": "",
    "license": "ISC"
}
`;

exports.READMEmd = `
    The gameface-test-name is part of the Gameface custom components suite. As most of the components in this suite it uses slots to allow dynamic content.


    Usage
    ===================
    The gameface-test-name component comes with UMD and CJS builds.

    ## Usage with UMD modules:

    * import the components library:

    ~~~~{.html}
    <script src="./node_modules/coherent-gameface-components/umd/components.production.min.js"></script>
    ~~~~

    * import the gameface-test-name component:

    ~~~~{.html}
    <script src="./node_modules/gameface-test-name/umd/gameface-test-name.production.min.js"></script>
    ~~~~

    * add the gameface-test-name component to your html:

    ~~~~{.html}
    <gameface-test-name class="gameface-test-name-component"></gameface-test-name>
    ~~~~

    This is all! Load the file in Gameface to see the gameface-test-name.

    If you wish to import the modules using JavaScript you can remove the script tags
    which import the components and the gameface-test-name from the node_modules folder and import them like this:

    ~~~~{.js}
    import components from 'coherent-gameface-components';
    import gameface-test-name from 'gameface-test-name';
    ~~~~

    Note that this approach requires a module bundler like [Webpack](https://webpack.js.org/) or [Rollup](https://rollupjs.org/guide/en/) to resolve the
    modules from the node_modules folder. Alternatively you can import them directly from node_modules:

    ~~~~{.js}
    import components from './node_modules/coherent-gameface-components/umd/components.production.min.js';
    import gameface-test-name from './node_modules/gameface-test-name/umd/gameface-test-name.production.min.js';
    ~~~~

    ## Usage with CJS modules:

    * Import the components library:

    ~~~~{.js}
    const components = require('coherent-gameface-components');
    const gameface-test-name = require('gameface-test-name');
    ~~~~

    The CommonJS(CJS) modules are used in a NodeJS environment, be sure to use a module
    bundler in order to be use them in a browser.
`;

exports.scriptjs = `
    import components from 'coherent-gameface-components';
    import template from './template.html';
    import style from './style.css';
    
    class GamefaceTestName extends HTMLElement {
        constructor() {
            super();
            this.template = template;
            components.importStyleTag('gameface-test-name', style);
            this.url = '/components/gameface-test-name/template.html';
        }
        connectedCallback() {
            components.loadResource(this)
                .then((response) => {
                    this.template = response[1].cloneNode(true);
                    components.render(this);
                })
                .catch(err => console.error(err));
        }
    }
    components.defineCustomElement('gameface-test-name', GamefaceTestName);
    export default GamefaceTestName;
`;

exports.stylecss = `
    body {
        background-color: #ebebeb;
    }
`;

exports.templatehtml = `
    <div class="gameface-test-name">
        <span>Hello </span>
        <component-slot data-name="name">there!</component-slot>
    </div>
`;