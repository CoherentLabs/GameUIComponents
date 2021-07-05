if (process.env.NODE_ENV === 'production') {
    module.exports = require('./cjs/automatic-grid.production.min.js');
} else {
    module.exports = require('./cjs/automatic-grid.development.js');
}