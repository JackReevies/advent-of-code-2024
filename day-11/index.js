const { timeFunction, getInput } = require('../common')

function partOne(numbers) {
  const stones = numbers[0].split(' ').map(o => { return { value: Number(o) } })
  let allStones = {}

  stones.forEach(o => {
    if (!allStones[o.value]) {
      allStones[o.value] = 1
    } else {
      allStones[o.value]++
    }
  })

  for (let i = 0; i < 25; i++) {
    allStones = doIteration(allStones, 1)
  }

  const ans = Object.values(allStones).reduce((acc, obj) => acc + obj, 0)
  return ans
}

function evenNumberOfDigits(num) {
  return num.toString().length % 2 === 0
}

function doIteration(allStones, x) {
  const keys = Object.keys(allStones)
  const newStones = {}

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]

    if (key === '0') {
      if (!newStones[1]) {
        newStones[1] = 0
      }

      newStones[1] += allStones[0]
      newStones[0] = 0
    } else if (evenNumberOfDigits(key)) {
      const leftHalfOfDigits = Number(key.split('').slice(0, key.length / 2).join(''))
      const rightHalfOfDigits = Number(key.split('').slice(key.length / 2).join(''))

      if (!newStones[leftHalfOfDigits]) {
        newStones[leftHalfOfDigits] = 0
      }

      newStones[leftHalfOfDigits] += allStones[key]


      if (!newStones[rightHalfOfDigits]) {
        newStones[rightHalfOfDigits] = 0
      }

      newStones[rightHalfOfDigits]+= allStones[key]
    } else {
      const newNum = Number(key) * 2024

      if (!newStones[newNum]) {
        newStones[newNum] = 0
      }

      newStones[newNum]+= allStones[key]
    }
  }

  return newStones
}

function partTwo(numbers) {
  const stones = numbers[0].split(' ').map(o => { return { value: Number(o) } })
  let allStones = {}

  stones.forEach(o => {
    if (!allStones[o.value]) {
      allStones[o.value] = 1
    } else {
      allStones[o.value]++
    }
  })

  for (let i = 0; i < 75; i++) {
    allStones = doIteration(allStones, 1)
  }

  const ans = Object.values(allStones).reduce((acc, obj) => acc + obj, 0)
  return ans
}

async function start() {
  const numbers = getInput(`${__dirname}/input.txt`)

  const task1 = await timeFunction(() => partOne(numbers))
  const task2 = await timeFunction(() => partTwo(numbers))
  return [{ ans: task1.result, ms: task1.ms }, { ans: task2.result, ms: task2.ms }]
}

module.exports = start
