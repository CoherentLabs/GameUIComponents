<!--Copyright (c) Coherent Labs AD. All rights reserved. -->
# Testing the components

The components are tested using [Jasmine](https://jasmine.github.io/), [Chai](https://www.chaijs.com/) for assertions
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

All tests are located in tools/tests. There is a separate folder for each component. All tests are named **test.js**.
The dependencies of the test are listed in the package.json file located in tools/tests. If your tests depends on some package - add it there:

tools/tests/package.json
~~~~{.js}
{
    "name": "components-tests",
    "dependencies": {
      "coherent-gameface-automatic-grid": "^1.0.6",
      "coherent-gameface-components": "^1.0.5",
      "coherent-gameface-checkbox": "^1.0.5",
      "coherent-gameface-dropdown": "^1.0.6",
      "coherent-gameface-form-control": "^1.0.1",
      "coherent-gameface-grid": "^1.0.2",
      "coherent-gameface-menu": "^1.0.7",
      "coherent-gameface-modal": "^1.0.4",
      "coherent-gameface-progress-bar": "^1.0.4",
      "coherent-gameface-radial-menu": "^1.0.3",
      "coherent-gameface-radio-button": "^1.0.1",
      "coherent-gameface-rangeslider": "^1.0.4",
      "coherent-gameface-router": "^1.0.5",
      "coherent-gameface-scrollable-container": "^1.0.6",
      "coherent-gameface-slider": "^1.0.5",
      "coherent-gameface-switch": "^1.0.1",
      "coherent-gameface-tabs": "^1.0.6",
      "coherent-gameface-tooltip": "^1.0.1"
      // add your dependencies here
    },
    "author": "CoherentLabs",
    "license": "ISC"
}
~~~~

By default the tests create a symbolic links between the source of the components and the modules installed in tests/node_modules. This is necessary in order to test the local packages. If we don't create links we'll test the published npm modules. The links are not deleted between test runs. If you wish to skip the linking pass --link=false to the test script:

`npm run test -- --link=false`

# Configuration

The `karma.config.js` file contains the list of tests that are going to be
executed. If you need to disable a test or add a new one - edit the files
property in the configuration.

karma.conf.js:
~~~~{.js}
files: [
    { pattern: 'node_modules/coherent-gameface-*/**/*.css', included: true, type: 'css' },
    { pattern: 'node_modules/coherent-gameface-components/umd/*.development.js', served: true },
    { pattern: 'node_modules/coherent-gameface-*/umd/*.development.js', served: true },
    { pattern: 'actions.js', served: true },
    'scrollable-container/*.js',
    'checkbox/test.js',
    'dropdown/*.js',
    'lib/*.js',
    'menu/*.js',
    'modal/*.js',
    'radial-menu/*.js',
    'router/*.js',
    'tabs/*.js',
    'progress-bar/*.js',
    'rangeslider/*.js',
    'automatic-grid/*.js',
    'radio-button/*.js',
    'switch/*.js',
    'form-control/*.js',
    'tooltip/*js',
],
~~~~

The actions.js file contains common helper functions that are used in a lot of tests -
click, nested requestAnimationFrame for the cases where you need to wait a couple of
frames for the component to be completely rendered before you continue with the test.

Karma is configured to run the tests once and then stop the server. If you need to run
tests multiple times per one connection set the [singleRun](http://karma-runner.github.io/6.3/config/configuration-file.html#singlerun) to false in karma.conf.js.

Currently if a test fails the whole test runner process will exit with an error code.
If you would like to ignore failing tests and continue until all tests are executed,
set the [failOnFailingTestSuite](http://karma-runner.github.io/6.3/config/configuration-file.html#failonfailingtestsuite) to false.

Refer to the [full list of options](http://karma-runner.github.io/6.3/config/configuration-file.html) for more details.

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

All tests are wrapped in `describe`. Use the built in lifecycle hooks to do any setup before the tests or cleanup after it. Use individual describes if the tests require different environment that needs to be setup independently. For example if two tests define functions that have the same name, wrap them in describe because otherwise one will
overwrite the other.

Refer to the Jasmine and Karma documentations for more information on their APIs.


# Inspecting running tests

The `npm run tests` command will start Karma which will spawn a server that will host and
execute the tests. Karma will automatically open the test page in Google Chrome.
The default page is http://localhost:9876. You can inspect and debug this page by
clicking th debug button located in the top right corner of the page.
The default debugging page in Gameface is http://localhost:9876/debug.html.