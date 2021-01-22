const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const DOC_FILES_DIRECTORY = path.join(__dirname, '../docs/static/components')

/**
 * Get all folder names within the components folder.
 * @returns {Array<string>}
*/
function getComponentDirectories() {
    return fs.readdirSync(path.join(__dirname, '../components'), { withFileTypes: false });
}

/**
 * Calls buildForTargets for all components and passes all environments
 * and formats as targets. Builds the components library first.
*/
function transfer() {
    let components = getComponentDirectories();

    for (let component of components) {
        const componentSourcePath = path.join(__dirname, '../components', component, '/demo/bundle.js');
        if (!fs.existsSync(componentSourcePath)) continue;

        const componentDocsDest = path.join(DOC_FILES_DIRECTORY, component, 'bundle.js');
        // File destination.txt will be created or overwritten by default.
        fs.copyFile(componentSourcePath, componentDocsDest, (err) => {
            if (err) throw err;
            console.log(`${componentSourcePath} was copied to ${componentDocsDest}`);
        });
    }
}


function main() {
    const arguments = process.argv.slice(2);

    if(arguments.indexOf('--rebuild') > -1) execSync(`npm run rebuild`);
    transfer();
}

main();