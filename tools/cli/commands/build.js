/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
/* eslint-disable max-lines-per-function */
const path = require('path');
const build = require('./handlers/build');

const ENVIRONMENTS = [
    'production',
    'development',
];

exports.command = 'build';
exports.desc = 'Create the production and development packages.';
exports.handler = function (argv) {
    const buildTargets = argv.env ? [argv.env] : ENVIRONMENTS;
    build(buildTargets, (path.basename(process.cwd())), argv.watch);
};
