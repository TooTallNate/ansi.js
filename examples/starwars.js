
/**
 * A little script to play the ACSII Star Wars, but with a hidden cursor,
 * since over `telnet(1)` the cursor remains visible which is annoying.
 */

var net = require('net')
  , cursor = require('../')(process.stdout)

var socket = net.connect(23, 'towel.blinkenlights.nl')

socket.on('connect', function () {
  cursor.hide()
  socket.pipe(process.stdout)
})

process.on('SIGINT', function () {
  socket.destroy()
})

process.on('exit', function () {
  cursor.show().write('\n')
})
