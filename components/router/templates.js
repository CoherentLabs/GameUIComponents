/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

const tanksTemplate = `<div>
<div>Available Tanks:</div>
<p></p>
<div class="tanks-menu">
    <gameface-route slot="route" to="/heroes/tanks/one/79/12">
        <div class="avatar-container">
            <div class="avatar tank-avatar1"></div>
            <div>Tank 1</div>
        </div>
    </gameface-route>
    <gameface-route slot="route" to="/heroes/tanks/two">
        <div class="avatar-container">
            <div class="avatar tank-avatar2"></div>
            <div>Tank 2</div>
        </div>
    </gameface-route>
    <gameface-route slot="route" to="/heroes/tanks/three">
        <div class="avatar-container">
            <div class="avatar tank-avatar3"></div>
            <div>Tank 3</div>
        </div>
    </gameface-route>
</div>
</div>`;


const healersTemplate = `<div>
    <div>Available Supports:</div>
    <p></p>
    <div class="healers-menu">
        <gameface-route slot="route" to="/heroes/healers/paladin">
            <div class="avatar-container">
                <div class="avatar avatar1"></div>
                <div>Paladin</div>
            </div>
        </gameface-route>
        <gameface-route slot="route" to="/heroes/healers/monk">
            <div class="avatar-container">
                <div class="avatar avatar2"></div>
                <div>Monk</div>
            </div>
        </gameface-route>
        <gameface-route slot="route" to="/heroes/healers/priest">
            <div class="avatar-container">
                <div class="avatar avatar3"></div>
                <div>Priest</div>
            </div>
        </gameface-route>
    </div>
</div>
`;

const heroesTemplate = `<div>
    <div>Heroes:</div>
    <div class="menu">
        <gameface-route slot="route" to="/heroes/tanks">Tanks</gameface-route>
        <gameface-route slot="route" to="/heroes/healers">Healers</gameface-route>
    </div>
    <router-view></router-view>
</div>`;

const startGameTemplate = `<div>Start Game</div>`;
const homeTemplate = `<div>Home</div>`;

const tankOneTemplate = ({ health, mana }) => `<div>
    <div>Tank One:</div>
    <p>Health: ${health}</p>
    <p>Armor: ${mana}</p>
</div>`;

const tankTwoTemplate = `<div>
    <div>Tank Two:</div>
    <p>Health: 100</p>
    <p>Armor: 500</p>
    <p>Shield: 200</p>
</div>`;

const tankThreeTemplate = `<div>
    <div>Tank Three:</div>
    <p>Health: 100</p>
    <p>Armor: 500</p>
    <p>Rockets: 300</p>
</div>`;

const healerTemplate = `<div>
    <div>Mana: <span id="mana"></span></div>
    <div>Strength: <span id="strength"></span></div>
</div>`;


const notFoundTemplate = `<div>404</div>`;

export {
    tanksTemplate,
    healersTemplate,
    startGameTemplate,
    homeTemplate,
    heroesTemplate,
    tankOneTemplate,
    tankTwoTemplate,
    tankThreeTemplate,
    healerTemplate,
    notFoundTemplate,
};
