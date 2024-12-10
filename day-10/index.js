const { timeFunction, getInput, getAdjacent4 } = require('../common')

function partOne(numbers) {
  const grid = numbers.map(o => o.split('').map(o => Number(o)))

  const zeros = getZeros(grid)
  const scores = []
  const p2Scores = []
  for (let i = 0; i < zeros.length; i++) {
    const start = zeros[i]
    // Find a path 
    let paths = []
    let currentPath = []

    takeAStep(grid, start, currentPath, paths)

    const score = getUniqueEnds(paths)
    const deduped = dedupPaths(paths)

    p2Scores.push(deduped.length)
    // console.log(deduped.length)
    scores.push(score.length)
  }
  return { p1: scores.reduce((a, b) => a + b, 0), p2: p2Scores.reduce((a, b) => a + b, 0) }
}

function getUniqueEnds(paths) {
  const ends = {}
  for (let i = 0; i < paths.length; i++) {
    const path = paths[i]
    ends[path[path.length - 1].coord] = true
  }
  return Object.keys(ends)
}

function dedupPaths(paths) {
  const deduped = []
  for (let i = 0; i < paths.length; i++) {
    const path = paths[i]
    const alias = path.map(o => `${o.x},${o.y}`).join('-')
    if (deduped.indexOf(alias) !== -1) {
      continue
    }
    deduped.push(alias)
  }
  return deduped
}

function takeAStep(grid, start, currentPath, knownPaths) {
  const valids = getAdjacent4(grid, start.x, start.y).filter(o => o.char === start.char + 1)

  if (valids.length === 0) {
    // No more valids
    currentPath.pop()
    return
  }

  for (let i = 0; i < valids.length; i++) {
    const adjacent = valids[i]

    if (adjacent.char === 9) {
      // Finished
      knownPaths.push([...currentPath, adjacent])
      continue
    } else {
      currentPath.push(adjacent)
    }

    takeAStep(grid, adjacent, currentPath, knownPaths)
  }

  currentPath.pop()

  return knownPaths
}

function getZeros(grid) {
  const zeros = []
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === 0) {
        zeros.push({ char: grid[y][x], coord: `${x}, ${y}`, x, y })
      }
    }
  }
  return zeros
}

function partTwo(numbers) {

}

async function start() {
  const numbers = getInput(`${__dirname}/input.txt`)

  const task1 = await timeFunction(() => partOne(numbers))
  return [{ ans: task1.result.p1, ms: task1.ms }, { ans: task1.result.p2, ms: 0 }]
}

module.exports = start
