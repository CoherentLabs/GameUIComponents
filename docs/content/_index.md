---
date: 2020-10-08T14:00:45Z
lastmod: 2020-10-08T14:00:45Z
publishdate: 2020-10-08T14:00:45Z

title: Home
description: Text about this post
---

# Components for Game User Interface

This is a suite of custom elements designed specifically for Gameface. You can preview them by starting the demo. You can serve the root directory and open the demo.html file using an http-server of your choice. Or use the default setup in the package.

Navigate to the root directory and run:

    npm install

This will install a webpack server. After that run:

    npm run start:demo

This will serve the files on http://localhost:8080. Load that url in the Gameface player and preview the components.
You can change the port in the webpack.config.js file.

Custom components examples.

Usage
===================

Start an http-server in the root of the repository. Set the startup page in Gameface to
**http://localhost:8080/examples/<example_name>/"** and launch it.

You can use [http-server](https://www.npmjs.com/package/http-server) or any http-server that you like. Make sure you serve all files. The files in **/lib** and **/components** should be accessible.



Contributing
===================

To build the components run:

`npm run build`