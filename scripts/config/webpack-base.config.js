/* eslint-disable max-lines-per-function */

module.exports = function (env) {
    const environment = env === 'production' ? 'production' : 'development';

    return {
        externals: {
            'coherent-gameface-components': 'components',
        },
        mode: environment,
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
    };
};
