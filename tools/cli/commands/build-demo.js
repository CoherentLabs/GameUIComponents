/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
const webpack = require('webpack');
const webpackDemoConfig = require('../config/webpack-demo-config');
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

exports.command = 'build:demo [--dev] [--watch]';
exports.desc = 'Create a production bundle of the demo.';
exports.builder = {
    '--dev': {
        desc: 'Create a development non minified bundle.',
    },
    '--prod': {
        desc: 'Create a production minified bundle.',
    },
    '--watch': {
        desc: 'Watch for file changed and rebuild automatically.',
    },
};
exports.handler = function (argv) {
    buildDemo(argv);
};

