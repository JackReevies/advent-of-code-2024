const { timeFunction, getInput } = require('../common')

function interpretInput(input) {
  const grid = []
  const instructions = []

  let isGrid = true
  for (let i = 0; i < input.length; i++) {
    const line = input[i]

    if (line.length < 2) {
      isGrid = false
      continue
    }

    if (isGrid) {
      grid.push(line.split(''))
    } else {
      const chars = line.split('')
      for (const char of chars) {
        instructions.push(char)
      }
    }
  }

  return { grid, instructions }
}

function interpretInput2(input) {
  const grid = []
  const instructions = []

  let isGrid = true
  for (let i = 0; i < input.length; i++) {
    const line = input[i]

    if (line.length < 2) {
      isGrid = false
      continue
    }

    if (isGrid) {
      grid.push([])
      const chars = line.split('')
      for (const char of chars) {
        if (char === 'O') {
          grid[i].push('[')
          grid[i].push(']')
        } else if (char === '@') {
          grid[i].push('@')
          grid[i].push('.')
        } else {
          grid[i].push(char)
          grid[i].push(char)
        }
      }
    } else {
      const chars = line.split('')
      for (const char of chars) {
        instructions.push(char)
      }
    }
  }

  return { grid, instructions }
}

function getRobotPos(grid) {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] === '@') {
        return { x: j, y: i }
      }
    }
  }
}

function debugVisualise(grid) {
  for (let y = 0; y < grid.length; y++) {
    let row = `${y}: `
    for (let x = 0; x < grid[0].length; x++) {
      row += grid[y][x]
    }
    console.log(row)
  }
}

function pushBoxes(grid, box, xModifier, yModifier) {
  const currentCell = { x: box.x, y: box.y }

  let canMove = true
  let moveCoords = { x: currentCell.x + xModifier, y: currentCell.y + yModifier }

  while (true) {
    const nextCell = { x: currentCell.x + xModifier, y: currentCell.y + yModifier }
    nextCell.char = grid[nextCell.y][nextCell.x]

    if (nextCell.char === '#') {
      // We would hit a wall if we moved this, so NO
      canMove = false
      break
    }

    if (nextCell.char === '.') {
      // We would move onto a free space, so YES
      canMove = true
      moveCoords = nextCell
      break
    }

    // If else, we would move onto a box, so run again with the next box in mind, can that move etc etc...
    currentCell.x = nextCell.x
    currentCell.y = nextCell.y
  }

  if (canMove) {
    grid[box.y][box.x] = '.'
    grid[moveCoords.y][moveCoords.x] = 'O'
  }

  return canMove
}

function partOne(numbers) {
  const { grid, instructions } = interpretInput(numbers)
  const robot = getRobotPos(grid)

  for (const instruction of instructions) {
    // If the robot were to push a box into a wall or another box, abort movement
    let canMove = true

    if (instruction === '>') {
      // Move right
      const targetCell = grid[robot.y]?.[robot.x + 1]
      if (targetCell === '#' || !targetCell) {
        canMove = false
      } else if (targetCell === 'O') {
        // Do we push box?
        canMove = pushBoxes(grid, { x: robot.x + 1, y: robot.y }, 1, 0)
      }

      if (canMove) {
        grid[robot.y][robot.x] = '.'
        robot.x = robot.x + 1
        robot.y = robot.y
        grid[robot.y][robot.x] = '@'
      }

    } else if (instruction === '<') {
      // Move left
      const targetCell = grid[robot.y]?.[robot.x - 1]
      if (targetCell === '#' || !targetCell) {
        canMove = false
      } else if (targetCell === 'O') {
        // Do we push box?
        canMove = pushBoxes(grid, { x: robot.x - 1, y: robot.y }, -1, 0)
      }

      if (canMove) {
        grid[robot.y][robot.x] = '.'
        robot.x = robot.x - 1
        robot.y = robot.y
        grid[robot.y][robot.x] = '@'
      }
    } else if (instruction === '^') {
      // Move up
      const targetCell = grid[robot.y - 1]?.[robot.x]
      if (targetCell === '#' || !targetCell) {
        canMove = false
      } else if (targetCell === 'O') {
        // Do we push box?
        canMove = pushBoxes(grid, { x: robot.x, y: robot.y - 1 }, 0, -1)
      }

      if (canMove) {
        grid[robot.y][robot.x] = '.'
        robot.x = robot.x
        robot.y = robot.y - 1
        grid[robot.y][robot.x] = '@'
      }
    } else if (instruction === 'v') {
      // Move down
      const targetCell = grid[robot.y + 1]?.[robot.x]
      if (targetCell === '#' || !targetCell) {
        canMove = false
      } else if (targetCell === 'O') {
        // Do we push box?
        canMove = pushBoxes(grid, { x: robot.x, y: robot.y + 1 }, 0, 1)
      }

      if (canMove) {
        grid[robot.y][robot.x] = '.'
        robot.x = robot.x
        robot.y = robot.y + 1
        grid[robot.y][robot.x] = '@'
      }
    }

    //console.log(`After ${instruction}: ${robot.x}, ${robot.y}`)
    ///debugVisualise(grid)
  }

  let ans = getGPS(grid)
  return ans
  debugger
}

