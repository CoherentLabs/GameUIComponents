const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const DOC_FILES_DIRECTORY = path.join(__dirname, '../docs/static/components');
const DOC_FILES_CONTENT_DIRECTORY = path.join(__dirname, '../docs/content/en');
const DOC_FILES_COMPONENTS_DIRECTORY = path.join(__dirname, '../docs/content/en/components');
const DOC_FILES_CONTENT_EXAMPLES_DIRECTORY = path.join(__dirname, '../docs/content/en/examples');
const EXCLUDED_FILES = new Set(['coherent-gameface-components-theme.css', 'demo.html', 'node_modules']);
const IGNORED_EXAMPLES = new Set(['form-control']);
const PARAMS_FILE_DIRECTORY = path.join(__dirname, '../docs/config/_default/params.toml');
const PACKAGE_FILE_DIRECTORY = path.join(__dirname, '../package.json');
const docsVersionRegExp = /docsVersion = "([0-9]|\.)+"/;

const packageFile = require(PACKAGE_FILE_DIRECTORY);
/**
 * @param {number} value
 * @returns {string}
 */
function toTwoDigits(value) {
    return value < 10 ? `0${value}` : value;
}

/**
 * Gets the font matter template
 * @param {string} componentName
 * @returns {string}
 */
function frontMatterTemplate(componentName) {
    const title = componentName === '_index' ?
        'Components for Game User Interface' :
        (componentName.charAt(0).toUpperCase() + componentName.slice(1)).replace(/-/g, ' ');
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = toTwoDigits(now.getDate());
    const date = `${year}-${month}-${day}`;
    return `---
date: ${date}
title: ${title}
draft: false
---`;
}

/**
 * Get all folder names within the components folder.
 * @param {string} folder
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

    for (const file of folderFiles) {
        if (EXCLUDED_FILES.has(file)) continue;
        const filePath = path.resolve(folder, file);

        if (fs.lstatSync(filePath).isDirectory()) copyAllStyleFiles(filePath, component);
        if (!file.match('.css')) continue;

        copyFile(
            filePath,
            path.join(DOC_FILES_DIRECTORY, component, file)
        );
    }
}

/**
 * Transfers a all the components documentation, styles and bundle to the documentation
 * @param {string[]} components
 */
function transferAllComponents(components) {
    console.log('Transfering README.md...');
    saveMarkdownWithFrontMatter('_index', path.join(__dirname, '../README.md'), DOC_FILES_CONTENT_DIRECTORY);
    for (const component of components) {
        copyDocumentationFiles(component);
    }
}

/**
 * Transfers a single component documentation, styles and bundle to the documentation
 * @param {string} component
 * @param {string[]} components
 * @returns {void}
 */
function transferSingleComponent(component, components) {
    if (components.indexOf(component) === -1) {
        return console.error(`Component ${component} does not exist. Make sure the name you passed is correct.`);
    }

    if (components.indexOf(component) > -1) return copyDocumentationFiles(component);
    process.exitCode = 1;
    console.error(`Component ${component} does not exist. Please pass an existing name or omit the --component argument to transfer the documentation files of all components.`);
}

/**
 * If the component argument is omitted reads all components folders and calls the function
 * that transfers the documentation files. Logs an error if the passed component
 * does not exist.
 *
 * @param {string} [component=null]
 * @returns {void}
*/
function transferBundleAndStyles(component = null) {
    const components = getFolderDirectories('../components');
    if (!component) return transferAllComponents(components);

    return transferSingleComponent(component, components);
}

