const fs = require('fs')
const { sep } = require('path')
const { convert } = require('./html2md')

function getUrl(day, resource = '') {
  return `https://adventofcode.com/${process.env.YEAR}/day/${day}${resource}`
}

async function makeApiRequest(url) {
  const res = await fetch(url, { headers: { 'Cookie': `session=${process.env.SESSION}` } })
  return await res.text()
}

async function setupDay(day) {
  console.log(`Setting up project for day ${day}`)
  const dayDir = `day-${day}`

  const text = await makeApiRequest(getUrl(day, '/input'))

  if (text.includes("Please don't repeatedly request this endpoint before it unlocks!")) {
    throw new Error(`Looks like this day is not available yet`)
  }

  if (!fs.existsSync(dayDir)) {
    fs.mkdirSync(dayDir)
  }

  const descText = await makeApiRequest(getUrl(day))
  const markdown = convert(descText)

  fs.writeFileSync(`${dayDir}${sep}readme.md`, markdown)

  if (!fs.existsSync(`${dayDir}${sep}index.js`)) {
    fs.copyFileSync(`day-x/index.js`, `${dayDir}${sep}index.js`)
  }

  if (!fs.existsSync(`day-${day}${sep}input.txt`)) {
    fs.writeFileSync(`day-${day}${sep}input.txt`, text.endsWith("\n") ? text.substring(0, text.length - 1) : text)
  }

  console.log(`Finished setup for day ${day}`)
}

/**
 * @param {Number} day 
 */
async function getAnswersForDay(day) {
  const text = await makeApiRequest(getUrl(day))

  const ans = []
  for (const obj of text.matchAll(/Your puzzle answer was <code>(\d+)<\/code>/g)) {
    ans.push(obj[1])
  }

  return [ans[0] || undefined, ans[1] || undefined]
}

module.exports = {
  setupDay,
  getAnswersForDay
}