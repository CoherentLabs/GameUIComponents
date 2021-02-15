if (process.env.NODE_ENV === 'production') {
    module.exports = require('./cjs/gameface-router.production.min.js');
} else {
    module.exports = require('./cjs/gameface-router.development.js');
}