/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
const buildDemo = require('./handlers/demo');

exports.command = 'build-demo';
exports.desc = 'Create a minified bundle of the demo.';
exports.handler = function (argv) {
    buildDemo(argv);
};
