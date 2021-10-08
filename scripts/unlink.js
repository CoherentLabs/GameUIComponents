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
    console.log('Removing links...')
    // unlink the components library
    execSync('npm unlink -g', { cwd: path.join(__dirname, '../lib'), encoding: 'utf8' });
    const components = fs.readdirSync(COMPONENTS_PATH);

    const removedPackages = [];
    for (let component of components) {
        const links = execSync('npm ls -g --depth=0 --link=true', { encoding: 'utf8' });
        const packageJSON = getPackageJSON(component);

        if (!packageJSON) continue;
        if (!links.match(`${packageJSON.name}`)) continue;

        const result = execSync('npm unlink -g', { cwd: path.join(COMPONENTS_PATH, component), encoding: 'utf8' });
        // The result from npm has to many new lines, remove the ones at the start and end of the string and
        // replace one that's in the middle with a comma
        console.log(`${result.replace(/^\n|\n$/g, '').replace(/\n/, ', ')}(${packageJSON.name})\n`);
        removedPackages.push(packageJSON.name);
    }

    console.log(`Unlinked ${removedPackages.length} packages:\n${removedPackages.join('\n')}`);
}

main();