module.exports = function (config) {
  config.set({
    failOnFailingTestSuite: true,
    frameworks: ['jasmine', 'chai', 'sinon'],
    client: {
      jasmine: {
        timeoutInterval: 30000,
        random: false
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
      { pattern: 'node_modules/coherent-gameface-*/**/*.css', included: true, type: 'css' },
      { pattern: 'node_modules/coherent-gameface-components/umd/*.development.js', served: true },
      { pattern: 'node_modules/coherent-gameface-*/umd/*.development.js', served: true },
      { pattern: 'node_modules/coherent-gameface-interaction-manager/dist/interaction-manager.js', served: true },
      { pattern: 'actions.js', served: true },
      { pattern: 'define-engine.js', served: true },
      { pattern: '../../../cohtml.js', served: true },
      { pattern: 'comprehensive-components-test/templates.js', served: true },
      'scrollable-container/*.js',
      'checkbox/*.js',
      'dropdown/*.js',
      'lib/*.js',
      'menu/*.js',
      'modal/*.js',
      'radial-menu/*.js',
      'router/*.js',
      'tabs/*.js',
      'progress-bar/*.js',
      'rangeslider/*.js',
      'automatic-grid/*.js',
      'radio-button/*.js',
      'switch/*.js',
      'stepper/*.js',
      // 'form-control/spec/*.js',
      'tooltip/*js',
      'text-field/*.js',
      'accordion-menu/*.js',
      'interaction-manager/**/*.js',
      'comprehensive-components-test/test.js'
    ],
    singleRun: true,
    retryLimit: 0,
    preprocessors: {
      'router/*.js': ['webpack'],
      'form-control/spec/*.js': ['webpack'],
      'node_modules/coherent-gameface-router/umd/*.development.js': ['webpack'],
      'dropdown/*.js': ['webpack'],
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
