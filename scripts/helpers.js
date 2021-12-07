const path = require('path');
const fs = require('fs');
const COMPONENTS_PATH = path.join(__dirname, '../components');
const { execSync } = require('child_process');

function getPackageJSON(component, folder = COMPONENTS_PATH) {
    const packageJSONPath = path.join(folder, component, 'package.json');
    const fsStats = fs.lstatSync(packageJSONPath, {throwIfNoEntry: false});
    if (!fsStats || !fsStats.isFile()) {
        console.error(`Could not find package.json for ${component}. Make sure the component exists and has a valid source code.`);
        return null;
    }
    return JSON.parse(fs.readFileSync(packageJSONPath));
}

function linkSingleComponent(component, folder = COMPONENTS_PATH) {
    const packageJSON = getPackageJSON(component, folder);
    if (!packageJSON || !packageJSON.dependencies) return;

    let componentsDeps = '';
    const dependencies = Object.keys(packageJSON.dependencies);
    for(let dependency of dependencies) {
        if (!dependency.match(/(coherent)/g)) continue;
        componentsDeps += ` ${dependency}`;
    }

    safelyCreateLink(path.join(folder, component), component, componentsDeps.trim())
}

function safelyCreateLink(cwd, component, packages = '') {
    const linked = packages || component;
    try {
        execSync(`npm link ${packages}`, { cwd: cwd, encoding: 'utf8', stdio: 'inherit'});
        if (packages) {
            console.log(`Linked dependencies - ${packages.replace(/\s/g, ', ')} for component ${component}.`);
        } else {
            console.log(`Created link for ${component}.`);
        }
    } catch (err) {
        console.error(`The following error ocurred while linking ${linked}: ${err}`);
    }
}

module.exports = {
    getPackageJSON: getPackageJSON,
    safelyCreateLink: safelyCreateLink,
    linkSingleComponent: linkSingleComponent
};