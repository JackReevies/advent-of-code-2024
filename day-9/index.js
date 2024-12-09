const { timeFunction, getInput } = require('../common')

function partOne(numbers) {
  const visual = []
  const layout = numbers[0].split('')

  let id = 0
  for (let i = 0; i < layout.length; i++) {
    const number = layout[i]

    if (i % 2 === 1) {
      // Evens are free space
      for (let j = 0; j < Number(number); j++) {
        visual.push('.')
      }
    } else {
      // Odds are files
      for (let j = 0; j < Number(number); j++) {
        visual.push(id)
      }
      id++
    }
  }

  // console.log(visual.join(''))

  // Go backwards through visual
  for (let i = visual.length - 1; i >= 0; i--) {
    if (visual[i] === '.') {
      // Free space
      continue
    }

    const firstFreeSpace = visual.indexOf('.', 0)
    const file = visual[i]
    const fileNumber = Number(file)

    // If there is a free space, move the file there
    if (firstFreeSpace !== -1 && firstFreeSpace < i) {
      visual[i] = '.'
      visual[firstFreeSpace] = file
    }

    //console.log(visual.join(''))
  }

  let ans = 0

  for (let i = 0; i < visual.length; i++) {
    if (visual[i] === '.') continue
    ans += i * Number(visual[i])
  }


  return ans
}

function partTwo(numbers) {
  const visual = []
  const layout = numbers[0].split('')

  let id = 0
  for (let i = 0; i < layout.length; i++) {
    const number = layout[i]

    if (i % 2 === 1) {
      // Evens are free space
      for (let j = 0; j < Number(number); j++) {
        visual.push('.')
      }
    } else {
      // Odds are files
      for (let j = 0; j < Number(number); j++) {
        visual.push(id)
      }
      id++
    }
  }

  // console.log(visual.join(''))

  // Go backwards through visual
  for (let i = visual.length - 1; i >= 0; i--) {
    if (visual[i] === '.') {
      // Free space
      continue
    }

    let fileChunk = []

    for (let j = i; j >= 0; j--) {
      if (visual[j] !== visual[i]) {
        // Free space
        break
      }

      fileChunk.push(visual[j])
    }

    let firstBigEnoughFreeSpace = Number.MAX_SAFE_INTEGER

    for (let j = 0; j < visual.length; j++) {
      const file = visual.slice(j, j + fileChunk.length).some(o => o !== '.')
      if (!file) {
        // Big enough contiguous free space
        firstBigEnoughFreeSpace = j
        break
      }
    }

    if (firstBigEnoughFreeSpace !== Number.MAX_SAFE_INTEGER && firstBigEnoughFreeSpace < i) {
      // Move the file there
      for (let j = 0; j < fileChunk.length; j++) {
        visual[firstBigEnoughFreeSpace + j] = fileChunk[j]
        visual[i - j] = '.'
      }
    }

    i -= fileChunk.length - 1

    // console.log(visual.join(''))
  }

  let ans = 0

  for (let i = 0; i < visual.length; i++) {
    if (visual[i] === '.') continue
    ans += i * Number(visual[i])
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
