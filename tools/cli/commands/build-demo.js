const yargs = require('yargs/yargs');
const path = require('path');
const Webpack = require('webpack');

/**
 * Builds the demo of the component.
*/
function buildDemo() {
    const pathToDemo = path.resolve(path.join(process.cwd(), 'demo'));

    Webpack({
        mode: 'production',
        entry: path.join(pathToDemo, 'demo.js'),
        output: {
            path: pathToDemo,
            filename: "bundle.js"
        }
    }, (err, stats) => { // Stats Object
        if (err || stats.hasErrors()) {
            console.error(err);
        }
    });
}

exports.command = 'build:demo';
exports.desc = 'Create a production bundle of the demo.';
exports.handler = buildDemo;