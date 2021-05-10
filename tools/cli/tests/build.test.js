/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

const execSync = require('child_process').execSync;
const path = require('path');
const fs = require('fs');
const { folderContainsFiles } = require('./test-helpers/utils');
const rimraf = require('rimraf');

const componentFolder = 'create-component-test-folder';
const componentName = 'test-name';
const generatedName = `gameface-${componentName}`;
const componentFolderPath = path.resolve(path.join(process.cwd(), componentFolder));
const componentSourcePath = path.join(componentFolderPath, generatedName);
const componentsPackagePath = path.join(process.cwd(), 'tests', 'test-helpers', 'coherent-gameface-components-1.0.0.tgz');

describe('build component test', () => {
    afterAll(() => {
        rimraf.sync(componentFolderPath);
    });

    test("Builds a component CJS and UMD modules from source", () => {
        // create a component
        execSync(`node index.js create ${componentName} ./${componentFolder}`, { encoding: 'utf8' });

        // move the components library package to the components folder
        // this is needed only until we publish the components library to the
        // npm registry
        fs.copyFileSync(componentsPackagePath, path.join(componentSourcePath, 'coherent-gameface-components-1.0.0.tgz'));

        // install the component's dependencies
        execSync(`cd ${componentSourcePath} && npm i`, { encoding: 'utf8' });
        // build the component's umd and cjs bundles
        execSync(`cd ${componentSourcePath} && node ../../index.js build`, { encoding: 'utf8' });
        // check inf the bundle folders were created
        const hasBundles = folderContainsFiles(componentSourcePath, ['umd', 'cjs']);
        expect(hasBundles).toBe(true);
    });

    test('Has UMD files', () => {
        // check if the UMD JavaScript bundles were created
        const hasUMDBundles = folderContainsFiles(
            path.join(componentSourcePath, 'umd'),
            [`${generatedName}.development.js`, `${generatedName}.production.min.js`]);

        expect(hasUMDBundles).toBe(true);
    });

    test('Has CJS files', () => {
        // check if the CJS JavaScript bundles were created
        const hasUMDBundles = folderContainsFiles(
            path.join(componentSourcePath, 'cjs'),
            [`${generatedName}.development.js`, `${generatedName}.production.min.js`]);

        expect(hasUMDBundles).toBe(true);
    });
});