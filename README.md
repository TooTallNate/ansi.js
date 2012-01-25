ansi.js
=========
### ANSI formatting tool for Node.js

`ansi.js` is a module for Node.js that writes provides an easy-to-use API for
witing ANSI escape codes to `Stream` instances. ANSI escape codes are used to do
fancy things in a terminal window, like render text in colors, delete characters,
lines, the entire window, or hide and show the cursor, and lots more!

#### Features:

 * 256 color support for terminals!
 * Works with *any* writable `Stream` instance.
 * Converts CSS color codes and RGB values into ANSI escape codes.
 * Low-level; you are in control of when escape codes are used, it's not abstracted.


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
