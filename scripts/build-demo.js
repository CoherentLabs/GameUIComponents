/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
/* eslint-disable max-lines-per-function */
const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const { getComponentDirectories } = require('./utils');
const HtmlWebpackPlugin = require('html-webpack-plugin');

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
            entry: path.resolve(path.join(__dirname, '../components', component, 'demo.js')),
            module: {
                rules: [
                    {
                        test: /\.html$/i,
                        loader: 'html-loader',
                    },
                ],
            },
            plugins: [
                new HtmlWebpackPlugin({
                    inject: 'body',
                    filename: 'demo.html',
                    template: path.resolve(path.join(__dirname, '../components', component, 'index.html')),
                }),
            ],
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
