/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

const path = require('path');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackBaseConfig = require('../config/webpack-base-config');

const PORT = 3000;
const pathToDemo = path.resolve(path.join(process.cwd(), 'demo'));

const devServerOptions = {
    static: {
        directory: path.join(pathToDemo, '../'),
        watch: {
            ignored: 'demo/',
        },
    },
    open: 'http://localhost:3000/demo/demo.html',
    allowedHosts: 'all',
    hot: false,
    port: PORT,
};

const webpackConfig = { ...webpackBaseConfig, devServer: devServerOptions };

/**
 * Will start the demo
 */
function startDemo() {
    const compiler = webpack(webpackConfig);
    const devServerOptions = { ...webpackConfig.devServer };
    const server = new WebpackDevServer(devServerOptions, compiler);

    server.startCallback(() => {
        console.log('Successfully started server on http://localhost:3000');
    });
}

exports.command = 'start:demo';
exports.desc = 'Start a development server and host the demo.';
exports.handler = startDemo;
