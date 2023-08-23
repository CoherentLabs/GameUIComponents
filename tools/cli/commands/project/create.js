/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const { exec } = require('node:child_process');

const supportedTemplates = ['webpack', 'vite'];

/**
 * Validate if the passed template is valid
 * @param {string} template - the name of the template
 * @returns {boolean}
 */
function isValidTemplate(template) {
    const valid = supportedTemplates.includes(template.toLowerCase());

    if (!valid) console.log(chalk.red(`Template ${template} is not a valid option. Please use one of the supported templates - ${supportedTemplates.join(', ')}!`));

    return valid;
}

/**
 * Creates a directory if it doesn't exist
 * @param {string} directory - the path to the directory
 * @returns {string|null[]} tuple - error, path
 */
function setupDirectory(directory) {
    const fullPath = path.resolve(process.cwd(), directory);
    const exists = fs.existsSync(fullPath);

    if (!exists) {
        try {
            fs.mkdirSync(fullPath);
            return [null, fullPath];
        } catch (error) {
            console.log(chalk.red(`The following error occurred while trying to create directory ${fullPath} - ${error}`));
        }
    }

    const content = fs.readdirSync(fullPath);
    if (!content.length) return [null, fullPath];

    const error = `ERROR: Directory ${directory} is not empty.`;
    return [error, null];
}

/**
 * Create a components project from a template
 * @param {string} template - the name of the template
 * @param {string} directory - the directory in which to create the project
 * @returns {void}
 */
function create(template, directory) {
    console.log(chalk.blue(`Creating project in ${directory} ...`));

    if (!isValidTemplate(template)) return;

    const [error, fullPath] = setupDirectory(directory);
    if (error) return console.log(chalk.red(error));

    const templateSrc = path.resolve(__dirname, '../../templates/projects/' + template.toLowerCase());

    console.log(chalk.blue('Copying files...'));

    fs.cpSync(templateSrc, fullPath, { recursive: true });

    console.log(chalk.blue('Installing dependencies...'));

    exec(`npm i`, { cwd: fullPath }, (error, stdout) => {
        if (error) return console.log(chalk.red(`Installing dependencies failed. Error: ${error}`));

        console.log(chalk.green(`${stdout}`));

        console.log(chalk.blue('Created project from template ') + chalk.magenta(template));
        console.log(chalk.blue('cd ') + chalk.magenta(fullPath) + chalk.blue(' and run'));
        console.log(chalk.magenta.bold('npm run dev'));
        console.log(chalk.blue('to start a development server'));
    });
}

exports.command = 'create-project <template> <directory>';
exports.desc = 'Create a new project from template';
exports.builder = {
    template: {
        desc: 'The name of the template.',
        default: 'webpack',
    },
    directory: {
        desc: 'The directory where the component should be',
        default: '',
    },
};
exports.handler = function (argv) {
    create(argv.template, argv.directory);
};
