describe('Form control XHR property tests', () => {
    const template = `<div class="form-wrapper">
<gameface-form-control id="xhr-form" action="http://localhost:${SERVER_PORT}/user" method="get">
<input name="username" value="name" type="text" />
<input name="password" value="pass" type="password" />
<button class="form-element" type="submit">Submit</button>
</gameface-form-control>
</div>`;

    beforeAll(() => {
        const el = document.createElement('div');
        el.className = 'test-wrapper';
        el.innerHTML = template;

        const currentEl = document.querySelector('.test-wrapper');
        if (currentEl) {
            currentEl.parentElement.removeChild(currentEl);
        }

        document.body.appendChild(el);
    });

    afterAll(() => {
        const currentEl = document.querySelector('.test-wrapper');

        if (currentEl) {
            currentEl.parentElement.removeChild(currentEl);
        }
    });

    it('Should have xhr property exposed', () => {
        const form = document.querySelector('gameface-form-control');
        const xhr = form.xhr;

        assert.exists(xhr, 'The xhr property exists.');
    });

    it('Should be able to attach a listener to the xhr property', function (done) {
        const form = document.querySelector('gameface-form-control');
        const xhr = form.xhr;
        const submitButton = document.querySelector('[type="submit"]');
        let load = 0;

        xhr.onload = () => {
            load++;
            xhr.onload = () => {
                assert(load === 1, `The xhr load event callback was called ${load} times, expected: 1.`);
                done();
            }
            click(submitButton);
        }
        click(submitButton);
    });
});