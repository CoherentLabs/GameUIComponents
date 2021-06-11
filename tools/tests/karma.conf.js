
module.exports = function(config) {
  config.set({
    failOnFailingTestSuite : true,
    frameworks: ['jasmine', 'chai'],
    client: {
      jasmine: {
        timeoutInterval: 30000,
      },
      clearContext: false,
    },
    files: [
      {pattern: '**/**/*.css', included: true, type:'css' },
      {pattern: 'lib/components.development.js', served: true },
      {pattern: 'actions.js', served: true },
      '**/scrollable-container/*.js',
      '**/checkbox/**.js',
      '**/dropdown/*.js',
      '**/lib/*.js',
      '**/menu/*.js',
      '**/modal/*.js',
      '**/radial-menu/*.js',
      '**/router/*.js',
      '**/tabs/*.js',
    ],
    singleRun: true,
    retryLimit: 0,
    preprocessors: {
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
    logLevel: config.LOG_INFO,
    processKillTimeout: 20000,
    browserSocketTimeout: 20000,
  });
};