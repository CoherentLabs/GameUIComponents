/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { formsIds, SERVER_PORT, RESPONSE_CONTAINER_ID } from './constants';

export const LOGIN_TEMPLATE = `
<div class="form-wrapper">
    <h2>GET</h2>
    <gameface-form-control id="${formsIds.LOGIN_FORM}" action="http://localhost:${SERVER_PORT}/user" method="get">
        <div class="form-element">
            <span>User name:</span><input name="username" value="name" type="text" />
        </div>
        <div class="form-element">
            <span>Password:</span><input name="password" value="pass" type="password" />
        </div>
        <div class="form-element">
            <span class="label">Remember user</span>
            <gameface-switch name="policy-agreement" value="accepted" type="text-inside">
                <component-slot data-name="switch-unchecked">No</component-slot>
                <component-slot data-name="switch-checked">Yes</component-slot>
            </gameface-switch>
        </div>
        <div class="form-element">
            <span class="label">What is more possible you to like?</span>
            <gameface-dropdown name="poll" class="gameface-dropdown-component" id="dropdown-default">
                <dropdown-option value="cats" slot="option">Cats</dropdown-option>
                <dropdown-option value="dogs" slot="option">Dogs</dropdown-option>
                <dropdown-option value="giraffes" slot="option">Giraffes</dropdown-option>
                <dropdown-option value="lions" slot="option">Lions</dropdown-option>
                <dropdown-option value="eagles" slot="option">Eagles</dropdown-option>
                <dropdown-option value="parrots" slot="option">Parrots</dropdown-option>
            </gameface-dropdown>
        </div>
        <button class="form-element" type="submit">Login</button>
    </gameface-form-control>
    <h3>Response data:</h3>
    <span class="response" id="${RESPONSE_CONTAINER_ID}"></span>
</div>`;

export const REGISTER_TEMPLATE = `
<div class="form-wrapper">
    <h2>POST</h2>
    <gameface-form-control id="${formsIds.REGISTER_FORM}" action="http://localhost:${SERVER_PORT}/form-data" method="post">
        <div class="form-element">
            <span>User name:</span><input name="username" value="name" type="text" />
        </div>
        <div class="form-element">
            <span>Password:</span><input name="password" value="password" type="password" />
        </div>
        <div class="form-element">
            <span>User info:</span><textarea name="info">user info</textarea>
        </div>
        <div class="form-element">
            <span>I am:</span>
            <gameface-radio-group name="gender">
                <radio-button checked value="male">Male</radio-button>
                <radio-button value="female">Female</radio-button>
            </gameface-radio-group>
        </div>
        <div class="form-element">
            <span>What are your interests?</span>
            <gameface-checkbox name="user-interests" value="music" class="checkbox-component form-element" checked>
                <component-slot data-name="checkbox-background">
                    <div class="checkbox-background"></div>
                </component-slot>
                <component-slot data-name="label">
                    <span class="label">Music</span>
                </component-slot>
            </gameface-checkbox>
            <gameface-checkbox name="user-interests" value="coding" class="checkbox-component form-element" checked>
                <component-slot data-name="checkbox-background">
                    <div class="checkbox-background"></div>
                </component-slot>
                <component-slot data-name="label">
                    <span class="label">Coding</span>
                </component-slot>
            </gameface-checkbox>
        </div>

        <div class="form-element">
            <span>What is your skill level:</span>
            <gameface-rangeslider name="skill-level" orientation="horizontal" grid thumb value="Beginner"
                values='["Beginner", "Average", "Skilled", "Specialist", "Expert"]' step="20">
            </gameface-rangeslider>
        </div>
        <button class="form-element" type="submit" name="register-btn" value="register">Register</button>
    </gameface-form-control>
    <h3>Response data:</h3>
    <span class="response" id="${RESPONSE_CONTAINER_ID}"></span>
</div>`;

export const PREVENT_SUBMIT_TEMPLATE = `
<div class="form-wrapper">
    <h2>Prevent form from submitting</h2>
    <gameface-form-control id="${formsIds.PREVENT_SUBMIT_FORM}" action="http://localhost:${SERVER_PORT}/form-data" method="post">
        <button class="form-element" type="submit">Click me!</button>
    </gameface-form-control>
    <h3>Response data:</h3>
    <span class="response" id="${RESPONSE_CONTAINER_ID}"></span>
</div>`;

