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
    const outputDir = path.normalize(path.resolve(__dirname, '../ui_utils/interaction_manager/'));

    const entryPoints = getEntryPoints();

    const builds = ['esm', 'dist'];

    const errors = [];

    builds.forEach((build) => {
        // Clear folder if it exists
        if (fs.pathExistsSync(`${outputDir}/${build}`)) fs.emptyDirSync(`${outputDir}/${build}`);
    });

    // Building for ESM
    const esmResult = esbuild.buildSync({
        entryPoints: [`${outputDir}/src/InteractionManager.js`],
        bundle: true,
        outdir: `${outputDir}/esm`,
        format: 'esm',
    });

    errors.push(...esmResult.errors);

    // Building for UMD
    entryPoints.forEach((entryPoint) => {
        const options = {
            entryPoints: [entryPoint.path],
            bundle: true,
            outdir: `${outputDir}/dist`,
            format: `iife`,
        };

        options.globalName = entryPoint.name;

        const umdBuild = esbuild.buildSync(options);

        errors.push(...umdBuild.errors);
    });

    if (errors.length > 0) console.error(...errors);
}

/**
 * Gets all of the entry points for the bundles
 * @returns {string[]}
 */
function getEntryPoints() {
    const pathToFiles = path.normalize(path.resolve(__dirname, '../ui_utils/interaction_manager/src'));
    const itemsInFolder = fs.readdirSync(pathToFiles, { encoding: 'utf-8' });
    return itemsInFolder.reduce((acc, el) => {
        if (!fs.statSync(`${pathToFiles}/${el}`).isFile() && path.extname(el) !== 'js') return acc;

        acc.push({ path: `${pathToFiles}/${el}`, name: path.basename(el, '.js') });
        return acc;
    }, []);
}

buildInteractionManager();
