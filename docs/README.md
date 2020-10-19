This is the documentation source of the GameUIComponents.

# Getting Started

The documentation is built using [Hugo - a framework for building websites](https://gohugo.io/).
You need to install it globally in order to be able to use it.
The installation steps vary depending on the operating system on which it will be used.
For Windows you can [download](https://github.com/gohugoio/hugo/releases) the non-extended version. Extract the files and add the containing folder to the user PATH variable.
Refer to the [documentation](https://gohugo.io/getting-started/installing/) for more information.

Before you start the hugo server you need to fetch the theme. Run:

```
git submodule update --init
```

After hugo was installed navigate to the /docs folder and run:

```
hugo server -t hugo-theme-techdoc
```

or

```
hugo server -D
```

to start a development server.