function getGPS(grid) {
  let coords = []
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] === 'O' || grid[i][j] === '[') {
        coords.push(i * 100 + j)
      }
    }
  }

  return coords.reduce((acc, curr) => acc + curr, 0)
}

function getGPS2(grid) {
  let coords = []
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] === '[') {
        coords.push(i * 100 + j)
      }
    }
  }

  return coords.reduce((acc, curr) => acc + curr, 0)
}

function getBoxCoords(grid, x, y, xModifier, yModifier) {
  const char = grid[y][x]

  if (char === ']') {
    return { x: x - 1, y, x2: x, y2: y }
  }

  if (char === '[') {
    return { x: x, y, x2: x + 1, y2: y }
  }

  return { x: Math.min(x, x + xModifier), y, x2: Math.max(x, x + xModifier), y2: y + yModifier }
}

function canWeMoveBoxesVertically(grid, firstBox, yModifier, moveBoxes = {}) {
  // Look up/down from this box, do we touch any boxes (0,1 or 2)?
  const nextLeft = grid[firstBox.y + yModifier][firstBox.x]
  const nextRight = grid[firstBox.y + yModifier][firstBox.x + 1]

  // Happy case, none of these cells contain a box
  if (nextLeft === '.' && nextRight === '.') {
    // We can move onto the next cell
    moveBoxes[`x${firstBox.x},y${firstBox.y}`] = { from: { x: firstBox.x, y: firstBox.y, x2: firstBox.x2, y2: firstBox.y2 }, to: { x: firstBox.x, y: firstBox.y + yModifier, x2: firstBox.x2, y2: firstBox.y2 + yModifier } }
    return true
  }

  if (nextLeft === '#' || nextRight === '#') {
    // We would hit a wall somewhere in this chain, so abort movement
    return false
  }

  // Else we must be involved with boxes
  if (nextLeft === '[' || nextLeft === ']') {
    const nextLeftBox = getBoxCoords(grid, firstBox.x, firstBox.y + yModifier)
    if (canWeMoveBoxesVertically(grid, nextLeftBox, yModifier, moveBoxes)) {
      moveBoxes[`x${firstBox.x},y${firstBox.y}`] = { from: { x: firstBox.x, y: firstBox.y, x2: firstBox.x2, y2: firstBox.y2 }, to: { x: firstBox.x, y: firstBox.y + yModifier, x2: firstBox.x2, y2: firstBox.y2 + yModifier } }
    } else {
      return false
    }
  }

  if (nextRight === '[' || nextRight === ']') {
    const nextRightBox = getBoxCoords(grid, firstBox.x2, firstBox.y + yModifier)
    if (canWeMoveBoxesVertically(grid, nextRightBox, yModifier, moveBoxes)) {
      moveBoxes[`x${firstBox.x},y${firstBox.y}`] = { from: { x: firstBox.x, y: firstBox.y, x2: firstBox.x2, y2: firstBox.y2 }, to: { x: firstBox.x, y: firstBox.y + yModifier, x2: firstBox.x2, y2: firstBox.y2 + yModifier } }
    } else {
      return false
    }
  }

  moveBoxes[`x${firstBox.x},y${firstBox.y}`] = { from: { x: firstBox.x, y: firstBox.y, x2: firstBox.x2, y2: firstBox.y2 }, to: { x: firstBox.x, y: firstBox.y + yModifier, x2: firstBox.x2, y2: firstBox.y2 + yModifier } }
  return true
}

function pushBoxes2(grid, box, xModifier, yModifier) {
  box = getBoxCoords(grid, box.x, box.y)
  let currentCell = { ...box }

  let canMove = true
  let moveCoords = getBoxCoords(grid, currentCell.x + xModifier, currentCell.y + yModifier, xModifier, yModifier)

  while (true) {
    const nextCell = { x: xModifier > 0 ? currentCell.x2 + xModifier : currentCell.x + xModifier, y: currentCell.y + yModifier }
    nextCell.char = grid[nextCell.y][nextCell.x]

    if (nextCell.char === '#') {
      // We would hit a wall if we moved this, so NO
      canMove = false
      break
    }

    if (nextCell.char === '.') {
      // We would move onto a free space, so YES
      canMove = true
      moveCoords = nextCell
      break
    }

    // If else, we would move onto a box, so run again with the next box in mind, can that move etc etc...
    const nextBox = getBoxCoords(grid, nextCell.x, nextCell.y)
    currentCell.x = nextBox.x
    currentCell.y = nextBox.y
    currentCell.x2 = nextBox.x2
    currentCell.y2 = nextBox.y2
  }

  if (canMove && xModifier === -1) {
    let curX = moveCoords.x
    const moveBy = Math.abs(curX - box.x2)
    for (let i = 0; i < moveBy; i++) {
      grid[moveCoords.y][curX] = grid[moveCoords.y][curX + (xModifier * -1)]
      curX += (xModifier * -1)
    }
  } else if (canMove && xModifier === 1) {
    let curX = moveCoords.x
    const moveBy = Math.abs(curX - box.x)
    for (let i = 0; i < moveBy; i++) {
      grid[moveCoords.y][curX] = grid[moveCoords.y][curX + (xModifier * -1)]
      curX += (xModifier * -1)
    }
  }



  return canMove
}

