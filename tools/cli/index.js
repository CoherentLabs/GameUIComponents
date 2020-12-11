#!/usr/bin/env node

const yargs = require('yargs/yargs');
const create = require('./commands/create');
const build = require('./commands/build');
const startDemo = require('./commands/start-demo');
const buildDemo = require('./commands/build-demo');

yargs(process.argv.slice(2))
    .scriptName("coherent-guic-cli")
    .command(create)
    .command(build)
    .command(startDemo)
    .command(buildDemo)
    .help()
    .argv