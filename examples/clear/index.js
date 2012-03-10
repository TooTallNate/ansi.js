#!/usr/bin/env node

/**
 * Like GNU ncurses "clear" command.
 * https://github.com/mscdex/node-ncurses/blob/master/deps/ncurses/progs/clear.c
 */

require('../../')(process.stdout)
  .eraseData(2)
  .goto(1, 1)
