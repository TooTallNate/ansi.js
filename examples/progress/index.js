#!/usr/bin/env node

var tty = require('tty')
  , assert = require('assert')
  , ansi = require('../../')

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

function c (char, length) {
  return Array.apply(null, Array(length)).map(function () {
    return char
  }).join('')
}

Progress.prototype.setProgress = function setProgress (v) {
  this.progress = Math.max(0, Math.min(v, 100))

  var n = this.width * (this.progress / 100) | 0
    , i = this.width - n
    , com = c(this.complete, n)
    , inc = c(this.incomplete, i)

  assert.equal(com.length + inc.length, this.width)

  this.cursor
    .restorePosition()
    .eraseLine(2)
    .fg.grey()
    .write(this.open)
    .fg.white()
    .write(com)
    .write(inc)
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
