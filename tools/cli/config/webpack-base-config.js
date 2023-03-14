const path = require('path');
const pathToDemo = path.resolve(path.join(process.cwd(), 'demo'));

const webpackConfig = {
    mode: 'development',
    entry: path.join(process.cwd(), 'demo/demo.js'),
    devtool: false,
    resolve: {
        symlinks: true,
    },
    output: {
        path: pathToDemo,
        filename: 'bundle.js',
    },
};

module.exports = webpackConfig;
