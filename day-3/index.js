const { timeFunction, getInput } = require('../common')

function partOne(numbers) {
  let input = numbers.join('')
  let instructions = []

  const regexMatch = input.matchAll(/mul\((\d+),(\d+)\)/g)

  for (const match of regexMatch) {
    instructions.push([match[1], match[2]])
  }

  let ans = 0
  for (let i = 0; i < instructions.length; i++) {
    const [a, b] = instructions[i]
    ans += parseInt(a) * parseInt(b)
  }

  return ans
}

function partTwo(numbers) {
  let input = numbers.join('')
  let instructions = []

  const regexMatch = input.matchAll(/mul\((\d+),(\d+)\)/g)
  for (const match of regexMatch) {
    let substring = input.substring(0, match.index)
    if (substring.lastIndexOf("don't()") > substring.lastIndexOf("do()")) {
      continue
    }

    instructions.push([match[1], match[2]])
  }

  let ans = 0
  for (let i = 0; i < instructions.length; i++) {
    const [a, b] = instructions[i]
    ans += parseInt(a) * parseInt(b)
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
start()