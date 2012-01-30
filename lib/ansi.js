
/**
 * Reference: http://en.wikipedia.org/wiki/ANSI_escape_code
 */

/**
 * Module dependencies.
 */

var debug = require('debug')('ansi')
  , prefix = '\033[' // For all escape codes
  , suffix = 'm'; // Only for color codes

/**
 * The ANSI escape sequences.
 */

var codes = {
    up: 'A'
  , down: 'B'
  , forward: 'C'
  , back: 'D'
  , nextLine: 'E'
  , previousLine: 'F'
  , horizontalAbsolute: 'G'
  , eraseData: 'J'
  , eraseLine: 'K'
  , scrollUp: 'S'
  , scrollDown: 'T'
  , savePosition: 's'
  , restorePosition: 'u'
  , hide: '?25l'
  , show: '?25h'
};

/**
 * Rendering ANSI codes.
 */

var styles = {
    bold: 1
  , italic: 3
  , underline: 4
  , inverse: 7
};

/**
 * The negating ANSI code for the rendering modes.
 */

var reset = {
    bold: 22
  , italic: 23
  , underline: 24
  , inverse: 27
  , foreground: 39
  , background: 49
};

/**
 * The standard, styleable ANSI colors.
 */

var colors = {
    white: 37
  , grey: 90
  , black: 30
  , blue: 34
  , cyan: 36
  , green: 32
  , magenta: 35
  , red: 31
  , yellow: 33
};


/**
 * Creates a Cursor instance based off the given `writable stream` instance.
 */

function ansi (stream, options) {
  return new Cursor(stream, options);
}
module.exports = exports = ansi;

/**
 * The `Cursor` class.
 */

function Cursor (stream, options) {
  this.stream = stream;
  this.fg = this.foreground = new Foreground(this);
  this.bg = this.background = new Background(this);
}
exports.Cursor = Cursor;

/**
 * The `Foreground` class.
 */

function Foreground (cursor) {
  this.cursor = cursor;
}
exports.Foreground = Foreground;

/**
 * The `Background` class.
 */

function Background (cursor) {
  this.cursor = cursor;
}
exports.Background = Background;

/**
 * Set up the positional ANSI codes.
 */

Object.keys(codes).forEach(function (name) {
  debug('defining `Cursor#'+name+'`');
  var code = String(codes[name]);
  Cursor.prototype[name] = function () {
    debug('Cursor#'+name+'()`');
    var c = code;
    if (arguments.length > 0) {
      c = Math.round(arguments[0]) + code;
    }
    this.stream.write(prefix + c);
  }
});

/**
 * Set up the functions for the rendering ANSI codes.
 */

Object.keys(styles).forEach(function (style) {
  var name = style[0].toUpperCase() + style.substring(1);

  debug('defining `Cursor#'+style+'`');
  Cursor.prototype[style] = function () {
    this.stream.write(prefix + styles[style] + suffix);
  }

  debug('defining `Cursor#reset'+name+'`');
  Cursor.prototype['reset'+name] = function () {
    this.stream.write(prefix + reset[style] + suffix);
  }
});

/**
 * Setup the functions for the standard colors.
 */

Object.keys(colors).forEach(function (color) {
  debug('defining `Foreground#'+color+'`');
  Foreground.prototype[color] = function () {
    this.cursor.stream.write(prefix + colors[color] + suffix);
  }

  debug('defining `Background#'+color+'`');
  var bgCode = colors[color] + 10;
  Background.prototype[color] = function () {
    this.cursor.stream.write(prefix + bgCode + suffix);
  }

  debug('defining `Cursor#`'+color+'`');
  Cursor.prototype[color] = function () {
    this.foreground[color]();
  }
});

/**
 * Makes a beep sound!
 */

Cursor.prototype.beep = function () {
  debug('Cursor#beep()');
  this.stream.write('\007');
}

/**
 * Reset the foreground color.
 */

Foreground.prototype.reset = function () {
  this.cursor.stream.write(prefix + reset.foreground + suffix);
}

/**
 * Reset the background color.
 */

Background.prototype.reset = function () {
  this.cursor.stream.write(prefix + reset.background + suffix);
}

/**
 * Resets all ANSI formatting on the stream.
 */

Cursor.prototype.reset = function () {
  this.stream.write(prefix + '0' + suffix);
}

/**
 * Sets the foreground color with the given RGB values.
 * The closest match out of the 216 colors is picked.
 */

Foreground.prototype.rgb = function (r, g, b) {
  this.cursor.stream.write(prefix + '38;5;' + rgb(r, g, b) + suffix);
}

/**
 * Sets the background color with the given RGB values.
 * The closest match out of the 216 colors is picked.
 */

Background.prototype.rgb = function (r, g, b) {
  this.cursor.stream.write(prefix + '48;5;' + rgb(r, g, b) + suffix);
}

/**
 * Same as `cursor.fg.rgb()`.
 */

Cursor.prototype.rgb = function (r, g, b) {
  this.foreground.rgb(r, g, b);
}

/**
 * Accepts CSS color codes for use with ANSI escape codes.
 * For example: `#FF000` would be bright red.
 */

Foreground.prototype.hex = Background.prototype.hex = function (color) {
  var rgb = hex(color);
  this.rgb(rgb[0], rgb[1], rgb[2]);
}

/**
 * Same as `cursor.fg.hex()`.
 */

Cursor.prototype.hex = function (color) {
  this.foreground.hex(color);
}

function rgb (r, g, b) {
  var red = r / 255 * 5
    , green = g / 255 * 5
    , blue = b / 255 * 5;
  return rgb5(red, green, blue);
}

function rgb5 (r, g, b) {
  var red = Math.round(r)
    , green = Math.round(g)
    , blue = Math.round(b);
  return 16 + (red*36) + (green*6) + blue;
}

function hex (color) {
  var c = color[0] === '#' ? color.substring(1) : color
    , r = c.substring(0, 2)
    , g = c.substring(2, 4)
    , b = c.substring(4, 6);
  return [parseInt(r, 16), parseInt(g, 16), parseInt(b, 16)];
}
