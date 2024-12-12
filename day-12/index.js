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
  const mapFences = []

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
        cell.fences.push({ coord: `${cell.x}, ${cell.y - 1}`, x: cell.x, y: cell.y - 1, char: '-', ocX: cell.x, ocY: cell.y, ocChar: char[0] })
      }

      // Should this cell have a fence below?
      if (groupData[`${cell.x}, ${cell.y + 1}`]) {
        // No, because theres another plant directly below it
      } else {
        cell.fences.push({ coord: `${cell.x}, ${cell.y + 1}`, x: cell.x, y: cell.y + 1, char: '-', ocX: cell.x, ocY: cell.y, ocChar: char[0] })
      }

      // Should this cell have a fence to the left?
      if (groupData[`${cell.x - 1}, ${cell.y}`]) {
        // No, because theres another plant directly to the left of it
      } else {
        cell.fences.push({ coord: `${cell.x - 1}, ${cell.y}`, x: cell.x - 1, y: cell.y, char: '|', ocX: cell.x, ocY: cell.y, ocChar: char[0] })
      }

      // Should this cell have a fence to the right?
      if (groupData[`${cell.x + 1}, ${cell.y}`]) {
        // No, because theres another plant directly to the right of it
      } else {
        cell.fences.push({ coord: `${cell.x + 1}, ${cell.y}`, x: cell.x + 1, y: cell.y, char: '|', ocX: cell.x, ocY: cell.y, ocChar: char[0] })
      }

      //cell.fences = cell.fences ? Object.keys(cell.fences) : []
    }

    const area = getAreaOfGroup(groupData)
    const perimeter = getPerimeterOfGroup(groupData)
    const allFences = Object.values(groupData).reduce((acc, cell) => {
      return acc.concat(cell.fences)
    }, [])

    allFences.forEach(o => mapFences.push(o))

    // drawFencesOnGrid(JSON.parse(JSON.stringify(groupData)), 2)

    //const sides = getSidesOfGroupOld(char[0], allFences)



    // console.log(`${char}: ${area} area, ${perimeter} perimeter = ${area * perimeter}`)
    //console.log(`${char}: ${area} area, ${sides} sides = ${area * sides} `)
    ans += area * perimeter
  }


  // drawTransposedGrid(mapFences)
  //console.log(ans)
  return ans
}

