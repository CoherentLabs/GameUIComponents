#!/usr/bin/env node

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

const yargs = require('yargs/yargs');
const create = require('./commands/create');
const build = require('./commands/build');
const buildDemo = require('./commands/build-demo');

const createProject = require('./commands/project/create');

yargs(process.argv.slice(2))
    .scriptName('coherent-guic-cli')
    .command(create)
    .command(build)
    .command(buildDemo)
    .command(createProject)
    .help()
    .argv;
