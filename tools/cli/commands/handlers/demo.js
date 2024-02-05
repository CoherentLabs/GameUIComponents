/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/* Handles the build and watch commands of the demo */

const webpack = require('webpack');
const webpackDemoConfig = require('../../config/webpack-demo-config');
const WebpackDevServer = require('webpack-dev-server');
const chalk = require('chalk');

/**
 * Builds the demo of the component.
 * @param {object} argv
*/
function buildDemo(argv) {
    const config = webpackDemoConfig(argv);
    const compiler = webpack(config);

    if (argv.watch) {
        const devServerOptions = config.devServer;
        const server = new WebpackDevServer(devServerOptions, compiler);
        server.startCallback();
    } else {
        compiler.run((err, stats) => {
            if (err) return console.error(err);

            console.log(chalk.green.bold('Build successful!'));
            console.log('The following assets were generated:');

            Object.keys(stats.compilation.assets).forEach(name => console.log(chalk.blue.bold(name)));
        });
    }
}

module.exports = buildDemo;
