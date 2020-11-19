module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],

    files: [
      {pattern: 'lib/components.development.js', served:true },
      '**/*.js',
      '**/*.html',
    ],

    preprocessors: {
      '**/*.html': ['html2js']
    },

    browsers: ['Chrome'],
    exclude: [
      'node_modules/'
    ],
  });
};