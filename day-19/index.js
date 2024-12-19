const { timeFunction, getInput } = require('../common')

function interpretInput(lines) {
  const towels = {}

  lines[0].split(', ').forEach(o => towels[o] = o.split('').join(''))

  const designs = lines.slice(2).map(o => o.split('').join(''))

  return { towels, designs }
}

function getValidNextParts(towels, partialDesign) {
  return Object.keys(towels).filter(o => partialDesign.startsWith(o))
}

function isPossibleTwo(towels, partialDesign, cache) {
  if (partialDesign === "") {
    return 1
  } else if (cache[partialDesign]) {
    return cache[partialDesign]
  }

  let total = 0
  const valids = getValidNextParts(towels, partialDesign)

  for (let i = 0; i < valids.length; i++) {
    const valid = valids[i]

    const left = partialDesign.substring(valid.length)
    total += isPossibleTwo(towels, left, cache)
  }

  cache[partialDesign] = total
  return total
}

function isPossible(towels, design) {
  const cache = {}
  const queue = []
  const valids = []

  // Seed queue
  getValidNextParts(towels, design).forEach(o => queue.push({ parts: [o], restOfDesign: design.substring(o.length) }))

  let iterations = 0
  while (queue.length) {
    queue.sort((a, b) => a.restOfDesign.length - b.restOfDesign.length)
    const item = queue.shift()
    iterations++

    if (iterations > 100) {
      // Cheat because its getting stuck
      continue
    }

    const validOptions = getValidNextParts(towels, item.restOfDesign)

    if (!validOptions.length) {
      // Dead branch
      continue
    }

    for (const option of validOptions) {
      const restOfDesign = item.restOfDesign.substring(option.length)
      if (restOfDesign.length === 0) {
        // Valid option
        valids.push(item.parts.concat(option))
        //console.log(`Found in ${iterations} iterations`)
        return valids[0]
      }
      queue.push({ parts: [...item.parts, option], restOfDesign })
    }
  }

  return valids
}

function partOne(towels, designs) {
  let possible = []

  for (let i = 0; i < designs.length; i++) {
    const design = designs[i]
    const ways = isPossible(towels, design)
    if (ways.length) {
      possible.push(design)
    }
    // console.log(`After ${i + 1} (found ${possible} design so far`)
  }

  // console.log(possible.length)
  return possible
  debugger
}

function ensureValid(design, ways) {
  return ways.filter(o => design === o.join(''))
}

function partTwo(towels, designs) {
  let towelsMap = {}

  for (let i = 0; i < designs.length; i++) {
    const startIteration = Date.now()
    const design = designs[i]
    const ways = isPossibleTwo(towels, design, {})
    if (ways) {
      towelsMap[design] = ways
    }
   // console.log(`After ${i + 1} we have ${Object.values(towelsMap).reduce((acc, curr) => acc + curr, 0)} (took: ${(Date.now() - startIteration) / 1000} seconds || total elapsed: ${(Date.now() - start) / 1000 / 60} minutes)`)
  }

  const ans = Object.values(towelsMap).reduce((acc, curr) => acc + curr, 0)
  return ans
  debugger
}

async function start() {
  const numbers = getInput(`${__dirname}/input.txt`)
  const { towels, designs } = interpretInput(numbers)

  const task1 = await timeFunction(() => partOne(towels, designs))
  const task2 = await timeFunction(() => partTwo(towels, task1.result))
  return [{ ans: task1.result.length, ms: task1.ms }, { ans: task2.result, ms: task2.ms }]
}

module.exports = start
