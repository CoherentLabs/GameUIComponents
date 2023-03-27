/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

const webpack = require('webpack');
const webpackBaseConfig = require('../config/webpack-base-config');

/**
 * Builds the demo of the component.
 * @param {boolean} [dev=false]
*/
function buildDemo(dev = false) {
    webpack({
        ...webpackBaseConfig,
        ...{
            mode: dev ? 'development' : 'production',
            devtool: false,
        },
    }, (err, stats) => { // Stats Object
        if (err) {
            console.error(err);
        }
        if (stats.hasErrors()) {
            console.error(stats.compilation.getErrors().join('\n'));
        }
    });
}

exports.command = 'build:demo [--dev]';
exports.desc = 'Create a production bundle of the demo.';
exports.builder = {
    '--dev': {
        desc: 'Create a development non minified bundle.',
    },
};
exports.handler = function (argv) {
    buildDemo(argv.dev);
};
