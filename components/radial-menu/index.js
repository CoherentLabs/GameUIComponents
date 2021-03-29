if (process.env.NODE_ENV === 'production') {
    module.exports = require('./cjs/radial-menu.production.min.js');
} else {
    module.exports = require('./cjs/radial-menu.development.js');
}
