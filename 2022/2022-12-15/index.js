const example = `
Sensor at x=2, y=18: closest beacon is at x=-2, y=15
Sensor at x=9, y=16: closest beacon is at x=10, y=16
Sensor at x=13, y=2: closest beacon is at x=15, y=3
Sensor at x=12, y=14: closest beacon is at x=10, y=16
Sensor at x=10, y=20: closest beacon is at x=10, y=16
Sensor at x=14, y=17: closest beacon is at x=10, y=16
Sensor at x=8, y=7: closest beacon is at x=2, y=10
Sensor at x=2, y=0: closest beacon is at x=2, y=10
Sensor at x=0, y=11: closest beacon is at x=2, y=10
Sensor at x=20, y=14: closest beacon is at x=25, y=17
Sensor at x=17, y=20: closest beacon is at x=21, y=22
Sensor at x=16, y=7: closest beacon is at x=15, y=3
Sensor at x=14, y=3: closest beacon is at x=15, y=3
Sensor at x=20, y=1: closest beacon is at x=15, y=3
`.trim();

/**
 *
 * 1 brute force
 * - create a map of every location
 * - for each sensor,
 * -   determine it's manhattan distance to it's beacon
 * -   note all positions around it within that distance
 *
 * 2
 * - determin the manhattan dist for each beacon
 * - step through grid locations
 * - step through each sensor and ask if it can reach the current position
 *
 * 1 & 2 are the same run time if you consider the entire grid
 * 2 will be faster for part 1 though
 *
 */

function parseInput(input) {
  const lines = input.split("\n");
  const pairs = [];
  lines.forEach((line, i) => {
    const locs = line.match(/-?\d+/g).map(Number);
    pairs.push({ sensor: locs.slice(0, 2), beacon: locs.slice(2, 4) });
  });
  return pairs;
}

const pairs = parseInput(example);
for (const pair of pairs) {
  const { sensor, beacon } = pair;
  const [x1, y1] = sensor;
  const [x2, y2] = beacon;
  const dist = Math.abs(x1 - x2) + Math.abs(y1 - y2);
  pair.dist = dist;
}

let xs = pairs.map((pair) => [pair.sensor[0], pair.beacon[0]]).flat();
let ys = pairs.map((pair) => [pair.sensor[1], pair.beacon[1]]).flat();
let minX = Math.min(...xs);
let maxX = Math.max(...xs);
let minY = Math.min(...ys);
let maxY = Math.max(...ys);

const beaconMap = new Map();
for (const pair of pairs) {
  const { beacon } = pair;
  const [x, y] = beacon;
  beaconMap.has(x) ? beaconMap.get(x).push(y) : beaconMap.set(x, [y]);
}
function beaconAtLoc(x, y) {
  return beaconMap.has(x) && beaconMap.get(x).includes(y);
}

console.log(pairs);
let count = 0;
let res = "";
const y = 10;
for (let x = minX; x <= maxX; x++) {
  if (beaconAtLoc(x, y)) {
    res += "B";
    continue;
  }
  let inrange = false;
  for (const pair of pairs) {
    const { sensor, dist } = pair;
    const [x1, y1] = sensor;
    const distSensor = Math.abs(x - x1) + Math.abs(y - y1);
    if (distSensor <= dist) {
      inrange = true;
      count += 1;
      break;
    }
  }
  res += inrange ? "#" : ".";
}
console.log(res);
console.log(count);
