if (process.env.NODE_ENV === 'production') {
    module.exports = require('./cjs/components.production.min.js');
} else {
    module.exports = require('./cjs/components.development.js');
}