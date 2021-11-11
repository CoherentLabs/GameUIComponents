/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
const SERVER_PORT = 12345;
const formsIds = {
	LOGIN_FORM: 'login-form',
	REGISTER_FORM: 'register-form',
	PREVENT_SUBMIT_FORM: 'prevent-submit',
	CHECKBOXES_FORM: 'checkboxes-form',
	RADIO_FORM: 'radio-form',
	SWITCH_FORM: 'switch-form',
	DROPDOWN_FORM: 'dropdown-form',
}
const RESPONSE_CONTAINER_ID = 'form-response';
const forms = [
	{
		testName: 'Login form',
		id: formsIds.LOGIN_FORM,
		shouldAddRequestFinishCallback: true,
		submitData: '{"username":"name","password":"pass","poll":"cats"}',
		template:
			`<div class="form-wrapper">
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
			</div>`
	},
	{
		testName: 'Register form',
		id: formsIds.REGISTER_FORM,
		shouldAddRequestFinishCallback: true,
		submitData: '{"username":"name","password":"password","info":"user info","gender":"male","user-interests":["music","coding"],"skill-level":"Beginner"}',
		template:
			`<div class="form-wrapper">
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
						<gameface-checkbox name="user-interests" value="music" class="checkbox-component form-element">
							<component-slot data-name="checkbox-background">
								<div class="checkbox-background"></div>
							</component-slot>
							<component-slot data-name="label">
								<span class="label">Music</span>
							</component-slot>
						</gameface-checkbox>
						<gameface-checkbox name="user-interests" value="coding" class="checkbox-component form-element">
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
			</div>`
	},
	{
		testName: 'Prevent form from submiting',
		id: formsIds.PREVENT_SUBMIT_FORM,
		shouldPreventSubmit: true,
		submitData: 'Prevented default',
		template:
			`<div class="form-wrapper">
				<h2>Prevent form from submitting</h2>
				<gameface-form-control id="${formsIds.PREVENT_SUBMIT_FORM}" action="http://localhost:${SERVER_PORT}/form-data" method="post">
					<button class="form-element" type="submit">Click me!</button>
				</gameface-form-control>
				<h3>Response data:</h3>
				<span class="response" id="${RESPONSE_CONTAINER_ID}"></span>
			</div>`
	},
	{
		testName: 'Checkbox cases form',
		id: formsIds.CHECKBOXES_FORM,
		shouldAddRequestFinishCallback: true,
		submitData: '{"user-interests":["music","on"]}',
		template:
			`<div class="form-wrapper">
				<h2>Checkbox cases</h2>
				<gameface-form-control id="${formsIds.CHECKBOXES_FORM}" action="http://localhost:${SERVER_PORT}/user" method="get">
					<gameface-checkbox name="user-interests" value="music" class="checkbox-component form-element">
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
					<!-- Should send "no" as value if it is checked -->
					<gameface-checkbox name="user-interests" class="checkbox-component form-element">
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
			</div>`
	},
	{
		testName: 'Radio cases form',
		id: formsIds.RADIO_FORM,
		shouldAddRequestFinishCallback: true,
		submitData: '{"option1":"1","option3":"on"}',
		template:
			`<div class="form-wrapper">
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
						<span>Disabled:</span>
						<gameface-radio-group disabled name="option2" class="form-element">
							<radio-button checked value="1">1</radio-button>
							<radio-button disabled value="2">2</radio-button>
							<radio-button value="3">3</radio-button>
						</gameface-radio-group>
					</div>
					<!-- Should send "no" as value if it is checked -->
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
					<button class="form-element" type="submit">Submit</button>
				</gameface-form-control>
				<h3>Response data:</h3>
				<span class="response" id="${RESPONSE_CONTAINER_ID}"></span>
			</div>`
	},
	{
		testName: 'Switch cases form',
		id: formsIds.SWITCH_FORM,
		shouldAddRequestFinishCallback: true,
		submitData: '{}',
		template:
			`<div class="form-wrapper">
				<h2>Switch cases</h2>
				<gameface-form-control id="${formsIds.SWITCH_FORM}" action="http://localhost:${SERVER_PORT}/user" method="get">
					<div class="form-element">
						<span class="label">Normal</span>
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
					<!-- Should send "no" as value if it is checked -->
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
			</div>`
	},
	{
		testName: 'Dropdown cases form',
		id: formsIds.DROPDOWN_FORM,
		shouldAddRequestFinishCallback: true,
		submitData: '{"option1":"1","option2":"One","option4":"One","option5":"1"}',
		template:
			`<div class="form-wrapper">
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
						<gameface-dropdown name="option5" class="gameface-dropdown-component" id="dropdown-default" multiple
							collapsable>
							<dropdown-option value="1" slot="option" selected>One</dropdown-option>
							<dropdown-option slot="option" selected>Two</dropdown-option>
							<dropdown-option value="3" slot="option" disabled selected>Three</dropdown-option>
						</gameface-dropdown>
					</div>
					<button class="form-element" type="submit">Submit</button>
				</gameface-form-control>
				<h3>Response data:</h3>
				<span class="response" id="${RESPONSE_CONTAINER_ID}"></span>
			</div>`
	},
];

