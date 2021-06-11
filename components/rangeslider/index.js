if (process.env.NODE_ENV === 'production') {
    module.exports = require('./cjs/rangeslider.production.min.js');
} else {
    module.exports = require('./cjs/rangeslider.development.js');
}