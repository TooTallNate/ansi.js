ansi.js
=========
### Advanced ANSI formatting tool for Node.js

![](http://f.cl.ly/items/0D3w3d1W443f2z3X361G/Screen%20Shot%202012-01-26%20at%202.18.31%20AM.png)

`ansi.js` is a module for Node.js that writes provides an easy-to-use API for
writing ANSI escape codes to `Stream` instances. ANSI escape codes are used to do
fancy things in a terminal window, like render text in colors, delete characters,
lines, the entire window, or hide and show the cursor, and lots more!

The code for the example in the screenshot above can be found in the `examples`
directory.

#### Features:

 * 256 color support for the terminal!
 * Works with *any* writable `Stream` instance.
 * Allows you to move the cursor anywhere on the terminal window.
 * Allows you to delete existing contents from the terminal window.
 * Allows you to hide and show the cursor.
 * Converts CSS color codes and RGB values into ANSI escape codes.
 * Low-level; you are in control of when escape codes are used, it's not abstracted.
 * Optional automatic cleanup of stream by before closing (still TODO).


Installation
------------

Install with `npm`:

``` bash
$ npm install ansi
```


Example
-------

``` js
var ansi = require('ansi')
  , cursor = ansi(process.stdout);

// Set the font color to rgb(22, 254, 109)
cursor.rgb(22, 254, 109);

console.log('this will be colored text!');

// Set the background color to bright red
cursor.bg.rgb(255, 0, 0);

console.log('this will be colored text with a red background!');

cursor.reset();

console.log('this will be regular text');
```
