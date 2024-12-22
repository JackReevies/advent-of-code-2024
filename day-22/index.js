const { timeFunction, getInput } = require('../common')

function simSecretAfter2000(seed) {
  seed = BigInt(seed)
  for (let i = 0; i < 2000; i++) {
    const mul64 = (seed * 64n)
    const mix1 = mix(mul64, seed)
    const prune1 = prune(mix1)

    const div32 = prune1 / 32n
    const mix2 = mix(div32, prune1)
    const prune2 = prune(mix2)

    const mul2048 = prune2 * 2048n
    const mix3 = mix(mul2048, prune2)
    const prune3 = prune(mix3)

    //console.log(prune3)
    seed = prune3
  }

  return seed
}

function mix(secret, n) {
  return secret ^ n
}

function prune(secret) {
  return secret % 16777216n
}

function partOne(numbers) {
  let sum = 0n
  for (let i = 0; i < numbers.length; i++) {
    const res = simSecretAfter2000(numbers[i])
    sum += res
  }

  return sum
}

function getBuyers(number) {
  return BigInt(number.toString().split('').pop())
}

function simP2(seed) {
  seed = BigInt(seed)
  let buyers = getBuyers(seed)
  let lastBuyers = buyers
  let highestBuyers = 0
  const priceChangeArr = [] // {seller, buyer, change}

  for (let i = 0; i < 2000; i++) {
    const mul64 = (seed * 64n)
    const mix1 = mix(mul64, seed)
    const prune1 = prune(mix1)

    const div32 = prune1 / 32n
    const mix2 = mix(div32, prune1)
    const prune2 = prune(mix2)

    const mul2048 = prune2 * 2048n
    const mix3 = mix(mul2048, prune2)
    const prune3 = prune(mix3)

    //console.log(prune3)
    seed = prune3
    lastBuyers = buyers
    buyers = getBuyers(seed)
    priceChangeArr.push({ seller: seed, buyer: buyers, change: buyers - lastBuyers })
    if (buyers > highestBuyers) {
      highestBuyers = buyers
    }
  }

  return { priceChangeArr, highestBuyerSeen: highestBuyers }
}

function partTwo(numbers) {
  let sum = 0n
  const arrs = []
  for (let i = 0; i < numbers.length; i++) {
    const res = simP2(numbers[i])
    arrs.push(res)
  }

  debugger

  const opts = {} // [[1,2,3,4]]

  for (let i = 0; i < arrs.length; i++) {
    const o = arrs[i]
    for (let j = 3; j < o.priceChangeArr.length; j++) {
      const key = `${o.priceChangeArr[j - 3].change},${o.priceChangeArr[j - 2].change},${o.priceChangeArr[j - 1].change},${o.priceChangeArr[j - 0].change}`

      if (!opts[key]) {
        opts[key] = {}
      }

      if (opts[key][i]) {
        continue
      }

      opts[key][i] = o.priceChangeArr[j].buyer
    }
  }

  Object.keys(opts).forEach(key => opts[key] = Object.values(opts[key]).reduce((acc, curr) => acc + curr, 0n))

  const highest = Object.values(opts).reduce((acc, curr) => acc > curr ? acc : curr, 0n)


  return highest
}

async function start() {
  const numbers = getInput(`${__dirname}/input.txt`)

  const task1 = await timeFunction(() => partOne(numbers))
  const task2 = await timeFunction(() => partTwo(numbers))
  return [{ ans: task1.result, ms: task1.ms }, { ans: task2.result, ms: task2.ms }]
}

module.exports = start
