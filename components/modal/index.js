if (process.env.NODE_ENV === 'production') {
    module.exports = require('./cjs/modal.production.min.js');
} else {
    module.exports = require('./cjs/modal.development.js');
}