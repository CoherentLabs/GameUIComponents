if (process.env.NODE_ENV === 'production') {
    module.exports = require('./cjs/gameface-example-component.production.min.js');
} else {
    module.exports = require('./cjs/gameface-example-component.development.js');
}