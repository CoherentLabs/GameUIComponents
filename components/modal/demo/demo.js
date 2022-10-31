/* eslint-disable no-unused-vars */
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import components from 'coherent-gameface-components';
import modal from '../umd/modal.development.js';

/**
 * Class definition of the demo
 */
class Demo {
    // eslint-disable-next-line require-jsdoc
    constructor() {
        this.saveButton = document.querySelector('.save');
        this.confirmButton = document.querySelector('#confirm');
        this.nameField = document.querySelector('input[for="name"]');

        this.attachEventListeners();
    }

    /**
     * Handler when the save button is clicked
     */
    onSaveName() {
        document.getElementsByTagName('gameface-modal')[0].style.display = 'flex';
    }

    /**
     * Attach listeners to all the modal buttons
     */
    attachEventListeners() {
        this.confirmButton.addEventListener('click', this.onConfirm);

        this.nameField.addEventListener('keyup', (e) => {
            if (this.nameField.value) {
                this.saveButton.classList.remove('disabled');
                this.saveButton.addEventListener('click', this.onSaveName);
                return;
            }
            this.saveButton.removeEventListener('click', this.onSaveName);
            this.saveButton.classList.add('disabled');
        });
    }

    /**
     * Handler when the confirm button is clicked
     * @returns {void}
     */
    onConfirm() {
        const modal = document.getElementsByTagName('gameface-modal')[0];
        const nameText = document.querySelector('.name-text');
        const nameField = document.querySelector('input[for="name"]');

        if (!nameText || !nameField) return modal.close();
        document.querySelector('.name').textContent = nameField.value;
        modal.close();

        nameText.classList.remove('hidden');
        nameText.querySelector('.name').textContent = nameField.value;
    }
}

const demo = new Demo();

export { demo };
