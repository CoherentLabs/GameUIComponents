if (process.env.NODE_ENV === 'production') {
    module.exports = require('./dist/color-picker.production.min.js');
} else {
    module.exports = require('./dist/color-picker.development.js');
}
