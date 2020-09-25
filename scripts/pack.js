const path = require('path');
const fs = require('fs');
const {exec} = require('child_process');

/**
 * Pack all npm modules starting from a root.
 * @param {Array<string>} - the files which to loop.
 * @param {string} dir - the root directory.
*/
function createPackage(files, dir) {
    for (let file of files) {
        // ignore node_modules and .git
        if(file ==='node_modules' || file ==='.git' || file === 'scripts') continue;

        const filePath = path.join(dir, file);

        if (file === 'package.json') {
            exec('npm pack', {
                cwd: path.dirname(filePath)
            });
            continue;
        }

        // loop recursively
        if(fs.lstatSync(filePath).isDirectory() ) {
            createPackage(fs.readdirSync(filePath), filePath);
        }
    }
}

function getDirectories (source) {
  return fs.readdirSync(source, { withFileTypes: true })
    // fs.readDirSync returns <fs.Dirent[]>
    // Dirent is a representation of a directory entry
    // see https://nodejs.org/api/fs.html#fs_class_fs_dirent
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
}

const rootDir = path.join(__dirname, '../');
createPackage(getDirectories(rootDir), rootDir);