function partTwo(numbers) {
  const { grid, instructions } = interpretInput2(numbers)
  const robot = getRobotPos(grid)

  //console.log(`Initial State`)
  //debugVisualise(grid)

  for (const instruction of instructions) {
    //console.log(`After ${instruction}: ${robot.x}, ${robot.y}`)
    // If the robot were to push a box into a wall or another box, abort movement
    let canMove = true

    if (instruction === '>') {
      // Move right
      const targetCell = grid[robot.y]?.[robot.x + 1]
      if (targetCell === '#' || !targetCell) {
        canMove = false
      } else if (targetCell === '[') {
        // Do we push box?
        canMove = pushBoxes2(grid, { x: robot.x + 1, y: robot.y }, 1, 0)
      }

      if (canMove) {
        grid[robot.y][robot.x] = '.'
        robot.x = robot.x + 1
        robot.y = robot.y
        grid[robot.y][robot.x] = '@'
      }

    } else if (instruction === '<') {
      // Move left
      const targetCell = grid[robot.y]?.[robot.x - 1]
      if (targetCell === '#' || !targetCell) {
        canMove = false
      } else if (targetCell === ']') {
        // Do we push box?
        canMove = pushBoxes2(grid, { x: robot.x - 1, y: robot.y }, -1, 0)
      }

      if (canMove) {
        grid[robot.y][robot.x] = '.'
        robot.x = robot.x - 1
        robot.y = robot.y
        grid[robot.y][robot.x] = '@'
      }
    } else if (instruction === '^') {
      // Move up
      const targetCell = grid[robot.y - 1]?.[robot.x]
      if (targetCell === '#' || !targetCell) {
        canMove = false
      } else if (targetCell === '[' || targetCell === ']') {
        // Do we push box?
        const firstBox = getBoxCoords(grid, robot.x, robot.y - 1)
        const movableBoxes = []
        canMove = canWeMoveBoxesVertically(grid, firstBox, -1, movableBoxes)

        if (canMove) {
          //const originalGrid = JSON.parse(JSON.stringify(grid))
          for (const box of Object.values(movableBoxes)) {
            grid[box.from.y][box.from.x] = '.'
            grid[box.from.y][box.from.x2] = '.'
          }

          for (const box of Object.values(movableBoxes)) {
            grid[box.to.y][box.to.x] = '['
            grid[box.to.y][box.to.x2] = ']'
          }
        }

      }

      if (canMove) {
        grid[robot.y][robot.x] = '.'
        robot.x = robot.x
        robot.y = robot.y - 1
        grid[robot.y][robot.x] = '@'
      }
    } else if (instruction === 'v') {
      // Move down
      const targetCell = grid[robot.y + 1]?.[robot.x]
      if (targetCell === '#' || !targetCell) {
        canMove = false
      } else if (targetCell === '[' || targetCell === ']') {
        // Do we push box?
        const firstBox = getBoxCoords(grid, robot.x, robot.y + 1)
        const movableBoxes = []
        canMove = canWeMoveBoxesVertically(grid, firstBox, 1, movableBoxes)

        if (canMove) {
          //const originalGrid = JSON.parse(JSON.stringify(grid))
          for (const box of Object.values(movableBoxes)) {
            grid[box.from.y][box.from.x] = '.'
            grid[box.from.y][box.from.x2] = '.'
          }

          for (const box of Object.values(movableBoxes)) {
            grid[box.to.y][box.to.x] = '['
            grid[box.to.y][box.to.x2] = ']'
          }
        }
      }

      if (canMove) {
        grid[robot.y][robot.x] = '.'
        robot.x = robot.x
        robot.y = robot.y + 1
        grid[robot.y][robot.x] = '@'
      }
    }


    // debugVisualise(grid)
    // if (checkForIssues(grid)) {
    //   console.log('fuk')
    //   debugger
    // }
    // console.log(`----`)
  }

  let ans = getGPS(grid)
  return ans
  debugger
}

function checkForIssues(grid) {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] === '[' && grid[i][j + 1] !== ']') {
        return true
      }
    }
  }
}

async function start() {
  const numbers = getInput(`${__dirname}/input.txt`)

  const task1 = await timeFunction(() => partOne(numbers))
  const task2 = await timeFunction(() => partTwo(numbers))
  return [{ ans: task1.result, ms: task1.ms }, { ans: task2.result, ms: task2.ms }]
}

module.exports = start