export const CHECKBOXES_TEMPLATE = `
<div class="form-wrapper">
    <h2>Checkbox cases</h2>
    <gameface-form-control id="${formsIds.CHECKBOXES_FORM}" action="http://localhost:${SERVER_PORT}/user" method="get">
        <gameface-checkbox name="user-interests" value="music" class="checkbox-component form-element" checked>
            <component-slot data-name="checkbox-background">
                <div class="checkbox-background"></div>
            </component-slot>
            <component-slot data-name="label">
                <span class="label">1</span>
            </component-slot>
        </gameface-checkbox>
        <!-- Should be skipped when form is submitted because it is disabled -->
        <gameface-checkbox disabled name="user-interests" value="coding" class="checkbox-component form-element">
            <component-slot data-name="checkbox-background">
                <div class="checkbox-background"></div>
            </component-slot>
            <component-slot data-name="label">
                <span class="label">Disabled</span>
            </component-slot>
        </gameface-checkbox>
        <!-- Should send "on" as value if it is checked -->
        <gameface-checkbox name="user-interests" class="checkbox-component form-element" checked>
            <component-slot data-name="checkbox-background">
                <div class="checkbox-background"></div>
            </component-slot>
            <component-slot data-name="label">
                <span class="label">No value</span>
            </component-slot>
        </gameface-checkbox>
        <button class="form-element" type="submit">Submit</button>
    </gameface-form-control>
    <h3>Response data:</h3>
    <span class="response" id="${RESPONSE_CONTAINER_ID}"></span>
</div>`;

export const RADIO_TEMPLATE = `
<div class="form-wrapper">
    <h2>Radio group cases</h2>
    <gameface-form-control id="${formsIds.RADIO_FORM}" action="http://localhost:${SERVER_PORT}/user" method="get">
        <div class="form-element">
            <span>Normal:</span>
            <gameface-radio-group name="option1">
                <radio-button checked value="1">1</radio-button>
                <radio-button value="2">2</radio-button>
                <radio-button value="3">3</radio-button>
            </gameface-radio-group>
        </div>
        <!-- Should be skipped when form is submitted because it is disabled -->
        <div class="form-element">
            <span>Disabled group:</span>
            <gameface-radio-group disabled name="option2" class="form-element">
                <radio-button checked value="1">1</radio-button>
                <radio-button disabled value="2">2</radio-button>
                <radio-button value="3">3</radio-button>
            </gameface-radio-group>
        </div>
        <!-- Should send "on" as value if it is checked -->
        <div class="form-element">
            <span>No value:</span>
            <gameface-radio-group name="option3" class="form-element">
                <radio-button checked>1</radio-button>
                <radio-button>2</radio-button>
                <radio-button>3</radio-button>
            </gameface-radio-group>
        </div>
        <!-- Should send nothing because there are no checked elements -->
        <div class="form-element">
            <span>No checked:</span>
            <gameface-radio-group name="option4" class="form-element">
                <radio-button value="1">1</radio-button>
                <radio-button value="2">2</radio-button>
                <radio-button value="3">3</radio-button>
            </gameface-radio-group>
        </div>
        <!-- Should send 3 because it will not check the disabled button with value 2 -->
        <div class="form-element">
            <span>Disabled button:</span>
            <gameface-radio-group name="option5" class="form-element">
                <radio-button value="1">1</radio-button>
                <radio-button checked disabled value="2">2</radio-button>
                <radio-button checked value="3">3</radio-button>
            </gameface-radio-group>
        </div>
        <!-- Should send nothing because there are no checked elements -->
        <div class="form-element">
            <span>Disabled button with value:</span>
            <gameface-radio-group name="option6" class="form-element">
                <radio-button value="1">1</radio-button>
                <radio-button checked disabled value="2">2</radio-button>
                <radio-button value="3">3</radio-button>
            </gameface-radio-group>
        </div>
        <button class="form-element" type="submit">Submit</button>
    </gameface-form-control>
    <h3>Response data:</h3>
    <span class="response" id="${RESPONSE_CONTAINER_ID}"></span>
</div>`;

export const SWITCH_TEMPLATE = `
<div class="form-wrapper">
    <h2>Switch cases</h2>
    <gameface-form-control id="${formsIds.SWITCH_FORM}" action="http://localhost:${SERVER_PORT}/user" method="get">
        <div class="form-element">
            <span class="label">Normal</span>
            <!-- Should send the value from the value attribute when checked -->
            <gameface-switch name="option1" value="option1-checked" type="text-inside">
                <component-slot data-name="switch-unchecked">No</component-slot>
                <component-slot data-name="switch-checked">Yes</component-slot>
            </gameface-switch>
        </div>
        <!-- Should be skipped when form is submitted because it is disabled -->
        <div class="form-element">
            <span class="label">Disabled</span>
            <gameface-switch disabled name="option2" value="option2-checked" type="text-inside">
                <component-slot data-name="switch-unchecked">No</component-slot>
                <component-slot data-name="switch-checked">Yes</component-slot>
            </gameface-switch>
        </div>
        <!-- Should send "on" as value if it is checked -->
        <div class="form-element">
            <span class="label">No value</span>
            <gameface-switch name="option3" type="text-inside">
                <component-slot data-name="switch-unchecked">No</component-slot>
                <component-slot data-name="switch-checked">Yes</component-slot>
            </gameface-switch>
        </div>
        <button class="form-element" type="submit">Submit</button>
    </gameface-form-control>
    <h3>Response data:</h3>
    <span class="response" id="${RESPONSE_CONTAINER_ID}"></span>
</div>`;

