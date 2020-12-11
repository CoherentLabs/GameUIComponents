const yargs = require('yargs/yargs');
const path = require('path');
const fs = require('fs');
const Webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const { start } = require('repl');

const PORT = 3000;

function startDemo() {
    const pathToDemo = path.resolve(path.join(process.cwd(), 'demo'));

    const compiler = Webpack({
        mode: 'development',
        devtool: false,
        entry: path.join(pathToDemo, 'demo.js'),
        output: {
            path: pathToDemo,
            filename: "bundle.js"
        },
    });

    const server = new WebpackDevServer(compiler, {
        contentBase: path.join(pathToDemo),
        publicPath: `http://localhost:${PORT}/`,
        watchContentBase: true,
        port: PORT,
        hot: true,
        disableHostCheck: true,
        watchOptions: {
            poll: 500
        }
    });


    server.listen(PORT, '127.0.0.1', () => {
        console.log(`Starting server on http://localhost:${PORT}`);
    });
}

exports.command = 'start:demo';
exports.desc = 'Start a development server and host the demo.';
exports.handler = startDemo;