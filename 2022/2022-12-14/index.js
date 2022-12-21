const fs = require("fs");

const enableDebug = false;
function debug(...args) {
  if (!enableDebug) return;
  console.log(...args);
}

const example = `
498,4 -> 498,6 -> 496,6
503,4 -> 502,4 -> 502,9 -> 494,9
`;
// const input = example;
const input = fs.readFileSync(__dirname + "/input.txt", "utf8");

const lines = input
  .trim()
  .split("\n")
  .map((line) =>
    line
      .trim()
      .split(" -> ")
      .map((str) => str.split(",").map(Number))
  );

// Set up map
let minX = 0;
let maxX = 0;
let minY = 0;
let maxY = Math.max(...points.map(([, y]) => y), source[1]) + 2;
const map = {};
function updateMap(point, value) {
  const [x, y] = point;
  minX = Math.min(minX, x);
  maxX = Math.max(maxX, x);
  map[x] = map[x] || {};
  map[x][y] = value;
}
function getMap(point) {
  const [x, y] = point;
  if (y >= maxY) return 1;
  return map[x]?.[y] || 0;
}

// Populate map
const source = [500, 0];
const points = lines
  .map((line) => {
    const points = [line[0]];
    for (let i = 0; i < line.length - 1; i++) {
      const [x1, y1] = line[i];
      const [x2, y2] = line[i + 1];
      const dx = x2 - x1;
      const dy = y2 - y1;
      if (dx !== 0 && dy !== 0) throw new Error("diagonal lines not supported");
      if (dx !== 0) {
        const step = dx / Math.abs(dx);
        for (let i = step; i !== dx + step; i += step) {
          points.push([x1 + i, y1]);
        }
      } else if (dy !== 0) {
        const step = dy / Math.abs(dy);
        for (let i = step; i !== dy + step; i += step) {
          points.push([x1, y1 + i]);
        }
      }
    }
    return points;
  })
  .flat();
points.forEach((p) => updateMap(p, 1));

function drawMap(map) {
  let res = "";
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      res += [".", "#", "o"][getMap([x, y])];
    }
    res += "\n";
  }
  return res;
}

function next(sand = source) {
  const below = [sand[0], sand[1] + 1];
  const leftBelow = [sand[0] - 1, sand[1] + 1];
  const rightBelow = [sand[0] + 1, sand[1] + 1];
  if (getMap(below) === 0) {
    sand = below;
  } else if (getMap(leftBelow) === 0) {
    sand = leftBelow;
  } else if (getMap(rightBelow) === 0) {
    sand = rightBelow;
  } else {
    updateMap(sand, 2);
    return true;
  }
  return next(sand);
}

function part1() {
  let step = 0;
  while (true) {
    next();
    debug(drawMap(map));
    if (sand[0] < minX || sand[0] > maxX || sand[1] > maxY) {
      break;
    }
    step += 1;
  }
  return step;
}

function part2() {
  let step = 0;
  while (true) {
    next();
    debug(drawMap(map));
    step += 1;
    if (getMap(source) === 2) break;
  }
  return step;
}

console.log("Part 1:", part1());
console.log("Part 2:", part2());
