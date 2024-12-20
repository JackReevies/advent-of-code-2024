const fs = require('fs')
const answers = require('./answers')
const { setupDay, getAnswersForDay } = require('./api')
const { noFail } = require('./common')

fs.readFileSync('.env').toString().split(/\r\n|\n/).reduce((acc, o) => {
  const regex = /^([a-zA-Z0-9-]+)=(.+?)$/.exec(o).slice(1)
  const value = regex[1].startsWith('"') ? regex[1].substring(1, regex[1].length - 1) : regex[1]
  acc[regex[0]] = value
  process.env[regex[0].toUpperCase()] = value
  return acc
}, {})

function discoverDays() {
  const fns = []
  for (let i = 1; i < 26; i++) {
    if (fs.existsSync(`./day-${i}/index.js`)) {
      fns.push(require(`./day-${i}/index.js`))
    } else {
      fns.push(undefined)
    }
  }

  // return up to the last filled day
  const lastAnswered = fns.reverse().findIndex(o => o)
  return fns.reverse().slice(0, Math.abs(lastAnswered - 26))
}

async function downloadMissingDays() {
  for (let i = 0; i < 25; i++) {

    const date = new Date(process.env.YEAR, 11, i + 1)
    if (date.getTime() > new Date().getTime()) continue // We're in the future for this AoC year

    if (fs.existsSync(`./day-${i + 1}/readme.md`)) {
      const contents = fs.readFileSync(`./day-${i + 1}/readme.md`).toString()
      if (!contents.includes('Not unlocked yet - submit part 1 and re-run')) {
        continue
      }
    }

    try { await setupDay(i + 1) } catch (e) { console.error(e) }
  }
}

async function run(fn) {
  const times = []
  let ans = []
  const maxTime = 60_000
  const start = Date.now()

  for (let i = 0; i < 100; i++) {
    const result = await noFail(fn)
    if (result instanceof Error) {
      return { result: [{ ans: NaN, ms: 0 }, { ans: NaN, ms: 0 }], ms: 0, min: [0], max: [0] }
    }
    times.push(result.map(o => o.ms))

    if (i == 0) {
      // Result should be the same in each run
      ans = result.map(o => o.ans)
    }

    const totalTime = Date.now() - start
    const lastInstanceTime = (result[0].ms || 0) + (result[1].ms || 0)
    if (totalTime + lastInstanceTime > maxTime) {
      // We won't have enough time left to run any more iterations
      break
    }
  }
  // Return avg of both
  const avg = [0, 1].map(_ => times.reduce((acc, curr) => acc + curr[_], 0) / times.length)
  const min = [0, 1].map(_ => Math.min(...times.map(o => o[_])))
  const max = [0, 1].map(_ => Math.max(...times.map(o => o[_])))
  return { result: [{ ans: ans[0], ms: avg[0] }, { ans: ans[1], ms: avg[1] }], ms: avg[0] + avg[1], min, max }
}

async function readOldData() {
  const data = fs.readFileSync('readme.md').toString()
  const regex = /([\d.]+)(?:&nbsp;)*\|(.*?)(?:&nbsp;)*\|([\d.]+)(?:&nbsp;)*\|(.*?)(?:&nbsp;)*\|([\d.]+)(?:&nbsp;)*\|([\d.]+)(?:&nbsp;)*/g
  const matches = data.matchAll(regex)
  if (!matches) return []

  const days = []
  for (const match of matches) {
    if (match.find(o => o.includes('❌'))) continue
    days.push({
      day: match[1],
      oneResult: match[2],
      oneTime: match[3],
      twoResult: match[4],
      twoTime: match[5],
      totalTime: match[6]
    })
  }

  return days
}

