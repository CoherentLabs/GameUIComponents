module.exports = {
    entry: __dirname,
    optimization: {
        minimize: false,
    },
    devServer: {
        static: __dirname,
        compress: true,
        port: 8080,
    },
};
