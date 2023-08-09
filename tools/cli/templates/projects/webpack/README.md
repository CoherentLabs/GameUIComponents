# The default coherent-guic-cli Webpack template

This is the default template for [GameUIcomponents](https://coherentlabs.github.io/GameUIComponents/en/) using [Vite](https://webpack.js.org/) creates using [coherent-guic-cli](https://www.npmjs.com/package/coherent-guic-cli).

Uses Webpack with various plugins and loaders to setup an environment that can handle
- importing JavaScript modules - [babel-loader](https://webpack.js.org/loaders/babel-loader/)
- importing CSS - [css-loader](https://webpack.js.org/loaders/css-loader/) and [style-loader](https://webpack.js.org/loaders/style-loader/)
- loading HTML and injecting dependencies using link and script tags for styles and JS - [html-webpack-plugin](https://webpack.js.org/plugins/html-webpack-plugin/)
- loading assets such as images - [file-loader](https://v4.webpack.js.org/loaders/file-loader/)

## How to Run

### Create a Project
```
coherent-guic-cli create-project webpack <directory>
```
this will create a project from this template

### Navigate to the project
```
cd <directory>
```
execute after the project has been created and its dependencies installed.

## Commands

### build

```
npm run build
```
will create a production (minified) build

### build:dev
```
npm build:dev
```
will create a development build (non minified)

### watch
```
npm run watch
```
will start a development server with live reload (required polyfills are included in the sample - check index.js)