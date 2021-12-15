/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

const fs = require('fs');
const path = require('path');
const expectedFiles = require('./expected');

/**
 * Recursively created an object representing a directory's structure as a tree.
 * Trees enable us to easily iterate over the directory files and quickly access nested folders.
 * @param {string} folderPath - the path to the directory
 * @param {object} tree - the object tree
 * @returns {object} - the created tree
*/
exports.folderToTree = (folderPath, tree = {}) => {
    const root = path.basename(folderPath);
    tree[root] = tree[root] || [];
    const filesInFolder = fs.readdirSync(folderPath);

    for (let file of filesInFolder) {
        const filePath = path.join(folderPath, file);

        if(!fs.lstatSync(filePath).isDirectory()) {
            tree[root].push(file);
            continue;
        }
        this.folderToTree(filePath, tree);
    }

    return tree;
}

/**
 * Checks if a given folder contains certain files.
 * @param {string} folderPath - the path to the folder that needs to be checked
 * @param {Array<string>} files - an array with the the names of the files that are
 * expected to be present in the folder.
 * @returns {boolean}
*/
exports.folderContainsFiles = (folderPath, files) => {
    const filesInFolder = fs.readdirSync(folderPath);

    return files.every((file) => filesInFolder.indexOf(file) !== -1);
}

/**
 * Checks if given files have a valid content.
 * The content is valid if it's equal to a predefined expected values.
 * Reads each file from the filesToCheck list in folderPath, removes all spaces
 * and newline characters and compares the expected to the actual values.
 * @param {string} folderPath - the path to the folder which contains the files
 * that need to be checked
 * @param {Array<string>} filesToCheck - an array of the file names that need to
 * be checked
 * @returns {boolean}
*/
exports.filesHaveCorrectContent = (folderPath, filesToCheck) => {
    
    for(let file of filesToCheck) {
        const expectedFileContent = expectedFiles[file.replace(/(\.|-)/g, '')].replace(/\r?\n|\r|\s/g, '');
        const fileContent = fs.readFileSync(path.join(folderPath, file), 'utf8').replace(/\r?\n|\r|\s/g, '');

        if(expectedFileContent !== fileContent) return false;
    }

    return true;
}