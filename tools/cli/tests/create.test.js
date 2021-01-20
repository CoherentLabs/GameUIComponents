const execSync = require('child_process').execSync;
const path = require('path');
const { folderContainsFiles, folderToTree, filesHaveCorrectContent } = require('./test-helpers/utils');
const rimraf = require('rimraf');

const componentFolder = 'create-component-test-folder';
const componentName = 'test-name';
const generatedName = `gameface-${componentName}`;
const componentFolderPath = path.resolve(path.join(process.cwd(), componentFolder));
const componentSourcePath = path.join(componentFolderPath, generatedName);

const componentFiles = {
    'gameface-test-name': [
        'index.js',
        'package.json',
        'README.md',
        'script.js',
        'style.css',
        'template.html'
    ],
    'demo': ['demo.html', 'demo.js']
};

describe('create component test', () => {
    afterAll(() => {
        rimraf.sync(componentFolderPath);
    });

    test("Creates a component with given name at a given folder", () => {
        // create a component
        const result = execSync(`node index.js create ${componentName} ./${componentFolder}`, { encoding: 'utf8' });
        // Verify the output is correct
        expect(result).toMatch(`Created component ${generatedName} in C:\\GameUIComponents\\GameUIComponents\\tools\\cli\\create-component-test-folder\\${generatedName}.`);
    });

    test("Created the component files", () => {
        // Verify the output is correct
        const hasComponentFiles = folderContainsFiles(componentSourcePath, componentFiles[generatedName]);
        expect(hasComponentFiles).toBe(true);
    });

    test("Created the demo files", () => {
        // Check if the demo files were created
        const hasDemoFiles = folderContainsFiles(path.join(componentSourcePath, 'demo'), componentFiles['demo']);
        expect(hasDemoFiles).toBe(true)
    });

    test("Generates component source files with valid content", () => {
        // Check if the generated files have valid content
        const componentFilesTree = folderToTree(componentSourcePath);
        const isContentValid = filesHaveCorrectContent(componentSourcePath, componentFilesTree[generatedName]);

        expect(isContentValid).toBe(true);
    });

    test("Generates component demo files with valid content", () => {
        // Check if the generated demo files have valid content
        const componentFilesTree = folderToTree(componentSourcePath);
        const isContentValid = filesHaveCorrectContent(path.join(componentSourcePath, 'demo'), componentFilesTree['demo']);

        expect(isContentValid).toBe(true);
    });
});