async function benchmark(full = false) {
  const existing = full ? [] : await readOldData()
  await downloadMissingDays()
  const fns = discoverDays()

  /** @type [{day, oneResult, oneTime, twoResult, twoTime, totalTime}] */
  const rows = []
  let maxDay = 0
  let stars = 0

  for (let i = 0; i < fns.length; i++) {
    const fn = fns[i]

    const cached = existing.find(o => o.day == (i + 1).toString())

    if (cached) {
      stars += 2
      maxDay = i + 1
      rows.push({
        day: cached.day.padEnd(8, ' '),
        oneResult: cached.oneResult.toString().padEnd(10, ' '),
        oneTime: cached.oneTime.toString().padEnd(10, ' '),
        twoResult: cached.twoResult.toString().padEnd(10, ' '),
        twoTime: cached.twoTime.toString().padEnd(10, ' '),
        totalTime: cached.totalTime.toString().padEnd(10, ' ')
      })
    } else {
      if (new Date(process.env.YEAR, 11, i + 1).getTime() > new Date().getTime()) continue // We're in the future for this AoC year
      if (fn === undefined) continue // Nothing to run means it cannot be correct

      const expected = await answers(i)
      const actual = fn ? await run(fn) : { result: [NaN, NaN], ms: 0, min: [0], max: [0] }

      const dayBlurb = `Day ${i + 1} (${Math.round(actual.ms * 100) / 100} ms)`

      console.log(''.padStart(dayBlurb.length, '='))
      console.log(dayBlurb)
      console.log(''.padStart(dayBlurb.length, '-'))

      const byTask = expected.map((val, i) => {
        const actualResult = actual.result[i]
        if (actualResult.ans === undefined) {
          console.log(`Task ${i + 1} has no solution`)
          return false
        }
        if (val == actualResult.ans && val !== undefined) {
          console.log(`Task ${i + 1} is Correct (${val}) (took ${Math.round(actualResult.ms * 100) / 100}ms)`)
          stars++
          return true
        } else {
          console.error(`Task ${i + 1} is Wrong (expected ${val} but got ${actualResult.ans}) (took ${Math.round(actualResult.ms * 100) / 100}ms)`)
        }
      })
      console.log('\n'.padStart(dayBlurb.length, '='))
      maxDay = i + 1

      const p1Result = byTask[0] ? actual.result[0].ans : '❌'
      const p1Time = byTask[0] ? Math.round(actual.result[0].ms * 1000) / 1000 : 0
      const p2Result = byTask[1] ? actual.result[1].ans : '❌'
      const p2Time = byTask[1] ? Math.round(actual.result[1].ms * 1000) / 1000 : 0

      const totalTime = byTask[0] && byTask[1] ? Math.round(actual.ms * 1000) / 1000 : byTask[0] ? p1Time : 0

      rows.push({
        day: (i + 1).toString().padEnd(8, ' '),
        oneResult: p1Result.toString().padEnd(10, ' '),
        oneTime: p1Time.toString().padEnd(10, ' '),
        twoResult: p2Result.toString().padEnd(10, ' '),
        twoTime: p2Time.toString().padEnd(10, ' '),
        totalTime: totalTime.toString().padEnd(10, ' ')
      })
    }
  }

  const tableBody = rows.map(o => Object.values(o).map(o => o.toString().replace(/ /g, '&nbsp;')).join('|')).join(`\n`)

  const template = fs.readFileSync('readme.template.md').toString()
  fs.writeFileSync('readme.md', template
    .replace(/%YEAR%/g, process.env.YEAR)
    .replace(/%ROWS%/g, tableBody)
    .replace(/%DAY%/g, maxDay)
    .replace(/%STARS%/g, stars)
    .replace(/%BADGE_POS%/g, '') //`https://img.shields.io/badge/🏆%20Position%20-${maxDay}-69aa22?style=for-the-badge`)
  )
}

async function start() {
  if (process.argv[2]?.toLowerCase() === 'benchmark') {
    return benchmark(true)
  }

  if (process.argv[2]?.toLowerCase() === 'download') {
    return await setupDay(process.argv[3])
  }

  if (process.argv[2]?.toLowerCase() === 'answers') {
    return console.log(await getAnswersForDay(process.argv[3]))
  }

  benchmark(false)
}

start()
