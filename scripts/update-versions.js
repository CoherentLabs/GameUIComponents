/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

const path = require('path');
const fs = require('fs');
const { getComponentDirectories, getPublicVersion } = require('./utils');

const updatedPackages = {};

/**
 * Will return the difference between the new and the current version of dependency
 * For example if new version is 2.0.0 and current is 1.3.4 then it will return object
 * { update: 'major', versionUpdate: '2' }
 * @param {string} newVersion
 * @param {string} currentVersion
 * @returns {Object}
 */
function getVersionDiff(newVersion, currentVersion) {
    const [majorA, minorA, patchA] = newVersion.split('.');
    const [majorB, minorB, patchB] = currentVersion.split('.');

    if (majorA > majorB) return { update: 'major', versionUpdate: majorA };
    if (minorA > minorB) return { update: 'minor', versionUpdate: minorA };
    if (patchA > patchB) return { update: 'patch', versionUpdate: patchA };

    return {};
}

/**
 * Will return the new version of the dependency based on the update
 * @param {string} update
 * @param {string} currentFullVersion
 * @param {string} newVersionNumber
 * @returns {string}
 */
function getNewVersion(update, currentFullVersion, newVersionNumber) {
    const [major, minor] = currentFullVersion.split('.');

    switch (update) {
        case 'major': return `${newVersionNumber}.0.0`;
        case 'minor': return `${major}.${newVersionNumber}.0`;
        case 'patch': return `${major}.${minor}.${newVersionNumber}`;
    }

    return currentFullVersion;
}

/**
 * Will return the updated package version based on the dependencies update
 * @param {string} update - Either `major`, `minor` or `patch`
 * @param {string} currentFullVersion
 * @returns {string}
 */
function getUpdatedPackageVersion(update, currentFullVersion) {
    const [major, minor, patch] = currentFullVersion.split('.');

    switch (update) {
        case 'major': return `${parseInt(major) + 1}.0.0`;
        case 'minor': return `${major}.${parseInt(minor) + 1}.0`;
        case 'patch': return `${major}.${minor}.${parseInt(patch) + 1}`;
    }

    return currentFullVersion;
}

/**
 * Will update the dependencies of the module
 * @param {string} packageJSONPath
 * @returns {void}
 */
function updateDependencies(packageJSONPath, { moduleVersion, name }) {
    const packageJSON = JSON.parse(fs.readFileSync(packageJSONPath, { encoding: 'utf-8' }));
    const packageVersion = packageJSON.version;
    if (!packageJSON.dependencies || !packageJSON.dependencies[name]) return console.log(`Did not found '${name}' as dependency in '${packageJSON.name}'.`);

    const dependencyVersion = packageJSON.dependencies[name].replace('^', '');
    const { update, versionUpdate } = getVersionDiff(moduleVersion, dependencyVersion);
    // We should update the dependency just if it has major update!
    if (!update || update !== 'major') return;
    const newDependencyVersion = getNewVersion(update, dependencyVersion, versionUpdate);
    if (newDependencyVersion === dependencyVersion) return;

    console.log(`Updating '${name}' dependency for ${packageJSON.name} from ${dependencyVersion} to ${newDependencyVersion}`);
    packageJSON.dependencies[name] = `^${newDependencyVersion}`;
    // If major update has been done of some dependency then update the package major versions as well
    // because the backwards compatability will be broken
    // Also check if the package version has been updated already to prevent updating it twice.
    // When package is updated from 1.0.0 to 2.0.0 and then looping it for second time won't update it to 3.0.0
    if (!updatedPackages[packageJSON.name] && packageJSON.name !== 'components-tests') {
        packageJSON.version = getUpdatedPackageVersion(update, packageVersion);
        console.log(`Updating '${packageJSON.name}' version from ${packageVersion} to ${packageJSON.version}`);
        updatedPackages[packageJSON.name] = packageJSON.version;
    }

    fs.writeFileSync(packageJSONPath, JSON.stringify(packageJSON, null, 2) + '\n', { encoding: 'utf-8' });
}

/**
 * @param {Object} data
 * @param {string} data.moduleVersion
 * @param {string} data.name
*/
function updateVersionDependents(data) {
    const components = getComponentDirectories(['slider', 'scrollable-container', 'dropdown']);

    // Loop package.json-s of the components
    for (const component of components) {
        const componentPath = path.join(__dirname, '../components', component);
        updateDependencies(path.join(componentPath, 'package.json'), data);
    }

    // check if the package.json in the tests should be updated as well
    updateDependencies(path.join(__dirname, '../tools/tests/package.json'), data);
}

/** */
function updateComponentsDependencies() {
    const components = getComponentDirectories(['slider', 'scrollable-container', 'dropdown']);

    // Update dependents of the components
    for (const component of components) {
        const componentPath = path.join(__dirname, '../components', component);
        const { name, version } = JSON.parse(fs.readFileSync(path.join(componentPath, 'package.json'), { encoding: 'utf-8' }));
        const publicVersion = getPublicVersion(name);

        if (version === publicVersion) {
            console.log(`Package ${component} has no new version. Skipping it`);
            continue;
        }

        // If the component version has been changed cache this change
        if (!updatedPackages[name]) updatedPackages[name] = version;

        console.log(`Package ${component} has new version - ${version}, current is ${publicVersion}.`);
        console.log(`Updating all the ${component} dependents modules.`);
        updateVersionDependents({ moduleVersion: version, name: name });
    }

    // Update dependents of the components library
    const lib = path.join(__dirname, '../lib');
    const { version, name } = JSON.parse(fs.readFileSync(path.join(lib, 'package.json'), { encoding: 'utf-8' }));

    updateVersionDependents({ moduleVersion: version, name: name });
}


/** */
async function main() {
    updateComponentsDependencies();

    console.log('Updating versions finished!');
}

main();
