/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
const buildDemo = require('./handlers/demo');

exports.command = 'start-demo';
exports.desc = 'Start a development server and watch for file changed and rebuild automatically.';
exports.handler = function (argv) {
    // this command should always watch for file changes
    argv.watch = true;
    buildDemo(argv);
};
