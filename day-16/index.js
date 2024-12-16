const { timeFunction, getInput, getAdjacent4 } = require('../common')

function partOne(numbers) {
  const grid = numbers.map(n => n.split(''))
  const startCoord = getStartCoord(grid)

  const cells = [{ x: startCoord.x, y: startCoord.y, direction: '>', score: 0 }]
  const cache = {}

  while (cells.length) {
    cells.sort((a, b) => a.score - b.score)

    const cell = cells.shift()
    const { x, y, score, direction } = cell

    if (grid[y][x] === 'E') {
      return score
    }

    if (cache[`${x},${y},${direction}`]) {
      continue
    }

    cache[`${x},${y},${direction}`] = true

    const adjacents = getAdjacent4(grid, x, y)
      .filter(c => c.char !== '#')
      .map(o => {
        return {
          ...o,
          ...getPentaltyForMovement(x, y, o.x, o.y, direction)
        }
      })

    for (const adjacent of adjacents) {
      cells.push({ x: adjacent.x, y: adjacent.y, score: adjacent.score + score, direction: adjacent.newDirection })
    }
  }

}

function getStartCoord(grid) {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] === 'S') {
        return { x: j, y: i }
      }
    }
  }
}

function getPentaltyForMovement(x, y, x2, y2, direction) {
  // Moving in current direction increases score by 1
  // Rotating and moving increases score by 1001

  // Moving in the already established direction

  if (direction === '>' && x + 1 === x2) {
    return { score: 1, newDirection: direction }
  }

  if (direction === '<' && x - 1 === x2) {
    return { score: 1, newDirection: direction }
  }

  if (direction === '^' && y - 1 === y2) {
    return { score: 1, newDirection: direction }
  }

  if (direction === 'v' && y + 1 === y2) {
    return { score: 1, newDirection: direction }
  }

  // Turning 180 degrees to move in the opposite direction

  if (direction === '>' && x - 1 === x2) {
    return { score: 1000 + 1000 + 1, newDirection: '<' }
  }

  if (direction === '<' && x + 1 === x2) {
    return { score: 1000 + 1000 + 1, newDirection: '<' }
  }

  if (direction === '^' && y + 1 === y2) {
    return { score: 1000 + 1000 + 1, newDirection: 'v' }
  }

  if (direction === 'v' && y - 1 === y2) {
    return { score: 1000 + 1000 + 1, newDirection: '^' }
  }

  // Else must rotate once to move
  if (y - 1 === y2) {
    return { score: 1001, newDirection: '^' }
  }

  if (y + 1 === y2) {
    return { score: 1001, newDirection: 'v' }
  }

  if (x - 1 === x2) {
    return { score: 1001, newDirection: '<' }
  }

  if (x + 1 === x2) {
    return { score: 1001, newDirection: '>' }
  }
}

function partTwo(numbers, max) {
  const grid = numbers.map(n => n.split(''))
  const startCoord = getStartCoord(grid)

  const cells = [{ x: startCoord.x, y: startCoord.y, direction: '>', score: 0, path: [] }]
  const seats = {}
  const cache = {}

  while (cells.length) {
    cells.sort((a, b) => a.score - b.score)

    const cell = cells.shift()
    const { x, y, score, direction } = cell

    if (cell.score === max && grid[y][x] === 'E') {
      cell.path.forEach(c => seats[`${c.x},${c.y}`] = true)
    }

    if (score > max) {
      continue
    }

    if ((cache[`${x},${y},${direction}`] || Number.MAX_VALUE) < score) {
      continue
    }

    cache[`${x},${y},${direction}`] = cell.score

    const adjacents = getAdjacent4(grid, x, y)
      .filter(c => c.char !== '#')
      .map(o => {
        return {
          ...o,
          ...getPentaltyForMovement(x, y, o.x, o.y, direction)
        }
      })

    for (const adjacent of adjacents) {
      cells.push({ x: adjacent.x, y: adjacent.y, score: adjacent.score + score, direction: adjacent.newDirection, path: [...cell.path, { x: adjacent.x, y: adjacent.y }] })
    }
  }

  // The start is also a valid seat
  return Object.values(seats).length + 1
}

async function start() {
  const numbers = getInput(`${__dirname}/input.txt`)

  const task1 = await timeFunction(() => partOne(numbers))
  const task2 = await timeFunction(() => partTwo(numbers, task1.result))
  return [{ ans: task1.result, ms: task1.ms }, { ans: task2.result, ms: task2.ms }]
}

module.exports = start
