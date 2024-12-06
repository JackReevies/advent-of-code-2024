const { timeFunction, getInput, getAdjacent4 } = require('../common')

function partOne(numbers) {
  const grid = numbers.map(line => line.split(''))
  const dirGrid = grid.map(line => line.map(o => []))

  let guardDir = { x: 0, y: -1, char: '^' }
  let guardPos = grid.reduce((acc, obj, i) => {
    const index = obj.indexOf('^')
    if (index !== -1) {
      acc.x = index
      acc.y = i
    }
    return acc
  }, { x: -1, y: -1 })

  grid[guardPos.y][guardPos.x] = 'X'

  const ans = solveLoop(grid, guardPos, guardDir, dirGrid)
  return ans
}

function solveLoop(grid, guardPos, guardDir, dirGrid, maxIterations = Number.MAX_SAFE_INTEGER) {
  for (let i = 0; i < maxIterations; i++) {
    // If there is something directly in front of you, turn right 90 degrees.
    // Otherwise, take a step forward.

    const nextPos = { x: guardPos.x + guardDir.x, y: guardPos.y + guardDir.y }
    if (grid[nextPos.y]?.[nextPos.x] === undefined) {
      // Out of bounds
      // How many coords got X'd
      const coords = grid.reduce((acc, obj) => {
        return acc + obj.filter(c => c === 'X').length
      }, 0)
      return coords
    }
    if (grid[nextPos.y]?.[nextPos.x] === '.' || grid[nextPos.y]?.[nextPos.x] === 'X') {
      // Nothing in front, go forward
      guardPos.x = nextPos.x
      guardPos.y = nextPos.y

      grid[nextPos.y][nextPos.x] = 'X'
      dirGrid[nextPos.y][nextPos.x].push(guardDir.char)

      continue
    }

    // There is something in front, turn right
    guardDir = getRotation(guardDir)
  }

  return false
}

function partTwo(numbers) {
  const grid = numbers.map(line => line.split(''))
  const dirGrid = grid.map(line => line.map(o => []))

  let guardDir = { x: 0, y: -1, char: '^' }
  let guardPos = grid.reduce((acc, obj, i) => {
    const index = obj.indexOf('^')
    if (index !== -1) {
      acc.x = index
      acc.y = i
    }
    return acc
  }, { x: -1, y: -1 })

  grid[guardPos.y][guardPos.x] = 'X'
  dirGrid[guardPos.y][guardPos.x].push('^')

  const potentialObstacles = []
  const originalGuardDir = { x: guardDir.x, y: guardDir.y }
  const originalGuardPos = { x: guardPos.x, y: guardPos.y }

  while (true) {
    const copyGrid = grid.map(line => line.slice())
    const copyDirGrid = dirGrid.map(line => line.map(o => o.map(o => o.slice())))
    const copyGuardPos = { x: guardPos.x, y: guardPos.y }
    const copyGuardDir = { x: guardDir.x, y: guardDir.y, char: guardDir.char }

    const newObstacle = findPotentialObstacle(copyGrid, copyGuardPos, copyGuardDir, copyDirGrid, potentialObstacles)

    if (!newObstacle) {
      // We must have finished?
      break
    }

    // // Verify this obstacle by calling p1s code
    // // Clone grid
    // const newGrid = grid.map(line => line.slice())
    // newGrid[newObstacle.y][newObstacle.x] = '#'

    // solveGrid(newGrid, originalGuardPos, originalGuardDir)

    potentialObstacles.push(newObstacle)
  }


  debugger
}

