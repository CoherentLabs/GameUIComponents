/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const templatesLocation = path.join(__dirname, '../templates/component');
const reservedCustomElNames = ['annotation-xml', 'color-profile', 'font-face', 'font-face-src', 'font-face-uri', 'font-face-format', 'font-face-name', 'missing-glyph'];

/**
 * Will create folder in some directory
 * @param {string} directory
 * @param {string} folderName
 * @returns {string}
 */
function createFolder(directory, folderName) {
    const fullPath = path.resolve(path.join(directory, folderName));

    if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
    } else {
        console.log(`Component with name ${folderName} already exists in ${directory}`);
    }

    return fullPath;
}

/**
 * @param {string} s
 * @returns {string}
 */
function capitalize(s) {
    if (typeof s !== 'string') return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
}

/**
 * @param {string[]} words
 * @returns {string}
 */
function toUpperCamelCase(words) {
    let formatted = '';
    words.forEach((name) => {
        formatted += capitalize(name);
    });

    return formatted;
}

/**
 * Validate if a name is valid custom element name
 * @param {string} name
 * @returns {boolean}
 */
function isNameValid(name) {
    const wordsBetweenHyphensRegExp = new RegExp(/(?<=[a-z]-)[a-z]+/);
    const specialCharactersRegExp = new RegExp(/\?|!|<|>|@|#|\$|%|\^|&|\*|\(|\)|\+|\[|\]|~/g);

    if (specialCharactersRegExp.test(name)) {
        console.error(`Custom element's name must not contain any of the following characters - ?  !  <  >  @  #  $  %  ^  &  *  (  )  +  [  ] ~. Current name uses ${name.match(specialCharactersRegExp).join(' ')}`);
        return false;
    }

    if (!wordsBetweenHyphensRegExp.test(name)) {
        console.error(`Custom element's name must contain at least two lowercase words separated by a hyphen.`);
        return false;
    }

    if (reservedCustomElNames.indexOf(name) > -1) {
        console.error(`Custom element's name must not be one of the following: ${reservedCustomElNames.join(', ')}`);
        return false;
    }

    return true;
}

/**
 * Will create a component with a specific name into specific directory
 * @param {string} name
 * @param {string} directory
 */
function create(name, directory) {
    name = `${name.toLowerCase()}`;
    if (!isNameValid(name)) return;

    directory = directory || process.cwd();
    const componentFolder = createFolder(path.join(directory), name);

    try {
        fs.readdirSync(templatesLocation).forEach((file) => {
            const filename = file.replace('.template', '');
            const data = fs.readFileSync(path.join(templatesLocation, file), 'utf8');
            const className = toUpperCamelCase(name.split('-'));

            const templateVars = {
                componentName: name,
                className: className,
            };

            /**
             * @param {string} templateString
             * @param {{componentName: string, className: string}} templateVars
             * @returns {Function}
             */
            const fillTemplate = function (templateString, templateVars) {
                return new Function('return `' + templateString + '`;').call(templateVars);
            };

            const fileContent = fillTemplate(data, templateVars);

            fs.writeFileSync(path.join(componentFolder, filename), fileContent, 'utf8');
        });
        console.log('Installing dependencies...');
        execSync(`npm i`, { cwd: componentFolder });
        console.log('Finished!');
        console.log(`Created component ${name} in ${componentFolder}.`);
        console.log(`Created component ${name} in ${componentFolder}.`);
    } catch (error) {
        console.error(error);
    }
}


exports.command = 'create-component [name] [directory]';
exports.desc = 'Create a new component.';
exports.builder = {
    name: {
        desc: 'The name of the component.',
        default: 'example-component',
    },
    directory: {
        desc: 'The directory where the component should be',
        default: '',
    },
};
exports.handler = function (argv) {
    create(argv.name, argv.directory);
};
