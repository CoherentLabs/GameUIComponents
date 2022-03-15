/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { XHR_TEMPLATE } from '../utils/templates';

describe('Form control XHR property tests', () => {
    beforeAll(() => {
        const el = document.createElement('div');
        el.className = 'test-wrapper';
        el.innerHTML = XHR_TEMPLATE;

        cleanTestPage('.test-wrapper');

        document.body.appendChild(el);
    });

    afterAll(() => cleanTestPage('.test-wrapper'));

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
            };
            click(submitButton);
        };

        click(submitButton);
    });
});
