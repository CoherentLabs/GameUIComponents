components.whenDefined('gameface-checkbox').then(() => {
    components.loadHTML('my-checkbox/index.html').then((html) => {
        document.body.appendChild(html);
    });
});