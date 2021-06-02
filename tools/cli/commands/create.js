/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

const yargs = require('yargs/yargs');
const fs = require('fs');
const path = require('path');
const { argv } = require('process');
const build = require('./build');
const templatesLocation = path.join(__dirname, '../templates');

function createFolder(directory, folderName) {
    const fullPath = path.resolve(path.join(directory, folderName));

    if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
    } else {
        console.log(`Component with name ${folderName} already exists in ${directory}`);
    }

    return fullPath;
}

function capitalize(s) {
    if (typeof s !== 'string') return '';
    return s.charAt(0).toUpperCase() + s.slice(1)
}

function toUpperCamelCase(words) {
    let formatted = '';
    words.forEach(name => {
        formatted += capitalize(name);
    });

    return formatted;
}

function create(name, directory) {
    name = `${name}`;
    directory = directory || process.cwd();
    const componentFolder = createFolder(path.join(directory), name);
    const demoFolder = createFolder(componentFolder, 'demo');

    fs.readdirSync(templatesLocation).forEach(file => {
        const filename = file.replace('.template', '');
        const data = fs.readFileSync(path.join(templatesLocation, file), 'utf8');
        const className = toUpperCamelCase(name.split('-'));

        const templateVars = {
            componentName: name,
            className: className
        }

        const fillTemplate = function (templateString, templateVars) {
            return new Function("return `" + templateString + "`;").call(templateVars);
        }

        const fileContent = fillTemplate(data, templateVars);

        if (filename !== 'demo.html' && filename !== 'demo.js') {
            fs.writeFileSync(path.join(componentFolder, filename), fileContent, 'utf8');
        } else {
            fs.writeFileSync(path.join(demoFolder, filename), fileContent, 'utf8');
        }
    });

    console.log(`Created component ${name} in ${componentFolder}.`);
}


exports.command = 'create [name] [directory]';
exports.desc = 'Create a new component.';
exports.builder = {
    name: {
        desc: 'The name of the component.',
        default: 'example-component',
    },
    directory: {
        desc: 'The directory where the component should be',
        default: '',
    }
};
exports.handler = function (argv) {
    create(argv.name, argv.directory);
};