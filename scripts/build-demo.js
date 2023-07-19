/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
/* eslint-disable max-lines-per-function */
const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const { getComponentDirectories } = require('./utils');

/**
 * Calls buildForTargets for all components and passes all environments
 * and formats as targets. Builds the components library first.
*/
function buildAllDemos() {
    const components = getComponentDirectories(['slider', 'scrollable-container', 'dropdown']);
    const mode = process.env === 'development' ? 'development' : 'production';

    for (const component of components) {
        const pathToDemo = path.resolve(path.join(__dirname, '../components', component, 'demo'));

        if (!fs.existsSync(pathToDemo)) continue;
        webpack({
            mode: mode,
            entry: path.join(pathToDemo, 'demo.js'),
            devtool: mode === 'development' ? 'inline-source-map' : false,
            module: {
                rules: [
                    {
                        test: /\.css$/i,
                        use: ['style-loader', 'css-loader'],
                    },
                    {
                        test: /\.html$/i,
                        loader: 'html-loader',
                    },
                ],
            },
            output: {
                path: pathToDemo,
                filename: 'bundle.js',
            },
        }, (err, stats) => { // Stats Object
            if (err || stats.hasErrors()) {
                console.error(err);
            }
        });
    }
}

buildAllDemos();
