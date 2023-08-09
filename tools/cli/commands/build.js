/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
/* eslint-disable max-lines-per-function */
const path = require('path');
const webpack = require('webpack');
const webpackBaseConfig = require('../config/webpack-base-config');

const ENVIRONMENTS = [
    'production',
    'development',
];

/**
 * build using webpack
 * @param {object} config
 * @param {boolean} watch
 * @returns {Promise}
 */
function buildWithWebpack(config, watch) {
    return new Promise((resolve, reject) => {
        const compiler = webpack(config);

        if (watch) {
            compiler.watch(
                {
                    // Example
                    aggregateTimeout: 300,
                },
                (err, stats) => {
                    if (err) return console.error(err);
                    if (stats && stats.hasErrors()) return reject(stats.compilation.getErrors().join('\n'));

                    // Print watch/build result here...
                    console.log('Successfully bundled');
                    if (stats && stats.compilation.emittedAssets.size) {
                        stats.compilation.emittedAssets.forEach(element => console.log(element));
                    }
                }
            );
        } else {
            compiler.run((err, stats) => {
                if (err) return reject(err);
                if (stats && stats.hasErrors()) return reject(stats.compilation.getErrors().join('\n'));
                resolve();
            });
        }
    });
}

/**
 * Build the component
 * @param {Array<string>} environments
 * @param {string} moduleName
 * @param {boolean} watch
 */
async function build(environments, moduleName, watch = false) {
    console.log(`Building component ${moduleName}...`);
    const entry = path.join(process.cwd(), './script.js');
    const output = path.join(path.dirname(entry), 'dist');

    for (const environment of environments) {
        const suffix = environment === 'development' ? '.development' : '.production.min';
        const name = `${moduleName}${suffix}.js`;

        await buildWithWebpack({
            ...webpackBaseConfig(environment),
            entry: entry,
            output: {
                path: output,
                filename: name,
            },
        }, watch).catch(console.error);

        console.log(`Created bundle - ${name}`);
    }
    console.log(`Build finished! Distribution files are located in ${output}`);
}

exports.command = 'build [--watch]';
exports.desc = 'start the server';
exports.builder = {
    '--watch': {
        desc: 'Watch for changes in the source files and rebuild.',
    },
};
exports.handler = function (argv) {
    build(ENVIRONMENTS, (path.basename(process.cwd())), argv.watch);
};
