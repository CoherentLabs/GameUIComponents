const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const { getPackageJSON } = require('./helpers');

const COMPONENTS_PATH = path.join(__dirname, '../components');

function main() {
    console.log('Removing links...')
    execSync('npm unlink -g', { cwd: path.join(__dirname, '../lib'), encoding: 'utf8' });
    const components = fs.readdirSync(COMPONENTS_PATH);

    const removedPackages = [];
    for (let component of components) {
        const packageJSON = getPackageJSON(component);

        if (!packageJSON) continue;
        const result = execSync('npm unlink -g', { cwd: path.join(COMPONENTS_PATH, component), encoding: 'utf8' });
        // The result from npm has to many new lines, remove the ones at the start and end of the string and
        // replace one that's in the middle with a comma
        console.log(`${result.replace(/^\n|\n$/g, '').replace(/\n/, ', ')}(${packageJSON.name})\n`);
        removedPackages.push(packageJSON.name);
    }

    console.log(`Unlinked ${removedPackages.length} packages:\n${removedPackages.join('\n')}`);
}

main();