if (process.env.NODE_ENV === 'production') {
    module.exports = require('./cjs/gameface-menu.production.min.js');
} else {
    module.exports = require('./cjs/gameface-menu.development.js');
}