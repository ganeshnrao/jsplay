/* global define */

define(require => {
  const $ = require('jquery')

  const cellTypes = {
    open: 0,
    brick: 1,
    gem: 2,
    none: 3
  }
  const cellTypeClass = [
    'cell open',
    'cell brick',
    'cell open gem',
    'cell none'
  ]

  const parseBoard = boardString => boardString.split('\n').filter(s => s !== '')
    .reduce((result, row) => {
      const cells = row.split(/[\s]+/g)
      result.width = result.width || cells.length
      result.board = result.board.concat(cells)
      return result
    }, {
      width: 0,
      board: []
    })

  class Board {
    constructor (boardString, $container) {
      const data = parseBoard(boardString)
      const board = data.board
      const width = data.width
      this.cellWidth = (100 / width) + '%'
      this.cellHeight = (100 / (board.length / width)) + '%'
      this.cells = board.map((cellType, index) => {
        const $el = $('<div class="cell" style="width:' + this.cellWidth + ';height:' + this.cellHeight + ';"/>')
        $container.append($el)
        return {
          type: Number(cellType),
          $el: $el,
          index: index,
          left: this.getCell.bind(this, index % width === 0 ? -1 : (index - 1)),
          right: this.getCell.bind(this, (index + 1) % width === 0 ? -1 : (index + 1)),
          top: this.getCell.bind(this, index - width),
          bottom: this.getCell.bind(this, index + width),
          isBlocked: this.isBlocked.bind(this, index)
        }
      })
      this.setDirty()
      this.render()
    }

    clearDirty () {
      delete this.dirty
      return this
    }

    clearGem (index) {
      if (this.cells[index].type === cellTypes.gem) {
        this.cells[index].type = cellTypes.open
        this.setDirty()
        return 1
      }
      return 0
    }

    getCell (index, includeAll) {
      const cell = this.cells[index]
      if (includeAll || (cell && cell.type !== cellTypes.brick)) {
        return cell
      }
    }

    getCellPosition (index) {
      return this.cells[index].$el.position()
    }

    getState () {
      return this.cells.map(cell => cell.type)
    }

    isBlocked (index) {
      return this.cells[index].type === cellTypes.brick
    }

    isDirty () {
      return !!this.dirty
    }

    isGem (index) {
      return this.cells[index].type === cellTypes.gem
    }

    render () {
      if (!this.dirty) return
      this.cells.forEach(cell => {
        cell.$el[0].className = cellTypeClass[cell.type]
      })
      this.clearDirty()
      return this
    }

    setDirty () {
      this.dirty = true
      return this
    }

    setState (state) {
      this.cells.map((cell, index) => {
        cell.type = state[index]
      })
      this.setDirty()
      return this
    }
  }

  return Board
})
