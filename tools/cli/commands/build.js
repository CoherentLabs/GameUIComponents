const yargs = require('yargs/yargs');
const path = require('path');
const fs = require('fs');
const rollup = require('rollup');
const terser = require('rollup-plugin-terser').terser;
const nodeResolve = require('@rollup/plugin-node-resolve').nodeResolve;
const html = require('rollup-plugin-html');
const importCss = require('@atomico/rollup-plugin-import-css');

// The module formats which will be bundled
const FORMATS = [
    'cjs',
    'umd',
];

// The target environments
const ENVIRONMENTS = [
    'prod',
    'dev'
];


/**
 * Creates an object of output options for rollup.
 * @param {string} directory - the component's folder.
 * @param {string} format - the module type to which to bundle.
 * @param {string} moduleName - the name of the bundle.
 * @param {boolean} isProd - if true, the code will be minified.
 * @returns {object} - OutputParams object.
*/
function generateOutputOptions(directory, format = 'umd', moduleName, isProd = false,) {
    const suffix = isProd ? '.production.min' : '.development';

    const outputOptions = {
        format: format,
        dir: path.join(directory, format),
        entryFileNames: `${moduleName}${suffix}.js`,
        globals: {
            'coherent-gameface-components': 'components'
        },
        exports: 'auto'
    };

    // When bundling for umd we need to specify a name for
    // the global variable that will be exported.
    if (format === 'umd') outputOptions.name = moduleName;
    // terser is a rollup plugin that minifies the code
    if (isProd) outputOptions.plugins = [terser()];

    return outputOptions;
}

/**
 * Creates bundles for given list of formats and environments.
 * @param {string} moduleName - the root name of the bundle.
 * @param {object} inputOptions - rollup input options.
 * @param {Array<string>} formats - the module types for which to bundle(UMD, CJS).
 * @param {Array<string>} environments - the environments for which to bundle(prod, dev).
*/
function buildForTargets(moduleName, inputOptions, formats, environments) {
    for (let format of formats) {
        for (let environment of environments) {
            createBundle(inputOptions, generateOutputOptions(
                path.dirname(inputOptions.input),
                format,
                moduleName,
                environment === 'prod' ? true : false
            ));
        }
    }
}

/**
 * Calls buildForTargets for all components and passes all environments
 * and formats as targets. Builds the components library first.
*/
function build(watch) {
    const inputOptions = {
        input: path.resolve('./script.js'),
        external: ['coherent-gameface-components'],
        plugins: [
            nodeResolve(),
            html(),
            importCss()
        ],
    };

    buildForTargets(path.basename(process.cwd()), inputOptions, FORMATS, ENVIRONMENTS);

    if (watch) {
        const watcher = rollup.watch({
            ...inputOptions,
            watch: {
                buildDelay: 800
            }
        });

        console.log(`coherent-guic-cli is watching for file changes.`);

        watcher.on('change', (event) => {
            buildForTargets(path.basename(process.cwd()), inputOptions, FORMATS, ENVIRONMENTS);
            console.log(`change!`);
        });
    }
}

/**
 * Invokes the rollup JS API to create and write a bundle.
 * See https://rollupjs.org/guide/en/#rolluprollup.
*/
async function createBundle(inputOptions, outputOptions) {
    // create a bundle
    const bundle = await rollup.rollup(inputOptions);
    // and write the bundle to disk
    await bundle.write(outputOptions);
}

exports.command = 'build [--watch]';
exports.desc = 'start the server';
exports.builder = {
    '--watch': {
        desc: 'Watch for changes in the source files and rebuild.',
    }
};
exports.handler = function (argv) {
    build(argv.watch);
}