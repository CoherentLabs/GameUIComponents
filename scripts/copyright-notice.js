const fs = require('fs');
const path = require('path');

const COPYRIGHT_NOTICE_JS_CSS = `/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/\n\n`;
const COPYRIGHT_NOTICE_JS_CSS_CRLF = COPYRIGHT_NOTICE_JS_CSS.replace(/\n/g, '\r\n');
const COPYRIGHT_NOTICE_HTML_MD = `<!--Copyright (c) Coherent Labs AD. All rights reserved. Licensed under the MIT License. See License.txt in the project root for license information. -->\n`;
const COPYRIGHT_NOTICE_HTML_MD_CRLF = COPYRIGHT_NOTICE_HTML_MD.replace(/\n/g, '\r\n');
const OLD_COPYRIGHT_NOTICE_HTML_MD = `<!--Copyright (c) Coherent Labs AD. All rights reserved. -->\n`;
const OLD_COPYRIGHT_NOTICE_HTML_MD_CRLF = OLD_COPYRIGHT_NOTICE_HTML_MD.replace(/\n/g, '\r\n');
const FILE_EXTENSIONS = {
    JS: '.js',
    CSS: '.css',
    HTML: '.html',
    MD: '.md',
};
const COMPONENTS_FOLDER_PATH = path.join(__dirname, '../components');
const EXCLUDED_FILES = new Set(['package.json', 'package-lock.json', 'bundle.js']);
const INCLUDED_EXTENSIONS = new Set([
    FILE_EXTENSIONS.JS,
    FILE_EXTENSIONS.CSS,
    FILE_EXTENSIONS.HTML,
    FILE_EXTENSIONS.MD
]);
const EXCLUDED_FOLDERS = new Set(['node_modules', 'umd', 'cjs', 'dist']);
let addCopyrights = false;
let allCheckedFilesHaveCopyrightNotice = true;

/**
 * Checks if the file is valid for checking/adding a copyright notice
 * @param {string} filePath
 * @returns {boolean}
 */
function shouldCheckFileForCopyrights(filePath) {
    const fileName = path.basename(filePath);
    const fileExtension = path.extname(fileName);

    if (EXCLUDED_FOLDERS.has(fileName) ||
        EXCLUDED_FILES.has(fileName)) return false;
    if (fileExtension !== '' && !INCLUDED_EXTENSIONS.has(fileExtension)) return false;

    return true;
}

/**
 * Checks whether the file has the copyright notice or not.
 * @param {string} fileContent
 * @param {string} fileExtension
 * @returns {boolean}
 */
function fileHasCopyrightsIncluded(fileContent, fileExtension) {
    switch (fileExtension) {
        case FILE_EXTENSIONS.JS:
        case FILE_EXTENSIONS.CSS:
            return fileContent.indexOf(COPYRIGHT_NOTICE_JS_CSS) !== -1 ||
                fileContent.indexOf(COPYRIGHT_NOTICE_JS_CSS_CRLF) !== -1;
        case FILE_EXTENSIONS.HTML:
        case FILE_EXTENSIONS.MD:
            return fileContent.indexOf(COPYRIGHT_NOTICE_HTML_MD) !== -1 ||
                fileContent.indexOf(COPYRIGHT_NOTICE_HTML_MD_CRLF) !== -1;
        default: return false;
    }
}

/**
 * Will add the copyright notice at the beginning of the file
 * @param {string} fileContent
 * @param {string} fileExtension
 * @param {string} filePath
 */
function addCopyrightsToFile(fileContent, fileExtension, filePath) {
    let buffer = '';

    switch (fileExtension) {
        case FILE_EXTENSIONS.JS:
        case FILE_EXTENSIONS.CSS:
            buffer = COPYRIGHT_NOTICE_JS_CSS_CRLF + fileContent;
            break;
        case FILE_EXTENSIONS.HTML:
        case FILE_EXTENSIONS.MD:
            const hasOldLicence = fileContent.indexOf(OLD_COPYRIGHT_NOTICE_HTML_MD) !== -1;
            const hasOldCRLFLicence = fileContent.indexOf(OLD_COPYRIGHT_NOTICE_HTML_MD_CRLF) !== -1;

            if (hasOldLicence) {
                buffer = fileContent.replace(OLD_COPYRIGHT_NOTICE_HTML_MD, COPYRIGHT_NOTICE_HTML_MD_CRLF);
            } else if (hasOldCRLFLicence) {
                buffer = fileContent.replace(OLD_COPYRIGHT_NOTICE_HTML_MD_CRLF, COPYRIGHT_NOTICE_HTML_MD_CRLF);
            } else {
                buffer = COPYRIGHT_NOTICE_HTML_MD_CRLF + fileContent;
            }
            break;
        default: break;
    }

    if (buffer) {
        fs.writeFileSync(filePath, buffer);
        console.log(`Added copyrights to ${filePath}`);
    }
}

/**
 * Checks and adds copyright notice at the beginning of the file if they are not there
 * @param {string} filePath
 */
function checkCopyrightNotesAtBeginning(filePath) {
    const fileExtension = path.extname(filePath);
    const data = fs.readFileSync(filePath).toString();

    if (fileHasCopyrightsIncluded(data, fileExtension)) return;
    allCheckedFilesHaveCopyrightNotice = false;

    if (!addCopyrights) {
        console.log(`File ${filePath} has no copyright notice added or differes from the default one.`);
        return;
    }

    addCopyrightsToFile(data, fileExtension, filePath);
}

/**
 * Will check/add the copyright notice to a file. If the file is directory then will check for files recursively
 * @param {string} filePath
 */
function checkCopyrightsInFile(filePath) {
    if (!shouldCheckFileForCopyrights(filePath)) return;

    const fileStat = fs.lstatSync(filePath);

    if (fileStat.isFile()) {
        checkCopyrightNotesAtBeginning(filePath);
    } else if (fileStat.isDirectory()) {
        checkCopyrightsInDirectory(filePath);
    }
}

/**
 * Will go through a directory and add the copyright notice to its files if they are valid
 * @param {string} dirPath
 */
function checkCopyrightsInDirectory(dirPath) {
    const folderFiles = fs.readdirSync(dirPath);
    const folderFilesAbsPaths = folderFiles.map(file => path.join(dirPath, file));

    for (const file of folderFilesAbsPaths) {
        if (!fs.existsSync(file)) continue;

        checkCopyrightsInFile(file);
    }
}

/** */
function main() {
    const args = process.argv.slice(2);
    if (args.indexOf('--add') > -1 || args.indexOf('-a') > -1) addCopyrights = true;

    checkCopyrightsInDirectory(COMPONENTS_FOLDER_PATH);

    if (!addCopyrights && !allCheckedFilesHaveCopyrightNotice) {
        console.log(`There are files that are missing the copyright notice! Run the 'npm run add:copyright' that will automatically fix the issue!`);
        process.exitCode = 1;
        return;
    }

    if (addCopyrights && !allCheckedFilesHaveCopyrightNotice) {
        console.log('Successfully added copyright notice to all the files that have missed it!');
        return;
    }

    console.log('All the files have the copyright notice!');
}

main();
