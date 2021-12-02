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

function areComponentsPackaged() {
    const notBuildComponents = [];
    for (let component of components) {
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

function linkDependencies() {
    execSync('npm run link', {cwd: ROOT_FOLDER, stdio: 'inherit'});
    linkSingleComponent('', TESTS_FOLDER);
}

function test(rebuild, browsersArg) {
    if (rebuild) execSync('npm run build:dev', { cwd: path.join(__dirname, '../'), stdio: 'inherit' });
    if (!areComponentsPackaged()) return;

    const formsServer = spawn('node', ['forms-server.js'], { cwd: __dirname });
    formsServer.stdout.on('data', function (data) {
        console.log(data.toString());
    });

    formsServer.stderr.on('data', function (data) {
        console.log(data.toString());
    });


    linkDependencies();
    const process = exec(`karma start tools/tests/karma.conf.js ${browsersArg}`, { cwd: path.join(__dirname, '../') });

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

function main() {
    const arguments = process.argv.slice(2);
    const rebuild = (arguments.indexOf('--rebuild') > -1);
    let browsersArg = '';

    const browsersArgIndex = arguments.indexOf('--browsers');
    if (browsersArgIndex > -1) browsersArg = `--browsers ${arguments[browsersArgIndex + 1]}`;

    test(rebuild, browsersArg);
}

main();