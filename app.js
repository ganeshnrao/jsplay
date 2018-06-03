/* global define */
/* eslint-disable import/no-webpack-loader-syntax */

define(require => {
  const $ = require('jquery')
  const Board = require('./board')
  const Character = require('./character')
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
    constructor ($container, boardString, character) {
      const $maze = $container.find('.maze')
      const boardData = boardFromString(boardString)
      this.board = new Board(boardData.board, boardData.width, $maze)
      this.character = new Character(this.board, character, $maze)
    }

    render () {
      this.board.render()
      this.character.render()
    }
  }

  const app = new App($('#app'), boardString, {index: 0, direction: 0})

  window.moveForward = () => {
    app.character.moveForward()
  }
})
