const { timeFunction, getInput } = require('../common')

function interpretInput(input, isPart2 = false) {
  const machines = []
  let currentMachine = {}

  for (let i = 0; i < input.length; i++) {
    const line = input[i]

    if (line.length < 2) {
      machines.push(currentMachine)
      currentMachine = {}
      continue
    }

    const regex = /Button (.+): X\+(\d+), Y\+(\d+)/.exec(line)

    if (!regex) {
      const prizeRegex = /Prize: X=(\d+), Y=(\d+)/.exec(line)
      currentMachine.prize = { x: Number(prizeRegex[1]), y: Number(prizeRegex[2]) }
      if (isPart2) {
        currentMachine.prize.x = currentMachine.prize.x + 10000000000000
        currentMachine.prize.y = currentMachine.prize.y + 10000000000000
      }
      continue
    }

    currentMachine[regex[1]] = { x: Number(regex[2]), y: Number(regex[3]) }
  }

  machines.push(currentMachine)
  return machines
}

function solveForMachine(machine) {
  let combos = []
  for (let i = 0; i < 100; i++) {
    for (let j = 0; j < 100; j++) {
      if (machine.A.x * i + machine.B.x * j === machine.prize.x && machine.A.y * i + machine.B.y * j === machine.prize.y) {
        combos.push(3 * i + j)
      }
    }
  }

  const ans = combos.length ? Math.min(...combos) : -1
  return ans
}

function solveForMachineTwo(machine) {
  const ax = machine.A.x
  const ay = machine.A.y
  const bx = machine.B.x
  const by = machine.B.y
  const px = machine.prize.x
  const py = machine.prize.y

  const d = ax * by - ay * bx
  if (!d) {
    return -1
  }

  const a = (px * by - py * bx) / d
  const b = (py * ax - px * ay) / d

  if (a < 0 || b < 0 || !Number.isInteger(a) || !Number.isInteger(b)) {
    return -1
  }

  return { a: a, b: b }
}

function partOne(numbers) {
  let tokens = 0
  const machines = interpretInput(numbers)
  for (const machine of machines) {
    const lowest = solveForMachine(machine)
    if (lowest === -1) {
      // Unwinnable - do not waste your time
      continue
    }
    tokens += lowest
  }

  return tokens
}

function partTwo(numbers) {
  let tokens = 0
  const machines = interpretInput(numbers, true)
  for (const machine of machines) {
    const lowest = solveForMachineTwo(machine)
    if (lowest === -1) {
      // Unwinnable - do not waste your time
      continue
    }
    tokens += (3 * lowest.a) + lowest.b
  }

  return tokens
}

async function start() {
  const numbers = getInput(`${__dirname}/input.txt`)

  const task1 = await timeFunction(() => partOne(numbers))
  const task2 = await timeFunction(() => partTwo(numbers))
  return [{ ans: task1.result, ms: task1.ms }, { ans: task2.result, ms: task2.ms }]
}

module.exports = start
start()