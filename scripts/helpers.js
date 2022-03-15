const path = require('path');
const fs = require('fs');
const COMPONENTS_PATH = path.join(__dirname, '../components');
const { execSync } = require('child_process');

/**
 * Will get package json from some component
 * @param {string} component
 * @param {string} folder
 * @returns {Object}
 */
function getPackageJSON(component, folder = COMPONENTS_PATH) {
    const packageJSONPath = path.join(folder, component, 'package.json');
    const fsStats = fs.lstatSync(packageJSONPath, { throwIfNoEntry: false });
    if (!fsStats || !fsStats.isFile()) {
        console.error(`Could not find package.json for ${component}. Make sure the component exists and has a valid source code.`);
        return null;
    }
    return JSON.parse(fs.readFileSync(packageJSONPath));
}

/**
 * Will link a component in order to use its repo code instead its latest version in npm
 * @param {string} component
 * @param {string} folder
 * @returns {void}
 */
function linkSingleComponent(component, folder = COMPONENTS_PATH) {
    const packageJSON = getPackageJSON(component, folder);
    if (!packageJSON || !packageJSON.dependencies) return;

    let componentsDeps = '';
    const dependencies = Object.keys(packageJSON.dependencies);
    for (const dependency of dependencies) {
        if (!dependency.match(/(coherent)/g)) continue;
        componentsDeps += ` ${dependency}`;
    }

    safelyCreateLink(path.join(folder, component), component, componentsDeps.trim());
}

/**
 * Will do an npm link to a component folder
 * @param {string} cwd
 * @param {string} component
 * @param {string} packages
 */
function safelyCreateLink(cwd, component, packages = '') {
    const linked = packages || component;
    try {
        execSync(`npm link ${packages}`, { cwd: cwd, encoding: 'utf8', stdio: 'inherit' });
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
    linkSingleComponent: linkSingleComponent,
};
