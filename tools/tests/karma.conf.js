module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],

    files: [
      {pattern: 'lib/components.development.js', served: true },
      {pattern: 'actions.js', served: true },
      '**/**/*.js',
      '**/*.html',
    ],
    preprocessors: {
      '**/*.html': ['html2js']
    },
    browsers: [],
    exclude: [
      'node_modules/'
    ],
    customDebugFile: 'specRunner.html',
    logLevel: config.LOG_INFO
  });
};