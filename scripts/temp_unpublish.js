const path = require('path');
const { execSync } = require('child_process');
const COMPONENTS_PATH = path.join(__dirname, '../components');

function main() {
    execSync(`npm unpublish test-temp-component -f`, {encoding: 'utf8'});
}

main();