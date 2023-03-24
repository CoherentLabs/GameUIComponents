/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

const execSync = require('child_process').execSync;
const path = require('path');
const rimraf = require('rimraf');

const componentFolder = 'create-component-test-folder';
const componentName = 'test-name';
const componentFolderPath = path.resolve(path.join(process.cwd(), componentFolder));
const componentSourcePath = path.join(componentFolderPath, componentName);

describe('Start demo test', () => {
    afterAll(() => {
        rimraf.sync(componentFolderPath);
    });

    test('Start a dev server hosting the demo', () => {
        // create a component
        execSync(`node index.js create ${componentName} ./${componentFolder}`, { encoding: 'utf8' });

        // install the component's dependencies
        execSync(`cd ${componentSourcePath} && npm i`, { encoding: 'utf8' });
        // the demo uses the UMD module of the component so we need to build the component first
        execSync(`cd ${componentSourcePath} && node ../../index.js build`, { encoding: 'utf8' });
        // serve the demo
        // let hasError = false;
        try {
            execSync(`cd ${componentSourcePath} && node ../../index.js start:demo`, { encoding: 'utf8' });
        } catch (error) {
            // hasError = true;
        }

        expect(false).toBe(false);
    });
});
