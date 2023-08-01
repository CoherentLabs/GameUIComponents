# The default coherent-guic-cli Vite template

This is the default template for [GameUIcomponents](https://coherentlabs.github.io/GameUIComponents/en/) using [Vite](https://vitejs.dev/) creates using [coherent-guic-cli](https://www.npmjs.com/package/coherent-guic-cli).
If you need to change Vite's configuration - create a `vite.config.js` in the root and setup whatever options you need to change. Check the full configuration guide [here](https://vitejs.dev/config/).

## How to Run

### Create a Project
```
coherent-guic-cli create-project vite <directory>
```
this will create a project from this template

### Navigate to the project
```
cd <directory>
```
execute after the project has been created and its dependencies installed.

## Commands

### dev
```
npm run dev
```
will start a development server with HMR and page reload (no need for polyfills)

### build
```
npm build
```
will create a production build

### preview
```
npm run preview
```
will start a local web server that serves the built solution from ./dist folder (the result from build)