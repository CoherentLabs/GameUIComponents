const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

/* eslint-disable max-lines-per-function */
module.exports = (env, argv) => {
    const isProd = env.production === true;

    const config = {
        stats: {
            children: true,
        },
        entry: path.resolve(__dirname, './index.js'),
        output: {
            path: path.resolve(__dirname, './dist'),
            filename: 'index_bundle.js',
        },
        mode: 'development',
        plugins: [new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './index.html'),
        }),
        new MiniCssExtractPlugin()],
        module: {
            rules: [
                {
                    test: /\.css$/i,
                    use: [MiniCssExtractPlugin.loader, 'css-loader'],
                },
                {
                    test: /\.html$/i,
                    loader: 'html-loader',
                },
                {
                    test: /\.(jpe?g|png|gif|svg|otf|ttf)$/i,
                    type: 'asset/resource',
                },
            ],
        },
    };

    if (!isProd) {
        config.devServer = {
            allowedHosts: 'all',
            static: path.join(__dirname, './*'),
            port: 9000,
            hot: false,
            liveReload: true,
        };
    }

    return config;
};
