if (process.env.NODE_ENV === 'production') {
    module.exports = require('./cjs/router.production.min.js');
} else {
    module.exports = require('./cjs/router.development.js');
}