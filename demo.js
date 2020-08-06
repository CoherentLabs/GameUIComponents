(() => {
    let currentComponent = '';

    function hideCurrentComponent() {
        document.querySelector(currentComponent).parentNode.classList.add('hidden');
    }

    function onClick(e) {
        if (currentComponent !== '') hideCurrentComponent();

        const name = e.currentTarget.dataset.link;

        if (!document.querySelector(`[src="components/${name}/${name}.js"]`)) {
            components.importScript(`components/${name}/${name}.js`);
        }

        const component = document.querySelector(`.${name}-component`);
        if (!component) return;

        component.parentNode.classList.remove('hidden');
        currentComponent = `.${name}-component`;

        const modalElement = document.getElementsByTagName('gameface-modal')[0];
        if (name === 'modal' && modalElement) {
            modalElement.style.display = '';
        } else if (name === 'modal' && ! modalElement) {
            // Wait for the component to be registered and attached to the dom.
            // Usually we would do this in the component's loading script
            // but in this case we are reusing an example(not a component) and
            // we don't want to change it.
            components.whenDefined('gameface-modal').then(() => {
                setTimeout(() => {
                    document.getElementsByTagName('gameface-modal')[0].style.display = ''
                }, 100);
            });
        }
    }

    const links = document.querySelectorAll('.component-link');
    for (let i = 0; i < links.length; i++) {
        links[i].addEventListener('click', onClick);
    }
})();