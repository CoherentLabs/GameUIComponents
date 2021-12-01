// run npm i in tools/tests
// read package.json
//    get dependencies
//    run npm link <dep_name>

const fs = require('fs');
const path = require('path');
const { execSync, exec, spawn } = require('child_process');
const { linkSingleComponent } = require('./helpers');

const TESTS_FOLDER = path.join(__dirname, '../tools/tests');
const ROOT_FOLDER = path.join(__dirname, '../');

function linkDependencies() {
    execSync('npm run link', {cwd: ROOT_FOLDER, stdio: 'inherit'});
    linkSingleComponent('', TESTS_FOLDER);
}

linkDependencies();
