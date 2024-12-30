const { timeFunction, getInput, getAdjacent4 } = require('../common')

const globalCache = {}
const cacheSteps = {}

function buildCache() {
  const grid = [
    [' ', '^', 'A'],
    ['<', 'v', '>']
  ]

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === ' ') {
        continue
      }

      const char1 = grid[y][x]

      for (let y2 = 0; y2 < grid.length; y2++) {
        for (let x2 = 0; x2 < grid[y2].length; x2++) {
          if (grid[y2][x2] === ' ') {
            continue
          }

          const char2 = grid[y2][x2]

          const dirs = minPath(grid, x, y, char2)
          for (const o of dirs) {
            const key = getCacheKey(char1, char2)
            if (!globalCache[key]) {
              globalCache[key] = []
            }

            globalCache[key].push(o.score.join('') + 'A')
          }
        }
      }
    }
  }

  for (let y = grid.length - 1; y >= 0; y--) {
    for (let x = grid[y].length - 1; x >= 0; x--) {
      if (grid[y][x] === ' ') {
        continue
      }

      const char1 = grid[y][x]

      for (let y2 = 0; y2 < grid.length; y2++) {
        for (let x2 = 0; x2 < grid[y2].length; x2++) {
          if (grid[y2][x2] === ' ') {
            continue
          }

          const char2 = grid[y2][x2]

          const dirs = minPath(grid, x, y, char2)
          for (const o of dirs) {
            const key = `${char1}-${char2}`
            if (!globalCache[key]) {
              globalCache[key] = []
            }

            globalCache[key].push(o.score.join('') + 'A')
          }
        }
      }
    }
  }
}

function getCacheKey(char1, char2) {
  return `${char1}${char2}`
}

function enterCodeOnFinalKeypad(code) {
  const chars = code.toString().split('')

  /*

+---+---+---+
| 7 | 8 | 9 |
+---+---+---+
| 4 | 5 | 6 |
+---+---+---+
| 1 | 2 | 3 |
+---+---+---+
    | 0 | A |
    +---+---+

  */

  const grid = [
    ['7', '8', '9'],
    ['4', '5', '6'],
    ['1', '2', '3'],
    [' ', '0', 'A']
  ]

  let paths = []

  let x = 2
  let y = 3

  let queue = []

  const res = minPath(grid, x, y, chars[0])

  res.forEach(o => queue.push({ fromChar: chars[0], fromCharIndex: 0, nextChar: chars[1], nextCharIndex: 1, state: o, path: [...o.path], score: [...o.score] }))

  while (queue.length) {
    const item = queue.shift()

    if (!item.nextChar) {
      // Finished
      paths.push(item)
    }

    const dirs = minPath(grid, item.state.x, item.state.y, item.nextChar)

    dirs.forEach(o => queue.push({ fromChar: item.nextChar, fromCharIndex: item.nextCharIndex, nextChar: chars[item.nextCharIndex + 1], nextCharIndex: item.nextCharIndex + 1, state: o, path: [...item.path, ...o.path], score: [...item.score, 'A', ...o.score] }))
  }


  return paths.map(o => o.score.join('') + 'A')
}

function minPath(grid, x, y, target, allowSpace = false) {
  const cells = [{ x: x, y: y, direction: '>', path: [{ x: x, y: y }], score: [] }]
  const options = []
  let bestSoFar = Infinity

  while (cells.length) {
    cells.sort((a, b) => a.path.length - b.path.length)

    //cells.sort((a, b) => Math.abs(a.x - targetCoord.x) + Math.abs(a.y - targetCoord.y) - Math.abs(b.x - targetCoord.x) + Math.abs(b.y - targetCoord.y))

    const cell = cells.shift()

    if (cell.path.length > bestSoFar) {
      continue
    }

    if (grid[cell.y][cell.x] === target) {
      options.push(cell)
      bestSoFar = Math.min(bestSoFar, cell.path.length)
      continue
    }

    // if (cache[`${cell.x},${cell.y}`]) {
    //   continue
    // }

    // cache[`${cell.x},${cell.y}`] = true

    const adjacents = getAdjacent4(grid, cell.x, cell.y).filter(c => allowSpace || c.char !== ' ')

    for (const adjacent of adjacents) {
      // Don't if path already includes this cell
      if (cell.path.find(o => o.x === adjacent.x && o.y === adjacent.y)) {
        continue
      }
      const newDirection = getDrection(cell.x, cell.y, adjacent.x, adjacent.y)
      cells.push({ x: adjacent.x, y: adjacent.y, direction: newDirection, path: [...cell.path, { x: adjacent.x, y: adjacent.y }], score: [...cell.score, newDirection] })
    }
  }

  return options
}

function getDrection(x1, y1, x2, y2) {
  if (x1 + 1 === x2) {
    return '>'
  }

  if (x1 - 1 === x2) {
    return '<'
  }

  if (y1 + 1 === y2) {
    return 'v'
  }

  if (y1 - 1 === y2) {
    return '^'
  }
}

function partOne(numbers) {
  return numbers.reduce((acc, curr) => acc + doForCode(curr, 2), 0)
}

function doForCode(code, levels) {
  const firstLevelCodes = enterCodeOnFinalKeypad(code)
  let minLength = Number.MAX_VALUE

  for (const code of firstLevelCodes) {
    const split = code.split('A').filter(o => o).map(o => `${o}A`)

    const length = split.reduce((acc, curr) => acc + getShortestForPartial(curr, levels), 0)
    if (length < minLength) {
      minLength = length
    }
  }

  return Number(code.match(/(\d+)/)?.[1]) * minLength
}

function getShortestForPartial(sub, level) {
  if (level == 0) { return sub.length }

  if (!cacheSteps[level]) {
    cacheSteps[level] = {}
  }

  if (cacheSteps[level][sub]) {
    return cacheSteps[level][sub]
  }

  let length = 0

  for (let i = 0; i < sub.length; i++) {
    const dest = sub[i]
    const prev = sub[i - 1] || 'A' // Always start with A
    const newToken = globalCache[getCacheKey(prev, dest)]

    const shortest = Math.min(...newToken.map(o => getShortestForPartial(o, level - 1)))

    length += shortest
  }

  cacheSteps[level][sub] = length
  return length
}

function partTwo(numbers) {
  return numbers.reduce((acc, curr) => acc + doForCode(curr, 25), 0)
}

async function start() {
  const numbers = getInput(`${__dirname}/input.txt`)
  buildCache()

  const task1 = await timeFunction(() => partOne(numbers))
  const task2 = await timeFunction(() => partTwo(numbers))
  return [{ ans: task1.result, ms: task1.ms }, { ans: task2.result, ms: task2.ms }]
}

module.exports = start
