const path = require('path');
const fs = require('fs');
const rimraf = require('rimraf');

const FOLDERS_TO_CLEAN = ['umd', 'cjs', 'dist', 'node_modules'];

/**
 * Remove all bundles and bundle folders in a directory starting from a root.
 * @param {string} dir - the root directory.
*/
function cleanBundles(dir) {
    const files = fs.readdirSync(dir);

    for (let file of files) {
        const filePath = path.join(dir, file);

        // ignore node_modules and .git
        if ((file === 'node_modules' && path.dirname(filePath) === process.cwd()) || file === '.git') continue;

        if (FOLDERS_TO_CLEAN.indexOf(file) > -1 || path.extname(file) === '.tgz') {
            rimraf.sync(filePath);
            continue;
        }

        // loop recursively
        if (fs.lstatSync(filePath).isDirectory()) {
            cleanBundles(filePath);
        }
    }
}

cleanBundles(path.join(__dirname, '../'));