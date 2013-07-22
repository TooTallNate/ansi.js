#! /usr/bin/env node

var ansi = require('../')
  , always = process.argv[1].match(/(?:ansi-)?echo$/i)
  , colour = process.env['COLOUR'] || process.env['COLOR']
  , enabled = colour == 'ALWAYS' ? true : colour == 'NEVER' ? false : undefined
  , cursor = ansi(process.stdout, { enabled: always || enabled })

  , colours =
    { r: 'red'
    , g: 'green'
    , b: 'blue'
    , c: 'cyan'
    , m: 'magenta'
    , y: 'yellow'
    , k: 'black'
    , w: 'white'
    }

  , styles =
    { o: 'bold'
    , u: 'underline'
    , i: 'italic'
    , v: 'inverse'
    }

  , nl = process.argv[2] !== '-n'
  , ac = 2 + !nl
  , help = /^-(?:h|-help)$/.test(process.argv[2])

  , usage = 'usage: ansi [-n] <format>\n\
\n\
is an "echo" replacement, where format may turn on/off ansi colours/features\n\
via @{escape} sequences, as in:\n\
\n\
 @{rgbcmykw} foreground: Red, Green, Blue, Cyan, Magenta, Yellow, blacK, White\n\
 @{RGBCMYKW} BACKGROUND: Red, Green, Blue, Cyan, Magenta, Yellow, blacK, White\n\
 @{ouiv}     enter bOld / Underline / Italic / inVerse case\n\
 @{OUIV}     leave bOld / Underline / Italic / inVerse case\n\
 @{-}        reset all colours and styles\n\
\n\
By default, colour output is only enabled for TTYs, but setting the env\n\
vars COLOUR or COLOR to "ALWAYS" (or "NEVER") overrides this detection.\n';

if (help || process.argv.length < 3) {
  console[help ? 'log' : 'error'](usage);
}
else {
  process.argv.slice(ac).forEach(write);
  if (nl) cursor.write('\n');
}

function write(format, argNo) {
  var pos = 0
    , fmt = /@\{([-rgbcmykwRGBCMYKWouivOUIV]+)\}/g
    , raw = ''
    , code, lower, colour, reset, style
    ;

  if (argNo > 0) cursor.write(' ');

  format.split(fmt).forEach(function(chunk, i) {
    if (!(i & 1)) {
      cursor.write(chunk);
      return;
    }

    for (i = 0; i < chunk.length; i++) {
      code = chunk[i];
      lower = code.toLowerCase();

      if ((colour = colours[lower])) {
        if (lower === code)
          cursor[colour]();
        else
          cursor.bg[colour]();
        continue;
      }

      if ((reset = code === '-')) {
        code = chunk[++i];
        if (code === undefined) {
          cursor.reset();  
          return;
        }
      }

      if ((style = styles[lower])) {
        reset = lower !== style;
        if (reset)
          style = 'reset' + style[0].toUpperCase() + style.slice(1);
        cursor[style]();
      }
    }
  });
}
