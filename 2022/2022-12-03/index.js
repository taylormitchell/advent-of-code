const fs = require("fs");

function assert(condition) {
  if (!condition) {
    throw new Error();
  }
}

function priority(char) {
  const code = char.charCodeAt(0);
  if (code >= 97) {
    return code - 96;
  } else {
    return code - 65 + 27;
  }
}
assert(priority("a") === 1);
assert(priority("z") === 26);
assert(priority("A") === 27);
assert(priority("Z") === 52);

function part1() {
  function findDups(rucksack) {
    const [first, second] = rucksack;

    const inFirst = new Set();
    for (let i = 0; i < first.length; i++) {
      inFirst.add(first[i]);
    }

    const dups = new Set();
    for (let i = 0; i < second.length; i++) {
      if (inFirst.has(second[i])) {
        dups.add(second[i]);
      }
    }
    return Array.from(dups);
  }
  let total = 0;
  const input = fs.readFileSync("input.txt", "utf-8");
  for (const line of input.split("\n")) {
    let mid = Math.ceil((line.length - 1) / 2);
    const rucksack = [line.slice(0, mid), line.slice(mid)];
    const dups = findDups(rucksack);
    let score = dups.map((c) => priority(c)).reduce((a, b) => a + b, 0);
    total += score;
  }
  return total;
}

function part2() {
  function findDups(lines) {
    let lastSet = new Set(lines[0].split(""));
    let nextSet = new Set();
    for (const line of lines.slice(1)) {
      for (const c of line.split("")) {
        if (lastSet.has(c)) {
          nextSet.add(c);
        }
      }
      lastSet = nextSet;
      nextSet = new Set();
    }
    return Array.from(lastSet);
  }

  let total = 0;
  const lines = fs.readFileSync("input.txt", "utf-8").split("\n");
  for (i = 0; i < lines.length; i += 3) {
    const dups = findDups(lines.slice(i, i + 3));
    let score = dups.map((c) => priority(c)).reduce((a, b) => a + b, 0);
    total += score;
  }
  return total;
}
