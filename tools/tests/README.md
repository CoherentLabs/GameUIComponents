<!--Copyright (c) Coherent Labs AD. All rights reserved. -->
# Testing the components

The components are tested using [Jasmine](https://jasmine.github.io/) for assertions
and checks and [Karma](https://karma-runner.github.io/latest/index.html) for running the tests.

The test.js file located in scripts runs all tests. It builds the components and
copies the bundle files into the tests folders to ensure that the tests are running
with the latest version of the components.

To run the test execute:

`npm run test`

in the root of the GameUIComponents.

The test script will execute `karma start tools/tests/karma.conf.js` which will automatically
run the tests in Google Chrome.

# Adding new tests

All tests are located in tools/tests. There is a separate folder for each component.
The name of the folder should be the same as the name of the folder that contains the
source of the component. For example the test folder for the radial-menu should be radial-menu.
This is required in order to simplify the setup process that copies the source bundles into
the test folders. All tests are named **test.js**. The `karma.config.js` file
contains the list of tests that are going tp be executed. If you need to disable a test or
add a new one - edit the files filed in the configuration.

The actions.js file contains common helper functions that are used in a lot of tests -
click, nested requestAnimationFrame for the cases where you need to wait a couple of
frames for the page to be completely rendered before you continue with the test.


# The structure of a test

 In order to setup the test page we need to manually create the content and attach it to the DOM using JavaScript. For this we create a template that is going to be the content of the component:

At the top of test.js:

````
const template = `<gameface-dropdown class="gameface-dropdown-component">
<dropdown-option slot="option">Cat</dropdown-option>
<dropdown-option slot="option">Dog</dropdown-option>
<dropdown-option slot="option">Giraffe</dropdown-option>
<dropdown-option slot="option">Lion</dropdown-option>
`</gameface-dropdown>
````

After that we create HTMLElements from this template and attach it to the DOM:

````
const el = document.createElement('div');
el.className = 'dropdown-test-wrapper';
el.innerHTML = template;

document.body.appendChild(el);
````

If you do this multiple times within a test, it is good practice
to clean the DOM before attaching a new element to avoid duplications:

````
const currentElement = document.querySelector('.dropdown-test-wrapper');

if (currentElement) {
    currentElement.parentElement.removeChild(currentElement);
}
````

If you need to do an asynchronous setup of the page simply return
a promise and resolve it after the amount of time you need:

````
function setupDropdownTestPage() {
    const el = document.createElement('div');
    el.className = 'dropdown-test-wrapper';
    el.innerHTML = template;

    const currentElement = document.querySelector('.dropdown-test-wrapper');

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
````

All tests are wrapped in describe. Use the built in lifecycle hooks to do any setup before the tests or cleanup after it. Use individual describes if the tests require different environment that needs to be setup independently.

Refer to the Jasmine and Karma documentations for more information on their APIs.