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
const componentFolderPath = path.resolve(path.join(process.cwd(), componentFolder));
const componentSourcePath = path.join(componentFolderPath, componentName);
const componentsPackagePath = path.join(process.cwd(), 'tests', 'test-helpers', 'coherent-gameface-components-1.0.0.tgz');

describe('Build demo test', () => {
    afterAll(() => {
        rimraf.sync(componentFolderPath);
    });

    test("Builds a demo bundle from source", () => {
        // create a component
        execSync(`node index.js create ${componentName} ./${componentFolder}`, { encoding: 'utf8' });

        // move the components library package to the components folder
        // this is needed until we publish the components library to the
        // npm registry
        fs.copyFileSync(componentsPackagePath, path.join(componentSourcePath, 'coherent-gameface-components-1.0.0.tgz'));

        // install the component's dependencies
        execSync(`cd ${componentSourcePath} && npm i`, { encoding: 'utf8' });
        // the demo uses the UMD module of the component so we need to build the component first
        execSync(`cd ${componentSourcePath} && node ../../index.js build`, { encoding: 'utf8' });
        // build the demo
        execSync(`cd ${componentSourcePath} && node ../../index.js build:demo`, { encoding: 'utf8' });
        // check if the demo folder contains the demo JavaScript bundle
        const hasDemoBundle = folderContainsFiles(path.join(componentSourcePath, 'demo'), ['bundle.js']);
        expect(hasDemoBundle).toBe(true);
    });
});