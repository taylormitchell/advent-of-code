const fs = require("fs");

const input = fs.readFileSync("input.txt", "utf8").trim().split(/\r\n/);
const elves = [];
let elf = [];
for (let i = 0; i < input.length; i++) {
  if (input[i] === "") {
    elves.push(elf);
    elf = [];
  } else {
    elf.push(parseInt(input[i]));
  }
}

function part1() {
  let maxCalories = 0;
  for (let i = 0; i < elves.length; i++) {
    const elf = elves[i];
    const total = elf.reduce((a, b) => a + b, 0);
    if (total > maxCalories) {
      maxCalories = total;
    }
  }
  return maxCalories;
}

console.log(`Part 1: ${part1()}`);

function part2() {
  let topThreeCalories = [0, 0, 0];
  for (let i = 0; i < elves.length; i++) {
    const elf = elves[i];
    const total = elf.reduce((a, b) => a + b, 0);
    for (let j = 0; j < topThreeCalories.length; j++) {
      if (total > topThreeCalories[j]) {
        topThreeCalories.splice(j, 0, total);
        topThreeCalories.pop();
        break;
      }
    }
  }
  return topThreeCalories.reduce((a, b) => a + b, 0);
}

console.log(`Part 2: ${part2()}`);
