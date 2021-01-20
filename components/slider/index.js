if (process.env.NODE_ENV === 'production') {
    module.exports = require('./cjs/slider.production.min.js');
} else {
    module.exports = require('./cjs/slider.development.js');
}