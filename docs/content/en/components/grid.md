---
date: 2024-1-24
title: Grid
draft: false
---

<!--Copyright (c) Coherent Labs AD. All rights reserved. Licensed under the MIT License. See License.txt in the project root for license information. -->

<a href="https://www.npmjs.com/package/coherent-gameface-grid"><img src="http://img.shields.io/npm/v/coherent-gameface-grid.svg?style=flat-square"/></a>

The grid is part of the Gameface components suite. It provides a set of styles which enable the creation of
a responsive grid.

Installation
===================

`npm i coherent-gameface-grid`

Usage
===================
First you need to import the grid library:

~~~~{.html}
<link rel="stylesheet" href="<path_to_grid.css>">
~~~~

Or if you use a css-loader:

~~~~~{.js}
import grid from 'coherent-gameface-grid/style.css';
~~~~~

The grid is made up of rows and columns. It is like a table. Each cell has a responsive width. The grid can have 12 columns. The width is specified by the class name - guic-col-6 is a column which takes half the width of a row. To create a row add a div with class name guic-row:

~~~~~{.html}
<div class="guic-row"></div>
~~~~~

To add a column create a div with class name guic-col-`<size_number>`:

~~~~~{.html}
<div class="guic-row">
    <div class="guic-col-12"></div>
    <div class="guic-col-6"></div>
    <div class="guic-col-6"></div>
</div>
~~~~~

You can add offsets to the columns. The offsets can be the same sizes as the columns. To add an offset create a column div and add to its class name guic-col-offset-`<size_number>`:

~~~~~{.html}
<div class="guic-row">
    <div class="guic-col-offset-11 guic-col-1"></div>
</div>
~~~~~

This will offset the column by 11. Keep in mind that the sum of the offset and the column size should not be greater than 12 because a row can be divided into 12 columns.

If you don't want to manually specify the widths of the columns you can use auto width by using the guic-col class. It doesn't have a size number. The columns will be automatically resized.

~~~~~{.html}
<div class="guic-row">
    <div class="guic-col"></div>
    <div class="guic-col"></div>
</div>
~~~~~