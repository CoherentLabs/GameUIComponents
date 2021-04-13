const fs = require('fs');
const path = require('path');
const { execSync, exec } = require('child_process');

const CWD = path.join(__dirname, '../GameUIComponents_Public');
const COMPONENTS_FOLDER = path.join(CWD, '/components');
const TESTS_FOLDER = path.join(CWD, '/tools/tests');
const components = fs.readdirSync(COMPONENTS_FOLDER, { withFileTypes: false });

function areComponentsPackaged() {
    const notBuildComponents = [];
    for(let i = 0; i < components.length; i++) {
        const componentFolder = path.join(COMPONENTS_FOLDER, components[i], 'umd');
        const componentTestFolder = path.join(TESTS_FOLDER, components[i]);

        // if there is a test for this component but doesn't have umd package
        if (!fs.existsSync(componentTestFolder) || fs.existsSync(componentFolder)) continue;
        notBuildComponents.push(components[i]);
    }
    if (!notBuildComponents.length) return true;
    console.error(`Missing packages for ${components.join(', ')}.
    Did you forget to build the components?
    Try running npm run test -- --rebuild to generate the component packages.`);

    return false;
}

function test(rebuild) {
    if (rebuild) execSync('npm run rebuild', { cwd: CWD, stdio: 'inherit' });
    if(!areComponentsPackaged()) return;

    fs.copyFileSync(
        path.join(CWD, '/lib/umd/components.development.js'),
        path.join(TESTS_FOLDER, '/lib/components.development.js')
    );

    components.forEach(component => {
        if (!fs.existsSync(path.join(TESTS_FOLDER, component))) return;

        const componentPackageName = `${component}.development.js`;

        fs.copyFileSync(
            path.join(COMPONENTS_FOLDER, component, 'umd', componentPackageName),
            path.join(TESTS_FOLDER, component, componentPackageName));
    });

    const process = exec('npm run test', { cwd: CWD });

    process.stdout.on('data', function (data) {
        console.log(data.toString());
    });
}

function main() {
    const arguments = process.argv.slice(2);
    const rebuild = (arguments.indexOf('--rebuild') > -1);
    test(rebuild);
}

main();