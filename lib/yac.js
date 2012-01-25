
/**
 * Module dependencies.
 */

var prefix = '\033['
  , suffix = 'm';

var styles = {
    bold: 1
  , italic: 3
  , underline: 4
  , inverse: 7
  , white: 37
  , grey: 90
  , black: 30
  , blue: 34
  , cyan: 36
  , green: 32
  , magenta: 35
  , red: 31
  , yellow: 33
  //, foreground: '38;5;'
  //, background: '48;5;'
};

var clear = {
    bold: 22
  , italic: 23
  , underline: 24
  , inverse: 27
  , white: 39
  , grey: 39
  , black: 39
  , blue: 39
  , cyan: 39
  , green: 39
  , magenta: 39
  , red: 39
  , yellow: 39
  //, foreground: 39
  //, background: 48
};


/**
 * Creates a Cursor instance based off the given `writable stream` instance.
 */

function create (stream) {
  var cursor = Object.create(proto);
  cursor.stream = stream;
  return cursor;
}
module.exports = exports = create;


function rgb (r, g, b, mode) {

}


function rgb5 (r, g, b, mode) {
  var red = Math.round(r)
    , green = Math.round(g)
    , blue = Math.round(b)
    , color = 16 + (red*36) + (green*6) + blue;
  mode || (mode = 'foreground');
  return prefix + styles[mode] + color + suffix;
}

var proto = {};


Object.keys(styles).forEach(function (style) {
  var name = style[0].toUpperCase() + style.substring(1);
  proto[style] = function () {
    this.stream.write(prefix + styles[style] + suffix);
  }
  proto['clear'+name] = function () {
    this.stream.write(prefix + clear[style] + suffix);
  }
});

proto.clear = function () {
  this.stream.write(prefix + 0 + suffix);
}
