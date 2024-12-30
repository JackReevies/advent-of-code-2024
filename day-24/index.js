const { isDataView } = require('util/types')
const { timeFunction, getInput } = require('../common')
function seed(input) {
  const wires = {}
  const rules = []
  let isWire = true
  let i = 0
  for (const line of input) {
    if (line.length < 3) {
      isWire = false
      continue
    }

    if (isWire) {
      const sp = line.split(': ')
      wires[sp[0]] = Number(sp[1])
      i++
    } else {
      const regex = /(.{3}) (AND|OR|XOR) (.{3}) -> (.{3})/.exec(line)
      rules.push({ inputs: [regex[1], regex[3]], op: regex[2], output: regex[4] })
    }

  }
  return { wires, rules }
}

function partOne(numbers) {
  const { wires, rules } = seed(numbers)

  while (rules.length) {
    for (let i = 0; i < rules.length; i++) {
      const rule = rules[i]
      const wire1 = wires[rule.inputs[0]]
      const wire2 = wires[rule.inputs[1]]

      if (wire1 === undefined || wire2 === undefined) {
        continue
      }

      if (rule.op === 'AND') {
        wires[rule.output] = wire1 & wire2
      }

      if (rule.op === 'OR') {
        wires[rule.output] = wire1 | wire2
      }

      if (rule.op === 'XOR') {
        wires[rule.output] = wire1 ^ wire2
      }

      rules.splice(i, 1)
    }
  }

  const zWires = Object.keys(wires).sort().filter(o => o.startsWith('z')).reverse().map(o => wires[o]).join('')
  const ans = BigInt(`0b${zWires}`)
  return ans
}

function partTwo(numbers) {
  const { rules } = seed(numbers)
  const bads = {}

  const inIsXOrY = (rule) => rule.inputs.some(i => i.startsWith("x") || i.startsWith("y"))
  const is00 = (rule) => rule.inputs.some(i => i === "x00" || i === "y00") || rule.output === "z00"
  const notLaterXorGate = (rule, i) => !rules.slice(i).find(r => r.op === "XOR" && r.inputs.some(i => i === rule.output))
  const notLaterOrGate = (rule, i) => !rules.slice(i).find(r => r.op === "OR" && r.inputs.some(i => i === rule.output))

  for (let i = 0; i < rules.length; i++) {
    const rule = rules[i]

    if (rule.output.startsWith("z") && rule.op !== "XOR" && rule.output !== "z45") {
      bads[rule.output] = true
    }

    if (!rule.output.startsWith("z") && !inIsXOrY(rule) && rule.op === "XOR") {
      bads[rule.output] = true
    }

    if (rule.op === "XOR" && inIsXOrY(rule) && !is00(rule)) {
      if (notLaterXorGate(rule)) {
        bads[rule.output] = true
      }
    }

    if (rule.op === "AND" && inIsXOrY(rule) && !is00(rule)) {
      if (notLaterOrGate(rule)) {
        bads[rule.output] = true
      }
    }
  }

  return Object.keys(bads).sort().join(",")
}

async function start() {
  const numbers = getInput(`${__dirname}/input.txt`)

  const task1 = await timeFunction(() => partOne(numbers))
  const task2 = await timeFunction(() => partTwo(numbers))
  return [{ ans: task1.result, ms: task1.ms }, { ans: task2.result, ms: task2.ms }]
}

module.exports = start
