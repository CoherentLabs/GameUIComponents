const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const path = require('path');
const fs = require('fs');
const Webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

/**
 * Calls buildForTargets for all components and passes all environments
 * and formats as targets. Builds the components library first.
*/
function startDemo() {
        const pathToDemo = path.resolve(path.join(process.cwd(), 'demo'));

        const compiler = Webpack({
            mode: 'development',
            entry: path.join(pathToDemo, 'demo.js'),
            output: {
                path: pathToDemo,
                filename: "bundle.js"
            }
        });

        const server = new WebpackDevServer(compiler, {
            contentBase: path.join(pathToDemo),
            port: 3000,
            hot: true,
            lazy: false,
            watchOptions: {
                poll: 500
            }
        });


        server.listen(3000, '127.0.0.1', () => {
            console.log('Starting server on http://localhost:8080');
        });
}


module.exports = yargs(hideBin(process.argv))
    .command('start:demo', 'start the server', (yargs) => {
    }, (argv) => {
        startDemo()
    })
    .option('verbose', {
        alias: 'v',
        type: 'boolean',
        description: 'Run with verbose logging'
    })
    .argv