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

    const builds = [
        { folder: 'esm', type: 'esm' },
        { folder: 'dist', type: 'iife' }
    ];

    builds.forEach((build) => {
        // Building for each different entry point, to be able to declare different global names for different files
        entryPoints.forEach((entryPoint) => {
            const options = {
                entryPoints: [entryPoint.path],
                bundle: true,
                outdir: `${outputDir}/${build.folder}`,
                format: `${build.type}`,
                plugins: [],
            };

            if (build.type === 'iife') options.globalName = entryPoint.name;

            const { errors } = esbuild.buildSync(options);

            if (errors.length > 0) console.error(...errors);
        });
    });
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

        acc.push({ path: `${pathToFiles}/${el}`, name: path.basename(el) });
        return acc;
    }, []);
}

buildInteractionManager();
