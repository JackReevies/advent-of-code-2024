const { timeFunction, getInput } = require('../common')

function partOne(numbers) {
  let ans = 0
  let valid = []
  for (const line of numbers) {
    const regex = /(\d+): (.+)/.exec(line)

    const solveFor = Number(regex[1])
    const numbers = regex[2].split(' ').map(n => parseInt(n))

    // Every possible combination of operators between every possible combination of numbers

    const operators = ['+', '*']
    const permutations = {}

    const number = numbers[0]
    const nextNumber = numbers[1]

    for (const operator of operators) {
      permutations[`${number} ${operator} ${nextNumber}`] = [number, operator, nextNumber]
    }

    for (let i = 2; i < numbers.length; i++) {
      const number = numbers[i]

      const toAddPermutations = {}

      for (const operator of operators) {
        for (const leftSide of Object.keys(permutations)) {
          toAddPermutations[`${leftSide} ${operator} ${number}`] = [...permutations[leftSide], operator, number]
        }
      }

      Object.assign(permutations, toAddPermutations)
    }

    for (const key of Object.keys(permutations)) {
      const value = permutations[key]
      if (value.length === numbers.length + numbers.length - 1) {
        permutations[key] = leftToRightSolve(value)
      }
    }

    // Does any of the values match the solveFor?
    const found = Object.values(permutations).find(v => v === solveFor)

    if (found) {
      // console.log(`Found ${found} for ${solveFor}`)
      ans += solveFor
      valid.push(line)
    }
  }

  // console.log(ans)
  return { ans, valid }
}

function leftToRightSolve(equationParts) {
  let ans = 0
  for (let i = 0; i < equationParts.length; i++) {
    const part = equationParts[i]
    if (part === '+') {
      equationParts[i] = equationParts[i - 1] + equationParts[i + 1]
      equationParts.splice(i + 1, 1)
      equationParts.splice(i - 1, 1)
      i--
    } else if (part === '*') {
      equationParts[i] = equationParts[i - 1] * equationParts[i + 1]
      equationParts.splice(i + 1, 1)
      equationParts.splice(i - 1, 1)
      i--
    } else if (part === '||') {
      equationParts[i] = parseInt(`${equationParts[i - 1]}${equationParts[i + 1]}`)
      equationParts.splice(i + 1, 1)
      equationParts.splice(i - 1, 1)
      i--
    }
  }
  return equationParts[0]
}

function partTwo(numbers, p1Ans) {
  let ans = p1Ans.ans
  for (const line of numbers) {
    if (p1Ans.valid.includes(line)) {
      continue
    }
    const regex = /(\d+): (.+)/.exec(line)

    const solveFor = Number(regex[1])
    const numbers = regex[2].split(' ').map(n => parseInt(n))

    // Every possible combination of operators between every possible combination of numbers

    const operators = ['+', '*', '||']
    const permutations = {}

    const number = numbers[0]
    const nextNumber = numbers[1]

    for (const operator of operators) {
      permutations[`${number} ${operator} ${nextNumber}`] = [number, operator, nextNumber]
    }

    for (let i = 2; i < numbers.length; i++) {
      const number = numbers[i]

      const toAddPermutations = {}

      for (const operator of operators) {
        for (const leftSide of Object.keys(permutations)) {
          toAddPermutations[`${leftSide} ${operator} ${number}`] = [...permutations[leftSide], operator, number]
        }
      }

      Object.assign(permutations, toAddPermutations)
    }

    // console.log(`Permutations for ${solveFor}: ${Object.keys(permutations).length}`)

    for (const key of Object.keys(permutations)) {
      const value = permutations[key]
      if (value.length === numbers.length + numbers.length - 1) {
        permutations[key] = leftToRightSolve(value)
      }
    }

    // Does any of the values match the solveFor?
    const found = Object.values(permutations).find(v => v === solveFor)

    if (found) {
      // console.log(`Found ${found} for ${solveFor}`)
      ans += solveFor
    }
  }

  return ans
}

async function start() {
  const numbers = getInput(`${__dirname}/input.txt`)
  const task1 = await timeFunction(() => partOne(numbers))
  const task2 = await timeFunction(() => partTwo(numbers, task1.result))
  return [{ ans: task1.result?.ans, ms: task1.ms }, { ans: task2.result, ms: task2.ms }]
}

module.exports = start
