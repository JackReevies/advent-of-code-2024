const { timeFunction, getInput, getAdjacent4 } = require('../common')

function partOne(numbers) {
  const grid = []
  const maxX = 71
  const maxY = 71

  for (let y = 0; y < maxY; y++) {
    grid[y] = []
    for (let x = 0; x < maxX; x++) {
      grid[y][x] = '.'
    }
  }

  for (let i = 0; i < 1025; i++) {
    const coord = numbers[i]
    const [x, y] = coord.split(',').map(o => parseInt(o))
    grid[y][x] = '#'
  }

  return minPath(grid, 0, 0, maxX - 1, maxY - 1)
}

function minPath(grid, x, y, x2, y2) {
  const cells = [{ x: x, y: y, direction: '>', score: 0 }]
  const cache = {}

  while (cells.length) {
    cells.sort((a, b) => a.score - b.score)

    const cell = cells.shift()
    const { x, y, score, direction } = cell

    if (y == y2 && x == x2) {
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

function getPentaltyForMovement() {
  return { score: 1, newDirection: '>' }
}

function partTwo(numbers) {
  const grid = []
  const maxX = 71
  const maxY = 71

  for (let y = 0; y < maxY; y++) {
    grid[y] = []
    for (let x = 0; x < maxX; x++) {
      grid[y][x] = '.'
    }
  }

  let searchSpace = numbers.length
  let to = Math.floor(searchSpace / 2)
  let max = searchSpace

  while (true) {
    // Keep trying halves

    for (let i = 0; i < to; i++) {
      const coord = numbers[i]
      const [x, y] = coord.split(',').map(o => parseInt(o))
      grid[y][x] = '#'
    }

    const ans = minPath(grid, 0, 0, maxX - 1, maxY - 1)

    if (ans) {
      // Still possible - so the answer isnt gonna be less than "to"
      const oldTo = to
      to = to + Math.floor((max - to) / 2)

      if (oldTo === to) {
        // We're not generating any more, so it must be it
        return `${numbers[to]}`
      }
    } else {
      // Nope - so the answer is less than "to"
      // Reset Grid
      for (let y = 0; y < maxY; y++) {
        grid[y] = []
        for (let x = 0; x < maxX; x++) {
          grid[y][x] = '.'
        }
      }
      const oldTo = to
      to = to - Math.floor((max - to) / 2)
      max = oldTo
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
