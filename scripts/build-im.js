/* eslint-disable no-undef */
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

const esbuild = require('esbuild');
const path = require('path');
const fs = require('fs-extra');

/**
 * Builds the Interaction Manager. Uses every file in the top level of the src folder as an entry point
 */
function buildInteractionManager() {
    const outputDir = path.resolve(__dirname, '../interaction-manager/');

    const entryPoints = getEntryPoints();

    const builds = [
        { output: `${outputDir}/esm`, entry: [{ path: `${outputDir}/src/interaction_manager.js` }], format: 'esm' },
        { output: `${outputDir}/dist`, entry: entryPoints, format: 'iife', globalName: true },
    ];

    const errors = [];

    builds.forEach((build) => {
        // Clear folder if it exists
        if (fs.pathExistsSync(build.output)) fs.emptyDirSync(build.output);

        build.entry.forEach((entry) => {
            const options = {
                entryPoints: [entry.path],
                bundle: true,
                outdir: build.output,
                format: build.format,
            };

            if (build.globalName) options.globalName = entry.name;

            const buildResult = esbuild.buildSync(options);

            if (buildResult.errors) errors.push(...buildResult.errors);
        });
    });

    if (errors.length > 0) console.error(...errors);
}

/**
 * Gets all of the entry points for the bundles
 * @returns {string[]}
 */
function getEntryPoints() {
    const pathToFiles = path.resolve(__dirname, '../interaction-manager/src');
    const itemsInFolder = fs.readdirSync(pathToFiles, { encoding: 'utf-8' });
    return itemsInFolder.reduce((acc, el) => {
        const pathToFile = `${pathToFiles}/${el}`;
        if (!fs.statSync(pathToFile).isFile() && path.extname(el) !== 'js') return acc;

        acc.push({ path: pathToFile, name: path.basename(el, '.js') });
        return acc;
    }, []);
}

buildInteractionManager();
