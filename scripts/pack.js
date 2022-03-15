/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

/**
 * Pack all npm modules starting from a root.
 * @param {Array<string>} files - the files which to loop.
 * @param {string} dir - the root directory.
*/
function createPackage(files, dir) {
    for (const file of files) {
        // ignore node_modules and .git
        if (file === 'node_modules' || file === '.git' || file === 'scripts') continue;

        const filePath = path.join(dir, file);

        if (file === 'package.json') {
            exec('npm pack', {
                cwd: path.dirname(filePath),
            });
            continue;
        }

        // loop recursively
        if (fs.lstatSync(filePath).isDirectory()) {
            createPackage(fs.readdirSync(filePath), filePath);
        }
    }
}

/**
 * Gets the folder files and directories names
 * @param {string} source
 * @param {boolean} [includeFiles = false]
 * @returns {string[]}
 */
function getFolderContent(source, includeFiles = false) {
    return fs.readdirSync(source, { withFileTypes: true })
        // fs.readDirSync returns <fs.Dirent[]>
        // Dirent is a representation of a directory entry
        // see https://nodejs.org/api/fs.html#fs_class_fs_dirent
        .filter((dirent) => {
            return includeFiles ? dirent : dirent.isDirectory();
        })
        .map(dirent => dirent.name);
}

/**
 * @param {string} directory
 * @returns {boolean}
 */
function validateDirectory(directory) {
    return fs.existsSync(directory) && fs.lstatSync(directory).isDirectory();
}

const rootDir = path.join(__dirname, '../');
const args = process.argv.slice(2);
const directoryIndex = args.indexOf('--directory');

if (directoryIndex === -1) {
    createPackage(getFolderContent(rootDir), rootDir);
    process.exit();
}

const directory = path.resolve(path.join(rootDir, args[directoryIndex + 1]));
if (validateDirectory(directory)) {
    createPackage(getFolderContent(directory, true), directory);
}
