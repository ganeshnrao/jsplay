/* global define */

define(require => {
  const $ = require('jquery')
  const config = require('./config')

  class Board {
    constructor (board, width, $container) {
      const cssWidth = (100 / width) + '%'
      const cssHeight = (100 / (board.length / width)) + '%'
      this.cells = board.map((cellType, index) => {
        const $el = $('<div class="cell" style="width:' + cssWidth + ';height:' + cssHeight + ';"/>')
        $container.append($el)
        return {
          type: cellType,
          $el: $el,
          index: index,
          left: this.getCell.bind(this, index % width === 0 ? -1 : (index - 1)),
          right: this.getCell.bind(this, (index + 1) % width === 0 ? -1 : (index + 1)),
          top: this.getCell.bind(this, index - width),
          bottom: this.getCell.bind(this, index + width)
        }
      })
      this.render()
    }

    getCell (index) {
      return this.cells[index]
    }

    render () {
      this.cells.forEach(cell => {
        cell.$el[0].className = config.className[cell.type]
      })
    }
  }

  return Board
})
