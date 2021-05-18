
module.exports = function(config) {
  config.set({
    failOnFailingTestSuite : false,
    client: {
      mocha: {
        timeout: 10000,
      },
      // useIframe: false
      clearContext: true
    },
    frameworks: ['mocha', 'chai'],
    files: [
      {pattern: 'lib/components.development.js', served: true },
      {pattern: 'actions.js', served: true },
      // '**/**/*.js',
      // '**/checkbox/*.js',
      '**/dropdown/*.js',
      // '**/lib/*.js',
      '**/menu/*.js',
      // '**/modal/*.js',
      '**/radial-menu/*.js',
      // '**/router/*.js',
      '**/scrollable-container/*.js',
      // '**/tabs/*.js',
      {pattern: '**/**/*.css', included: true, type:'css' },
      '**/*.html',
    ],
    // singleRun: true,
    retryLimit: 2,
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
    // customContextFile: 'specRunner.html',
    customDebugFile: 'specRunner.html',
    logLevel: config.LOG_INFO,
    processKillTimeout: 20000,
    browserSocketTimeout: 20000,
  });
};