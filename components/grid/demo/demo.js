/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

(() => {
    this.current = 0;

    this.showDetails = (e) => {
        const targetId = e.currentTarget.dataset.id;

        if (this.current) {
            document.querySelector(`.avatar${this.current}`).classList.remove('selected');
            document.querySelector(`#avatar${this.current}-classes`).style.display = 'none';
        }

        this.current = targetId;
        document.querySelector(`.avatar${this.current}`).classList.add('selected');
        document.querySelector(`#avatar${this.current}-classes`).style.display = 'flex';
    }


    this.deselectAllClasses = () => {
        const classes = document.getElementsByClassName('class');
        for (let i = 0; i < classes.length; i++) {
            classes[i].classList.remove('active');
        }
    }

    this.selectClass = (e) => {
        this.deselectAllClasses();
        const target = e.currentTarget;
        target.classList.add('active');
    }

    const avatars = document.getElementsByClassName('avatar');
    for (let i = 0; i < avatars.length; i++) {
        avatars[i].addEventListener('click', this.showDetails);
    }

    const classes = document.getElementsByClassName('class');
    for (let i = 0; i < classes.length; i++) {
        classes[i].addEventListener('click', this.selectClass);
    }
})();