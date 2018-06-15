/* global define, ace */
/* eslint-disable import/no-webpack-loader-syntax, no-new-func */

define(require => {
  const $ = require('jquery')
  const Board = require('./board')
  const Character = require('./character')

  const delayMs = 1000

  const loadPuzzle = () => new Promise((resolve, reject) => {
    const puzzleIndex = Number(window.location.pathname.replace('/', '')) || 1
    const puzzleName = String(puzzleIndex).padStart(2, '0') + '.js'
    $.get('/puzzles/' + puzzleName)
      .done(data => {
        new Function(data)()
        resolve()
      })
      .fail(reject)
  })

  class App {
    constructor (puzzle) {
      const $boardContent = $('.board-content')
      $('#editor').text(puzzle.code.join('\n'))
      $('.description').text(puzzle.description)
      $('.actions').append('<ul>' + puzzle.actions.map(action => {
        return '<li class="' + action.class + '"><h3>' + action.name + '</h3>' + action.description + '</li>'
      }).join(' ') + '</ul>')
      this.puzzle = puzzle
      this.editor = ace.edit('editor')
      this.editor.setTheme('ace/theme/solarized_light')
      this.editor.setOptions({
        highlightActiveLine: false,
        showPrintMargin: false,
        showGutter: false
      })
      this.editor.session.setMode('ace/mode/javascript')
      this.playBackSpeed = delayMs
      this.board = new Board(puzzle.board, $boardContent)
      this.character = new Character(this.board, puzzle.character, $boardContent)
      this.history = []
      this.initControls()
      this.initialState = this.getState(true)
    }

    reportScore () {
      const fail = Object.keys(this.puzzle.goals).reduce((acc, goalName) => {
        if (!this.puzzle.goals[goalName](this)) {
          acc.push('You did not ' + goalName)
        }
        return acc
      }, [])
      if (fail.length) {
        window.prompt('Try again.\n' + fail.join('\n'))
      } else {
        window.prompt('You win!')
      }
    }

    executeCode () {
      const code = new Function(this.editor.getValue())
      this.reset()
      code.call(window)
    }

    initControls () {
      this.$togglePlay = $('.play-toggle')
      this.$speed = $('.play-speed')
      this.$speed.on('change', evt => {
        this.playBackSpeed = delayMs / Number(this.$speed.val())
      })
      this.$togglePlay.on('click', evt => {
        if (this.playBackTimer) {
          this.stop()
        } else {
          this.reset()
          this.executeCode()
          this.play()
        }
      })
    }

    getState (force) {
      return {
        board: (force || this.board.isDirty()) ? this.board.getState() : undefined,
        character: (force || this.character.isDirty()) ? this.character.getState() : undefined
      }
    }

    play (speed) {
      this.$togglePlay.text('Stop')
      this.playBackSpeed = speed || this.playBackSpeed
      this.playBackTimer = setTimeout(() => {
        if (!this.history.length) {
          this.stop()
          this.reportScore()
          return
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

    render () {
      this.board.render()
      this.character.render()
    }

    reset () {
      this.board.setState(this.initialState.board)
      this.character.setState(this.initialState.character)
      this.render()
    }

    saveHistory () {
      this.history.push(this.getState())
      this.board.clearDirty()
      this.character.clearDirty()
    }

    stop () {
      if (this.playBackTimer) {
        clearTimeout(this.playBackTimer)
        delete this.playBackTimer
      }
      this.$togglePlay.text('Play')
      return this
    }
  }

  loadPuzzle()
    .catch(console.log)
    .then(() => {
      const app = window.app = new App(window.puzzle)

      const updateFlags = () => {
        window.isBlocked = app.character.isBlocked()
        window.isGem = app.character.isGem()
      }

      window.moveForward = count => {
        const loopCount = count || 1
        for (let i = 0; i < loopCount; i++) {
          app.character.moveForward()
          app.saveHistory()
          if (app.character.handlePortal()) {
            app.saveHistory()
          }
          updateFlags()
        }
        return window
      }

      window.turnRight = count => {
        const loopCount = count || 1
        for (let i = 0; i < loopCount; i++) {
          app.character.turnRight()
          app.saveHistory()
          updateFlags()
        }
        return window
      }

      window.collectGem = () => {
        app.character.collectGem()
        app.saveHistory()
        updateFlags()
        return window
      }

      window.isBlocked = () => app.character.isBlocked()

      window.play = speed => app.play(speed)

      window.stop = () => app.stop()

      updateFlags()
    })
})
