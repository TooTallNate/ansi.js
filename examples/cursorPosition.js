
var tty = require('tty')
var cursor = require('../')(process.stdout)

process.stdin.once('data', function (b) {
  var xy = /\[(\d+)\;(\d+)R$/.exec(b.toString()).slice(1,3)
  console.error({ x: xy[0], y: xy[1] })
  tty.setRawMode(false)
  process.stdin.pause()
})

process.stdin.resume()
tty.setRawMode(true)

cursor.queryPosition()
