const { timeFunction, getInput } = require('../common')

function partOne(numbers) {
  const maxX = 101
  const maxY = 103

  const robots = interpretRobots(numbers)

  // debugVisualise(robots, maxY, maxX)


  for (let i = 0; i < 100; i++) {

    for (const robot of robots) {

      robot.coord.x += robot.velocity.x
      robot.coord.y += robot.velocity.y

      if (robot.coord.x < 0) {
        robot.coord.x = maxX - Math.abs(robot.coord.x)
      }

      if (robot.coord.y < 0) {
        robot.coord.y = maxY - Math.abs(robot.coord.y)
      }

      if (robot.coord.x >= maxX) {
        robot.coord.x = Math.abs(robot.coord.x - maxX)
      }

      if (robot.coord.y >= maxY) {
        robot.coord.y = Math.abs(robot.coord.y - maxY)
      }
    }

    // console.log(`After ${i + 1} iterations`)
    // debugVisualise(robots, maxY, maxX)

  }

  // debugVisualise(robots, maxY, maxX)

  // Get TopLeft quadrant
  const quadrantY = Math.floor(maxY / 2)
  const quadrantX = Math.floor(maxX / 2)

  // Why was working this out so hard?
  const topLeftStartY = 0
  const topLeftStartX = 0
  const topLeftEndY = quadrantY
  const topLeftEndX = quadrantX

  const topRightStartY = 0
  const topRightStartX = maxX - quadrantX
  const topRightEndY = quadrantY
  const topRightEndX = maxX

  const bottomLeftStartY = maxY - quadrantY
  const bottomLeftStartX = 0
  const bottomLeftEndY = maxY
  const bottomLeftEndX = quadrantX

  const bottomRightStartY = maxY - quadrantY
  const bottomRightStartX = maxX - quadrantX
  const bottomRightEndY = maxY
  const bottomRightEndX = maxX

  const robotsInTopLeft = getRobotsInQuadrant(robots, topLeftStartX, topLeftStartY, topLeftEndX, topLeftEndY)
  const robotsInTopRight = getRobotsInQuadrant(robots, topRightStartX, topRightStartY, topRightEndX, topRightEndY)
  const robotsInBottomLeft = getRobotsInQuadrant(robots, bottomLeftStartX, bottomLeftStartY, bottomLeftEndX, bottomLeftEndY)
  const robotsInBottomRight = getRobotsInQuadrant(robots, bottomRightStartX, bottomRightStartY, bottomRightEndX, bottomRightEndY)

  const totalRobots = robotsInTopLeft.length * robotsInTopRight.length * robotsInBottomLeft.length * robotsInBottomRight.length

  return totalRobots
}

function isChristmasTree(robots) {
  const grid = {}
  for (const robot of robots) {
    const alias = `x${robot.coord.x},y${robot.coord.y}`
    if (grid[alias]) {
      return false
    }
    grid[alias] = true
  }

  return true
}

function getRobotsInQuadrant(robots, qsX, qsY, qeX, qeY) {
  const quadrant = {
    top: qsY,
    bottom: qeY,
    left: qsX,
    right: qeX
  }
  const robotsInQuadrant = []

  for (const robot of robots) {
    if (robot.coord.y >= quadrant.top && robot.coord.y < quadrant.bottom && robot.coord.x >= quadrant.left && robot.coord.x < quadrant.right) {
      robotsInQuadrant.push(robot)
    }
  }
  return robotsInQuadrant
}

function debugVisualise(robots, maxY, maxX, startY = 0, startX = 0) {
  const grid = []

  for (let y = startY; y < maxY; y++) {
    grid[y] = []
    for (let x = startX; x < maxX; x++) {
      grid[y].push(0)
    }
  }

  // Place robots on grid
  for (const robot of robots) {
    try { grid[robot.coord.y][robot.coord.x]++ } catch (e) { }
    //robot.start = { x: robot.coord.x, y: robot.coord.y }
  }

  for (let y = startY; y < maxY; y++) {
    let row = `${y}: `
    for (let x = startX; x < maxX; x++) {
      row += grid[y][x]
    }
    console.log(row)
  }
}

function interpretRobots(input) {
  const robots = []
  for (let i = 0; i < input.length; i++) {
    const line = input[i]
    const split = line.split(' ')
    const coords = split[0].replace('p=', '')
    const velocity = split[1].replace('v=', '')

    robots.push({
      coord: { x: Number(coords.split(',')[0]), y: Number(coords.split(',')[1]) },
      start: { x: Number(coords.split(',')[0]), y: Number(coords.split(',')[1]) },
      velocity: { x: Number(velocity.split(',')[0]), y: Number(velocity.split(',')[1]) },
    })
  }

  return robots
}

function partTwo(numbers) {
  const maxX = 101
  const maxY = 103

  const robots = interpretRobots(numbers)

  // debugVisualise(robots, maxY, maxX)


  for (let i = 0; i < Number.MAX_VALUE; i++) {

    for (const robot of robots) {

      robot.coord.x += robot.velocity.x
      robot.coord.y += robot.velocity.y

      if (robot.coord.x < 0) {
        robot.coord.x = maxX - Math.abs(robot.coord.x)
      }

      if (robot.coord.y < 0) {
        robot.coord.y = maxY - Math.abs(robot.coord.y)
      }

      if (robot.coord.x >= maxX) {
        robot.coord.x = Math.abs(robot.coord.x - maxX)
      }

      if (robot.coord.y >= maxY) {
        robot.coord.y = Math.abs(robot.coord.y - maxY)
      }
    }

    // console.log(`After ${i + 1} iterations`)
    // debugVisualise(robots, maxY, maxX)

    if (isChristmasTree(robots)) {
      //console.log(`------------------------------------------`)
      //console.log(`After ${i + 1} iterations`)
      // debugVisualise(robots, maxY, maxX)
      return i + 1
    } else if (i % 10000 === 0) {
      //console.log(`Scanned ${i + 1}`)
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