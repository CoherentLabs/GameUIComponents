/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
/**
 * These are the expected sources of the generated component files.
 * This file can be automatically generated but for now it's manually updated.
 * If we update the component's files we need to update this file as well.
 * The expected source is mapped to the file by its name and extension concatenated
 * without a dot. The strings are trimmed and all spaces and newline characters
 * are removed when comparing to avoid differences due to spaces. This enables us
 * to format the source here so that it's more readable.
*/

exports.indexhtml = `
    <!DOCTYPE html>
    <html lang="en">
    <body>
        <test-name class="test-name-component">
            <component-slot data-name="name">test-name</component-slot>
        </test-name>
    </body>
    </html>
`;

exports.demojs = `
    import TestName from './script.js';
    import { pm } from 'postmessage-polyfill';
    import { fetch as fetchPolyfill } from 'whatwg-fetch';

    window.postMessage = function (message) {
        pm({
            origin: 'http://127.0.0.1/:3000',
            target: window,
            data: message,
        });
    };
`;

exports.indexjs = `
    if (process.env.NODE_ENV === 'production') {
        module.exports = require('./dist/test-name.production.min.js');
    } else {
        module.exports = require('./dist/test-name.development.js');
    }
`;

exports.packagejson = `
{
    "name": "test-name",
    "version": "1.0.0",
    "description": "AcomponentforCoherentLabsGameface.",
    "main": "script.js",
    "repository": {
        "type": "git",
        "url": "https://github.com/CoherentLabs/GameUIComponents/tree/master/components/test-name"
    },
    "keywords": [
        "UI",
        "Component"
    ],
    "dependencies": {
        "coherent-gameface-components": "^3.0.1",
        "postmessage-polyfill": "1.0.0",
        "whatwg-fetch": "3.4.1"
    },
    "devDependencies": {
        "html-loader": "^4.2.0"
    },
    "author": "CoherentLabs",
    "license": "ISC"
}
`;

exports.READMEmd = `
    The test-name is part of the Gameface custom components suite. As most of the components in this suite it uses slots to allow dynamic content.


    Usage
    ===================
    The test-name component comes with UMD and CJS builds.

    ## Usage with UMD modules:

    * import the test-name component:

    ~~~~{.html}
    <script src="./node_modules/test-name/umd/test-name.production.min.js"></script>
    ~~~~

    * add the test-name component to your html:

    ~~~~{.html}
    <test-name class="test-name-component"></test-name>
    ~~~~

    This is all! Load the file in Gameface to see the test-name.

    If you wish to import the modules using JavaScript you can remove the script tags
    which import the components and the test-name from the node_modules folder and import them like this:

    ~~~~{.js}
    import test-name from 'test-name';
    ~~~~

    Note that this approach requires a module bundler like [Webpack](https://webpack.js.org/) or [Rollup](https://rollupjs.org/guide/en/) to resolve the
    modules from the node_modules folder.
`;

exports.scriptjs = `
    import { Components } from 'coherent-gameface-components';
    import template from './template.html';

    const components = new Components();
    const BaseComponent = components.BaseComponent;

    /**
     * Class description
     */
    class TestName extends BaseComponent {
        /* eslint-disable require-jsdoc */
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
        /* eslint-enable require-jsdoc */
    }
    components.defineCustomElement('test-name', TestName);
    export default TestName;
`;

exports.stylecss = `
    body {
        background-color: #ebebeb;
    }
`;

exports.templatehtml = `
    <div class="test-name">
        <span>Hello </span>
        <component-slot data-name="name">there!</component-slot>
    </div>
`;

exports.coherentgamefacecomponentsthemecss = `
:root {
   --default-color-white: #fff;
   --default-color-blue: #25a5d6;
   --default-color-gray: #e6e6e6;
}

input, textarea, button {
   border-top-color: var(--default-color-blue);
   border-right-color: var(--default-color-blue);
   border-bottom-color: var(--default-color-blue);
   border-left-color: var(--default-color-blue);
   background-color: var(--default-color-white);
}

button, input[type="button"] {
   background-color: var(--default-color-gray);
}
`;
