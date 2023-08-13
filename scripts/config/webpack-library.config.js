const path = require('path');

module.exports = {
    output: {
        path: path.join(__dirname, '../../lib/dist/'),
        library: {
            type: 'umd',
            name: 'Components',
            export: 'Components',
        },
    },
};
