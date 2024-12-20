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
      // console.log(`Found a valid with score ${cell.score} (total valids ${valids.length})`)
      continue
    }

    if (cell.score > 9440 - filter) {
      // Our non-cheat path is this, so we're not going to cheat a better route if this is already our score
      continue
    }

    if (cache[`${x},${y}`] && cell.cheats > 0) {
      cell.score += cache[`${x},${y}`]
      valids.push({ ...cell })
      // console.log(`Found a valid with score ${cell.score} (total valids ${valids.length})`)
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

  // console.log(cheats)
  // console.log(validCheats.length)
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

  return minPath(grid, startCoord.x, startCoord.y, endCoord.x, endCoord.y)

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

function minPathNoCheatP2(grid, x, y, x2, y2) {
  const cells = [{ x: x, y: y, path: [`${x},${y}`], alias: `${x},${y}`, cheats: 1, score: 0 }]
  const valids = {}

  while (cells.length) {
    cells.sort((a, b) => a.score - b.score)

    const cell = cells.shift()
    const { x, y, score } = cell

    if (cell.score > 19) {
      continue
    }

    // if (grid[y][x] === '.') {
    //   valids[`${x},${y}`] = true
    //   continue
    // }

    const adjacents = getAdjacent4(grid, x, y)

    for (const adjacent of adjacents) {
      if (cell.path.includes(`${adjacent.x},${adjacent.y}`)) {
        continue
      }

      if (grid[adjacent.y][adjacent.x] === '.') {
        valids[`${adjacent.y},${adjacent.x}`] = Math.min(cell.score, valids[`${adjacent.y},${adjacent.x}`] || Infinity)
        console.log(`Found a valid with score ${cell.score} (total valids ${Object.keys(valids).length})`)
        continue
      }

      if (adjacent.char === '#') {
        cells.push({ x: adjacent.x, y: adjacent.y, score: 1 + cell.score, cheats: cell.cheats, path: [...cell.path, `${adjacent.x},${adjacent.y}`], })
      }
    }
  }

  return valids
}

function getTeleportLocations(grid, x, y, pico = 20) {
  // Think of it like teleporting instead of driving through walls
  // Given an entry point, how many exit points do we see that are reachable within 19 spaces?

  // How many cells are visible from our current position?
  const opts = []
  for (let y2 = y; y2 < pico + y; y2++) {
    for (let x2 = x; x2 < pico + x; x2++) {
      if (!grid[y2]?.[x2]) continue
      if ((x2 - x) + (y2 - y) > pico) continue
      if (grid[y2][x2] === '#') continue
      //console.log(`Cell (${x2},${y2}) is visible from (${x},${y})`)
      opts.push({ x: x2, y: y2, score: (x2 - x) + (y2 - y) + 1 })
    }
  }

  return opts
}

function minPathP2(grid, x, y, x2, y2, filter = 50, allowCheats = true) {
  const cells = []
  const valids = {}
  const cache = {}

  const maxPath = minPathNoCheat(grid, x, y, x2, y2)

  for (let i = 0; i < maxPath.length; i++) {
    const coord = maxPath[i]
    const [x, y] = coord.split(',')

    cache[`${x},${y}`] = maxPath.length - i - 1
  }

  // Seed queue with all cells on MaxPath

  for (const coord of maxPath) {
    const [x, y] = coord.split(',')
    // { x: x, y: y, path: [`(${x},${y})`], alias: `(${x},${y})`, cheats: allowCheats ? 0 : 1, score: 0 }
    cells.push({ x: Number(x), y: Number(y), path: [coord], alias: coord, cheats: allowCheats ? 0 : 1, score: 0 })
    break
  }

  while (cells.length) {
    cells.sort((a, b) => a.score - b.score)

    const cell = cells.shift()
    const { x, y, score } = cell

    // if (y == y2 && x == x2) {
    //   valids.push({ ...cell })
    //   console.log(`Found a valid with score ${cell.score} (total valids ${valids.length})`)
    //   continue
    // }

    if (cell.score > 9440 - filter) {
      // Our non-cheat path is this, so we're not going to cheat a better route if this is already our score
      continue
    }

    // if (cache[`${x},${y}`] && cell.cheats > 0) {
    //   cell.score += cache[`${x},${y}`]
    //   valids.push({ ...cell })
    //   console.log(`Found a valid with score ${cell.score} (total valids ${valids.length})`)
    //   continue
    // }

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

      // Get cheat options
      const cheatOpts = adjacent.char === '#' ? getTeleportLocations(grid, x, y) : []

      if (adjacent.char === '#') {
        for (const o of cheatOpts) {
          const alias = `${x},${y}-${o.x},${o.y}`
          const cacheScore = cache[`${o.x},${o.y}`] || 0
          valids[alias] = { entry: `${x},${y}`, exit: `${o.x},${o.y}`, alias, x: o.x, y: o.y, cheats: cell.cheats + 1, score: cell.score + o.score + cacheScore }
          console.log(`Found a valid with score ${cell.score + o.score + cacheScore} (total valids ${Object.values(valids).length})`)
          continue
        }
      } else {
        cells.push({ x: adjacent.x, y: adjacent.y, score: 1 + cell.score, cheats: cell.cheats, path: [...cell.path, `(${adjacent.x},${adjacent.y})`], })
      }

    }
  }

  Object.values(valids).forEach(o => { o.saving = maxPath.length - 1 - o.score })
  const validCheats = Object.values(valids).filter(o => o.cheats > 0 && o.saving >= filter)

  // Greup by savings
  const cheats = Object.values(valids).reduce((acc, curr) => {
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

function partTwoOld(numbers) {
  const grid = numbers.map(n => n.split(''))
  const startCoord = getCoord(grid, 'S')
  const endCoord = getCoord(grid, 'E')

  // minPathP2(grid, startCoord.x, startCoord.y, endCoord.x, endCoord.y)

  const valids = {}
  const cache = {}

  const maxPath = minPathNoCheat(grid, startCoord.x, startCoord.y, endCoord.x, endCoord.y)

  for (let i = 0; i < maxPath.length; i++) {
    const coord = maxPath[i]
    const [x, y] = coord.split(',')

    cache[`${x},${y}`] = maxPath.length - i - 1
  }

  for (let i = 0; i < maxPath.length; i++) {
    const coord = maxPath[i]
    const x = Number(coord.split(',')[0])
    const y = Number(coord.split(',')[1])

    const adjacents = getAdjacent4(grid, x, y)

    for (const adjacent of adjacents) {
      // Get cheat options
      const cheatOpts = getTeleportLocations(grid, adjacent.x, adjacent.y, 20)

      //if (adjacent.char === '#') {
      for (const o of cheatOpts) {
        const cacheScore = cache[`${o.x},${o.y}`]
        const alias = `${i + o.score + cacheScore}-${x},${y}-${o.x},${o.y}`

        // if (!valids[alias]) {
        valids[alias] = { from: `${x},${y}`, entry: `${adjacent.x},${adjacent.y}`, exit: `${o.x},${o.y}`, alias, x: o.x, y: o.y, cheats: 1, score: i + o.score + cacheScore }

        // }
        // console.log(`Found a valid with score ${cell.score} (total valids ${valids.length})`)
        continue
      }
      //}
    }
  }

  Object.values(valids).forEach(o => { o.saving = maxPath.length - 1 - o.score })
  const validCheats = Object.values(valids).filter(o => o.cheats > 0 && o.saving >= 50)

  // Greup by savings
  const cheats = Object.values(valids).reduce((acc, curr) => {
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

  debugger
}

function scoreThroughCheat(grid, x, y, x2, y2) {
  return Math.abs(x - x2) + Math.abs(y - y2)
}

function partTwo(numbers) {
  const grid = numbers.map(n => n.split(''))
  const startCoord = getCoord(grid, 'S')
  const endCoord = getCoord(grid, 'E')

  // minPathP2(grid, startCoord.x, startCoord.y, endCoord.x, endCoord.y)

  const valids = {}
  const cache = {}

  const maxPath = minPathNoCheat(grid, startCoord.x, startCoord.y, endCoord.x, endCoord.y)

  for (let i = 0; i < maxPath.length; i++) {
    const coord = maxPath[i]
    const [x, y] = coord.split(',')

    cache[`${x},${y}`] = maxPath.length - i - 1
  }

  for (let i = 0; i < maxPath.length; i++) {
    const coord = maxPath[i]
    const x = Number(coord.split(',')[0])
    const y = Number(coord.split(',')[1])

    for (let a = i + 100; a < maxPath.length; a++) {
      const x2 = Number(maxPath[a].split(',')[0])
      const y2 = Number(maxPath[a].split(',')[1])

      const score = Math.abs(x - x2) + Math.abs(y - y2)
      if (score <= 20) {
        const newScore = (maxPath.length - 1) - (i + score + cache[`${x2},${y2}`])

        if (!valids[newScore]) {
          valids[newScore] = 0
        }

        valids[newScore]++
      }
    }
  }

  const ans = Object.keys(valids).filter(o => Number(o) >= 100).reduce((acc, curr) => acc + valids[curr], 0)
  return ans

  // Object.values(valids).forEach(o => { o.saving = maxPath.length - 1 - o.score })
  // const validCheats = Object.values(valids).filter(o => o.cheats > 0 && o.saving >= 50)

  // // Greup by savings
  // const cheats = Object.values(valids).reduce((acc, curr) => {
  //   const savings = curr.saving
  //   if (acc[savings]) {
  //     acc[savings].push(curr)
  //   } else {
  //     acc[savings] = [curr]
  //   }
  //   return acc
  // }, {})

  // console.log(cheats)
  // console.log(validCheats.length)
  // return validCheats.length
}

async function start() {
  const numbers = getInput(`${__dirname}/input.txt`)

  const task1 = await timeFunction(() => partOne(numbers))
  const task2 = await timeFunction(() => partTwo(numbers))
  return [{ ans: task1.result, ms: task1.ms }, { ans: task2.result, ms: task2.ms }]
}

module.exports = start
