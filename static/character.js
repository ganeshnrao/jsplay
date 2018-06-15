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
      this.$el = $('<div style="width:' + board.cellWidth + ';height:' + board.cellHeight + ';"/>')
      $container.append(this.$el)
      this.dirty = true
      this.render()
    }

    clearDirty () {
      delete this.dirty
      return this
    }

    collectGem () {
      this.gems += this.board.clearGem(this.index)
      return this
    }

    getNextCell () {
      const direction = directions[this.direction]
      return this.board.getCell(this.index)[direction]()
    }

    getState () {
      return {
        index: this.index,
        direction: this.direction,
        gems: this.gems
      }
    }

    handlePortal () {
      if (this.board.isPortal(this.index)) {
        const portalDestination = this.board.getCell(this.index).portal()
        this.index = portalDestination.index
        this.setDirty()
        return true
      }
      return false
    }

    isBlocked () {
      const nextCell = this.getNextCell()
      return !nextCell || this.board.isBlocked(nextCell.index)
    }

    isGem () {
      return !!this.board.isGem(this.index)
    }

    isDirty () {
      return !!this.dirty
    }

    moveForward () {
      const nextCell = this.getNextCell()
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
      this.clearDirty()
      return this
    }

    setDirty () {
      this.dirty = true
      return this
    }

    setPosition (index) {
      this.index = index
      this.setDirty()
      return this
    }

    setState (state) {
      this.index = state.index
      this.direction = state.direction
      this.setDirty()
    }

    turnRight () {
      this.direction = (this.direction + 1) % directions.length
      this.setDirty()
      return this
    }
  }

  return Character
})
