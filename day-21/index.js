const { timeFunction, getInput, getAdjacent4 } = require('../common')

const globalCache = {}

function enterCodeOnIntermidiateKeypad(code, allowSpace = false, shortest = Infinity) {
  const chars = code.toString().split('')

  /*

    +---+---+
    | ^ | A |
+---+---+---+
| < | v | > |
+---+---+---+

  */

  const grid = [
    [' ', '^', 'A'],
    ['<', 'v', '>']
  ]

  let path = []
  let paths = []

  let x = 2
  let y = 0

  let queue = []

  const res = minPath(grid, x, y, chars[0])

  res.forEach(o => queue.push({ fromChar: chars[0], fromCharIndex: 0, nextChar: chars[1], nextCharIndex: 1, state: o, path: [...o.path], score: [...o.score] }))
  let bestSoFar = shortest
  while (queue.length) {
    queue.sort((a, b) => b.fromCharIndex - a.fromCharIndex)
    const item = queue.shift()

    if (item.score.length > bestSoFar) {
      continue
    }

    if (!item.nextChar) {
      // Finished
      paths.push(item)
      bestSoFar = Math.min(bestSoFar, item.score.length)
      if (allowSpace) {
        return paths.map(o => o.score.join('') + 'A')
      }
    }

    const dirs = minPath(grid, item.state.x, item.state.y, item.nextChar)

    dirs.forEach(o => queue.push({ fromChar: item.nextChar, fromCharIndex: item.nextCharIndex, nextChar: chars[item.nextCharIndex + 1], nextCharIndex: item.nextCharIndex + 1, state: o, path: [...item.path, ...o.path], score: [...item.score, 'A', ...o.score] }))
  }


  return paths.map(o => o.score.join('') + 'A')
}

function enterCdeOnFinalKeypad(code) {
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

  let path = []
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

function getCoord(grid, char = 'S') {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] === char) {
        return { x: j, y: i }
      }
    }
  }
}

function minPath(grid, x, y, target, allowSpace = false) {
  const targetCoord = getCoord(grid, target)
  const cells = [{ x: x, y: y, direction: '>', path: [{ x: x, y: y }], score: [] }]
  const cache = {}
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
  const ans = []
  const paths = {}
  for (const number of numbers) {
    console.log(`CONSIDERING ${number}`)
    const finalKeypad = enterCdeOnFinalKeypad(number)
    //console.log(`To enter ${number} on the final keypad, we need to enter:\n${finalKeypad.join('\n')}`)
    console.log(`To enter ${number} on the final keypad, we have ${finalKeypad.length} choices`)

    let pathsAfterOne = []
    for (const o of finalKeypad) {
      const iterKeypad = enterCodeOnIntermidiateKeypad(o)
      //console.log(`To enter ${o} on the final keypad, we need to enter:\n${iterKeypad.join('\n')}`)
      console.log(`To enter ${o} on the final keypad, we have ${iterKeypad.length} choices`)
      pathsAfterOne.push(...iterKeypad)
    }

    const shortestOne = pathsAfterOne.reduce((acc, curr) => Math.min(acc, curr.length), Infinity)
    const shortestPathsAfterOne = pathsAfterOne.filter(o => o.length === shortestOne)

    let pathsAfterTwo = []
    let shortestSoFar = Infinity
    for (const o of shortestPathsAfterOne) {
      const iterKeypad = enterCodeOnIntermidiateKeypad(o, true, shortestSoFar)
      if (!iterKeypad.length) continue
      //console.log(`To enter ${o} on the intermediate keypad, we need to enter:\n${iterKeypad.join('\n')}`)
      shortestSoFar = Math.min(shortestSoFar, ...iterKeypad.map(o => o.length))
      pathsAfterTwo.push(...iterKeypad)
      console.log(`To enter ${o} on the final keypad, we have ${iterKeypad.length} choices. Shortest is ${shortestSoFar}`)
    }

    const shortestTwo = pathsAfterTwo.reduce((acc, curr) => Math.min(acc, curr.length), Infinity)
    const shortestPathsAfterTwo = pathsAfterTwo.filter(o => o.length === shortestTwo)

    paths[number] = shortestPathsAfterTwo

    const numPart = Number(number.match(/(\d+)/)?.[1])
    ans.push({ a: shortestPathsAfterTwo[0].length, b: numPart, total: shortestPathsAfterTwo[0].length * numPart })
  }

  const finalAns = ans.reduce((acc, curr) => acc + curr.total, 0)
  console.log(JSON.stringify(ans))
  console.log(finalAns)
  return finalAns
}

function partTwo(numbers) {
  const ans = []
  const paths = {}
  for (const number of numbers) {
    console.log(`CONSIDERING ${number}`)
    const finalKeypad = enterCdeOnFinalKeypad(number)
    //console.log(`To enter ${number} on the final keypad, we need to enter:\n${finalKeypad.join('\n')}`)
    console.log(`To enter ${number} on the final keypad, we have ${finalKeypad.length} choices`)

    let pathsToTest = [...finalKeypad]
    for (let i = 0; i < 2; i++) {
      let newPathsToTest = []
      let shortestSoFar = Infinity

      while (pathsToTest.length) {
        pathsToTest.sort((a, b) => b.length - a.length)
        const item = pathsToTest.shift()

        const iterKeypad = enterCodeOnIntermidiateKeypad(item, false, shortestSoFar)
        newPathsToTest.push(...iterKeypad)
      }
      pathsToTest = [...newPathsToTest]
    }

    const shortestOne = pathsToTest.reduce((acc, curr) => Math.min(acc, curr.length), Infinity)
    const shortestPathsAfterOne = pathsToTest.filter(o => o.length === shortestOne)

    paths[number] = shortestPathsAfterOne

    const numPart = Number(number.match(/(\d+)/)?.[1])
    ans.push({ a: shortestPathsAfterOne[0].length, b: numPart, total: shortestPathsAfterOne[0].length * numPart })
  }

  const finalAns = ans.reduce((acc, curr) => acc + curr.total, 0)
  console.log(JSON.stringify(ans))
  console.log(finalAns)
  return finalAns
}

async function start() {
  const numbers = getInput(`${__dirname}/input.txt`)

  // const task1 = await timeFunction(() => partOne(numbers))
  const task2 = await timeFunction(() => partTwo(numbers))
  return [{ ans: task1.result, ms: task1.ms }, { ans: task2.result, ms: task2.ms }]
}

module.exports = start

start()