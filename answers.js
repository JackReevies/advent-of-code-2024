const { getAnswersForDay } = require('./api')
const fs = require('fs')

/**
 * @type {Array<Array<number>>}
 */
const answers = []

function readAnswers() {
  const raw = fs.readFileSync('answers.json').toString()
  answers.length = 0
  answers.push(...JSON.parse(raw))
}

function saveAnswers() {
  fs.writeFileSync('answers.json', JSON.stringify(answers))
}

async function getAnswers(day) {
  if (answers.length === 0) {
    try { readAnswers() } catch (e) { }
  }

  if (answers[day - 1]) {
    return answers[day - 1]
  }

  const ans = await getAnswersForDay(day + 1)
  answers[day - 1] = ans
  saveAnswers()
  return ans
}

module.exports = getAnswers