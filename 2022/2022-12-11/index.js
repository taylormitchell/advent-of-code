const fs = require("fs");

function log(...args) {
  if (!enableLogging) return;
  console.log(...args);
}

function getMonkeys(fn = "input.txt") {
  function parseEquation(equationStr) {
    let parts = equationStr.trim().split(" ");
    const operatorGroups = [
      ["*", "/"],
      ["+", "-"],
    ];
    for (let i = 0; i < operatorGroups.length; i++) {
      let p = 0;
      while (p < parts.length) {
        if (operatorGroups[i].includes(parts[p])) {
          const subpart = [parts[p - 1], parts[p], parts[p + 1]];
          parts.splice(p - 1, 3, subpart);
        } else {
          p++;
        }
      }
    }
    if (parts.length !== 1) throw new Error("Invalid equation");
    return parts[0];
  }

  function evalEquation(equation, args = {}) {
    if (typeof equation === "string") {
      return args[equation] || BigInt(parseInt(equation));
    }
    let [left, operator, right] = equation;
    left = evalEquation(left, args);
    right = evalEquation(right, args);
    switch (operator) {
      case "*":
        return left * right;
      case "/":
        return left / right;
      case "+":
        return left + right;
      case "-":
        return left - right;
      default:
        throw new Error("Unknown operator");
    }
  }
  // Parse input
  const monkeys = [];
  const input = fs.readFileSync(fn, "utf8");
  input.split("\n\n").forEach((monkeyStr) => {
    let items, operation, divisor, targets;
    const lines = monkeyStr.split("\n");
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();
      if (line.startsWith("Monkey")) {
        number = parseInt(line.split(" ")[1]);
      } else if (line.startsWith("Starting items")) {
        items = line
          .split(": ")[1]
          .trim()
          .split(", ")
          .map((i) => new Item(parseInt(i)));
      } else if (line.startsWith("Operation")) {
        const eq = parseEquation(line.split("=")[1]);
        operation = (old) => evalEquation(eq, { old });
      } else if (line.startsWith("Test")) {
        divisor = BigInt(parseInt(line.split("by ")[1]));
        targets = lines.slice(i + 1, i + 3).map((line) => {
          return parseInt(line.trim().slice(-1)[0]);
        });
        break;
      }
    }
    const monkey = new Monkey(number, operation, divisor, items, targets);
    monkeys.push(monkey);
  });
  return monkeys;
}

class Monkey {
  constructor(number, operation, divisor, items = [], targetMonkeys = []) {
    this.number = number;
    this.operation = operation;
    this.divisor = divisor;
    this.items = items;
    this.targetMonkeys = targetMonkeys;
    this.numInspections = 0;
  }

  inspect(itemWorry) {
    this.numInspections++;
    return this.operation(itemWorry);
  }

  target(itemWorry) {
    return itemWorry % this.divisor === BigInt(0) ? this.targetMonkeys[0] : this.targetMonkeys[1];
  }
}

class Item {
  constructor(worry) {
    this.worry = BigInt(worry);
  }
}

function logRound(i, monkeys) {
  log(`After round ${i + 1}, the monkeys are holding items with these worry levels:`);
  for (const monkey of monkeys) {
    log(`Monkey ${monkey.number}: ${monkey.items.map((i) => i.worry).join(", ")}`);
  }
}

function logInspections(monkeys) {
  log(`The monkeys inspected the following number of items:`);
  for (const monkey of monkeys) {
    log(`Monkey ${monkey.number} inspected ${monkey.numInspections} items`);
  }
}

function simulateMonkeyBusiness(fn, numRounds, update) {
  const monkeys = getMonkeys(fn);
  const common = monkeys.map((m) => m.divisor).reduce((a, b) => a * b, 1n);
  for (let i = 0; i < numRounds; i++) {
    for (const monkey of monkeys) {
      while (monkey.items.length > 0) {
        const item = monkey.items.shift();
        item.worry = monkey.inspect(item.worry);
        item.worry = update(item.worry);
        const targetMonkey = monkey.target(item.worry);
        item.worry = item.worry % BigInt(common);
        monkeys[targetMonkey].items.push(item);
      }
    }
    logRound(i, monkeys);
  }
  logInspections(monkeys);
  return monkeys
    .map((monkey) => monkey.numInspections)
    .sort((a, b) => b - a)
    .slice(0, 2)
    .reduce((a, b) => a * b, 1);
}

function part1() {
  return simulateMonkeyBusiness("input.txt", 20, (worry) => worry / 3n);
}

function part2() {
  return simulateMonkeyBusiness("input.txt", 10000, (worry) => worry);
}

const enableLogging = false;
console.log("Part 1:", part1());
console.log("Part 2:", part2());
