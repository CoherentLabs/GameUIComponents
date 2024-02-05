/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
const path = require('path');
const build = require('./handlers/build');

const ENVIRONMENTS = [
    'production',
    'development',
];

exports.command = 'watch';
exports.desc = 'Create the production and development packages and watch for file changes';
exports.handler = function (argv) {
    const buildTargets = argv.env ? [argv.env] : ENVIRONMENTS;
    // this command should always watch for file changes
    argv.watch = true;
    build(buildTargets, (path.basename(process.cwd())), argv.watch);
};