/**
 * Copies the markdown, css and html files from a component folder to its
 * respective destination folder in the documentation. Creates a new folder for
 * the component in the docs directory if it doesn't exit.
 *
 * @param {string} component - the name of the component
*/
function copyDocumentationFiles(component) {
    console.log(`Transfering ${component}...`);
    const componentPath = path.join(__dirname, '../components', component);
    const componentSourcePath = path.join(componentPath, '/demo/bundle.js');
    const componentDocsDestPath = path.join(DOC_FILES_DIRECTORY, component);

    if (!fs.existsSync(componentSourcePath)) return;
    if (!fs.existsSync(componentDocsDestPath)) fs.mkdirSync(componentDocsDestPath);

    if (!IGNORED_EXAMPLES.has(component)) {
        copyAllStyleFiles(componentPath, component);

        copyFile(componentSourcePath, path.join(componentDocsDestPath, 'bundle.js'));

        saveMarkdownWithFrontMatter(component, path.join(DOC_FILES_CONTENT_EXAMPLES_DIRECTORY, `${component}.html`), DOC_FILES_CONTENT_EXAMPLES_DIRECTORY, 'html');
    }

    saveMarkdownWithFrontMatter(component, path.join(componentPath, 'README.md'), DOC_FILES_COMPONENTS_DIRECTORY);
}

/**
 * Removes the README.md file content between <!-- HEADER-START --> and <!-- HEADER-END -->
 * @param {string} fileContent
 * @returns {string}
 */
function removeIndexFileHeader(fileContent) {
    const headerRegExp = /(<!-- HEADER-START -->)(.*)(<!-- HEADER-END -->)/s;
    const currentHeaderContent = fileContent.match(headerRegExp);
    const hasHeaderContent = currentHeaderContent && currentHeaderContent.length;

    if (hasHeaderContent) return fileContent.replace(headerRegExp, '');

    return fileContent;
}

/**
 * Will replace the front matter if it exists. Will append new one if none exists
 * @param {string} component
 * @param {string} file
 * @returns {string}
 */
function replaceFrontMatter(component, file) {
    const frontMatter = frontMatterTemplate(component);
    const frontMatterRegExp = /(---(\n|\r\n))(.*)((\r\n|\n)---)/s;
    const currentFrontMatter = file.match(frontMatterRegExp);
    const hasFrontMatter = currentFrontMatter && currentFrontMatter.length;

    if (hasFrontMatter) return file.replace(frontMatterRegExp, frontMatter);

    return `${frontMatter}\n\n${file}`;
}

/**
 * Adds the front matter to the readme markdown file and saves it in the docs
 * folder.
 *
 * @param {string} component - the name of the current component.
 * @param {string} readmeFilePath - the absolute path to the readme file
 * @param {string} targetDir
 * @param {string} [extension='md']
*/
function saveMarkdownWithFrontMatter(component, readmeFilePath, targetDir, extension = 'md') {
    let file = fs.readFileSync(readmeFilePath, { encoding: 'utf8' });

    file = replaceFrontMatter(component, file);

    if (component === '_index') file = removeIndexFileHeader(file);

    fs.writeFileSync(path.join(targetDir, `${component}.${extension}`), `${file}`);
}

/**
 * Wrapper around the fs.copyFile method. Copies a file, but also logs an error if there is any.
 *
 * @param {string} source - the path of the source file
 * @param {string} dest - the path of the destination file
*/
function copyFile(source, dest) {
    try {
        fs.copyFileSync(source, dest);
        console.log(`${source} was copied to ${dest}`);
    } catch (error) {
        throw new Error(error);
    }
}

/**
 * Updates the docsVersion field in docs/config/_default/params.toml file.
 * Gets the GameUIComponents version from the package.json and syncs it with
 * the toml file.
*/
function updateDocVersion() {
    const paramsToml = fs.readFileSync(PARAMS_FILE_DIRECTORY, { encoding: 'utf8' });

    const version = packageFile.version;
    // always update without checking id the current version is the same to avoid
    // additional regexp matches that could not match correctly
    const updated = paramsToml.replace(docsVersionRegExp, `docsVersion = "${version}"`);

    fs.writeFileSync(PARAMS_FILE_DIRECTORY, updated);
    console.log(`Updated docs version to ${version}`);
}


/**
 * @returns {void}
 */
function main() {
    const args = process.argv.slice(2);
    const componentIdx = args.indexOf('--component');
    let component = null;
    if (componentIdx > -1) component = args[componentIdx + 1];

    if (args.indexOf('--rebuild') > -1) execSync(`npm run build:dev`, { stdio: 'inherit' });
    transferBundleAndStyles(component);
    updateDocVersion();
}

try {
    main();
} catch (error) {
    console.error(`The following error occured: ${error}`);
}
