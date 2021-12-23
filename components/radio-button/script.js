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

	get value() {
		if (this.disabled) return;
		if (this.previouslyCheckedElement && this.previouslyCheckedElement.disabled) return;
		if (this.previouslyCheckedElement) return this.previouslyCheckedElement.value;
	}

	get disabled() {
		return this.hasAttribute('disabled');
	}

	set disabled(value) {
		if (value) {
			this.classList.add('radio-button-disabled');
			this.setAttribute('disabled', '');
		} else {
			this.classList.remove('radio-button-disabled');
			this.removeAttribute('disabled');
		}
	}

	valueMissing() {
		const checkedButton = this.previouslyCheckedElement;
		if (!checkedButton || !this.hasAttribute('name')) return true;
		return false;
	}

	setCheckedToPreviousItem(button) {
		if (this.disabled) return;

		const prevSibling = button.previousElementSibling;

		if (!prevSibling) return;

		if (prevSibling.disabled) return this.setCheckedToPreviousItem(prevSibling);
		prevSibling.checked = true;
		prevSibling.focus();
	}

	setCheckedToNextItem(button) {
		if (this.disabled) return;

		const nextSibling = button.nextElementSibling;

		if (!nextSibling) return;

		if (nextSibling.disabled) return this.setCheckedToPreviousItem(nextSibling);
		nextSibling.checked = true;
		nextSibling.focus();
	}

	checkButton(button) {
		if (this.disabled) return;
		if (button.disabled) return;

		if (this.previouslyCheckedElement) this.setButtonAttributes(this.previouslyCheckedElement, false);
		this.previouslyCheckedElement = null;

		this.setButtonAttributes(button, true);
		this.previouslyCheckedElement = button;
	}

	handleClick() {
		if (this.disabled) return;
		if (this.radioGroup && this.radioGroup.disabled) return;

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
		button.setAttribute('aria-checked', checked ? 'true' : 'false');
	}

	setupButtons() {
		for (const button of this.allButtons) {
			this.setButtonRoleAttribute(button);
			this.attachButtonEventListeners(button);
			this.setButtonAttributes(button);

			if (button.hasAttribute('checked')) {
				this.checkButton(button);
			}
		}
	}

	connectedCallback() {
		// Handle some configuration here so the user doesn't have to manually
		// do it and possibly forget it.
		this.setAttribute('role', 'radiogroup');
		this.setupButtons();
		if (this.disabled) this.classList.add('radio-button-disabled');
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
		this.radioGroup.checkButton(this);
	}

	get value() {
		return this.getAttribute('value') || 'on';
	}

	set value(value) {
		this.setAttribute('value', value);
	}

	get text() {
		return this.textElement.textContent;
	}

	set text(value) {
		this.textElement.textContent = value;
	}

	get disabled() {
		return this.hasAttribute('disabled');
	}

	set disabled(value) {
		if (value) {
			this.firstChild.classList.add('radio-button-disabled');
			this.setAttribute('disabled', '');
		} else {
			this.firstChild.classList.remove('radio-button-disabled');
			this.removeAttribute('disabled');
		}
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
				if (this.disabled) this.firstChild.classList.add('radio-button-disabled');
			})
			.catch(err => console.error(err));
	}
}

components.defineCustomElement('radio-button', RadioButton);
components.defineCustomElement('gameface-radio-group', GamefaceRadioGroup);

export default GamefaceRadioGroup;
