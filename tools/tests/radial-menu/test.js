/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

function createAsyncSpec(callback, time = 500) {
	return new Promise(resolve => {
		setTimeout(() => {
			callback();
			resolve();
		}, time);
	});
}

function setupRadialMenuTestPage() {
	const template = `
	<radial-menu id="radial-menu-one"
		data-name="Radial Menu Name Test"
		data-change-event-name="radOneItemChanged"
		data-select-event-name="radOneItemSelected"
		data-open-key-code="16"
		class="radial-menu-component"></radial-menu>
	`;

	const el = document.createElement('div');
	el.className = 'radial-menu-test-wrapper';

	el.innerHTML = template;

	const currentEl = document.querySelector('.radial-menu-test-wrapper');

	// Since we don't want to replace the whole content of the body using
	// innerHtml setter, we query only the current custom element and we replace
	// it with a new one; this is needed because the specs are executed in a random
	// order and sometimes the component might be left in a state that is not
	// ready for testing
	if (currentEl) {
		currentEl.parentElement.removeChild(currentEl);
	}

	document.body.appendChild(el);

	return new Promise(resolve => {
		setTimeout(() => {
			const radialMenuOne = document.getElementById('radial-menu-one');
			// Provide the items.
			radialMenuOne.items = itemsModel.items;
			// the .items setter triggers a DOM change, so we wait a second to make
			// sure the DOM is ready
			setTimeout(resolve, 1000);
		}, 1000);
	});
}

function dispatchKeyboardEventKeyDown(keyCode, element) {
	element.dispatchEvent(new KeyboardEvent('keydown', { keyCode: keyCode }));
}

function dispatchKeyboardEventKeyUp(keyCode, element) {
	element.dispatchEvent(new KeyboardEvent('keyup', { keyCode: keyCode }));
}

describe('Radial Menu Tests', () => {
	afterAll(() => {

		let currentElement = document.querySelector('.radial-menu-test-wrapper');

		if (currentElement) {
			currentElement.parentElement.removeChild(currentElement);
		}

	});

	describe('Radial Menu', () => {
		beforeEach(function (done) {
			setupRadialMenuTestPage().then(done).catch(err => console.error(err));
		}, 3000);

		it('Should be created', () => {
			assert(document.querySelector('radial-menu').id === 'radial-menu-one', 'The id of the radial menu is not radial-menu-one.');
		});
	});

	describe('Radial Menu', () => {
		beforeEach(function (done) {
			setupRadialMenuTestPage().then(done).catch(err => console.error(err));
		});

		it('Should set the provided name', () => {
			assert(document.querySelector('.radial-menu-center-text').textContent === 'Radial Menu Name Test', 'The textContent of the radial menu is not "Radial Menu Name Test".');
		});
	});

	describe('Radial Menu', () => {
		beforeEach(function (done) {
			setupRadialMenuTestPage().then(done).catch(err => console.error(err));
		});

		it('Should have items and their count to be 8', () => {
			assert(document.querySelectorAll('.radial-menu-item').length === 8, 'The length of .radial-menu-item elements is not 8.');
		});
	});

	describe('Radial Menu', () => {
		beforeEach(function (done) {
			setupRadialMenuTestPage().then(done).catch(err => console.error(err));
		});

		xit('Should have background image url on a populated element', () => {
			assert(document.querySelectorAll('.radial-menu-item-icon')[2].style.backgroundImage === 'url("./images/weapon3.png")', `The background image url is not "url("./images/weapon3.png")".`);
		});
	});

	describe('Radial Menu', () => {
		beforeEach(function (done) {
			setupRadialMenuTestPage().then(done).catch(err => console.error(err));
		});

		it('Should have transform rotate on a populated element', () => {
			// remove all numbers after the decimal point (if any)
			let transformValue = document.querySelectorAll('.radial-menu-item-icon')[7].style.transform.replace(/\.\d+/, '');
			assert((transformValue === 'rotate(-315deg)' || transformValue === 'rotateZ(-315deg)'),
				'The transform property of the radial-menu-item-icon is not "rotate(-315deg)" nor "rotateZ(-315deg)".');
		});
	});

	describe('Radial Menu', () => {
		beforeEach(function (done) {
			setupRadialMenuTestPage().then(done).catch(err => console.error(err));
		});

		xit('Should have opened on keydown', function (done) {
			const radialMenu = document.querySelector('radial-menu');

			dispatchKeyboardEventKeyDown(16, radialMenu);

			// The menu is opened 2 frames after the opening function is called.
			// More time is apparently needed for it to open and 200 frames seems to not be flaky.
			waitForStyles(() => {
				assert(radialMenu.classList.contains('radial-menu-open') === true, 'Radial menu does not have class radial-menu-open.');
				done();
			}, 10);
		});
	});

	describe('Radial Menu', () => {
		beforeEach(function (done) {
			setupRadialMenuTestPage().then(done).catch(err => console.error(err));
		});

		xit('Should have closed on keyup after opening', function (done) {
			const radialMenu = document.querySelector('radial-menu');

			dispatchKeyboardEventKeyDown(16, radialMenu);

			// The menu is opened 2 frames after the opening function is called.
			// More time is apparently needed for it to open and 200 frames seems to not be flaky.
			waitForStyles(() => {
				dispatchKeyboardEventKeyUp(16, radialMenu);
				assert(radialMenu.classList.contains('radial-menu-open') === false, 'Radial menu contains class radial-menu-open.');
				done();
			}, 10);
		});
	});

	describe('Radial Menu', () => {
		beforeEach(function (done) {
			setupRadialMenuTestPage().then(done).catch(err => console.error(err));
		});

		xit('Should successfully attach to and use custom event', function (done) {
			const radialMenu = document.querySelector('radial-menu');

			let selectedState = false;

			radialMenu.addEventListener('radOneItemSelected', () => {
				selectedState = true;
			});

			createAsyncSpec(() => {
				dispatchKeyboardEventKeyDown(16, radialMenu);
				click(radialMenu);
			}).then(() => {
				// The menu is opened 2 frames after the opening function is called.
				// More time is apparently needed for it to open and 200 frames seems to not be flaky.
				waitForStyles(() => {
					assert(selectedState === true, 'selectedState is not true.');
					done();
				}, 10);
			});
		});
	});
});
