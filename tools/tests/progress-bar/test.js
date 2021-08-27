/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

const templateNoAnimation = `<gameface-progress-bar></gameface-progress-bar>`;

// Async will test after 1000ms that is why the duration is set below 1000ms.
const templateAnimation100 = `<gameface-progress-bar data-animation-duration="100"></gameface-progress-bar>`;


function setupProgressBar(template) {
  const el = document.createElement('div');
  el.className = 'progress-bar-wrapper';
  el.innerHTML = template;

  // Since we don't want to replace the whole content of the body using
  // innerHtml setter, we query only the current custom element and we replace
  // it with a new one; this is needed because the specs are executed in a random
  // order and sometimes the component might be left in a state that is not
  // ready for testing
  const currentElement = document.querySelector('.progress-bar-wrapper');

  if (currentElement) {
    currentElement.parentElement.removeChild(currentElement);
  }

  document.body.appendChild(el);

  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, 1000);
  });
}

const targetValue = '75';
const targetValue2 = '25';

function createProgressBarAsyncSpec(callback, time = 1000) {
  return new Promise(resolve => {
    setTimeout(() => {
      callback();
      resolve();
    }, time);
  });
}

describe('Progress Bar Tests', () => {
  afterAll(() => {
    const currentElement = document.querySelector('.progress-bar-wrapper');

    if (currentElement) {
      currentElement.parentElement.removeChild(currentElement);
    }
  });

  describe('Progress Bar Component', () => {
    beforeEach(function (done) {
      setupProgressBar(templateNoAnimation).then(done).catch(err => console.error(err));
    });

    it(`Should have rendered`, () => {
      assert(document.querySelector('gameface-progress-bar') !== null, `Progress Bar element is not rendered.`);
    });
  });

  describe('Progress Bar Component', () => {
    beforeEach(function (done) {
      setupProgressBar(templateNoAnimation).then(done).catch(err => console.error(err));
    });

    it(`Should have been set to ${targetValue}% width.`, () => {
      document.querySelector('gameface-progress-bar').setProgress(targetValue);
      assert(document.querySelector('.progress-bar-filler').style.width === `${targetValue}%`, `Progress bar has not been set to ${targetValue}% width.`);
    });
  });

  describe('Progress Bar Component', () => {
    beforeEach(function (done) {
      setupProgressBar(templateNoAnimation).then(done).catch(err => console.error(err));
    });

    it(`Should have been set to 0% width when a value lower than 0 is passed.`, () => {
      document.querySelector('gameface-progress-bar').setProgress(-50);
      assert(document.querySelector('.progress-bar-filler').style.width === `0%`, `Progress bar has not been set to 0% width.`);
    });
  });

  describe('Progress Bar Component', () => {
    beforeEach(function (done) {
      setupProgressBar(templateNoAnimation).then(done).catch(err => console.error(err));
    });

    it(`Should have been set to 100% width when a value higher than the maximum is passed.`, () => {
      document.querySelector('gameface-progress-bar').setProgress(200);
      assert(document.querySelector('.progress-bar-filler').style.width === `100%`, `Progress bar has not been set to 100% width.`);
    });
  });

  describe('Progress Bar Component', () => {
    beforeEach(function (done) {
      setupProgressBar(templateAnimation100).then(done).catch(err => console.error(err));
    });

    it(`Should have animated to ${targetValue}% width.`, async (done) => {
      const progressBar = document.querySelector('gameface-progress-bar');

      progressBar.setProgress(targetValue);
      createProgressBarAsyncSpec(() => {
        assert(document.querySelector('.progress-bar-filler').style.width === `${targetValue}%`, `Progress bar has not animated to ${targetValue}% width.`);
      }).then(done);
    });
  });

  describe('Progress Bar Component', () => {
    beforeEach(function (done) {
      setupProgressBar(templateAnimation100).then(done).catch(err => console.error(err));
    });

    it(`Should have animated to ${targetValue2}% width.`, async (done) => {
      const progressBar = document.querySelector('gameface-progress-bar');
      const progressBarFiller = document.querySelector('.progress-bar-filler');

      progressBar.setProgress(targetValue);
      await createProgressBarAsyncSpec(() => {
        assert(progressBarFiller.style.width === `${targetValue}%`, `Progress bar has not animated to ${targetValue}% width.`);
      });

      progressBar.setProgress(targetValue2);
      createProgressBarAsyncSpec(() => {
        assert(progressBarFiller.style.width === `${targetValue2}%`, `Progress bar has not animated to ${targetValue2}% width.`);
      }).then(done);
    });
  });
});