const pageStyles = `body {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	justify-content: center;
}

.form-wrapper {
	margin: 5px;
	padding: 10px;
	width: 300px;
	border-width: 3px;
	border-style: solid;
	border-top-color: var(--default-color-blue);
	border-left-color: var(--default-color-blue);
	border-right-color: var(--default-color-blue);
	border-bottom-color: var(--default-color-blue);
	border-radius: 10px;
}

.form-element {
	margin-bottom: 5px;
}

.horizontal-rangeslider-wrapper {
	width: 80% !important;
	margin-left: 31px !important;
}

.selected {
	width: 100% !important;
}

.options-container {
	width: auto !important;
	height: auto !important;
}

.options,
.dropdown {
	width: 100% !important;
}

gameface-dropdown {
	width: 100% !important;
	left: 0 !important;
	top: 0 !important;
	margin-left: 0 !important;
}

.response {
	white-space: pre-wrap;
	overflow-wrap: break-word;
}`;

async function setupFormControlPage(form) {
	const el = document.createElement('div');
	el.className = 'test-wrapper';

	el.innerHTML = form.template;

	const currentEl = document.querySelector('.test-wrapper');

	// Since we don't want to replace the whole content of the body using
	// innerHtml setter, we query only the current custom element and we replace
	// it with a new one; this is needed because the specs are executed in a random
	// order and sometimes the component might be left in a state that is not
	// ready for testing
	if (currentEl) {
		currentEl.parentElement.removeChild(currentEl);
	}

	document.body.appendChild(el);

	if (form.shouldAddRequestFinishCallback) {
		document.getElementById(form.id).addEventListener('loadend', (event) => {
			document.getElementById(RESPONSE_CONTAINER_ID).textContent = event.detail.target.response;
		})
	}

	if (form.shouldPreventSubmit) {
		const formElement = document.getElementById(form.id);
		formElement.addEventListener('submit', (event) => {
			event.preventDefault();
			document.getElementById(RESPONSE_CONTAINER_ID).textContent = 'Prevented default';
		});
		formElement.addEventListener('loadend', (event) => {
			document.getElementById(RESPONSE_CONTAINER_ID).textContent = event.detail.target.response;
		})
	}
	// the .items setter triggers a DOM change, so we wait a bit to make
	// sure the DOM is ready.
	await createAsyncSpec();
}

const RESPONSE_TIMEOUT = 50;
async function waitServerResponse() {
	return new Promise((resolve, reject) => {
		setTimeout(resolve, RESPONSE_TIMEOUT);
	})
}

function setFormsTestCases() {
	for (const formData of forms) {
		describe(formData.testName, () => {
			beforeAll(function (done) {
				setupFormControlPage(formData).then(done).catch(err => console.error(err));
			});

			it('Should be created', () => {
				assert(document.querySelector('gameface-form-control').id === formData.id, 'The id of the form is not gameface-form-control.');
			});

			it('Should be submited', async () => {
				const submitButton = document.querySelector('[type="submit"]');
				click(submitButton);
				await waitServerResponse();
				await createAsyncSpec(() => {
					const data = document.querySelector('.response').textContent;
					assert(data === formData.submitData, `The form data is not the same as the expected one. Expected: ${formData.submitData}. Received: ${data}`);
				});
			});
		});
	}
}

describe('Form control Tests', () => {
	beforeAll(() => {
		const head = document.head || document.getElementsByTagName('head')[0],
			style = document.createElement('style');

		head.appendChild(style);

		style.type = 'text/css';
		if (style.styleSheet) {
			// This is required for IE8 and below.
			style.styleSheet.cssText = css;
		} else {
			style.appendChild(document.createTextNode(pageStyles));
		}
	})

	afterAll(() => {
		const currentEl = document.querySelector('.test-wrapper');

		if (currentEl) {
			currentEl.parentElement.removeChild(currentEl);
		}
	});

	setFormsTestCases();
});
