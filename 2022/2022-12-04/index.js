const fs = require("fs");

function part1() {
  let total = 0;
  const lines = fs.readFileSync("input.txt", "utf-8").trim().split("\n");
  for (let line of lines) {
    let superset = 0;
    const [left, right] = line.split(",").map((v) => v.split("-").map((n) => parseInt(n)));
    const minLower = Math.min(left[0], right[0]);
    const maxUpper = Math.max(left[1], right[1]);
    if (left[0] === minLower && left[1] === maxUpper) {
      superset = 1;
    } else if (right[0] === minLower && right[1] === maxUpper) {
      superset = 1;
    }
    total += superset;
  }
  return total;
}

function part2() {
  let total = 0;
  const lines = fs.readFileSync("input.txt", "utf-8").trim().split("\n");
  for (let line of lines) {
    let overlap = 0;
    const [left, right] = line
      .split(",")
      .map((v) => v.split("-").map((n) => parseInt(n)))
      .sort((a, b) => a[0] - b[0]);
    if (left[1] >= right[0]) {
      overlap = 1;
    }
    total += overlap;
  }
  return total;
}

console.log(part2());
