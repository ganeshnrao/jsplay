/* global define */
/* eslint-disable import/no-webpack-loader-syntax */

define(require => {
  const $ = require('jquery')
  const Board = require('./board')
  const Character = require('./character')
  const boardString = require('text!./maze.txt')

  class App {
    constructor ($container, boardString, character) {
      const $board = $('<div class="maze"></div>')
      $container.append($board)
      this.playBackSpeed = 1000
      this.board = new Board(boardString, $board)
      this.character = new Character(this.board, character, $board)
      this.history = []
    }

    render () {
      this.board.render()
      this.character.render()
    }

    saveHistory () {
      this.history.push({
        board: this.board.isDirty() ? this.board.getState() : undefined,
        character: this.character.isDirty() ? this.character.getState() : undefined
      })
      this.board.clearDirty()
      this.character.clearDirty()
    }

    play () {
      this.playBackTimer = setTimeout(() => {
        if (!this.history.length) {
          return this.stop()
        }
        const state = this.history.shift()
        if (state.board) {
          this.board.setState(state.board)
          this.board.render()
        }
        if (state.character) {
          this.character.setState(state.character)
          this.character.render()
        }
        this.play()
      }, this.playBackSpeed)
      return this
    }

    stop () {
      if (this.playBackTimer) {
        clearTimeout(this.playBackTimer)
        delete this.playBackTimer
      }
      return this
    }
  }

  const app = window.app = new App($('#app'), boardString, {
    index: 0,
    direction: 0
  })

  const updateFlags = () => {
    window.isBlocked = app.character.isBlocked()
    window.isGem = app.character.isGem()
  }

  window.moveForward = () => {
    app.character.moveForward()
    app.saveHistory()
    updateFlags()
    return window
  }

  window.turnRight = () => {
    app.character.turnRight()
    app.saveHistory()
    updateFlags()
    return window
  }

  window.collectGem = () => {
    app.character.collectGem()
    app.saveHistory()
    updateFlags()
    return window
  }

  window.isBlocked = () => app.character.isBlocked()

  window.play = () => app.play()

  window.stop = () => app.stop()

  updateFlags()
})
