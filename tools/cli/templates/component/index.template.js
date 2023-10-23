if (process.env.NODE_ENV === 'production') {
    module.exports = require('./dist/${this.componentName}.production.min.js');
} else {
    module.exports = require('./dist/${this.componentName}.development.js');
}
