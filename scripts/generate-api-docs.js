const fs = require('fs');
const { resolve } = require('path');
const jsDocToMarkdown = require('jsdoc-to-markdown');

const COMPONENTS_DIR = resolve(__dirname, '../lib/');
const COMPONENTS_FILE_PATH = resolve(COMPONENTS_DIR, 'components.js');

/**
 * Generate markdown documentation from jsDoc comments
 * @param {string} componentPath - the path to the file
 */
function generateDocsForComponent(componentPath = COMPONENTS_FILE_PATH) {
    jsDocToMarkdown.render({ files: [componentPath] }).then((md) => {
        fs.writeFileSync(resolve(COMPONENTS_DIR, 'api.md'), md);
    }).catch((error) => {
        console.error(`Failed to generate API docs for ${componentPath}, the following error ocurred: ${error}`);
    });
}

generateDocsForComponent();
