const { timeFunction, getInput } = require('../common')

function partOne(numbers) {
  const grid = numbers.map(line => line.split(''))
  const antiGrid = numbers.map(line => line.split(''))

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      const current = grid[y][x]

      if (current === '.') {
        continue
      }

      createAntinodesFor(grid, x, y, antiGrid)

    }
  }

  // Count the Xs

  const ans = antiGrid.reduce((acc, line) => acc + line.filter(c => c === '#').length, 0)
  console.log(ans)
  return ans
}

function createAntinodesFor(grid, x, y, antiGrid) {
  for (let y2 = 0; y2 < grid.length; y2++) {
    for (let x2 = 0; x2 < grid[y2].length; x2++) {
      const current = grid[y2][x2]

      if (current === '.') {
        continue
      }

      if (y === y2 && x === x2) {
        // Can't create an antinode with itself
        continue
      }

      if (current !== grid[y][x]) {
        // This antenna is not the same type
        continue
      }

      // At this point we must have another antenna that matches our source one

      const xDiff = x - x2
      const yDiff = y - y2

      // Create an Antinode at the other side

      const xAnti = x2 - xDiff
      const yAnti = y2 - yDiff

      if (yAnti < 0 || yAnti >= grid.length || xAnti < 0 || xAnti >= grid[yAnti].length) {
        // Can't create an antinode outside the grid
        continue
      }

      antiGrid[yAnti][xAnti] = '#'
    }
  }
}

function partTwo(numbers) {
  const grid = numbers.map(line => line.split(''))
  const antiGrid = numbers.map(line => line.split(''))

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      const current = grid[y][x]

      if (current === '.') {
        continue
      }

      createAntinodesForPartTwo(grid, x, y, antiGrid, true)

    }
  }

  // Count the Xs

  const ans = antiGrid.reduce((acc, line) => acc + line.filter(c => c === '#').length, 0)
  // console.log(ans)
  return ans
}

function createAntinodesForPartTwo(grid, x, y, antiGrid) {
  for (let y2 = 0; y2 < grid.length; y2++) {
    for (let x2 = 0; x2 < grid[y2].length; x2++) {
      const current = grid[y2][x2]

      if (current === '.') {
        continue
      }

      if (y === y2 && x === x2) {
        // Can't create an antinode with itself
        continue
      }

      if (current !== grid[y][x]) {
        // This antenna is not the same type
        continue
      }

      // At this point we must have another antenna that matches our source one

      const xDiff = x - x2
      const yDiff = y - y2

      let xAnti = x2 
      let yAnti = y2

      if (yAnti < 0 || yAnti >= grid.length || xAnti < 0 || xAnti >= grid[yAnti].length) {
        // Can't create an antinode outside the grid
        continue
      }

      antiGrid[yAnti][xAnti] = '#'

      while (true) {
        // While inside the map boundaries, keep reepeating this diff

        xAnti -= xDiff
        yAnti -= yDiff

        if (yAnti < 0 || yAnti >= grid.length || xAnti < 0 || xAnti >= grid[yAnti].length) {
          // Can't create an antinode outside the grid
          break
        }

        antiGrid[yAnti][xAnti] = '#'
      }

      // debugger
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