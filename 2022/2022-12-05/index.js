const fs = require("fs");

function load() {
  const lines = fs.readFileSync("input.txt", "utf-8").split("\r\n");

  let iLineEmpty = 0;
  while (lines[iLineEmpty] !== "" && iLineEmpty < lines.length) {
    iLineEmpty++;
  }
  const iLineCrateNum = iLineEmpty - 1;
  const iLineBottomCrates = iLineCrateNum - 1;

  const linesCrates = lines.slice(0, iLineCrateNum);
  const numCrates = lines[iLineCrateNum]
    .trim()
    .split(/\s+/)
    .map((n) => parseInt(n))
    .slice(-1)[0];
  const linesProcedure = lines.slice(iLineEmpty + 1);

  // empty array of arrays
  const crates = Array(numCrates + 1)
    .fill(null)
    .map(() => []);

  // Go through crates from bottom to top and left to right
  for (let iLine = iLineBottomCrates; iLine >= 0; iLine--) {
    const line = linesCrates[iLine];
    for (let iCrate = 1; iCrate <= numCrates; iCrate++) {
      let c = line[(iCrate - 1) * 4 + 1];
      if (c !== " ") {
        crates[iCrate].push(c);
      }
    }
  }
  return [crates, linesProcedure];
}
const [crates, linesProcedure] = load();

function part1() {
  for (const line of linesProcedure) {
    const [count, from, to] = Array.from(line.matchAll(/\d+/g)).map((match) =>
      parseInt(match[0])
    );
    let i = 0;
    while (i < count) {
      crates[to].push(crates[from].pop());
      i++;
    }
  }
  return crates.map((arr) => arr[arr.length - 1] || "").join("");
}

function part2() {
  for (const line of linesProcedure) {
    const [count, from, to] = Array.from(line.matchAll(/\d+/g)).map((match) =>
      parseInt(match[0])
    );
    const moving = crates[from].splice(-count, count);
    crates[to].push(...moving);
  }
  return crates.map((arr) => arr[arr.length - 1] || "").join("");
}

console.log(part1());
console.log(part2());
