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
      registers[letter] = BigInt(parseInt(value))
    } else {
      program = line.replace("Program: ", "").split(',').map(o => BigInt(Number(o)))
    }
  }

  return { registers, program }
}

function partOne(registers, program) {
  const outputs = []

  for (let i = 0n; i < BigInt(program.length); i += 2n) {
    const op = program[i]
    const arg = program[i + 1n]

    const comboArg = resolveComboArg(registers, arg)

    if (op === 0n) {
      registers.A = registers.A / (2n << comboArg - 1n)
      continue
    }

    if (op === 1n) {
      registers.B = registers.B ^ BigInt(arg)
      continue
    }

    if (op === 2n) {
      registers.B = comboArg % 8n
      continue
    }

    if (op === 3n) {
      if (registers.A === 0n) {
        continue
      }
      const jumpTo = arg * 2n
      i = jumpTo
      i -= 2n // To prevent moving
      continue
    }

    if (op === 4n) {
      registers.B = registers.B ^ registers.C
    }

    if (op === 5n) {
      outputs.push(comboArg % 8n)
      continue
    }

    if (op === 6n) {
      registers.B = registers.A / (2n << comboArg - 1n)
      continue
    }

    if (op === 7n) {
      registers.C = registers.A / (2n << comboArg - 1n)
      continue
    }

  }
  const ans = outputs.join(',')
  return ans
}


function resolveComboArg(registers, arg) {
  if (arg < 4n) {
    return arg
  }

  if (arg === 4n) {
    return registers.A
  }

  if (arg === 5n) {
    return registers.B
  }

  if (arg === 6n) {
    return registers.C
  }

  if (arg === 7n) {
    return undefined
  }
}

function partTwo(program, pos, value) {
  if (pos < 0) return value;

  const base = value << 3n
  // As long as we don't go above 8 we won't change the digit results previously found
  for (let i = base; i < base + 8n; i++) {
    const output = partOne({ A: i, B: 0n, C: 0n }, program).split(',').map(o => BigInt(Number(o)));
    if (output[0] === program[pos]) {
      // console.log(`Found ${pos}th digit as ${output[0]} when using ${i} as A`)

      const prevDigit = partTwo(program, pos - 1, i);
      if (prevDigit !== -1n) {
        return prevDigit
      };
    }
  }

  return -1n;
}

function partTwoOld(registers, program) {
  const programStr = program.join(',')
  const start = Date.now()
  let last = Date.now()
  const avgs = []

  console.log(`Start iteration: ${Number(process.argv[2] || '0')}`)
  let i = Number(process.argv[2] || '0')
  process.title = `Day-17 || Start: ${i / 1000000}`
  while (true) {
    const p1 = partOne({ A: BigInt(i), B: 0n, C: 0n }, program)
    // console.log(p1)
    if (p1 === programStr) {
      console.log(`${i} makes ${programStr}`)
      process.title = `FOUND AS ${i}`
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
  const task2 = await timeFunction(() => partTwo(program, program.length - 1, 0n))
  return [{ ans: task1.result, ms: task1.ms }, { ans: task2.result, ms: task2.ms }]
}

module.exports = start
