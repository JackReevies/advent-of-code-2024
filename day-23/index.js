const { timeFunction, getInput } = require('../common')

function partOne(lines) {
  const comps = {}
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const [one, two] = line.split('-')

    if (!comps[one]) {
      comps[one] = {}
    }

    if (!comps[two]) {
      comps[two] = {}
    }

    comps[one][two] = true
    comps[two][one] = true
  }

  return findSetOfThree(comps)
}

function findSetOfThree(comps) {
  const groups = {}
  Object.keys(comps).forEach(key => {
    const comp = comps[key]

    // aq for example. For each subkey in aq, does that subkey contain any other subkeys from aq?

    Object.keys(comp).forEach(subkey => {
      const subcomp = comp[subkey] //yn

      Object.keys(comps[subkey]).forEach(subsubkey => {

        if (comp[subsubkey]) {
          const arr = [key, subkey, subsubkey].sort()
          if (arr.some(x => x.startsWith('t'))) {
            groups[arr.join('-')] = true
          }
        }
      })
    })
  })

  return Object.keys(groups).length
}

function partTwo(lines) {
  const comps = {}
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const [one, two] = line.split('-')

    if (!comps[one]) {
      comps[one] = {}
    }

    if (!comps[two]) {
      comps[two] = {}
    }

    comps[one][two] = true
    comps[two][one] = true
  }

  const idklol = Object.keys(comps).map(key => getGroupFrom(comps, key))
  const idklol2 = idklol.reduce((acc, arr) => {
    const key = arr.join(',')
    if (!acc[key]) {
      acc[key] = 0
    }
    acc[key]++
    return acc
  }, {})

  const highest = Object.keys(idklol2).reduce((acc, key) => {
    const val = idklol2[key]
    if (val > acc) {
      return val
    }
    return acc
  }, 0)

  const highestSets = Object.keys(idklol2).filter(key => idklol2[key] === highest)

  return highestSets[0]
}

function getGroupFrom(comps, key) { // co
  const keysInComp = Object.keys(comps[key]) //de, ka, ta, tc
  const canSee = {}

  //de, ka, ta, tc 
  for (let i = 0; i < keysInComp.length; i++) {
    const subkey = keysInComp[i]
    const res = [subkey]

    //de, ka, ta, tc
    for (let j = 0; j < keysInComp.length; j++) {
      const subkey2 = keysInComp[j]

      //if (subkey === subkey2) continue

      // for de and ka, can ka see de?
      if (comps[subkey2][subkey]) {
        res.push(subkey2)
      }
    }
    canSee[subkey] = res.sort()
  }

  const biggestArr = Object.keys(canSee).reduce((acc, key) => {
    const arr = canSee[key]
    if (arr.length > acc.length) {
      return arr
    }
    return acc
  }, [])

  return [...biggestArr, key].sort()
}

async function start() {
  const numbers = getInput(`${__dirname}/input.txt`)

  const task1 = await timeFunction(() => partOne(numbers))
  const task2 = await timeFunction(() => partTwo(numbers))
  return [{ ans: task1.result, ms: task1.ms }, { ans: task2.result, ms: task2.ms }]
}

module.exports = start