const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const { getPackageJSON } = require('./helpers');

const COMPONENTS_PATH = path.join(__dirname, '../components');

function safelyCreateLink(cwd, component, packages = '') {
    const linked = packages || component;
    try {
        execSync(`npm link ${packages}`, { cwd: cwd, encoding: 'utf8'});
        if (packages) {
            console.log(`Linked dependencies - ${packages.replace(/\s/g, ', ')} for component ${component}.`);
        } else {
            console.log(`Created link for ${component}.`);
        }
    } catch (err) {
        console.error(`The following error ocurred while linking ${linked}: ${err}`);
    }
}

function main() {
    // link the components library
    safelyCreateLink(path.join(__dirname, '../lib'), 'coherent-gameface-components');
    const components = fs.readdirSync(COMPONENTS_PATH);

    // loop all components once to create links to the global node_modules.
    // This is needed because later we'll link a component's local dependencies
    // to the global node modules and we need to make sure all components already have links;
    // otherwise we would have to recursively go through all dependencies, which is slow
    // and error prone. NPM works like this, but we have an advantage in knowing the list
    // of all dependencies beforehand - everything in the /components folder and the /lib folder.
    for (let component of components) {
        const packageJSON = getPackageJSON(component);

        if (!packageJSON) continue;
        safelyCreateLink(path.join(COMPONENTS_PATH, component), component);
    }

    // loop all components to link their local dependencies to the global
    // dependencies that we linked in the previous loop.
    for (let component of components) {
        const packageJSON = getPackageJSON(component);
        if (!packageJSON || !packageJSON.dependencies) continue;

        let componentsDeps = '';
        const dependencies = Object.keys(packageJSON.dependencies);
        for(let dependency of dependencies) {
            if (!dependency.match(/(coherent)/g)) continue;
            componentsDeps += ` ${dependency}`;
        }

        safelyCreateLink(path.join(COMPONENTS_PATH, component), component, componentsDeps.trim())
    }
}

main();