/* eslint-disable max-lines-per-function */

const path = require('path');
const fs = require('fs');
const buildCssComponents = require('./build-style-component');
const copyCSSTheme = require('./copy-theme');
const webpack = require('webpack');
const baseConfig = require('./config/webpack-base.config');
const libraryConfig = require('./config/webpack-library.config');
const { getComponentDirectories } = require('./utils');

const { execSync } = require('child_process');
const routerConfig = require('./config/webpack-router.config');

let noInstall = false;
// The target environments
const ENVIRONMENTS = [
    'production',
    'development',
];

/**
 * Converts kebap-case to camelCase
 * https://stackoverflow.com/questions/57556471/convert-kebab-case-to-camelcase-with-javascript
 * @param {string} name
 * @returns {string}
 */
function kebabToCamelCase(name) {
    if (!name.match(/i/g)) return name;
    return name.replace(/-./g, x => x[1].toUpperCase());
}

/**
 * Creates bundles for given list of formats and environments.
 * @param {string} moduleName - the root name of the bundle.
 * @param {object} inputOptions - rollup input options.
 * @param {Array<string>} environments - the environments for which to bundle(prod, dev).
 * @param {string} libPath - the path to either the library or a component.
*/
async function buildAndPackage(moduleName, inputOptions, environments, libPath) {
    for (const environment of environments) {
        const suffix = environment === 'development' ? '.development' : '.production.min';
        const name = `${moduleName}${suffix}.js`;

        const config = baseConfig(environment);
        let additionalOutputConfig = {};

        additionalOutputConfig = {
            library: {
                type: 'umd',
                name: kebabToCamelCase(moduleName),
            },
        };

        if (moduleName === 'components') additionalOutputConfig = libraryConfig.output;
        if (moduleName === 'router') additionalOutputConfig = routerConfig.output;

        await buildWithWebpack({
            ...config,
            entry: inputOptions.entry,
            output: {
                path: path.join(path.dirname(inputOptions.entry), 'dist'),
                filename: name,
                ...additionalOutputConfig,
            },
        }).catch(console.error);

        // npm pack must run after createBundle has finished, otherwise the webpack
        // bundling will not be ready yet and not everything will be packed.
        execSync('npm pack', { cwd: libPath });
    }
}

/**
 * build using webpack
 * @param {object} config
 * @returns {Promise}
 */
function buildWithWebpack(config) {
    return new Promise((resolve, reject) => {
        webpack(config, (err, stats) => { // Stats Object
            if (err) {
                reject(err);
            }
            if (stats && stats.hasErrors()) {
                reject(stats.compilation.getErrors().join('\n'));
            }
            resolve();
        });
    });
}

/**
 * Will install the npm modules
 * @param {string} componentPath
 */
function installDependencies(componentPath) {
    try {
        execSync('npm i', { cwd: componentPath });
    } catch (err) {
        console.error(err);
    }
}

/**
 * Calls buildAndPackage for all components and passes all environments
 * and formats as targets. Builds the components library first.
*/
async function buildEverything() {
    await buildComponentsLibrary();
    const components = getComponentDirectories(['slider', 'scrollable-container', 'dropdown', 'tooltip', 'form-control']);

    for (const component of components) {
        const componentPath = path.join(__dirname, '../components', component);

        if (!fs.existsSync(componentPath)) continue;

        if (!noInstall) installDependencies(componentPath);

        if (!fs.existsSync(path.join(componentPath, 'script.js'))) {
            buildCssComponents(componentPath);
            continue;
        }

        const inputOptions = {
            entry: path.join(componentPath, 'script.js'),
        };

        await buildAndPackage(component, inputOptions, ENVIRONMENTS, componentPath);
    }
}

/**
 * Build the components library
 * @returns {Promise}
 */
function buildComponentsLibrary() {
    const libPath = path.join(__dirname, '../lib');

    const inputOptions = {
        entry: path.join(libPath, 'components.js'),
    };

    return buildAndPackage('components', inputOptions, ENVIRONMENTS, libPath);
}

/** */
async function main() {
    copyCSSTheme();
    const args = process.argv.slice(2);
    if (args.indexOf('--no-install') > -1 || args.indexOf('-ni') > -1) noInstall = true;

    if (args.indexOf('--library') > -1) {
        buildComponentsLibrary();
    } else {
        await buildEverything();
    }
}

main();
