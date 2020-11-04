const yargs = require('yargs/yargs');
const create = require('./commands/create');
const build = require('./commands/build');
const startDemo = require('./commands/start-demo');

yargs()
    .command(create)
    .command(build)
    .command(startDemo)
    .argv;