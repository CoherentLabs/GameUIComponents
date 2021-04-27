const fs = require('fs');
const path = require('path');
const { execSync, exec, spawn } = require('child_process');

const CWD = path.join(__dirname, '../GameUIComponents_Public');
const COMPONENTS_FOLDER = path.join(CWD, '/components');
const TESTS_FOLDER = path.join(CWD, '/tools/tests');

const components = fs.readdirSync(COMPONENTS_FOLDER, { withFileTypes: false });


function areComponentsPackaged() {
    const notBuildComponents = [];
    for (let component of components) {
        const componentFolder = path.join(COMPONENTS_FOLDER, component, 'umd');
        const componentTestFolder = path.join(TESTS_FOLDER, component);

        // if there is a test for this component but doesn't have umd package
        if (!fs.existsSync(componentTestFolder) || fs.existsSync(componentFolder)) continue;
        notBuildComponents.push(component);
    }
    if (!notBuildComponents.length) return true;
    console.error(`Missing packages for ${components.join(', ')}.
    Did you forget to build the components?
    Try running npm run test -- --rebuild to generate the component packages.`);

    return false;
}

function test(rebuild, cohtmlPath) {
    if (rebuild) execSync('npm run rebuild', { cwd: CWD, stdio: 'inherit' });
    if (!areComponentsPackaged()) return;

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

    const process = exec('npm run test', { cwd: CWD, encoding: 'utf8' });
    let cohtmlPlayer;

    process.stdout.on('data', (data) => {
        // karma is listening
        if (cohtmlPath && data.match('Karma v5.2.3 server started at http://localhost:9876/')) {
            // run gameface
            const playerPath = path.normalize(path.join(cohtmlPath, '/Player/Player.exe'));
            cohtmlPlayer = spawn(playerPath, ['--url=http://localhost:9876/debug.html'], {
                cwd: `${cohtmlPath}/Samples`
            });

            cohtmlPlayer.on('error', err => console.error(err))
            cohtmlPlayer.on('data', data => console.log(data))
        }
        console.log(data);
    });

    process.on('close', () => {
        if (cohtmlPlayer) cohtmlPlayer.kill();
    });
}

function main() {
    const arguments = process.argv.slice(2);
    const rebuild = (arguments.indexOf('--rebuild') > -1);
    const cohtmlPath = arguments.indexOf('--cohtml') > -1 ? arguments[arguments.indexOf('--cohtml') + 1] : '';

    test(rebuild, cohtmlPath);
}

main();