export const DROPDOWN_TEMPLATE = `
<div class="form-wrapper">
    <h2>Drop down cases</h2>
    <gameface-form-control id="${formsIds.DROPDOWN_FORM}" action="http://localhost:${SERVER_PORT}/user" method="get">
        <div class="form-element">
            <span class="label">Normal</span>
            <gameface-dropdown name="option1" class="gameface-dropdown-component" id="dropdown-default">
                <dropdown-option value="1" slot="option">One</dropdown-option>
                <dropdown-option value="2" slot="option">Two</dropdown-option>
            </gameface-dropdown>
        </div>
        <div class="form-element">
            <span class="label">No values</span>
            <gameface-dropdown name="option2" class="gameface-dropdown-component" id="dropdown-default">
                <dropdown-option slot="option">One</dropdown-option>
                <dropdown-option slot="option" selected>Two</dropdown-option>
            </gameface-dropdown>
        </div>
        <div class="form-element">
            <span class="label">Disabled dropdown</span>
            <gameface-dropdown name="option3" disabled class="gameface-dropdown-component" id="dropdown-default">
                <dropdown-option slot="option">One</dropdown-option>
                <dropdown-option slot="option" disabled selected>Two</dropdown-option>
            </gameface-dropdown>
        </div>
        <div class="form-element">
            <span class="label">Disabled option</span>
            <gameface-dropdown name="option4" class="gameface-dropdown-component" id="dropdown-default">
                <dropdown-option slot="option">One</dropdown-option>
                <dropdown-option slot="option" disabled selected>Two</dropdown-option>
            </gameface-dropdown>
        </div>
        <div class="form-element">
            <span class="label">Multiple select</span>
            <!-- The second option has no value so "Two" is expected. -->
            <gameface-dropdown name="option5" class="gameface-dropdown-component" id="dropdown-multiple" multiple
                collapsable>
                <dropdown-option value="1" slot="option">One</dropdown-option>
                <dropdown-option slot="option" selected>Two</dropdown-option>
                <dropdown-option value="3" slot="option" disabled selected>Three</dropdown-option>
            </gameface-dropdown>
        </div>
        <button class="form-element" type="submit">Submit</button>
    </gameface-form-control>
    <h3>Response data:</h3>
    <span class="response" id="${RESPONSE_CONTAINER_ID}"></span>
</div>`;

export const VALIDATION_TEMPLATE = `
<gameface-form-control>
    <input id="role" name="role" value="some name" required />
    <input minlength="3" maxlength="5" name="username" value="Valid" type="text" id="username" />
    <input type="number" min="10" max="30" value="15" name="age" type="text" id="age" />
    <input type="text" value="missing name" id="no-name" />
    <button class="form-element" id="submit" type="submit">Login</button>
</gameface-form-control>
`;

export const XHR_TEMPLATE = `
<div class="form-wrapper">
    <gameface-form-control id="xhr-form" action="http://localhost:${SERVER_PORT}/user" method="get">
    <input name="username" value="name" type="text" />
    <input name="password" value="pass" type="password" />
    <button class="form-element" type="submit">Submit</button>
    </gameface-form-control>
</div>`;

export const CUSTOM_FORM_VALIDATION_TEMPLATE = `
<div class="form-wrapper">
    <h2>Custom validation</h2>
    <gameface-form-control id="custom-validation-form" action="http://localhost:12345/user" method="get">
        <div class="form-element">
            <span>Username (native input):</span>
            <input id="username" name="username" type="text" minlength="5" maxlength="20"></input>
            <span id="username-error"></span>
        </div>
        <div class="form-element">
            <gameface-text-field id="url" name="url" label="Website:" type="url"></gameface-text-field>
        </div>
        <div class="form-element">
            <gameface-text-field id="email" name="email" label="Email:" type="email"></gameface-text-field>
        </div>
        <button id="submit" class="form-element" type="submit">Register</button>
    </gameface-form-control>
    <h3>Response data:</h3>
    <span class="response" id="form-response"></span>
</div>
`;
