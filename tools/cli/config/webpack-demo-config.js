const path = require('path');
const pathToDemo = path.resolve(path.join(process.cwd(), 'demo'));
const HtmlWebpackPlugin = require('html-webpack-plugin');
const PORT = 9000;

/* eslint-disable max-lines-per-function */
module.exports = (argv) => {
    const environment = argv.env?.prod ? 'production': 'development';

    const config = {
        mode: environment,
        devtool: environment === 'development' ? 'inline-source-map' : false,
        entry: path.join(process.cwd(), 'demo.js'),
        module: {
            rules: [
                {
                    test: /\.html$/i,
                    loader: 'html-loader',
                },
            ],
        },
        plugins: [
            new HtmlWebpackPlugin({
                inject: 'body',
                filename: 'demo.html',
                template: path.resolve(process.cwd(), 'index.html'),
            }),
        ],
        output: {
            path: pathToDemo,
            filename: 'bundle.js',
        },
    };

    if (argv.watch) {
        config.devServer = {
            static: {
                directory: path.join(pathToDemo),
            },
            open: `http://localhost:${PORT}/demo.html`,
            allowedHosts: 'all',
            port: PORT,
        };
    }

    return config;
};
