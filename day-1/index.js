const { timeFunction, getInput } = require('../common')

function partOne(list) {
  const list1 = []
  const list2 = []

  for (let i = 0; i < list.length; i++) {
    const regex = /(\d+) *(\d+)/.exec(list[i])
    list1.push(parseInt(regex[1]))
    list2.push(parseInt(regex[2]))
  }

  list1.sort((a, b) => a - b)
  list2.sort((a, b) => a - b)

  let ans = 0
  for (let i = 0; i < list1.length; i++) {
    const diff = Math.abs(list1[i] - list2[i])

    ans += diff
  }

  return ans
}

function partTwo(list) {
  const list1 = []
  const cache = {}

  for (let i = 0; i < list.length; i++) {
    const regex = /(\d+) *(\d+)/.exec(list[i])
    list1.push(parseInt(regex[1]))
    cache[regex[2]] = cache[regex[2]] ? cache[regex[2]] + 1 : 1
  }

  let ans = 0
  for (let i = 0; i < list1.length; i++) {
    const howOften = cache[list1[i]] || 0
    ans += howOften * list1[i]
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