if (process.env.NODE_ENV === 'production') {
    module.exports = require('./cjs/gameface-dropdown.production.min.js');
} else {
    module.exports = require('./cjs/gameface-dropdown.development.js');
}