/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

if (process.env.NODE_ENV === 'production') {
    module.exports = require('./cjs/tabs.production.min.js');
} else {
    module.exports = require('./cjs/tabs.development.js');
}