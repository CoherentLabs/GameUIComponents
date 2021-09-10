/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

const fs = require('fs');
const path = require('path');

const COMPONENTS_FOLDER = path.join(__dirname, '../components');
const components = fs.readdirSync(COMPONENTS_FOLDER);

function copyCSSTheme() {
    components.forEach(component => {
        fs.copyFileSync(
            path.join(__dirname, '../', 'theme/coherent-gameface-components-theme.css'),
            path.join(COMPONENTS_FOLDER, component, 'coherent-gameface-components-theme.css')
        );
    });
}

module.exports = copyCSSTheme;