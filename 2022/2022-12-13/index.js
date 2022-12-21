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
  return left <= right;
}

function compareMixed(left, right) {
  if (typeof left === "number") {
    left = [left];
  } else if (typeof right === "number") {
    right = [right];
  }
  return compareArrays(left, right, false);
}

function compareArrays(left, right, compareLength = true) {
  for (let i = 0; i < left.length; i++) {
    if (right[i] === undefined) {
      return compareLength ? false : true;
    } else if (typeof left[i] === "number" && typeof right[i] === "number") {
      if (!compareNumbers(left[i], right[i])) {
        return false;
      }
    } else if (Array.isArray(left[i]) && Array.isArray(right[i])) {
      if (!compareArrays(left[i], right[i])) {
        return false;
      }
    } else {
      if (!compareMixed(left[i], right[i])) {
        return false;
      }
    }
  }
  return true;
}

const pairs = parseInput(example);
for (const pair of pairs) {
  const { left, right } = pair;
  pair.inOrder = compareArrays(left, right);
}
console.log(pairs);
