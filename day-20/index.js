const { timeFunction, getInput, getAdjacent4 } = require('../common')

function minPath(grid, x, y, x2, y2, filter = 100, allowCheats = true) {
  const cells = [{ x: x, y: y, path: [`(${x},${y})`], alias: `(${x},${y})`, cheats: allowCheats ? 0 : 1, score: 0 }]
  const valids = []
  const cache = {}

  const maxPath = minPathNoCheat(grid, x, y, x2, y2)

  for (let i = 0; i < maxPath.length; i++) {
    const coord = maxPath[i]
    const [x, y] = coord.split(',')

    cache[`${x},${y}`] = maxPath.length - i - 1
  }

  while (cells.length) {
    cells.sort((a, b) => a.score - b.score)

    const cell = cells.shift()
    const { x, y, score } = cell

    if (y == y2 && x == x2) {
      valids.push({ ...cell })
      console.log(`Found a valid with score ${cell.score} (total valids ${valids.length})`)
      continue
    }

    if (cell.score > 9440 - filter) {
      // Our non-cheat path is this, so we're not going to cheat a better route if this is already our score
      continue
    }

    if (cache[`${x},${y}`] && cell.cheats > 0) {
      cell.score += cache[`${x},${y}`]
      valids.push({ ...cell })
      console.log(`Found a valid with score ${cell.score} (total valids ${valids.length})`)
      continue
    }

    const adjacents = getAdjacent4(grid, x, y)

    for (const adjacent of adjacents) {
      // Are we allowed to cheat and are we interested?
      // Allowed to cheat if a cheat has not already been made
      // Interested in cheating if the wall is only 1 thick

      if (cell.path.includes(`(${adjacent.x},${adjacent.y})`)) {
        continue
      }

      if (cell.cheats > 0 && adjacent.char === '#') {
        continue
      }

      const cheatable = adjacent.char === '#' && isCellCheatable(grid, x, y, adjacent.x, adjacent.y)

      if (adjacent.char === '#' && cheatable) {
        cells.push({ x: adjacent.x, y: adjacent.y, cheats: cell.cheats + 1, score: cell.score + 1, path: [...cell.path, `(${adjacent.x},${adjacent.y})`] })
        continue
      }

      if (adjacent.char !== '#') {
        cells.push({ x: adjacent.x, y: adjacent.y, score: 1 + cell.score, cheats: cell.cheats, path: [...cell.path, `(${adjacent.x},${adjacent.y})`], })
      }

    }
  }

  const maxScore = valids.reduce((acc, curr) => Math.max(acc, curr.score), 0)
  valids.forEach(o => { o.saving = maxScore - o.score })
  const validCheats = valids.filter(o => o.cheats > 0 && o.saving >= filter)

  // Greup by savings
  const cheats = valids.reduce((acc, curr) => {
    const savings = curr.saving
    if (acc[savings]) {
      acc[savings].push(curr)
    } else {
      acc[savings] = [curr]
    }
    return acc
  }, {})

  console.log(cheats)
  console.log(validCheats.length)
  return validCheats.length
}

function minPathNoCheat(grid, x, y, x2, y2) {
  const cells = [{ x: x, y: y, path: [`${x},${y}`], alias: `${x},${y}`, cheats: 1, score: 0 }]
  const valids = []
  const cache = {}

  while (cells.length) {
    cells.sort((a, b) => a.score - b.score)

    const cell = cells.shift()
    const { x, y, score } = cell

    if (y == y2 && x == x2) {
      valids.push({ ...cell })
      continue
    }

    // if (cache[`${x},${y}`]) {
    //   continue
    // }

    cache[`${x},${y}`] = true

    const adjacents = getAdjacent4(grid, x, y)

    for (const adjacent of adjacents) {
      // Are we allowed to cheat and are we interested?
      // Allowed to cheat if a cheat has not already been made
      // Interested in cheating if the wall is only 1 thick

      if (cell.path.includes(`${adjacent.x},${adjacent.y}`)) {
        continue
      }

      if (cell.cheats > 0 && adjacent.char === '#') {
        continue
      }

      const cheatable = adjacent.char === '#' && isCellCheatable(grid, x, y, adjacent.x, adjacent.y)

      if (adjacent.char === '#' && cheatable) {
        cells.push({ x: adjacent.x, y: adjacent.y, cheats: cell.cheats + 1, score: cell.score + 1, path: [...cell.path, `${adjacent.x},${adjacent.y}`] })
        continue
      }

      if (adjacent.char !== '#') {
        cells.push({ x: adjacent.x, y: adjacent.y, score: 1 + cell.score, cheats: cell.cheats, path: [...cell.path, `${adjacent.x},${adjacent.y}`], })
      }

    }
  }

  return valids[0].path
}

