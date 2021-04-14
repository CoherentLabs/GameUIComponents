function setupTestPage() {
	document.body.innerHTML = `
	<radial-menu id="radial-menu-one"
		data-name="Radial Menu Name Test"
		data-change-event-name="radOneItemChanged"
		data-select-event-name="radOneItemSelected"
		data-open-key-code="16"
		class="radial-menu-component"></radial-menu>
	`;

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
	element.dispatchEvent(new KeyboardEvent('keydown', {keyCode: keyCode}));
}

function dispatchKeyboardEventKeyUp(keyCode, element) {
	element.dispatchEvent(new KeyboardEvent('keyup', {keyCode: keyCode}));
}

describe('Radial Menu', () => {
	beforeAll(async function () {
		await setupTestPage();
	}, 3000);

	it('Should be created', () => {
		expect(document.querySelector('radial-menu').id).toEqual('radial-menu-one');
	});
});

describe('Radial Menu', () => {
	beforeAll(async function () {
		await setupTestPage();
	}, 3000);

	it('Should set the provided name', () => {
		expect(document.querySelector('.radial-menu-center-text').textContent).toEqual('Radial Menu Name Test');
	});
});

describe('Radial Menu', () => {
	beforeAll(async function () {
		await setupTestPage();
	}, 3000);

	it('Should have items and their count to be 8', () => {
		expect(document.querySelectorAll('.radial-menu-item').length).toEqual(8);
	});
});

describe('Radial Menu', () => {
	beforeAll(async function () {
		await setupTestPage();
	}, 3000);

	it('Should have background image url on a populated element', () => {
		expect(document.querySelectorAll('.radial-menu-item-icon')[2].style.backgroundImage).toEqual('url("./images/weapon3.png")');
	});
});

describe('Radial Menu', () => {
	beforeAll(async function () {
		await setupTestPage();
	}, 3000);

	it('Should have transform rotate on a populated element', () => {
		expect(document.querySelectorAll('.radial-menu-item-icon')[7].style.transform).toEqual('rotate(-315deg)');
	});
});

describe('Radial Menu', () => {
	beforeAll(async function () {
		await setupTestPage();
	}, 3000);

	it('Should have opened on keydown', () => {
		const radialMenu = document.querySelector('radial-menu');

		dispatchKeyboardEventKeyDown(16, radialMenu);

		// The menu is opened 2 frames after the opening function is called.
		// More time is apparently needed for it to open and 200 frames seems to not be flaky.
		waitForStyles(() => {
			expect(radialMenu.classList.contains('radial-menu-open')).toEqual(true);
		}, 200);
	});
});

describe('Radial Menu', () => {
	beforeAll(async function () {
		await setupTestPage();
	}, 3000);

	it('Should have closed on keyup after opening', () => {
		const radialMenu = document.querySelector('radial-menu');

		dispatchKeyboardEventKeyDown(16, radialMenu);

		// The menu is opened 2 frames after the opening function is called.
		// More time is apparently needed for it to open and 200 frames seems to not be flaky.
		waitForStyles(() => {
			dispatchKeyboardEventKeyUp(16, radialMenu);

			expect(radialMenu.classList.contains('radial-menu-open')).toEqual(false);
		}, 200);
	});
});

describe('Radial Menu', () => {
	beforeAll(async function () {
		await setupTestPage();
	}, 3000);

	it('Should successfully attach to and use custom event', () => {
		const radialMenu = document.querySelector('radial-menu');

		let selectedState = false;

		radialMenu.addEventListener('radOneItemSelected', () => {
			selectedState = true;
		});

		dispatchKeyboardEventKeyDown(16, radialMenu);

		// The menu is opened 2 frames after the opening function is called.
		// More time is apparently needed for it to open and 200 frames seems to not be flaky.
		waitForStyles(() => {
			click(radialMenu);

			expect(selectedState).toEqual(true);
		}, 200);
	});
});
