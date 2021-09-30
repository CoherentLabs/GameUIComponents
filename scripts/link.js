const path = require('path');
const fs = require('fs');
const { execSync, exec } = require('child_process');

const COMPONENTS_PATH = path.join(__dirname, '../components');

function main() {
    const arguments = process.argv.slice(2);
    if (arguments.indexOf('--no-build') === -1) execSync('npm run rebuild', { cwd: path.join(__dirname, '../') });

    execSync('npm link', { cwd: path.join(__dirname, '../lib') });
    const components = fs.readdirSync(COMPONENTS_PATH);
    for (let component of components) {
        const links = execSync('npm ls -g --depth=0 --link=true', {encoding: 'utf8'});

        const packageJSONPath = path.join(COMPONENTS_PATH, component, 'package.json');
        if (!fs.lstatSync(packageJSONPath).isFile()) constinue;
        const packageJSON = JSON.parse(fs.readFileSync(packageJSONPath));
        if (links.match(`${packageJSON.name}`)) continue;
        execSync('npm link', { cwd: path.join(COMPONENTS_PATH, component) });
    }

    for (let component of components) {
        const packageJSONPath = path.join(COMPONENTS_PATH, component, 'package.json');
        if (!fs.lstatSync(packageJSONPath).isFile()) continue;

        const packageJSON = JSON.parse(fs.readFileSync(packageJSONPath));
        if (!packageJSON.dependencies) continue;

        let componentsDeps = '';
        for( let dependency of Object.keys(packageJSON.dependencies)) {
            if (!dependency.match(/(coherent)/g)) continue;
            componentsDeps += ` ${dependency}`;
        }

        execSync(`npm link ${componentsDeps}`, { cwd: path.join(COMPONENTS_PATH, component)});
    }
}

main();