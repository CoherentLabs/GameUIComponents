/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

const path = require('path');
const fs = require('fs');
const uglifycss = require('uglifycss');
const { execSync } = require('child_process');

if (require.main === module) {
    const args = process.argv.slice(2);
    const componentPathIdx = args.indexOf('--component');
    if (componentPathIdx === -1) process.exit();
    const componentPath = args[componentPathIdx + 1];

    // check if the component path exists and contains a style.css file
    const isPathValid = fs.lstatSync(componentPath).isDirectory() && fs.lstatSync(path.join(componentPath, 'style.css')).isFile();

    if (componentPath && isPathValid) build(componentPath);
}

/**
 * @param {string} componentPath
 */
function createDist(componentPath) {
    const outputFolder = path.join(componentPath, 'dist');
    if (!fs.existsSync(outputFolder)) fs.mkdirSync(outputFolder);
}


/**
 * @param {string} componentPath
 */
function build(componentPath) {
    const uglified = uglifycss.processFiles(
        [path.join(componentPath, 'style.css')],
        { maxLineLen: 500, expandVars: true }
    );

    createDist(componentPath);
    const outputFile = path.join(componentPath, 'dist', `${path.basename(componentPath)}.production.min.css`);

    fs.writeFileSync(outputFile, uglified, { encoding: 'utf8' });

    execSync('npm pack', { cwd: componentPath });
}

module.exports = build;
