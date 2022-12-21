const fs = require("fs");

function parseInput(input) {
  let pairs = [];
  let pair = [];
  const lines = input.trim().split("\n");
  let index = 1;
  for (const line of lines) {
    if (line === "") {
      pairs.push({
        left: pair[0],
        right: pair[1],
        index,
        inOrder: true,
      });
      pair = [];
      index += 1;
      continue;
    } else {
      pair.push(JSON.parse(line));
    }
  }
  pairs.push({
    left: pair[0],
    right: pair[1],
    index,
    inOrder: true,
  });
  return pairs;
}

function compareNumbers(left, right) {
  if (left === right) return undefined;
  return left < right;
}

function compareMixed(left, right) {
  if (typeof left === "number") {
    left = [left];
  } else if (typeof right === "number") {
    right = [right];
  }
  return compareArrays(left, right);
  // if (Array.isArray(left)) {
  //   return compareArrays(left, right);
  // } else if (Array.isArray(right)) {
  //   return compareNumbers(left, right[0]);
  // } else {
  //   throw new Error("Not a mix of array and number");
  // }
}

function compareArrays(leftArr, rightArr) {
  const end = Math.max(leftArr.length, rightArr.length);
  for (let i = 0; i < end; i++) {
    const [left, right] = [leftArr[i], rightArr[i]];
    let res;
    if (left === undefined) {
      res = true;
    } else if (right === undefined) {
      res = false;
    } else if (typeof left === "number" && typeof right === "number") {
      res = compareNumbers(left, right);
    } else if (Array.isArray(left) && Array.isArray(right)) {
      res = compareArrays(left, right);
    } else {
      res = compareMixed(left, right);
    }
    if (res !== undefined) return res;
  }
  return undefined;
}

function part1(input) {
  const orderedPairs = [];
  const pairs = parseInput(input);
  for (const pair of pairs) {
    const { left, right } = pair;
    if (compareArrays(left, right)) {
      pair.inOrder = true;
      orderedPairs.push(pair.index);
    }
  }
  return orderedPairs.reduce((acc, cur) => acc + cur, 0);
}

// Part 1
const example = `
[1,1,3,1,1]
[1,1,5,1,1]

[[1],[2,3,4]]
[[1],4]

[9]
[[8,7,6]]

[[4,4],4,4]
[[4,4],4,4,4]

[7,7,7,7]
[7,7,7]

[]
[3]

[[[]]]
[[]]

[1,[2,[3,[4,[5,6,7]]]],8,9]
[1,[2,[3,[4,[5,6,0]]]],8,9]
`;
if (part1(example) !== 13) throw new Error("Test failed");
console.log(`Part 1: ${part1(fs.readFileSync(__dirname + "/input.txt", "utf8"))}`);
