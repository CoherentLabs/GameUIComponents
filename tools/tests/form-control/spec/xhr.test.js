/* eslint-disable max-lines-per-function */
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

    it('Should be able to attach a listener to the xhr property', async () => {
        const form = document.querySelector('gameface-form-control');
        const xhr = form.xhr;
        const submitButton = document.querySelector('[type="submit"]');
        let load = 0;

        const received = await new Promise((resolve) => {
            xhr.onload = () => {
                load++;
                xhr.onload = () => resolve(load);
                click(submitButton);
            };
            click(submitButton);
        });

        assert(received === 1, `The xhr load event callback was called ${load} times, expected: 1.`);
    });
});
