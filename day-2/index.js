const { timeFunction, getInput } = require('../common')

function partOne(numbers) {
  let safe = 0
  for (let i = 0; i < numbers.length; i++) {
    const report = numbers[i]

    const levels = report.split(' ').map(o => parseInt(o))

    if (!isAllIncreasingOrDedecreasing(levels, report)) {
      continue
    }

    if (!isAdjacent(levels)) {
      continue
    }

    safe++
  }

  return safe
}

function isAllIncreasingOrDedecreasing(levels, report) {
  const allIncrease = levels.slice().sort((a, b) => a - b).join(' ')
  const allDecrease = levels.slice().sort((a, b) => b - a).join(' ')

  for(let i = 0; i < levels.length; i++) {
    if (levels[i] === levels[i - 1]) {
      return false
    }
  }

  return allIncrease === report || allDecrease === report
}

function isAdjacent(levels) {
  for (let i = 1; i < levels.length; i++) {
    const level = levels[i]
    const previous = levels[i - 1]

    if (Math.abs(level - previous) >= 1 && Math.abs(level - previous) <= 3) {

    } else {
      return false
    }
  }

  return true
}

function partTwo(numbers) {
  let safe = 0
  for (let i = 0; i < numbers.length; i++) {
    const report = numbers[i]

    const levels = report.split(' ').map(o => parseInt(o))

    if (!isAllIncreasingOrDedecreasing(levels, report) || !isAdjacent(levels)) {
      // Can we remove 1 number from here to make it valid?
      for (let j = 0; j < levels.length; j++) {
        const newLevels = levels.slice()
        newLevels.splice(j, 1)
        if (isAllIncreasingOrDedecreasing(newLevels, newLevels.join(' ')) && isAdjacent(newLevels)) {
          safe++
          break
        }
      }
      continue
    }
    safe++
  }

  return safe
}

async function start() {
  const numbers = getInput(`${__dirname}/input.txt`)

  const task1 = await timeFunction(() => partOne(numbers))
  
  const task2 = await timeFunction(() => partTwo(numbers))
  return [{ ans: task1.result, ms: task1.ms }, { ans: task2.result, ms: task2.ms }]
}

module.exports = start