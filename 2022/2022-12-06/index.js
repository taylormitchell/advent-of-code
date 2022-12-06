/**
 *
 *
 * - have an object with past 4 chars {a: 1, b: 2, c: 1}
 *
 * - set up object with first 4 chars
 * - if it's length is 4, then end
 * - step to next char
 * - remove first char and add next char
 * - continue
 *
 *
 *
 *
 */

function part1(input) {
  const memo = {};
  input
    .slice(0, 4)
    .split("")
    .forEach((char) => {
      memo[char] = memo[char] ? memo[char] + 1 : 1;
    });
  if (Object.keys(memo).length === 4) {
    return 4;
  }

  for (let i = 4; i < input.length; i++) {
    const next = input[i];
    const prev = input[i - 4];
    memo[next] = memo[next] ? memo[next] + 1 : 1;
    memo[prev] = memo[prev] - 1;
    if (memo[prev] === 0) {
      delete memo[prev];
    }
    if (Object.keys(memo).length === 4) {
      return i + 1;
    }
  }
}

function part2(input) {
  const memo = {};
  input
    .slice(0, 14)
    .split("")
    .forEach((char) => {
      memo[char] = memo[char] ? memo[char] + 1 : 1;
    });
  if (Object.keys(memo).length === 14) {
    return 14;
  }

  for (let i = 14; i < input.length; i++) {
    const next = input[i];
    const prev = input[i - 14];
    memo[next] = memo[next] ? memo[next] + 1 : 1;
    memo[prev] = memo[prev] - 1;
    if (memo[prev] === 0) {
      delete memo[prev];
    }
    if (Object.keys(memo).length === 14) {
      return i + 1;
    }
  }
}

const fs = require("fs");
// const input = "bvwbjplbgvbhsrlpgdmjqwftvncz";
const input = fs.readFileSync("./input.txt", "utf8").trim();
// console.log(part1(input));
console.log(part2(input));
