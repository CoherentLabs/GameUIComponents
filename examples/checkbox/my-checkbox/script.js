components.whenDefined('gameface-checkbox').then(() => {
    components.loadHTML('/examples/checkbox/my-checkbox/index.html').then((html) => {
        document.querySelector('.checkbox-component').parentElement.appendChild(html);
    });
});