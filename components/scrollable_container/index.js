if (process.env.NODE_ENV === 'production') {
    module.exports = require('./cjs/scrollable_container.production.min.js');
} else {
    module.exports = require('./cjs/scrollable_container.development.js');
}