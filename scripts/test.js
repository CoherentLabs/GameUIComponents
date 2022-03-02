/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
const fs = require('fs');
const path = require('path');
const { execSync, exec, spawn } = require('child_process');
const { linkSingleComponent } = require('./helpers');

const TESTS_FOLDER = path.join(__dirname, '../tools/tests');
const ROOT_FOLDER = path.join(__dirname, '../');
const COMPONENTS_FOLDER = path.join(__dirname, '../components');

const components = fs.readdirSync(COMPONENTS_FOLDER);

/**
 * Checks if all the components are having packages and are not missing
 * @returns {boolean}
 */
function areComponentsPackaged() {
    const notBuildComponents = [];
    for (const component of components) {
        const componentFolder = path.join(COMPONENTS_FOLDER, component, 'umd');
        const componentTestFolder = path.join(TESTS_FOLDER, component);

        // if there is a test for this component but doesn't have umd package
        if (!fs.existsSync(componentTestFolder) || fs.existsSync(componentFolder)) continue;
        notBuildComponents.push(component);
    }
    if (!notBuildComponents.length) return true;
    console.error(`Missing packages for ${components.join(', ')}.
    Did you forget to build the components?
    Try running npm run test -- --rebuild to generate the component packages.`);

    return false;
}

/**
 * Will link all the components so thei will be tested with the local changes
 */
function linkDependencies() {
    linkSingleComponent('', TESTS_FOLDER);
}

/**
 * Will build components and test them
 * @param {boolean} rebuild
 * @param {string} browsersArg
 * @param {boolean} [noLink=false]
 * @returns {void}
 */
function test(rebuild, browsersArg, noLink = false) {
    if (rebuild) execSync('npm run build:dev', { cwd: ROOT_FOLDER, stdio: 'inherit' });
    if (!areComponentsPackaged()) return;

    execSync('npm i', { cwd: ROOT_FOLDER, stdio: 'inherit' });

    const formsServer = spawn('node', ['forms-server.js'], { cwd: __dirname });
    formsServer.stdout.on('data', function (data) {
        console.log(data.toString());
    });

    formsServer.stderr.on('data', function (data) {
        console.log(data.toString());
    });

    if (!noLink) linkDependencies();
    const process = exec(`karma start tools/tests/karma.conf.js ${browsersArg}`, { cwd: ROOT_FOLDER });

    process.stdout.on('data', function (data) {
        console.log(data.toString());
    });
    process.on('exit', function (code) {
        formsServer.kill();
        global.process.exit(code);
    });
    process.on('uncaughtException', () => {
        formsServer.kill();
    });
    process.on('SIGTERM', () => {
        formsServer.kill();
    });
}

/** */
function main() {
    const args = process.argv.slice(2);
    const rebuild = (args.indexOf('--rebuild') > -1);
    const noLink = args.indexOf('--no-link') > -1 || false;
    let browsersArg = '';

    const browsersArgIndex = args.indexOf('--browsers');
    if (browsersArgIndex > -1) browsersArg = `--browsers ${args[browsersArgIndex + 1]}`;

    test(rebuild, browsersArg, noLink);
}

main();