function findPotentialObstacle(grid, guardPos, guardDir, dirGrid, potentialObstacles) {
  while (true) {
    // If there is something directly in front of you, turn right 90 degrees.
    // Otherwise, take a step forward.

    const nextPos = { x: guardPos.x + guardDir.x, y: guardPos.y + guardDir.y }

    if (grid[nextPos.y]?.[nextPos.x] === undefined) {
      // Out of bounds
      // How many coords got X'd

      // We failed to create an obstacle
      return undefined
    }

    if (grid[nextPos.y]?.[nextPos.x] === '.' || grid[nextPos.y]?.[nextPos.x] === 'X') {
      // Nothing in front, go forward

      // Could we create an infinite loop here by putting an obstacle down on this next step?
      // We'd need to look at their next direction as if they had to rotate to the right
      // If the next step in that new direction is an already trodden path then we can accept it as a valid obatacle

      const potentialNewDir = getRotation(guardDir)
      const potentialNextStep = { x: guardPos.x, y: guardPos.y }

      // We don't just want if the next potential step is already trodden
      // We want to see if travelling in this direction would touch any already trodden cells in this direction

      while (true) {
        potentialNextStep.x += potentialNewDir.x
        potentialNextStep.y += potentialNewDir.y

        if (grid[potentialNextStep.y]?.[potentialNextStep.x] === undefined) {
          // Oops, we've gone too far
          break
        }

        if (grid[potentialNextStep.y]?.[potentialNextStep.x] === 'X') {
          const troddenDirs = dirGrid[potentialNextStep.y][potentialNextStep.x]

          if (troddenDirs.includes(potentialNewDir.char)) {
            // This would create an infinite loop (I hope)
            // This is a valid obstacle

            // Finall, have we already found this one? if so ignore
            if (potentialObstacles.find(o => o.x === nextPos.x && o.y === nextPos.y)) {
              // Noop
            } else {
              return { x: nextPos.x, y: nextPos.y }
            }
          }
        }
      }

      guardPos.x = nextPos.x
      guardPos.y = nextPos.y

      grid[nextPos.y][nextPos.x] = 'X'
      dirGrid[nextPos.y][nextPos.x].push(guardDir.char)

      continue
    }

    // There is something in front, turn right
    guardDir = getRotation(guardDir)
    dirGrid[guardPos.y][guardPos.x].push(guardDir.char)
  }
}

function getRotation(guardDir) {
  if (guardDir.x === 0 && guardDir.y === -1) {
    return { x: 1, y: 0, char: '>' } // v
  } else if (guardDir.x === 1 && guardDir.y === 0) {
    return { x: 0, y: 1, char: 'v' } // >
  } else if (guardDir.x === 0 && guardDir.y === 1) {
    return { x: -1, y: 0, char: '<' } // v
  } else if (guardDir.x === -1 && guardDir.y === 0) {
    return { x: 0, y: -1, char: '^' } // <
  }
}

function partTwoBrute(numbers) {
  const grid = numbers.map(line => line.split(''))
  const dirGrid = grid.map(line => line.map(o => []))

  let guardDir = { x: 0, y: -1, char: '^' }
  let guardPos = grid.reduce((acc, obj, i) => {
    const index = obj.indexOf('^')
    if (index !== -1) {
      acc.x = index
      acc.y = i
    }
    return acc
  }, { x: -1, y: -1 })

  grid[guardPos.y][guardPos.x] = 'X'

  const originalGrid = grid.map(line => line.slice())
  const originalDirGrid = dirGrid.map(line => line.map(o => o.slice()))
  const originalGuardPos = { x: guardPos.x, y: guardPos.y }
  const originalGuardDir = { x: guardDir.x, y: guardDir.y }

  const ans = solveLoop(grid, guardPos, guardDir, dirGrid)
  const troddenCoords = grid.reduce((acc, line, iY) => {
    const ys = line.forEach((c, i) => {
      if (c === 'X') {
        acc.push({ x: i, y: iY })
      }
    })
    return acc
  }, [])

  const obstacles = {}

  for (const troddenCoord of troddenCoords) {
    const adjacents = getAdjacent4(originalGrid, troddenCoord.x, troddenCoord.y)
    adjacents.push(troddenCoord)

    for (const adjacent of adjacents) {
      if (adjacent.x === originalGuardPos.x && adjacent.y === originalGuardPos.y) {
        // Can't put an obstacle on the starting position
        continue
      }

      const moddedGrid = originalGrid.map(line => line.slice())
      moddedGrid[adjacent.y][adjacent.x] = '#'
      const copyGuardPos = { x: originalGuardPos.x, y: originalGuardPos.y }
      const copyGuardDir = { x: originalGuardDir.x, y: originalGuardDir.y }

      const res = solveLoop(moddedGrid, copyGuardPos, copyGuardDir, originalDirGrid, 10000)

      if (!res) {
        // We found a valid obstacle
        //console.log(`Found obstacle at ${adjacent.x}, ${adjacent.y}`)
        obstacles[`${adjacent.x}, ${adjacent.y}`] = true
      }
    }


  }
  return Object.keys(obstacles).length
}

async function start() {
  const numbers = getInput(`${__dirname}/input.txt`)

  const task1 = await timeFunction(() => partOne(numbers))
  console.log(task1)
  const task2 = await timeFunction(() => partTwoBrute(numbers))
  return [{ ans: task1.result, ms: task1.ms }, { ans: task2.result, ms: task2.ms }]
}

module.exports = start