function getSidesOfGroup(char, allFences) {
  // Transpose fences
  const transpose = (x, y) => {
    return { y: y * 3 + 1, x: x * 3 + 1 }
  }

  for (const fence of allFences) {
    const transOC = transpose(fence.ocX, fence.ocY)
    const diffX = fence.x - fence.ocX
    const diffY = fence.y - fence.ocY

    fence.transCoord = { x: transOC.x + diffX, y: transOC.y + diffY }
  }

  // Do we have any dupes?
  const map = {}

  for (const fence of allFences) {
    const alias = `${fence.transCoord.x}-${fence.transCoord.y}`
    if (map[alias]) {
      debugger
      map[alias].push(fence)
    }
    map[alias] = [fence]
  }

  drawJustFencesTwo(allFences)

  let corners = 0
  for (const fence of allFences) {
    // Find potential corners
    const rightDown = allFences.find(f => f.transCoord.x === fence.transCoord.x + 1 && f.transCoord.y === fence.transCoord.y + 1) || allFences.find(f => f.transCoord.x === fence.transCoord.x + 2 && f.transCoord.y === fence.transCoord.y + 2)
    const rightUp = allFences.find(f => f.transCoord.x === fence.transCoord.x + 1 && f.transCoord.y === fence.transCoord.y - 1) || allFences.find(f => f.transCoord.x === fence.transCoord.x + 2 && f.transCoord.y === fence.transCoord.y - 2)
    const leftDown = allFences.find(f => f.transCoord.x === fence.transCoord.x - 1 && f.transCoord.y === fence.transCoord.y + 1) || allFences.find(f => f.transCoord.x === fence.transCoord.x - 2 && f.transCoord.y === fence.transCoord.y + 2)
    const leftUp = allFences.find(f => f.transCoord.x === fence.transCoord.x - 1 && f.transCoord.y === fence.transCoord.y - 1) || allFences.find(f => f.transCoord.x === fence.transCoord.x - 2 && f.transCoord.y === fence.transCoord.y - 2)

    if (rightDown?.ocChar === char) {
      corners++
    }

    if (rightUp?.ocChar === char) {
      corners++
    }

    if (leftDown?.ocChar === char) {
      corners++
    }

    if (leftUp?.ocChar === char) {
      corners++
    }
  }

  return corners

  let fence = allFences[0]
  let direction = fence.char === '-' ? 'right' : 'down'
  while (true) {
    // From fence, can we move to another fence?
    const potentialRight = fence.char === '-' ? allFences.find(f => f.transCoord.x === fence.transCoord.x + 2 && f.transCoord.y === fence.transCoord.y) : undefined
    const potentialDown = fence.char === '-' ? allFences.find(f => Math.abs(f.transCoord.x - fence.transCoord.x) <= 1 && f.transCoord.y === fence.transCoord.y + 1) : allFences.find(f => f.transCoord.x === fence.transCoord.x && f.transCoord.y === fence.transCoord.y + 2)
    const potentialLeft = fence.char === '-' ? allFences.find(f => f.transCoord.x === fence.transCoord.x - 2 && f.transCoord.y === fence.transCoord.y) : undefined
    const potentialUp = fence.char === '-' ? allFences.find(f => Math.abs(f.transCoord.x - fence.transCoord.x) <= 1 && f.transCoord.y === fence.transCoord.y - 1) : allFences.find(f => f.transCoord.x === fence.transCoord.x && f.transCoord.y === fence.transCoord.y - 2)

    if (direction === 'right') {
      const potentialRight = allFences.find(f => f.transCoord.x === fence.transCoord.x + 2 && f.transCoord.y === fence.transCoord.y)
      const potentialDown = allFences.find(f => f.transCoord.x === fence.transCoord.x + 1 && f.transCoord.y === fence.transCoord.y + 1) || allFences.find(f => f.transCoord.x === fence.transCoord.x + 2 && f.transCoord.y === fence.transCoord.y + 2)

    }
  }
}

function drawJustFencesTwo(allFences) {

  const maxX = Math.max(...allFences.map(o => o.transCoord.x))
  const maxY = Math.max(...allFences.map(o => o.transCoord.y))

  const grid = []
  let header = ''
  for (let y = -1; y <= maxY; y++) {
    grid[y] = []
    for (let x = -1; x <= maxX; x++) {
      grid[y][x] = ' '
      if (y === -1) {
        header += `${x}`
      }

    }
  }


  for (const fence of allFences) {

    try { grid[fence.transCoord.y][fence.transCoord.x] = fence.char }
    catch (e) { console.log(e) }
  }

  console.log(header)
  for (let y = -1; y < grid.length; y++) {
    let line = `${y.toString().padStart(2, '0')}: `
    for (let x = -1; x < grid[y].length; x++) {
      line += grid[y][x]
    }

    console.log(line)
  }
}

function drawJustFences(allFences) {
  const grid = []
  for (let y = -1; y <= 15; y++) {
    grid[y] = []
    for (let x = -1; x <= 15; x++) {
      grid[y][x] = ' '
    }
  }


  for (const fence of allFences) {

    try { grid[fence.y + 1][fence.x + 1] = fence.char }
    catch (e) { console.log(e) }
  }


  console.log([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].join(''))
  for (let y = 0; y < grid.length; y++) {
    console.log(`${y} ${grid[y].join('')}`)
  }
}

function drawFencesOnGrid(group, spacing = 1) {
  const grid = []


  // Transpose Corrds

  const transpose = (x, y) => {
    return { y: y * spacing + 1, x: x * spacing + 1 }
  }

  const maxX = Math.max(...Object.values(group).map(o => o.x))
  const maxY = Math.max(...Object.values(group).map(o => o.y))

  for (let y = 0; y <= (maxY * 3) + 2; y++) {
    grid[y] = []
    for (let x = 0; x <= (maxX * 3) + 2; x++) {
      grid[y][x] = ' '
    }
  }

  // First draw back on the original cells
  for (const cell of Object.values(group)) {
    const coord = transpose(cell.x, cell.y)
    grid[coord.y][coord.x] = cell.char

    // Now draw the fences
    for (const fence of cell.fences) {
      const fenceCellDiffX = fence.x - cell.x
      const fenceCellDiffY = fence.y - cell.y

      try { grid[coord.y + fenceCellDiffY][coord.x + fenceCellDiffX] = fence.char }
      catch (e) { console.log(e) }
    }
  }


  for (let y = 0; y < grid.length; y++) {
    console.log(`${y} ${grid[y].join('')}`)
  }

}

