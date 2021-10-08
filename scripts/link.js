const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const COMPONENTS_PATH = path.join(__dirname, '../components');

function getPackageJSON(component) {
    const packageJSONPath = path.join(COMPONENTS_PATH, component, 'package.json');
    if (!fs.lstatSync(packageJSONPath).isFile()) return null;
    return JSON.parse(fs.readFileSync(packageJSONPath));
}

function main() {
    // link the components library
    execSync('npm link', { cwd: path.join(__dirname, '../lib'), encoding: 'utf8' });
    const components = fs.readdirSync(COMPONENTS_PATH);

    // loop all components once to create links to the global node_modules.
    // This is needed because later we'll link a component's local dependencies
    // to the global node modules and we need to make sure all components already have links;
    // otherwise we would have to recursively go through all dependencies, which is slow
    // and error prone. NPM works like this, but we have an advantage in knowing the list
    // of all dependencies beforehand - everything in the /components folder and the /lib folder.
    for (let component of components) {
        const links = execSync('npm ls -g --depth=0 --link=true', {encoding: 'utf8'});
        const packageJSON = getPackageJSON(component);

        if (!packageJSON) continue;
        if (links.match(`${packageJSON.name}`)) continue;

        execSync('npm link', { cwd: path.join(COMPONENTS_PATH, component), encoding: 'utf8' });
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

        execSync(`npm link ${componentsDeps}`, { cwd: path.join(COMPONENTS_PATH, component), encoding: 'utf8'});
    }
}

main();