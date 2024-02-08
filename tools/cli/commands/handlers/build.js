/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/* Handles the build and watch commands that create the
* development and production bundles located in the dist/ folder */

/* eslint-disable max-lines-per-function */
const path = require('path');
const webpack = require('webpack');
const webpackBaseConfig = require('../../config/webpack-base-config');
const chalk = require('chalk');
let watching = null;

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
            if (!watching) console.log(chalk.green('Webpack is watching for file changes...'));

            watching = compiler.watch(
                {
                    // Add a delay before rebuilding once the first file changed.
                    aggregateTimeout: 300,
                },
                (err, stats) => {
                    if (err) return console.error(err);
                    if (!stats) return resolve();

                    if (stats.hasErrors()) return reject(stats.compilation.getErrors().join('\n'));

                    const assets = stats.compilation?.getAssets();
                    if (assets && assets.length) {
                        console.log(chalk.blue(`${new Date(stats.compilation.startTime).toLocaleTimeString()}: Building assets...`));
                        assets.forEach(element => console.log(chalk.magenta`Created bundle - ${element.name}`));
                    }

                    resolve();
                }
            );
        } else {
            if (watching) watching.close();

            compiler.run((err, stats) => {
                if (err) return reject(err);
                if (!stats) return resolve();

                if (stats.hasErrors()) return reject(stats.compilation.getErrors().join('\n'));

                const assets = stats.compilation?.getAssets();
                if (assets && assets.length) {
                    assets.forEach(element => console.log(chalk.magenta`Created bundle - ${element.name}`));
                }

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
    }

    console.log(chalk.green.bold(`Build finished! Distribution files are located in ${output}`));
}

module.exports = build;
