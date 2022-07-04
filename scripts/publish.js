const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const { getPackageJSON } = require('./helpers');
const COMPONENTS_PATH = path.join(__dirname, '../components');
const LIBRARY_PATH = path.join(__dirname, '../');
const CLI_PATH = path.join(__dirname, '../tools');

/**
 * Gets the latest version of some npm package
 * @param {string} npmPackage - The npm package name
 * @returns {string}
 */
function getPublicVersion(npmPackage) {
    return execSync(`npm view ${npmPackage} version`, { encoding: 'utf8' }).replace('\n', '');
}

/**
 * Checks if some component should be updated in npm if its version is bumped
 * @param {string} component
 * @param {string} folder
 * @returns {boolean}
 */
function shouldUpdate(component, folder = COMPONENTS_PATH) {
    const packageJSON = getPackageJSON(component, folder);
    if (!packageJSON) return false;

    const name = packageJSON.name;

    // if a component doesn't exist in the registry then it must be published
    if (!JSON.parse(execSync(`npm search ${name} --json`, { encoding: 'utf8' })).length) return true;

    const localVersion = packageJSON.version;
    const publicVersion = getPublicVersion(name);

    if (localVersion !== publicVersion) {
        console.log(`Package ${component} has new version - ${localVersion}, current is ${publicVersion}.`);
        return true;
    }

    return false;
}

/**
 * Will publish component changes in npm
 * @param {string} component
 * @param {string} folder
 */
function publish(component, folder = COMPONENTS_PATH) {
    try {
        execSync(`npm publish`, { cwd: path.join(folder, component), encoding: 'utf8' });
        console.log(`Successfully published ${component}.`);
    } catch (err) {
        console.error(err);
    }
}

/** */
function main() {
    if (shouldUpdate('lib', LIBRARY_PATH)) publish('lib', LIBRARY_PATH);
    if (shouldUpdate('cli', CLI_PATH)) publish('cli', CLI_PATH);
    if (shouldUpdate('interaction-manager', LIBRARY_PATH )) publish('interaction-manager', LIBRARY_PATH);

    const components = fs.readdirSync(COMPONENTS_PATH);
    for (const component of components) {
        if (shouldUpdate(component)) publish(component);
    }
}

main();
