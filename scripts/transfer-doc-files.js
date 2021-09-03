const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const DOC_FILES_DIRECTORY = path.join(__dirname, '../docs/static/components');
const DOC_FILES_CONTENT_DIRECTORY = path.join(__dirname, '../docs/content/components');

const frontMatterTemplate = (componentName) => {
    return `----
title: "${componentName.charAt(0).toUpperCase() + componentName.slice(1)}"
date: 2020-10-08T14:00:45Z
draft: false
----`;
};

/**
 * Get all folder names within the components folder.
 * @returns {Array<string>}
*/
function getFolderDirectories(folder) {
    return fs.readdirSync(path.join(__dirname, folder), { withFileTypes: false });
}

/**
 * Copies all .css files withing a folder and its nested folders
 * Same names are ignored, will be overwritten - this case is so
 * uncommon that it is easier to leave it for manual fix, instead of
 * doing it programmatically
 *
 * @param {string} folder - the current folder that will be searched for css files
 * @param {string} component - the name of the current component
*/
function copyAllStyleFiles(folder, component) {
    const folderFiles = fs.readdirSync(folder);

    for (let file of folderFiles) {
        if (file === 'components-theme.css' || file === 'demo') continue;
        const filePath = path.resolve(folder, file);

        if (fs.lstatSync(filePath).isDirectory()) copyAllStyleFiles(filePath, component);
        if(!file.match('.css')) continue;

        copyFile(
            path.join(folder, file),
            path.join(DOC_FILES_DIRECTORY, component, file)
            );
    }
}

/**
 * Reads all components folders and copies the bundle.js and README.ms files
 * into their respective folders in the documentation; Creates a new folder for
 * the component in the docs directory if it doesn't exit.
*/
function transferBundleAndStyles() {
    let components = getFolderDirectories('../components');

    for (let component of components) {
        const componentPath = path.join(__dirname, '../components', component);
        const componentSourcePath = path.join(componentPath, '/demo/bundle.js');
        const componentDocsDestPath = path.join(DOC_FILES_DIRECTORY, component);

        if (!fs.existsSync(componentSourcePath)) continue;
        if(!fs.existsSync(componentDocsDestPath)) fs.mkdirSync(componentDocsDestPath);

        copyAllStyleFiles(componentPath, component);

        copyFile(componentSourcePath, path.join(componentDocsDestPath, 'bundle.js'));

        saveMarkdownWithFrontMatter(component, path.join(componentPath, 'README.md'));
    }
}

/**
 * Adds the front matter to the readme markdown file and saves it in the docs
 * folder.
 *
 * @param {string} component - the name of the current component.
 * @param {string} readmeFilePath - the absolute path to the readme file
*/
function saveMarkdownWithFrontMatter(component, readmeFilePath) {
    const frontMatter = frontMatterTemplate(component);
    const file = fs.readFileSync(readmeFilePath, {encoding: 'utf8'});

    fs.writeFileSync(path.join(DOC_FILES_CONTENT_DIRECTORY, `${component}.md`), `${frontMatter}\n\n${file}`);
}

/**
 * Wrapper around the fs.copyFile method. Copies a file, but also logs an error if there is any.
 *
 * @param {string} source - the path of the source file
 * @param {string} dest - the path of the destination file
*/
function copyFile(source, dest) {
    fs.copyFile(source, dest, (err) => {
        if (err) throw err;
        console.log(`${source} was copied to ${dest}`);
    });
}

function main() {
    const args = process.argv.slice(2);

    if(args.indexOf('--rebuild') > -1) execSync(`npm run rebuild`);
    transferBundleAndStyles();
}

main();