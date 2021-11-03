This is the documentation source of the GameUIComponents.

# Getting Started

The documentation is built using [Hugo - a framework for building websites](https://gohugo.io/). You need to install it globally in order to be able to use it. The installation steps vary depending on the operating system on which it will be used. For Windows you can [download](https://github.com/gohugoio/hugo/releases) the non-extended version. Extract the files and add the containing folder to the user PATH variable. Refer to the [documentation](https://gohugo.io/getting-started/installing/) for more information.

Before you start the hugo server you need to fetch the theme. Run:

```
git submodule update --init
```

After hugo is installed navigate to the /docs folder.

In order to test the example pages locally, open **config.toml** and edit the first line to:

```baseURL = "localhost"```

This will use the proper paths to the required files in the examples.

Now run:

```
hugo server -t hugo-theme-techdoc
```

or

```
hugo server -D -F
```

 -F or --buildFuture is to configure Hugo to include content with publishdate in the future. The publish date that we use is the current local date. but Hugo uses some other time zone for reference, so the current local date seems in the future.

to start a development server.


# Adding a page

All components must have an info page that explains what the component is and how to use it and an interactive demo page that shows how the component looks and how it works. Most of the documentation files are automatically copied from the source. Run `node scripts/transfer-doc-files.js` in the root of the repo to copy all documentation files[^1] or `npm run build:documentation` to build the components and copy the documentation files.

1. The documentation pages are located in content/components. These are the markdown files that describe the components. They are automatically copied from the source of the component.
2. The demo pages are located in content/examples/. All demo pages must have a [front matter](https://gohugo.io/content-management/front-matter/) and the copyright notice comment:

~~~~{.html}
---
title: "Component Name"
date: 2020-10-08T14:00:45Z
draft: false
---

<!--Copyright (c) Coherent Labs AD. All rights reserved. -->
~~~~

3. The static files used for the demos are located in static/components or in static/images.
The static/components/ folder contains the JavaScript source of the component as well as its styles.
The static/images/ folder contains any images used in the demos.

Make sure all required files are present, run `hugo` or `hugo server` to test your changes in a
static build and a development server respectively.


[^1]: The example `.html` page is not automatically copied as most of the times
it has to be different than the demo in the source - usually simpler or with different styles that better fit
the documentation site. The images are not copied for the same reason.