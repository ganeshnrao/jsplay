/* global define */
/* eslint-disable import/no-webpack-loader-syntax */

define(require => {
  const $ = require('jquery')
  const Board = require('./board')
  const boardString = require('text!./maze.txt')

  const boardFromString = boardString => boardString.split('\n').filter(s => s !== '')
    .reduce((result, row) => {
      const cells = row.split(/[\s]+/g)
      result.width = result.width || cells.length
      result.board = result.board.concat(cells)
      return result
    }, {
      width: 0,
      board: []
    })

  class App {
    constructor ($container, boardString) {
      this.$container = $container
      const boardData = boardFromString(boardString)
      this.board = new Board(boardData.board, boardData.width, this.$container.find('.maze'))
      console.log(this.board)
    }
  }

  return new App($('#app'), boardString)
})
