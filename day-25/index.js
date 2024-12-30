const { timeFunction, getInput } = require('../common')

function interpretInput(lines) {
  const locks = []
  const keys = []
  let current = []
  for (let i = 0; i < lines.length; i += 8) {
    const sub = lines.slice(i, i + 7)
    const isLock = sub[0] === '#####'
    const grid = sub.map(o => o.split(''))
    const cols = {}
    for (let y = 0; y < sub.length; y++) {
      for (let x = 0; x < 5; x++) {
        if (!cols[x]) {

          cols[x] = 0
        }
        if (grid[y][x] === '#') {
          cols[x]++
        }
      }
    }

    if (sub[0] === '#####') {

      locks.push({ grid, cols })
    } else {
      keys.push({ grid, cols })
    }
  }

  return { keys, locks }
}

function partOne(numbers) {
  const { keys, locks } = interpretInput(numbers)
  let ans = 0
  for (const lock of locks) {
    for (const key of keys) {
      let fits = true
      for (let i = 0; i <= 5; i++) {
        if (lock.cols[i] + key.cols[i] >7) {
          fits = false
          break
        }
      }
      if (fits) {
       // console.log(`lock: ${Object.values(lock.cols).join(',')} and `)
      // console.log(lock.grid.join('\n'))
      // console.log('and')
      // console.log(key.grid.join('\n'))
       ans++
      }
    }
  }
  // console.log(ans)
  return ans
}

function partTwo(numbers) {
  return 0
}

async function start() {
  const numbers = getInput(`${__dirname}/input.txt`)

  const task1 = await timeFunction(() => partOne(numbers))
  const task2 = await timeFunction(() => partTwo(numbers))
  return [{ ans: task1.result, ms: task1.ms }, { ans: task2.result, ms: task2.ms }]
}

module.exports = start
