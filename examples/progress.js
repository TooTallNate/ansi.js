
var tty = require('tty')
  , ansi = require('../')

function Progress (stream) {
  this.cursor = ansi(stream)
  this.tty = !!stream.isTTY

  if (!this.tty && stream.hasOwnProperty('fd')) {
    this.tty = tty.isatty(stream.fd)
  }
  if (this.tty) {
    this.width = (stream.getWindowSize
      ? stream.getWindowSize()[0]
      : tty.getWindowSize()) / 2 | 0
  } else {
    this.width = 40
  }

  this.open = '['
  this.close = ']'
  this.complete = '▬'
  this.incomplete = '⋅'

  this.cursor.savePosition()
  this.setProgress(0)
}

Progress.prototype.setProgress = function setProgress (v) {
  this.progress = Math.max(0, Math.min(v, 100))

  var n = this.width * (this.progress / 100) | 0
    , i = this.width - n

  if (n === this.width) {
    --n
  }
  if (i === this.width) {
    --i
  }

  this.cursor
    .restorePosition()
    .eraseLine(2)
    .fg.grey()
    .write(this.open)
    .fg.white()
    .write(Array(n).join(this.complete))
    .write(Array(i).join(this.incomplete))
    .fg.grey()
    .write(this.close)
    .fg.reset()
    .write('\n')

}




// Usage
var p = new Progress(process.stdout)

;(function tick () {
  p.setProgress(p.progress + (Math.random() * 5))
  p.cursor.eraseLine(2)
  console.log('progress: %d', p.progress)
  if (p.progress < 100)
    setTimeout(tick, 100)
})()
