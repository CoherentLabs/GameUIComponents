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
	el.className = 'testtttt';

	el.innerHTML = template;

	const currentEl = document.querySelector('.testtttt');

	if(currentEl) {
		currentEl.parentElement.removeChild(currentEl);
	}

	document.body.appendChild(el);

	return new Promise(resolve => {
		setTimeout(() => {
			const radialMenuOne = document.getElementById('radial-menu-one');
			// Provide the items.
			radialMenuOne.items = itemsModel.items;
			resolve();
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

	describe('Radial Menu', () => {
		beforeEach(async function () {
			await setupRadialMenuTestPage();
		}, 3000);

		it('Should be created', () => {
			assert(document.querySelector('radial-menu').id === 'radial-menu-one', 'The id of the radial menu is not radial-menu-one.');
		});
	});

	describe('Radial Menu', () => {
		beforeEach(async function () {
			await setupRadialMenuTestPage();
		});

		it('Should set the provided name', () => {
			assert(document.querySelector('.radial-menu-center-text').textContent === 'Radial Menu Name Test', 'The textContent of the radial menu is not "Radial Menu Name Test".');
		});
	});

	describe('Radial Menu', () => {
		beforeEach(async function () {
			await setupRadialMenuTestPage();
		});

		it('Should have items and their count to be 8', () => {
			assert(document.querySelectorAll('.radial-menu-item').length === 8, 'The length of .radial-menu-item elements is not 8.');
		});
	});

	describe('Radial Menu', () => {
		beforeEach(async function () {
			await setupRadialMenuTestPage();
		});

		it('Should have background image url on a populated element', () => {
			assert(document.querySelectorAll('.radial-menu-item-icon')[2].style.backgroundImage === 'url("./images/weapon3.png")', `The background image url is not "url("./images/weapon3.png")".`);
		});
	});

	describe('Radial Menu', () => {
		beforeEach(async function () {
			await setupRadialMenuTestPage();
		});

		it('Should have transform rotate on a populated element', () => {
			assert(document.querySelectorAll('.radial-menu-item-icon')[7].style.transform === 'rotate(-315deg)', 'The transform property of the radial-menu-item-icon is not "rotate(-315deg)".');
		});
	});

	describe('Radial Menu', () => {
		beforeEach(async function () {
			await setupRadialMenuTestPage();
		});

		xit('Should have opened on keydown', async () => {
			const radialMenu = document.querySelector('radial-menu');

			dispatchKeyboardEventKeyDown(16, radialMenu);

			requestAnimationFrame(() => {
				debugger
			})
			// The menu is opened 2 frames after the opening function is called.
			// More time is apparently needed for it to open and 200 frames seems to not be flaky.
			return createAsyncSpec(() => {
				assert(radialMenu.classList.contains('radial-menu-open') === true, 'Radial menu does not have class radial-menu-open.');
			}, 0);
		});
	});

	describe('Radial Menu', () => {
		beforeEach(async function () {
			await setupRadialMenuTestPage();
		});

		it('Should have closed on keyup after opening', async () => {
			const radialMenu = document.querySelector('radial-menu');

			dispatchKeyboardEventKeyDown(16, radialMenu);

			// The menu is opened 2 frames after the opening function is called.
			// More time is apparently needed for it to open and 200 frames seems to not be flaky.
			return createAsyncSpec(() => {
				dispatchKeyboardEventKeyUp(16, radialMenu);
				assert(radialMenu.classList.contains('radial-menu-open') === false, 'Radial menu contains class radial-menu-open.');
			});
		});
	});

	describe('Radial Menu', () => {
		beforeEach(async function () {
			await setupRadialMenuTestPage();
		});

		xit('Should successfully attach to and use custom event', async () => {
			const radialMenu = document.querySelector('radial-menu');

			let selectedState = false;

			radialMenu.addEventListener('radOneItemSelected', () => {
				selectedState = true;
			});

			await createAsyncSpec(() => {
				dispatchKeyboardEventKeyDown(16, radialMenu);
				click(radialMenu);
			});

			// The menu is opened 2 frames after the opening function is called.
			// More time is apparently needed for it to open and 200 frames seems to not be flaky.
			return createAsyncSpec(() => {
				assert(selectedState === true, 'selectedState is not true.');
			});
		});
	});
});
