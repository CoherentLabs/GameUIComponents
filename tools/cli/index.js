#!/usr/bin/env node

const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const create = require('./commands/create');
const build = require('./commands/build');
const startDemo = require('./commands/start-demo');
const buildDemo = require('./commands/build-demo');

yargs(hideBin(process.argv))
    .scriptName("coherent-guic-cli")
    .command(create)
    .command(build)
    .command(startDemo)
    .command(buildDemo)
    .help()
    .argv