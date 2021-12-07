const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const DOC_FILES_DIRECTORY = path.join(__dirname, '../docs/static/components');
const DOC_FILES_CONTENT_DIRECTORY = path.join(__dirname, '../docs/content');
const DOC_FILES_COMPONENTS_DIRECTORY = path.join(__dirname, '../docs/content/components');
const DOC_FILES_CONTENT_EXAMPLES_DIRECTORY = path.join(__dirname, '../docs/content/examples');
const EXCLUDED_FILES = new Set(['coherent-gameface-components-theme.css', 'demo.html', 'node_modules']);

function toTwoDigits(value) {
    return value < 10 ? `0${value}` : value;
}

const frontMatterTemplate = (componentName) => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = toTwoDigits(now.getDate());
    const date = `${year}-${month}-${day}`;
    return `---
date: ${date}
title: "${componentName.charAt(0).toUpperCase() + componentName.slice(1)}"
draft: false
---`;
};

/**
 * Get all folder names within the components folder.
 * @returns {Array<string>}
*/
function getFolderDirectories(folder) {
    return fs.readdirSync(path.join(__dirname, folder));
}

/**
 * Copies all .css files within a folder and its nested folders
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
        if (EXCLUDED_FILES.has(file)) continue;
        const filePath = path.resolve(folder, file);

        if (fs.lstatSync(filePath).isDirectory()) copyAllStyleFiles(filePath, component);
        if(!file.match('.css')) continue;

        copyFile(
            filePath,
            path.join(DOC_FILES_DIRECTORY, component, file)
            );
    }
}

/**
 * If the component argument is omitted reads all components folders and calls the function
 * that transfers the documentation files. Logs an error if the passed component
 * does not exist.
 *
 * @param {string} [component=null]
*/
function transferBundleAndStyles(component = null) {
    let components = getFolderDirectories('../components');
    if (components.indexOf(component) === -1) {
        return console.error(`Component ${component} does not exist. Make sure the name you passed is correct.`)
    }

    if (!component) {
        saveMarkdownWithFrontMatter('_index', path.join(__dirname, '../README.md'), DOC_FILES_CONTENT_DIRECTORY);
        for (let component of components) {
            copyDocumentationFiles(component);
        }
        return;
    }

    if (components.indexOf(component) > -1) return copyDocumentationFiles(component);
    process.exitCode = 1;
    console.error(`Component ${component} does not exist. Please pass an existing name or omit the --component argument to transfer the documentation files of all components.`);
}

/**
 * Copies the markdown, css and html files from a component folder to its
 * respective destination folder in the documentation. Creates a new folder for
 * the component in the docs directory if it doesn't exit.
 *
 * @param {string} component - the name of the component
*/
function copyDocumentationFiles(component) {
    const componentPath = path.join(__dirname, '../components', component);
    const componentSourcePath = path.join(componentPath, '/demo/bundle.js');
    const componentDocsDestPath = path.join(DOC_FILES_DIRECTORY, component);

    if (!fs.existsSync(componentSourcePath)) return;
    if(!fs.existsSync(componentDocsDestPath)) fs.mkdirSync(componentDocsDestPath);

    copyAllStyleFiles(componentPath, component);

    copyFile(componentSourcePath, path.join(componentDocsDestPath, 'bundle.js'));

    saveMarkdownWithFrontMatter(component, path.join(componentPath, 'README.md'), DOC_FILES_COMPONENTS_DIRECTORY);
    saveMarkdownWithFrontMatter(component, path.join(DOC_FILES_CONTENT_EXAMPLES_DIRECTORY, `${component}.html`), DOC_FILES_CONTENT_EXAMPLES_DIRECTORY, 'html');
}

/**
 * Adds the front matter to the readme markdown file and saves it in the docs
 * folder.
 *
 * @param {string} component - the name of the current component.
 * @param {string} readmeFilePath - the absolute path to the readme file
*/
function saveMarkdownWithFrontMatter(component, readmeFilePath, targetDir, extension = 'md') {
    const frontMatter = frontMatterTemplate(component);
    let file = fs.readFileSync(readmeFilePath, {encoding: 'utf8'});
    const frontMatterRegExp = /(---\n)(.*)(\n---)/s;
    const currentFrontMatter = file.match(frontMatterRegExp);

    if(currentFrontMatter && currentFrontMatter.length) {
        file = file.replace(frontMatterRegExp, '');
    }
    fs.writeFileSync(path.join(targetDir, `${component}.${extension}`), `${frontMatter}\n\n${file}`);
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

    const componentIdx = args.indexOf('--component');
    if(componentIdx > -1) return transferBundleAndStyles(args[componentIdx + 1]);
    transferBundleAndStyles();
}

main();