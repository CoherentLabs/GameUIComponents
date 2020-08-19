components.whenDefined('gameface-checkbox').then(() => {
    components.loadHTML('/examples/checkbox/my-checkbox/index.html').then((html) => {
        document.body.appendChild(html);
    });
});