const path = require('path');
const fs = require('fs');
const COMPONENTS_PATH = path.join(__dirname, '../components');

function getPackageJSON(component, folder = COMPONENTS_PATH) {
    const packageJSONPath = path.join(folder, component, 'package.json');
    const fsStats = fs.lstatSync(packageJSONPath, {throwIfNoEntry: false});
    if (!fsStats || !fsStats.isFile()) {
        console.error(`Could not find package.json for ${component}. Make sure the component exists and has a valid source code.`);
        return null;
    }
    return JSON.parse(fs.readFileSync(packageJSONPath));
}

module.exports = {
    getPackageJSON: getPackageJSON
};