function drawTransposedGrid(fences, spacing = 1) {
  const grid = []
  // Transpose Corrds

  // Transpose fences
  const transpose = (x, y) => {
    return { y: y * 3 + 1, x: x * 3 + 1 }
  }

  for (const fence of fences) {
    const transOC = transpose(fence.ocX, fence.ocY)
    const diffX = fence.x - fence.ocX
    const diffY = fence.y - fence.ocY

    fence.transCoord = { x: transOC.x + diffX, y: transOC.y + diffY }
    fence.transOcCoord = { x: transOC.x, y: transOC.y }
  }

  const maxX = Math.max(...fences.map(o => o.transCoord.x))
  const maxY = Math.max(...fences.map(o => o.transCoord.y))

  for (let y = -1; y <= maxY; y++) {
    grid[y] = []
    for (let x = -1; x <= maxX; x++) {
      grid[y][x] = ' '
    }
  }

  for (const fence of fences) {
    grid[fence.transCoord.y][fence.transCoord.x] = fence.char
    grid[fence.transOcCoord.y][fence.transOcCoord.x] = fence.ocChar
  }

  for (let y = 0; y < grid.length; y++) {
    let row = `${y}: `
    for (let x = 0; x < grid[y].length; x++) {
      row += grid[y][x]
    }
    console.log(row)
  }

}

function getAreaOfGroup(group) {
  return Object.keys(group).length
}

function getPerimeterOfGroup(group) {
  return Object.values(group).reduce((acc, cell) => {
    return acc + cell.fences?.length || 0
  }, 0)
}

function getSidesOfGroupOld(group, allFences) {
  let sides = []
  let copyAllFences = JSON.parse(JSON.stringify(allFences))

  //drawJustFences(JSON.parse(JSON.stringify(allFences)))

  for (let i = 0; i < copyAllFences.length;) {
    const fence = copyAllFences[i]

    // if (sides[`${fence.coord}-${fence.char}`]) {
    //   copyAllFences.splice(i, 1)
    //   sides[`${fence.coord}-${fence.char}`].skips = sides[`${fence.coord}-${fence.char}`].skips ? (sides[`${fence.coord}-${fence.char}`].skips + 1) : 1
    //   continue
    // }

    const side = [fence]
    copyAllFences.splice(i, 1)
    getSideOld(fence.x, fence.y, copyAllFences, fence.char, side)

    sides.push(side)
    //drawJustFences(JSON.parse(JSON.stringify(allFences)))
    //drawJustFences(Object.values(sides).flat())
    // console.log(fence.coord, side)
  }

  // Find skips
  for (const side of Object.values(sides)) {
    if (side.skips) {
      console.log(`Skips: ${side.skips}`)
    }
  }

  return Object.keys(sides).length
}

