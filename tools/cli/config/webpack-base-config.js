module.exports = (env) => {
    const environment = env === 'production' ? 'production' : 'development';

    return {
        mode: environment,
        devtool: environment === 'development' ? 'inline-source-map' : false,
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
