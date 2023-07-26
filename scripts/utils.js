const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

/**
 * Get all folder names within the components folder.
 * @param {Array<string>} order
 * @returns {Array<string>}
*/
function getComponentDirectories(order = []) {
    let components = fs.readdirSync(path.join(__dirname, '../components'));
    if (!order.length) return components;

    // get only the elements that are not included in the ordered list
    components = components.filter(el => !order.includes(el));
    // add the ['scrollable-container', 'dropdown'] in the order they should be build
    return [...components, ...order];
}

/**
 * Gets the latest version of some npm package
 * @param {string} npmPackage - The npm package name
 * @returns {string}
 */
function getPublicVersion(npmPackage) {
    return execSync(`npm view ${npmPackage} version`, { encoding: 'utf8' }).replace('\n', '');
}

module.exports = {
    getComponentDirectories,
    getPublicVersion,
};