function isCellCheatable(grid, x, y, x2, y2) {
  // Get direction
  let x3 = x2
  let y3 = y2

  if (x2 === 0 || y2 === 0 || x2 === grid[0].length - 1 || y2 === grid.length - 1) {
    // No reason to cheat out of bounds
    return false
  }

  if (x - 1 === x2) {
    x3 = x2 - 1
  }

  if (x + 1 === x2) {
    direction = '>'
    x3 = x2 + 1
  }

  if (y - 1 === y2) {
    direction = '^'
    y3 = y2 - 1
  }

  if (y + 1 === y2) {
    direction = 'v'
    y3 = y2 + 1
  }

  const char = grid[y3]?.[x3]

  return char !== '#'
}

function getCoord(grid, char = 'S') {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] === char) {
        return { x: j, y: i }
      }
    }
  }
}

function partOne(numbers) {
  const grid = numbers.map(n => n.split(''))
  const startCoord = getCoord(grid, 'S')
  const endCoord = getCoord(grid, 'E')

  minPath(grid, startCoord.x, startCoord.y, endCoord.x, endCoord.y)

  // const path = minPathNoCheat(grid, startCoord.x, startCoord.y, endCoord.x, endCoord.y)
  // const maxScore = path.length

  // const opts = []

  // for (const o of path) {
  //   const x = o.split(',')[0]
  //   const y = o.split(',')[1]

  //   const adjacents = getAdjacent4(grid, x, y)

  //   for (const adjacent of adjacents) {
  //     if (adjacent.char === '#' && isCellCheatable(grid, x, y, adjacent.x, adjacent.y)) {
  //       opts.push(adjacent)
  //     }
  //   }

  // }

  // const results = []

  // let iterations = 0
  // const start = Date.now()
  // for (const o of opts) {
  //   const iterationStart = Date.now()
  //   iterations++
  //   const copyGrid = grid.map(n => n.slice())
  //   copyGrid[o.y][o.x] = '.'

  //   const optPath = minPathNoCheat(copyGrid, startCoord.x, startCoord.y, endCoord.x, endCoord.y)
  //   results.push({ cheat: `${o.x},${o.y}`, score: optPath.length })
  //   console.log(`Done with ${iterations} iterations out of ${opts.length} (took: ${(Date.now() - iterationStart) / 1000} seconds || total elapsed: ${(Date.now() - start) / 1000 / 60} minutes)`)
  // }

  // const cheatsBySavings = results.reduce((acc, curr) => {
  //   const savings = maxScore - curr.score
  //   if (acc[savings]) {
  //     acc[savings].push(curr)
  //   } else {
  //     acc[savings] = [curr]
  //   }
  //   return acc
  // }, {})

  // console.log(JSON.stringify(cheatsBySavings, null, 2))
}

function partTwo(numbers) {

}

async function start() {
  const numbers = getInput(`${__dirname}/input.txt`)

  const task1 = await timeFunction(() => partOne(numbers))
  const task2 = await timeFunction(() => partTwo(numbers))
  return [{ ans: task1.result, ms: task1.ms }, { ans: task2.result, ms: task2.ms }]
}

module.exports = start

start()