/* global define */
/* eslint-disable import/no-webpack-loader-syntax */

define(require => {
  const $ = require('jquery')

  const directions = ['right', 'bottom', 'left', 'top']
  const directionClass = directions.map(d => 'character ' + d)

  class Character {
    constructor (board, position, $container) {
      this.board = board
      this.index = position.index || 0
      this.direction = position.direction || 0
      this.gems = 0
      this.history = []
      this.$el = $('<div style="width:' + board.cellWidth + ';height:' + board.cellHeight + ';"/>')
      $container.append(this.$el)
      this.dirty = true
      this.render()
    }

    collectGem () {
      this.gems += this.board.clearGem(this.index)
      return this
    }

    moveForward () {
      const direction = directions[this.direction]
      const nextCell = this.board.getCell(this.index)[direction]()
      if (nextCell) {
        this.index = nextCell.index
        this.setDirty()
      }
      return this
    }

    render () {
      if (!this.dirty) return
      const position = this.board.getCellPosition(this.index)
      this.$el.css({
        top: position.top,
        left: position.left
      })
      this.$el[0].className = directionClass[this.direction]
      delete this.dirty
      return this
    }

    setDirty () {
      this.history.push(this.index)
      this.dirty = true
      return this
    }

    setPosition (index) {
      this.index = index
      this.setDirty()
      return this
    }

    turnRight () {
      this.direction = (this.direction + 1) % directions.length
      this.setDirty()
      return this
    }
  }

  return Character
})
