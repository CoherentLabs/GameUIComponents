const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const { getPackageJSON } = require('./helpers');
const COMPONENTS_PATH = path.join(__dirname, '../components');

function getPublicVersion(package) {
    return execSync(`npm view ${package} version`, {encoding: 'utf8'}).replace('\n', '');
}

function shouldUpdate(component) {
    const packageJSON = getPackageJSON(component);
    if (!packageJSON) return false;

    const name = packageJSON.name;

    // if a component doesn't exist in the registry then it must be published
    if (!execSync(`npm search ${name} --json`).length) return true;

    const localVersion = packageJSON.version;
    const publicVersion = getPublicVersion(name);

    if(localVersion !== publicVersion) {
        console.log(`Component ${component} has new version - ${localVersion}, current is ${publicVersion}.`);
        return true;
    }

    return false;
}

function main() {
    const components = fs.readdirSync(COMPONENTS_PATH);
    for (let component of components) {
        if(shouldUpdate(component)) {
            try {
                execSync(`npm publish`, {cwd: path.join(COMPONENTS_PATH, component), encoding: 'utf8'});
                console.log(`Successfully published ${component}.`);
            } catch(err) {
                console.error(err);
            }
        }
    }
}

main();