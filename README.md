# Components for Game User Interface

The Components source code is located in the GameUIComponents_Public folder.
For more information about the components library, how to install and use components
check the README.md located in GameUIComponents_Public.

## Running the tests

```
npm run test -- --browsers Chrome
```

To run the tests and rebuild the components before that, run:

```
npm run test -- --rebuild
```

To run the tests in Gameface, run:

```
npm run test -- --cohtml <path_to_cohtml_package>
```

Example:

```
npm run test -- --cohtml C:\\cohtml-1.12.1.12_16.12
```

To start a Karma server without spawning a browser, run:

```
npm run test
```

And open `http://localhost:9876` in any browser in order to connect to the Karma server or
pass the `--url=http://localhost:9876/debug.html` parameter to the Cohtml player to run the
tests in Gameface.