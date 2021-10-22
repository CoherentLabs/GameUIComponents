/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import components from 'coherent-gameface-components';
import template from './template.html';

const KEYCODES = components.KEYCODES;

class GamefaceRadioGroup extends HTMLElement {
	constructor() {
		super();

		this.previouslyCheckedElement = null;
	}

	get allButtons() {
		return Array.from(this.querySelectorAll('radio-button'));
	}

	setCheckedToPreviousItem(button) {
		const prevSibling = button.previousElementSibling;

		if (!prevSibling) return
		button.previousElementSibling.checked = true;
		button.previousElementSibling.focus();
	}

	setCheckedToNextItem(button) {
		const nextSibling = button.nextElementSibling;

		if (!nextSibling) return;
		button.nextElementSibling.checked = true;
		button.nextElementSibling.focus();
	}

	uncheckPreviousButton() {
		if (this.previouslyCheckedElement) this.setButtonAttributes(this.previouslyCheckedElement, false);
		this.previouslyCheckedElement = null;
	}

	checkButton(button) {
		this.setButtonAttributes(button, true);
		this.previouslyCheckedElement = button;
	}

	handleClick() {
		this.checked = true;
		this.focus();
	}

	handleKeydown(event) {
		switch (event.keyCode) {
			case KEYCODES.UP:
			case KEYCODES.LEFT:
				this.radioGroup.setCheckedToPreviousItem(this);
				break;
			case KEYCODES.DOWN:
			case KEYCODES.RIGHT:
				this.radioGroup.setCheckedToNextItem(this);
				break;
			default:
				break;
		}
	};

	setButtonRoleAttribute(button) {
		button.setAttribute('role', 'radio')
	}

	attachButtonEventListeners(button) {
		button.addEventListener('click', this.handleClick.bind(button));
		button.addEventListener('keydown', this.handleKeydown.bind(button));
	}

	setButtonAttributes(button, checked) {
		button.setAttribute('tabindex', checked ? '0' : '-1');
		button.setAttribute('aria-checked',  checked ? 'true' : 'false');
	}

	setupButtons() {
		for (const button of this.allButtons) {
			this.setButtonRoleAttribute(button);
			this.attachButtonEventListeners(button);
			this.setButtonAttributes(button);

			if (button.hasAttribute('checked')) {
				button.checked = true;
			}
		}
	}

	connectedCallback() {
		// Handle some configuration here so the user doesn't have to manually
		// do it and possibly forget it.
		this.setAttribute('role', 'radiogroup');
		this.setupButtons();

		this.previouslyCheckedElement = this.querySelector('[aria-checked="true"]');
	}
}

class RadioButton extends HTMLElement {
	constructor() {
		super();

		this.template = template;
		this.textElement = null;
	}

	get checked() {
		return this.getAttribute('aria-checked');
	}

	set checked(value) {
		this.radioGroup.uncheckPreviousButton();
		this.radioGroup.checkButton(this);
	}

	get value() {
		return this.textElement.textContent;
	}

	set value(value) {
		this.textElement.textContent = value;
	}

	connectedCallback() {
		// Get the text set from the user before applying the template.
		this.radioGroup = this.parentElement;
		const radioButtonText = this.textContent;

		components.loadResource(this)
			.then((result) => {
				this.template = result.template;
				components.renderOnce(this);

				this.textElement = this.querySelector('.radio-button-text');
				// Apply the user set text.
				this.textElement.textContent = radioButtonText;
			})
			.catch(err => console.error(err));
	}
}

components.defineCustomElement('radio-button', RadioButton);
components.defineCustomElement('gameface-radio-group', GamefaceRadioGroup);

export default GamefaceRadioGroup;