function getSideOld(startX, startY, allFences, direction, path = []) {
  if (direction === '-') {
    const opt1Index = allFences.findIndex(o => o.char === '-' && o.x === startX + 1 && o.y === startY)
    const opt1 = allFences[opt1Index]
    const opt2Index = allFences.findIndex(o => o.char === '-' && o.x === startX - 1 && o.y === startY)
    const opt2 = allFences[opt2Index]

    const opt1Temp = opt1 ? path.find(p => p.x === opt1.x && p.y === opt1.y && opt1.ocX !== p.ocX && opt1.ocY !== p.ocY) : undefined
    const opt2Temp = opt2 ? path.find(p => p.x === opt2.x && p.y === opt2.y && opt2.ocX !== p.ocX && opt2.ocY !== p.ocY) : undefined

    if (opt1Index > -1) {
      if (path.find(p => p.x === opt1.x && p.y === opt1.y) && !opt1Temp) {
        // Noop
      } else {
        path.push(opt1)
        allFences.splice(opt1Index, 1)
        getSideOld(opt1.x, opt1.y, allFences, direction, path)
      }
    }

    if (opt2Index > -1) {
      if (path.find(p => p.x === opt2.x && p.y === opt2.y) && !opt2Temp) {
        // Noop
      } else {
        path.push(opt2)
        allFences.splice(opt2Index, 1)
        getSideOld(opt2.x, opt2.y, allFences, direction, path)
      }
    }
  } else {
    const opt1Index = allFences.findIndex(o => o.char === '|' && o.x === startX && o.y === startY + 1)
    const opt1 = allFences[opt1Index]
    const opt2Index = allFences.findIndex(o => o.char === '|' && o.x === startX && o.y === startY - 1)
    const opt2 = allFences[opt2Index]

    const opt1Temp = opt1 ? path.find(p => p.x === opt1.x && p.y === opt1.y && opt1.ocX !== p.ocX && opt1.ocY !== p.ocY) : undefined
    const opt2Temp = opt2 ? path.find(p => p.x === opt2.x && p.y === opt2.y && opt2.ocX !== p.ocX && opt2.ocY !== p.ocY) : undefined

    if (opt1Index > -1) {

      // If it contains a fence already at that coord - it MUST be created by the same cell

      if (path.find(p => p.x === opt1.x && p.y === opt1.y) && !opt1Temp) {
        // Noop
      } else {
        path.push(opt1)
        allFences.splice(opt1Index, 1)
        getSideOld(opt1.x, opt1.y, allFences, direction, path)
      }


    }
    if (opt2Index > -1) {

      if (path.find(p => p.x === opt2.x && p.y === opt2.y) && !opt2Temp) {
        return
      } else {
        path.push(opt2)
        allFences.splice(opt2Index, 1)
        getSideOld(opt2.x, opt2.y, allFences, direction, path)
      }


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
  const mapFences = []

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
        cell.fences.push({ coord: `${cell.x}, ${cell.y - 1}`, x: cell.x, y: cell.y - 1, char: '-', ocX: cell.x, ocY: cell.y, ocChar: char[0] })
      }

      // Should this cell have a fence below?
      if (groupData[`${cell.x}, ${cell.y + 1}`]) {
        // No, because theres another plant directly below it
      } else {
        cell.fences.push({ coord: `${cell.x}, ${cell.y + 1}`, x: cell.x, y: cell.y + 1, char: '-', ocX: cell.x, ocY: cell.y, ocChar: char[0] })
      }

      // Should this cell have a fence to the left?
      if (groupData[`${cell.x - 1}, ${cell.y}`]) {
        // No, because theres another plant directly to the left of it
      } else {
        cell.fences.push({ coord: `${cell.x - 1}, ${cell.y}`, x: cell.x - 1, y: cell.y, char: '|', ocX: cell.x, ocY: cell.y, ocChar: char[0] })
      }

      // Should this cell have a fence to the right?
      if (groupData[`${cell.x + 1}, ${cell.y}`]) {
        // No, because theres another plant directly to the right of it
      } else {
        cell.fences.push({ coord: `${cell.x + 1}, ${cell.y}`, x: cell.x + 1, y: cell.y, char: '|', ocX: cell.x, ocY: cell.y, ocChar: char[0] })
      }

      //cell.fences = cell.fences ? Object.keys(cell.fences) : []
    }

    const area = getAreaOfGroup(groupData)
    const perimeter = getPerimeterOfGroup(groupData)
    const allFences = Object.values(groupData).reduce((acc, cell) => {
      return acc.concat(cell.fences)
    }, [])

    allFences.forEach(o => mapFences.push(o))

    // drawFencesOnGrid(JSON.parse(JSON.stringify(groupData)), 2)

    const sides = getSidesOfGroupOld(char[0], allFences)



    // console.log(`${char}: ${area} area, ${perimeter} perimeter = ${area * perimeter}`)
    //console.log(`${char}: ${area} area, ${sides} sides = ${area * sides} `)
    ans += area * sides
  }


  // drawTransposedGrid(mapFences)
  //console.log(ans)
  return ans
}

async function start() {
  const numbers = getInput(`${__dirname}/input.txt`)

  const task1 = await timeFunction(() => partOne(numbers))
  const task2 = await timeFunction(() => partTwo(numbers))
  return [{ ans: task1.result, ms: task1.ms }, { ans: task2.result, ms: task2.ms }]
}

module.exports = start
start()