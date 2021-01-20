if (process.env.NODE_ENV === 'production') {
    module.exports = require('./cjs/scrollable-container.production.min.js');
} else {
    module.exports = require('./cjs/scrollable-container.development.js');
}