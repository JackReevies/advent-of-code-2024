const { writeFileSync } = require('fs')
const { timeFunction, getInput } = require('../common')

function interpretInput(lines) {
  const registers = {}
  let program = []
  for (const line of lines) {
    if (line.length < 2) {
      continue
    }
    const regex = /Register (.): (\d+)/
    const [, letter, value] = line.match(regex) || []

    if (letter && value) {
      registers[letter] = parseInt(value)
    } else {
      program = line.replace("Program: ", "").split(',').map(o => Number(o))
    }
  }

  return { registers, program }
}

function partOne(registers, program) {
  const outputs = []

  for (let i = 0; i < program.length; i += 2) {
    const op = program[i]
    const arg = program[i + 1]

    const comboArg = resolveComboArg(registers, arg)

    if (op === 0) {
      registers.A = Math.floor(registers.A / (Math.pow(2, comboArg)))
      continue
    }

    if (op === 1) {
      registers.B = registers.B ^ arg
      continue
    }

    if (op === 2) {
      registers.B = comboArg % 8
      continue
    }

    if (op === 3) {
      if (registers.A === 0) {
        continue
      }
      const jumpTo = arg * 2
      i = jumpTo
      i -= 2 // To prevent moving
      continue
    }

    if (op === 4) {
      registers.B = registers.B ^ registers.C
    }

    if (op === 5) {
      outputs.push(comboArg % 8)
      continue
    }

    if (op === 6) {
      registers.B = Math.floor(registers.A / (Math.pow(2, comboArg)))
      continue
    }

    if (op === 7) {
      registers.C = Math.floor(registers.A / (Math.pow(2, comboArg)))
      continue
    }

  }
  const ans = outputs.join(',')
  return ans
}


function resolveComboArg(registers, arg) {
  if (arg < 4) {
    return arg
  }

  if (arg === 4) {
    return registers.A
  }

  if (arg === 5) {
    return registers.B
  }

  if (arg === 6) {
    return registers.C
  }

  if (arg === 7) {
    return undefined
  }
}

function partTwo(registers, program) {
  return 0
  const programStr = program.join(',')
  const start = Date.now()
  let last = Date.now()
  const avgs = []

  console.log(`Start iteration: ${Number(process.argv[2] || '0')}`)
  let i = Number(process.argv[2] || '0')
  process.title = `Day-17 || Start: ${i / 1000000}`
  while (true) {
    const p1 = partOne({ ...registers, A: i }, program)

    if (p1 === programStr) {
      console.log(i)
      process.title(`FOUND AS ${i}`)
      writeFileSync(`day-17-${i}.txt`, i.toString())
      return i
    }

    if (i % 1000000 === 0) {
      avgs.push(Date.now() - last)
      console.log(`Not found after ${i} iterations (last million in: ${Date.now() - last} || elapsed: ${Math.floor((Date.now() - start) / 1000)} seconds)`)
      last = Date.now()
    }


    i++
  }
}

async function start() {
  const numbers = getInput(`${__dirname}/input.txt`)

  const { registers, program } = interpretInput(numbers)

  const task1 = await timeFunction(() => partOne(registers, program))
  const task2 = await timeFunction(() => partTwo(registers, program))
  return [{ ans: task1.result, ms: task1.ms }, { ans: task2.result, ms: task2.ms }]
}

module.exports = start