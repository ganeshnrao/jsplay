/* global define */

define(require => {
  const $ = require('jquery')

  const cellTypes = {
    open: 0,
    brick: 1,
    gem: 2,
    none: 3,
    portal: 4
  }
  const cellTypeClass = [
    'cell open',
    'cell brick',
    'cell open gem',
    'cell none',
    'cell portal'
  ]
  const colors = ['dodgerblue', 'green', 'cyan', 'lime']

  const portalRegex = /^([a-z])$/i
  const parseBoard = boardArray => boardArray.reduce((result, row) => {
    const cells = row.split(/[\s]+/g).map((cell, index) => {
      const matches = cell.match(portalRegex)
      if (matches) {
        const portalId = matches[1]
        result.portals[portalId] = result.portals[portalId] || []
        result.portals[portalId].push(result.board.length + index)
        return {
          type: cellTypes.portal,
          portalId: portalId
        }
      }
      return {
        type: Number(cell)
      }
    })
    result.width = result.width || cells.length
    result.board = result.board.concat(cells)
    return result
  }, {
    width: 0,
    board: [],
    portals: {}
  })

  class Board {
    constructor (boardArray, $container) {
      const data = parseBoard(boardArray)
      const board = data.board
      const width = data.width
      const portals = data.portals
      const getPortalTo = (portalId, index) => {
        if (portals[portalId]) {
          const portalIndex = (portals[portalId].indexOf(index) + 1) % portals[portalId].length
          return portals[portalId][portalIndex]
        }
      }
      const portalColors = Object.keys(portals).reduce((acc, portalId, index) => {
        acc[portalId] = colors.pop()
        return acc
      }, {})
      this.cellWidth = (100 / width) + '%'
      this.cellHeight = (100 / (board.length / width)) + '%'
      this.cells = board.map((cell, index) => {
        const $el = $('<div class="cell"/>')
        const style = {
          width: this.cellWidth,
          height: this.cellHeight
        }
        if (cell.portalId) {
          style.backgroundColor = portalColors[cell.portalId]
        }
        $el.css(style)
        $container.append($el)
        const portalTo = getPortalTo(cell.portalId, index)
        return {
          type: cell.type,
          portalId: cell.portalId,
          portalTo: portalTo,
          $el: $el,
          index: index,
          left: this.getCell.bind(this, index % width === 0 ? -1 : (index - 1)),
          right: this.getCell.bind(this, (index + 1) % width === 0 ? -1 : (index + 1)),
          top: this.getCell.bind(this, index - width),
          bottom: this.getCell.bind(this, index + width),
          portal: portalTo ? this.getCell.bind(this, portalTo) : undefined,
          isBlocked: this.isBlocked.bind(this, index)
        }
      })
      this.render(true)
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

    isPortal (index) {
      return !!this.cells[index].portal
    }

    render (force) {
      if (!force && !this.dirty) return
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
