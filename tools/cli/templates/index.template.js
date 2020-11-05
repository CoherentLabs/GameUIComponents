if (process.env.NODE_ENV === 'production') {
    module.exports = require('./cjs/${this.componentName}.production.min.js');
} else {
    module.exports = require('./cjs/${this.componentName}.development.js');
}