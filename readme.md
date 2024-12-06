## Advent of Code 2024

![](https://img.shields.io/badge/Language-JS-778528?style=for-the-badge) &nbsp; &nbsp; ![](https://img.shields.io/badge/📅%20Day%20-6-118499?style=for-the-badge) &nbsp; &nbsp;  ![](https://img.shields.io/badge/⭐%20Stars%20-12-b5792a?style=for-the-badge)

My solutions to the [advent of code 2024](https://adventofcode.com/2024/)

## Results

Day | Task 1 | ᴍs | Task 2 | ᴍs | Total Time (ᴍs)
-|-|-|-|-|-
1&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|1579939&nbsp;&nbsp;&nbsp;|1.283&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|20351745&nbsp;&nbsp;|0.982&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|2.265&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
2&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|402&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|3.709&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|455&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|12.951&nbsp;&nbsp;&nbsp;&nbsp;|16.66&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
3&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|187194524&nbsp;|0.385&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|127092535&nbsp;|1.259&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|1.644&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
4&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|2578&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|1.782&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|1972&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|2.642&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|4.424&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
5&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|4766&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|3.431&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|6257&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|7.603&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|11.034&nbsp;&nbsp;&nbsp;&nbsp;
6&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|4939&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|3.869&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|1434&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|42312.228&nbsp;|42316.097&nbsp;

<br />

## How to Run

Create a `.env` file containing `year=YEAR` (the year this repo is for) and `session=COOKIE` (where `COOKIE` is your AoC cookie). This is used for downloading the puzzle input.

The goal is to not use any external modules, only those built in to the [node runtime](https://nodejs.org/en/) (this means no package.json). Node v18 is required for native fetch API

`index.js` in the root directory contains a basic test runner as well as grabbing each day's puzzle readme and input. Answers will also be downloaded when available (note: you need to have submitted the puzzle first)

* `node index` to run the benchmark.
* `node index download day` to setup a day's files
* `node index answers day` to grab the answers for the day (providing you have submitted already)

### Example

```
node index
```

Returns output in the format of

```
Day X
------
Task A is Correct (ANSWER) (took Zms)
Task B is Wrong (expected EXPECTED but got ACTUAL) (took Zms)
```

## How the Test Runner works

Each day will output an array of objects ([{ms: number, ans: object}]) representing the result of each task within that day.

The test runner knows what the answers *should* be, these are looked up on AoC directly and stored in the `answers.json` file to prevent spamming their servers.

For example 

```
[[DAY 1 TASK 1 ANSWER, DAY 1 TASK 2 ANSWER], [DAY 2 TASK 1 ANSWER], ...]
```

We iterate through all the days we have loaded and compare their answers. We ouput whether the answer was right or wrong (and what we got if it was wrong).
Solutions are benchmarked by running each day 100 times (or for a maximum of 60 seconds) and updating the table above with the average execution time.
