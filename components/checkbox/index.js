if (process.env.NODE_ENV === 'production') {
    module.exports = require('./cjs/checkbox.production.min.js');
} else {
    module.exports = require('./cjs/checkbox.development.js');
}