const { timeFunction, getInput, getAdjacent8, getAdjacent4 } = require('../common')

function partOne(rows) {
  const grid = rows.map(row => row.split(''))
  let ans = 0
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {

      if (grid[y][x] === 'X') {
        // is XMAS visible from here?
        ans += isXmas(grid, x, y)
      }
    }
  }

  return ans
}

function isXmas(grid, x, y) {
  // We know X is at (x, y)
  // A should be any adjacent 
  let count = 0
  const adjacents = getAdjacent8(grid, x, y)

  for (let i = 0; i < adjacents.length; i++) {
    const m = adjacents[i]
    if (m.char === 'M') {
      // By now we have the direction locked (ie, the same direction from X to M)
      // Is the next in the same direction an A (and then S)?

      const xDiff = m.x - x
      const yDiff = m.y - y

      let nextX = m.x + xDiff
      let nextY = m.y + yDiff

      if (grid[nextY]?.[nextX] === 'A') {
        let sNextX = nextX + xDiff
        let sNextY = nextY + yDiff
        if (grid[sNextY]?.[sNextX] === 'S') {
          // We have found the XMAS
          //console.log(`Found XMAS at (${x}, ${y}) - ${sNextX}, ${sNextY}`)
          count++
          continue
        } else {
          continue
        }
      } else {
        continue
      }
    }
  }
  return count
}

function partTwo(rows) {
  const grid = rows.map(row => row.split(''))
  let ans = 0
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {

      if (grid[y][x] === 'A') {
        const diagonals = getAdjacent8(grid, x, y).filter(a => a.x - x !== 0 && a.y - y !== 0)

        const Ms = diagonals.filter(a => a.char === 'M')
        const Ss = diagonals.filter(a => a.char === 'S')
        if (Ms.length === 2 && Ss.length === 2) {
          if (diagonals[0].char !== diagonals[3]?.char && diagonals[1].char !== diagonals[2]?.char) {
            ans++
          }
        }
      }
    }
  }

  return ans
}

async function start() {
  const numbers = getInput(`${__dirname}/input.txt`)

  const task1 = await timeFunction(() => partOne(numbers))
  const task2 = await timeFunction(() => partTwo(numbers))
  return [{ ans: task1.result, ms: task1.ms }, { ans: task2.result, ms: task2.ms }]
}

module.exports = start