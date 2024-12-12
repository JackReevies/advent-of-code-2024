const { timeFunction, getInput, getAdjacent4 } = require('../common')

function partOne(numbers) {
  const visualGrid = numbers.map(row => row.split(''))
  const grid = numbers.map(row => row.split(''))

  // // Insert empty rows between all
  // for (let y = 0; y < visualGrid.length; y++) {
  //   const row = visualGrid[y]
  //   visualGrid.splice(y, 0, Array(row.length).fill(' '))
  //   y++
  // }

  // visualGrid.push(Array(visualGrid[0].length).fill(' '))

  // //Insert empty columns between all
  // for (let y = 0; y < visualGrid.length; y++) {
  //   const row = visualGrid[y]
  //   for (let x = 0; x < row.length; x += 2) {
  //     visualGrid[y].splice(x, 0, ' ')
  //   }
  //   visualGrid[y].push(' ')
  // }

  const groups = {}

  for (let y = 0; y < grid.length; y++) {
    const row = grid[y]
    for (let x = 0; x < row.length; x++) {
      const char = row[x]

      if (char === ' ') {
        continue
      }

      const adjacent = getAdjacent4(x, y, grid)

      const group = { [`${x}, ${y}`]: { char, coord: `${x}, ${y}`, x, y } }
      findGroup(grid, x, y, group)

      // Delete these from the grid
      for (const cell of Object.values(group)) {
        grid[cell.y][cell.x] = ' '
      }

      groups[`${char} @ (${x}, ${y})`] = group
    }
  }

  let ans = 0

  for (const group of Object.keys(groups)) {
    const char = group
    const groupData = groups[char]

    for (const cell of Object.values(groupData)) {
      if (!cell.fences) {
        cell.fences = []
      }

      // Should this cell have a fence above?
      if (groupData[`${cell.x}, ${cell.y - 1}`]) {
        // No, because theres another plant directly above it
      } else {
        cell.fences.push({ coord: `${cell.x}, ${cell.y - 1}`, x: cell.x, y: cell.y - 1, char: '-', ocX: cell.x, ocY: cell.y })
      }

      // Should this cell have a fence below?
      if (groupData[`${cell.x}, ${cell.y + 1}`]) {
        // No, because theres another plant directly below it
      } else {
        cell.fences.push({ coord: `${cell.x}, ${cell.y + 1}`, x: cell.x, y: cell.y + 1, char: '-', ocX: cell.x, ocY: cell.y })
      }

      // Should this cell have a fence to the left?
      if (groupData[`${cell.x - 1}, ${cell.y}`]) {
        // No, because theres another plant directly to the left of it
      } else {
        cell.fences.push({ coord: `${cell.x - 1}, ${cell.y}`, x: cell.x - 1, y: cell.y, char: '|', ocX: cell.x, ocY: cell.y })
      }

      // Should this cell have a fence to the right?
      if (groupData[`${cell.x + 1}, ${cell.y}`]) {
        // No, because theres another plant directly to the right of it
      } else {
        cell.fences.push({ coord: `${cell.x + 1}, ${cell.y}`, x: cell.x + 1, y: cell.y, char: '|', ocX: cell.x, ocY: cell.y })
      }

      //cell.fences = cell.fences ? Object.keys(cell.fences) : []
    }

    const area = getAreaOfGroup(groupData)
    const perimeter = getPerimeterOfGroup(groupData)
    const allFences = Object.values(groupData).reduce((acc, cell) => {
      return acc.concat(cell.fences)
    }, [])

    const sides = getSidesOfGroup(groupData, allFences)

    console.log(`${char}: ${area} area, ${perimeter} perimeter = ${area * perimeter}`)
    console.log(`${char}: ${sides} sides, ${area} area = ${area * sides}`)
    ans += area * perimeter
  }
  console.log(ans)
  debugger
}

function getAreaOfGroup(group) {
  return Object.keys(group).length
}

function getPerimeterOfGroup(group) {
  return Object.values(group).reduce((acc, cell) => {
    return acc + cell.fences?.length || 0
  }, 0)
}

function getSidesOfGroup(group, allFences) {
  let sides = {}
  let copyAllFences = JSON.parse(JSON.stringify(allFences))

  for (let i = 0; i < copyAllFences.length;) {
    const fence = copyAllFences[i]

    if (sides[fence.coord]) {
      continue
    }

    const side = [fence]
    copyAllFences.splice(i, 1)
    getSide(fence.x, fence.y, copyAllFences, fence.char, side)
    sides[`${fence.coord}-${fence.char}`] = side
    // console.log(fence.coord, side)
  }

  return Object.keys(sides).length
}

function getSide(startX, startY, allFences, direction, path = []) {
  if (direction === '-') {
    const opt1Index = allFences.findIndex(o => o.char === '-' && o.x === startX + 1 && o.y === startY)
    const opt1 = allFences[opt1Index]
    const opt2Index = allFences.findIndex(o => o.char === '-' && o.x === startX - 1 && o.y === startY)
    const opt2 = allFences[opt2Index]

    if (opt1Index > -1) {
      path.push(opt1)
      allFences.splice(opt1Index, 1)
      getSide(opt1.x, opt1.y, allFences, direction, path)
    } else if (opt2Index > -1) {
      path.push(opt2)
      getSide(opt2.x, opt2.y, allFences, direction, path)
    }
  } else {
    const opt1Index = allFences.findIndex(o => o.char === '|' && o.x === startX && o.y === startY + 1)
    const opt1 = allFences[opt1Index]
    const opt2Index = allFences.findIndex(o => o.char === '|' && o.x === startX && o.y === startY - 1)
    const opt2 = allFences[opt2Index]

    if (opt1Index > -1) {
      path.push(opt1)
      allFences.splice(opt1, 1)
      getSide(opt1.x, opt1.y, allFences, direction, path)
    } else if (opt2Index > -1) {
      path.push(opt2)
      allFences.splice(opt2, 1)
      getSide(opt2.x, opt2.y, allFences, direction, path)
    }
  }
}

function addFenceToCell(cell, coord, direction) {
  if (!cell.fences) {
    cell.fences = []
  }

  cell.fences.push({ coord, direction })
}

function findGroup(grid, x, y, group) {
  const adjacents = getAdjacent4(grid, x, y).filter(o => o.char === grid[y][x])

  for (const adjacent of adjacents) {
    if (!group[`${adjacent.x}, ${adjacent.y}`]) {
      group[`${adjacent.x}, ${adjacent.y}`] = adjacent
      findGroup(grid, adjacent.x, adjacent.y, group)
    }
  }
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