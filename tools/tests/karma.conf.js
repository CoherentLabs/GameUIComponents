
module.exports = function(config) {
  config.set({
        frameworks: ['jasmine'],

    files: [
      {pattern: 'lib/components.development.js', served: true },
      {pattern: 'actions.js', served: true },
      '**/**/*.js',
      '**/*.html',
    ],
    singleRun: true,
    retryLimit: 0,
    preprocessors: {
      '**/*.html': ['html2js'],
      '**/router/*.js': ['webpack'],
    },
    webpack: {
      externals: {
        'coherent-gameface-components' : 'components'
      },
      module: {
        rules: [
          {
            test:/\.js$/,
            loader: 'babel-loader',
            exclude: [/node_modules/, /helpers/],
          }
        ]
      },
      watch: true
    },
    webpackServer: {
      noInfo: true
    },
    browsers: [],
    exclude: [
      'node_modules/'
    ],
    customDebugFile: 'specRunner.html',
    logLevel: config.LOG_INFO
  });
};