const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const { getPackageJSON } = require('./helpers');
const COMPONENTS_PATH = path.join(__dirname, '../components');
const LIBRARY_PATH = path.join(__dirname, '../');
const CLI_PATH = path.join(__dirname, '../tools')

function getPublicVersion(package) {
    return execSync(`npm view ${package} version`, {encoding: 'utf8'}).replace('\n', '');
}

function shouldUpdate(component, folder = COMPONENTS_PATH) {
    const packageJSON = getPackageJSON(component, folder);
    if (!packageJSON) return false;

    const name = packageJSON.name;

    // if a component doesn't exist in the registry then it must be published
    if (!JSON.parse(execSync(`npm search ${name} --json`, {encoding: 'utf8'})).length) return true;

    const localVersion = packageJSON.version;
    const publicVersion = getPublicVersion(name);

    if(localVersion !== publicVersion) {
        console.log(`Package ${component} has new version - ${localVersion}, current is ${publicVersion}.`);
        return true;
    }

    return false;
}

function publish(component, folder = COMPONENTS_PATH) {
    try {
        execSync(`npm publish`, {cwd: path.join(folder, component), encoding: 'utf8'});
        console.log(`Successfully published ${component}.`);
    } catch(err) {
        console.error(err);
    }
}

function main() {
    if (shouldUpdate('lib', LIBRARY_PATH)) publish('lib', LIBRARY_PATH);
    if (shouldUpdate('cli', CLI_PATH)) publish('cli', CLI_PATH);

    const components = fs.readdirSync(COMPONENTS_PATH);
    for (let component of components) {
        if(shouldUpdate(component)) publish(component);
    }
}

main();