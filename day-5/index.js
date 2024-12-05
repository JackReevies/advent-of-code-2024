const { timeFunction, getInput } = require('../common')

function partOne(numbers) {
  const rules = {}
  const updates = []

  let isRule = true
  for (let i = 0; i < numbers.length; i++) {
    const line = numbers[i]

    if (line.length < 2) {
      isRule = false
      continue
    }

    if (isRule) {
      const [_, before, after] = /(\d+)\|(\d+)/.exec(line) || []

      if (!before) {
        throw 'shit'
      }

      if (!rules[before]) {
        rules[before] = []
      }

      rules[before].push(Number(after))
      continue
    }



    updates.push(line.split(',').map(Number))
  }

  let validUpdates = []

  for (let i = 0; i < updates.length; i++) {
    let isValid = true
    for (let j = 0; j < updates[i].length; j++) {
      const num = updates[i][j]

      // To print num, it must be before all numbers in rules[num]
      const rule = rules[num]

      if (!rule) {
        // No rule for this, do we just continue?
        continue
      }

      for (let k = 0; k < rule.length; k++) {
        const mustBeBefore = rule[k]
        // If the update contains this number AFTER the position of j then we;re invalid

        const testSeq = updates[i].slice(0, j)
        if (testSeq.includes(mustBeBefore)) {
          isValid = false
          break
        }
      }
    }

    if (isValid) {
      validUpdates.push(updates[i])
    }
  }

  // Get middle position number in each valid update
  const middles = validUpdates.map(update => update[Math.floor(update.length / 2)])
  const ans = middles.reduce((a, b) => a + b)

  return ans
}


function partTwo(numbers) {
  const rules = {}
  const updates = []

  let isRule = true
  for (let i = 0; i < numbers.length; i++) {
    const line = numbers[i]

    if (line.length < 2) {
      isRule = false
      continue
    }

    if (isRule) {
      const [_, before, after] = /(\d+)\|(\d+)/.exec(line) || []

      if (!before) {
        throw 'shit'
      }

      if (!rules[before]) {
        rules[before] = []
      }

      rules[before].push(Number(after))
      continue
    }
    updates.push(line.split(',').map(Number))
  }

  let iteration = 0
  while (true) {
    iteration++
    // console.log(`Iteration ${iteration}`)
    const [validUpdates, invalidUpdates] = p2Sort(updates, rules, iteration !== 1)

    if (iteration === 1) {
      // Remove all valid updates from updates
      for (let i = 0; i < validUpdates.length; i++) {
        updates.splice(updates.indexOf(validUpdates[i]), 1)
      }
    }

    if (invalidUpdates.length === 0) {
      const middles = validUpdates.map(update => update[Math.floor(update.length / 2)])
      const ans = middles.reduce((a, b) => a + b)

      return ans
    }
  }


}

function p2Sort(updates, rules, correct = true) {
  let validUpdates = []
  let invalidUpdates = []

  for (let i = 0; i < updates.length; i++) {
    let wasValid = true
    for (let j = 0; j < updates[i].length; j++) {
      const num = updates[i][j]

      // To print num, it must be before all numbers in rules[num]
      const rule = rules[num]

      if (!rule) {
        // No rule for this, do we just continue?
        continue
      }

      for (let k = 0; k < rule.length; k++) {
        const mustBeBefore = rule[k]
        // If the update contains this number AFTER the position of j then we;re invalid

        const testSeq = updates[i].slice(0, j)
        if (testSeq.includes(mustBeBefore)) {
          // const index = testSeq.indexOf(mustBeBefore)
          wasValid = false
          if (!correct) {
            break
          }
          // This didn't work but not because it was wrong - because we werent resetting our index data!!!!
          // updates[i].splice(j, 1)
          // updates[i].splice(index, 0, num)
          const correctIndex = getCorrectPlaceForNum(updates[i], rule)
          updates[i].splice(j, 1)
          updates[i].splice(correctIndex, 0, num)
          break
        }
      }
    }

    if (wasValid) {
      validUpdates.push(updates[i])
    } else {
      invalidUpdates.push(updates[i])
    }
  }

  return [validUpdates, invalidUpdates]
}

function getCorrectPlaceForNum(update, rule) {
  // Find the earliest place for invalidNum in update
  for (let i = 0; i < update.length; i++) {
    if (rule.includes(update[i])) {
      // The earliest violation
      return i
    }
  }
}

async function start() {
  const numbers = getInput(`${__dirname}/input.txt`)

  const task1 = await timeFunction(() => partOne(numbers))
  const task2 = await timeFunction(() => partTwo(numbers))
  return [{ ans: task1.result, ms: task1.ms }, { ans: task2.result, ms: task2.ms }]
}

module.exports = start
