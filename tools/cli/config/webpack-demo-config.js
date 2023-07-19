const path = require('path');
const pathToDemo = path.resolve(path.join(process.cwd(), 'demo'));

module.exports = {
    mode: 'development',
    entry: path.join(pathToDemo, 'demo.js'),
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.html$/i,
                loader: 'html-loader',
            },
        ],
    },
    output: {
        path: pathToDemo,
        filename: 'bundle.js',
    },
};
