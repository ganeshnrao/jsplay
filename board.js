/* global define */

define(require => {
  const $ = require('jquery')

  const cellTypes = {
    open: 0,
    brick: 1,
    gem: 2
  }
  const cellTypeClass = ['cell open', 'cell brick', 'cell open gem']

  class Board {
    constructor (board, width, $container) {
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
          bottom: this.getCell.bind(this, index + width)
        }
      })
      this.setDirty()
      this.render()
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
      if (includeAll || cell.type !== cellTypes.brick) {
        return cell
      }
    }

    getCellPosition (index) {
      return this.cells[index].$el.position()
    }

    render () {
      if (!this.dirty) return
      this.cells.forEach(cell => {
        cell.$el[0].className = cellTypeClass[cell.type]
      })
      delete this.dirty
      return this
    }

    setDirty () {
      this.dirty = true
      return this
    }
  }

  return Board
})
