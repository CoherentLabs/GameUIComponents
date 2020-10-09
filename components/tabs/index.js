if (process.env.NODE_ENV === 'production') {
    module.exports = require('./cjs/tabs.production.min.js');
} else {
    module.exports = require('./cjs/tabs.development.js');
}