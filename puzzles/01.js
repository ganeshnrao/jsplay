window.puzzle = {
  description: 'Collect both the gems',
  actions: [
    {
      name: 'moveForward(<em>n</em>)',
      class: 'function',
      description: 'Moves character forward <em>n</em> times'
    },
    {
      name: 'turnRight(<em>n</em>)',
      class: 'function',
      description: 'Turns the character right <em>n</em> times'
    },
    {
      name: 'collectGem()',
      class: 'function',
      description: 'Collects the gem if character is on a block with a gem'
    },
    {
      name: 'isBlocked',
      class: 'boolean',
      description: '<em>true</em> if character can not move forward'
    },
    {
      name: 'hasGem',
      class: 'boolean',
      description: '<em>true</em> if character is on a block with a gem'
    }
  ],
  board: [
    '0 0 3 a 0 2',
    '3 0 3 0 3 3',
    '3 0 1 b 0 3',
    '3 b 1 1 0 3',
    '3 0 a 0 0 3',
    '3 0 1 2 0 3'
  ],
  character: {
    index: 0,
    direction: 0,
    gems: 0
  },
  goals: {
    'collect both gems': app => app.character.gems === 2
  },
  code: [
    'moveForward()',
    'turnRight()',
    'moveForward(3)',
    'turnRight(2)',
    'moveForward(2)',
    'turnRight()',
    'moveForward()',
    'turnRight()',
    'moveForward()',
    'collectGem()',
    'turnRight(2)',
    'moveForward()',
    'turnRight(3)',
    'moveForward()',
    'turnRight(2)',
    'moveForward(2)',
    'collectGem()'
  ]
}
