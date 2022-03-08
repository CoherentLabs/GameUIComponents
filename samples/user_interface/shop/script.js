/* eslint-disable linebreak-style */
/* eslint-disable require-jsdoc */
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

const SHOP_ITEMS_PER_ROW = 6;

const shopItems = document.getElementsByClassName('shop-item');
const shopItemsCount = shopItems.length;

// Shop items selection and navigation methods
let activeItemSlot = 0;

const setActiveItem = function (slotId) {
    shopItems[activeItemSlot].classList.remove('shop-item-active');
    activeItemSlot = slotId;
    shopItems[activeItemSlot].classList.add('shop-item-active');
};

const selectLeft = function () {
    if (activeItemSlot > 0) {
        setActiveItem(activeItemSlot - 1);
    }
};

const selectRight = function () {
    if (activeItemSlot < shopItemsCount - 1) {
        setActiveItem(activeItemSlot + 1);
    }
};

const selectUp = function () {
    if (activeItemSlot >= SHOP_ITEMS_PER_ROW) {
        setActiveItem(activeItemSlot - SHOP_ITEMS_PER_ROW);
    }
};

const selectDown = function () {
    if (activeItemSlot + SHOP_ITEMS_PER_ROW < shopItemsCount) {
        setActiveItem(activeItemSlot + SHOP_ITEMS_PER_ROW);
    }
};

// Modal management
// Ultimately when using the modal in a real project, these functions should be
// added as methods by directly extending the Modal Component.
const modal = document.querySelector('gameface-modal');
const modalHeader = modal.querySelector('.guic-modal-header').firstElementChild;

const openModal = function () {
    modalHeader.textContent = shopItems[activeItemSlot].querySelector('.item-name').textContent;
    modal.style.display = 'flex';
};

const isModalOpen = function () {
    return modal.style.display === 'flex';
};

// Keyboard navigation
const KEYBOARD_MAPPING = {
    ArrowLeft: 37,
    ArrowRight: 39,
    ArrowUp: 38,
    ArrowDown: 40,
    Enter: 13,
    Esc: 27,
};

document.addEventListener('keydown', (event) => {
    const keyCode = event.keyCode;

    if (!isModalOpen()) {
        switch (keyCode) {
            case KEYBOARD_MAPPING.ArrowLeft:
                selectLeft();
                break;
            case KEYBOARD_MAPPING.ArrowRight:
                selectRight();
                break;
            case KEYBOARD_MAPPING.ArrowUp:
                selectUp();
                break;
            case KEYBOARD_MAPPING.ArrowDown:
                selectDown();
                break;
            case KEYBOARD_MAPPING.Enter:
                openModal();
                break;
        }
    } else if (keyCode === KEYBOARD_MAPPING.Esc || keyCode === KEYBOARD_MAPPING.Enter) {
        modal.close();
    }
});

// Mouse navigation
for (let i = 0; i < shopItemsCount; i++) {
    shopItems[i].addEventListener('click', () => {
        shopItems[activeItemSlot].classList.remove('shop-item-active');
        activeItemSlot = i;
        shopItems[activeItemSlot].classList.add('shop-item-active');
    });

    shopItems[i].addEventListener('dblclick', () => {
        openModal();
    });
}

// Back button
document.getElementById('menu-back-button').addEventListener('click', () => { location.href = '../main/index.html'; });

// Initialization
setActiveItem(0);
// Set current time
const now = new Date(Date.now());
document.getElementById('time-value').textContent = `${('0' + now.getHours()).slice(-2)}:${('0' + now.getMinutes()).slice(-2)}`;
