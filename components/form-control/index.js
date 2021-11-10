if (process.env.NODE_ENV === 'production') {
    module.exports = require('./cjs/gameface-form-control.production.min.js');
} else {
    module.exports = require('./cjs/gameface-form-control.development.js');
}