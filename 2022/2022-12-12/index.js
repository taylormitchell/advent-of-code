const fs = require("fs");

const enableDebug = false;
function debug(...args) {
  if (!enableDebug) return;
  console.log(...args);
}

function parseInput(input) {
  const elevations = input
    .trim()
    .split("\n")
    .map((row) => row.split(""));
  let start, end;
  for (let r = 0; r < elevations.length; r++) {
    for (let c = 0; c < elevations[r].length; c++) {
      if (elevations[r][c] === "S") {
        elevations[r][c] = "a";
        start = [r, c];
      }
      if (elevations[r][c] === "E") {
        elevations[r][c] = "z";
        end = [r, c];
      }
      elevations[r][c] = elevations[r][c].charCodeAt(0) - 97;
    }
  }
  return { elevations, start, end };
}

function part1(input) {
  const { elevations: el, start, end } = parseInput(input);
  const visited = el.map((row) => row.map(() => false));
  const queue = [{ curr: start, steps: 0 }];

  // BFS
  while (queue.length > 0) {
    const { curr, steps } = queue.shift();
    const [r, c] = curr;
    // Skip if already visited
    if (visited[r][c]) continue;
    // At the end
    if (r === end[0] && c === end[1]) {
      return steps;
    }
    debug({ curr, steps });
    visited[r][c] = true;
    // Add accessible neighbours to queue
    let neighbours = [
      [r - 1, c],
      [r + 1, c],
      [r, c - 1],
      [r, c + 1],
    ];
    const elCurr = el[r][c];
    for (const [r, c] of neighbours) {
      const elNei = el?.[r]?.[c];
      if (elNei === undefined || elNei - elCurr > 1) continue; // Out of bounds or too high
      queue.push({ curr: [r, c], steps: steps + 1 });
    }
  }
  throw new Error("No path found");
}

function part2(input) {
  const { elevations: el, end } = parseInput(input);
  const visited = el.map((row) => row.map(() => false));
  const queue = [{ curr: end, steps: 0 }];
  const paths = new Set();

  // BFS
  while (queue.length > 0) {
    const { curr, steps } = queue.shift();
    const [r, c] = curr;
    // Skip if already visited
    if (visited[r][c]) continue;
    // At a start
    if (el[r][c] === 0) {
      paths.add(steps);
    }
    debug({ curr, steps });
    visited[r][c] = true;
    // Add accessible neighbours to queue
    let neighbours = [
      [r - 1, c],
      [r + 1, c],
      [r, c - 1],
      [r, c + 1],
    ];
    const elCurr = el[r][c];
    for (const [r, c] of neighbours) {
      const elNei = el?.[r]?.[c];
      if (elNei === undefined || elCurr - elNei > 1) continue; // Out of bounds or too high
      queue.push({ curr: [r, c], steps: steps + 1 });
    }
  }
  if (paths.size === 0) throw new Error("No paths found");
  return Math.min(...paths);
}

let steps;
// Part 1
// Example
steps = part1(`
Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi
`);
if (steps !== 31) throw new Error(`Result was ${steps}, expected 31`);
// Input
steps = part1(fs.readFileSync("input.txt", "utf8"));
console.log("Part 1:", steps);

// Part 2
// Example
steps = part2(`
Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi
`);
if (steps !== 29) throw new Error(`Result was ${steps}, expected 29`);
// Input
steps = part2(fs.readFileSync("input.txt", "utf8"));
console.log("Part 2:", steps);
