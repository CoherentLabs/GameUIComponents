components.whenDefined('gameface-modal').then(() => {
    components.loadHTML('/examples/modal/my-modal/index.html').then((html) => {
        document.body.appendChild(html);

        const modal = document.getElementsByTagName('gameface-modal')[0];
        const nameText = document.querySelector('.name-text');
        const nameField = document.querySelector('input[for="name"]');

        modal.querySelector('.confirm').addEventListener('click', () => {
            if(!nameText || !nameField) return modal.close();
            document.querySelector('.name').textContent = nameField.value;
            modal.close();

            nameText.classList.remove('hidden');
            nameText.querySelector('.name').textContent = nameField.value;
        });
    });
});