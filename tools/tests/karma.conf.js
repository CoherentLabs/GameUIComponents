
module.exports = function (config) {
  config.set({
    failOnFailingTestSuite: false,
    frameworks: ['jasmine', 'chai'],
    client: {
      jasmine: {
        timeoutInterval: 30000,
      },
      clearContext: false,
    },
    reporters: ["spec"],
    specReporter: {
      maxLogLines: 5,             // limit number of lines logged per test
      suppressErrorSummary: true, // do not print error summary
      suppressFailed: false,      // do not print information about failed tests
      suppressPassed: false,      // do not print information about passed tests
      suppressSkipped: false,     // do not print information about skipped tests
      showSpecTiming: true,       // print the time elapsed for each spec
      failFast: false,            // test would finish with error when a first fail occurs
      prefixes: {
        success: '     [OK] ',      // override prefix for passed tests, default is '✓ '
        failure: ' [FAILED] ',      // override prefix for failed tests, default is '✗ '
        skipped: '[SKIPPED] '      // override prefix for skipped tests, default is '- '
      }
    },
    files: [
      { pattern: '**/**/*.css', included: true, type: 'css' },
      { pattern: 'lib/components.development.js', served: true },
      { pattern: 'actions.js', served: true },
      '**/scrollable-container/*.js',
      '**/checkbox/**.js',
      '**/dropdown/*.js',
      '**/lib/*.js',
      '**/menu/*.js',
      '**/modal/*.js',
      '**/radial-menu/*.js',
      '**/router/*.js',
      '**/tabs/*.js',
      '**/progress-bar/*.js',
      '**/rangeslider/*.js',
      '**/automatic-grid/*.js'
    ],
    singleRun: true,
    retryLimit: 0,
    preprocessors: {
      '**/router/*.js': ['webpack'],
    },
    webpack: {
      externals: {
        'coherent-gameface-components': 'components'
      },
      module: {
        rules: [
          {
            test: /\.js$/,
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
