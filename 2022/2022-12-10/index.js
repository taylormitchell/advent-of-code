const fs = require("fs");

const instructions = fs
  .readFileSync("input.txt", "utf8")
  .split("\r\n")
  .map((line) => {
    const [command, value] = line.split(" ");
    return [command, parseInt(value)];
  });

const enableLogging = process.argv.includes("--debug");
function debug(...args) {
  if (!enableLogging) return;
  console.log(...args);
}

function part1() {
  let register = 1;
  let values = [register];
  let cycle = 1;

  function incrCycle() {
    debug(`Cycle ${cycle}. Register: ${register}`);
    values.push(register);
    cycle++;
  }

  while (instructions.length > 0) {
    [command, value] = instructions.shift();
    if (command === "noop") {
      incrCycle();
      continue;
    } else if (command === "addx") {
      incrCycle();
      incrCycle();
      register += value;
      continue;
    } else {
      throw new Error("Unknown command");
    }
  }
  debug(`Cycle ${cycle}. Register: ${register}`);

  let total = 0;
  const strengths = [];
  cycle = 20;
  while (values[cycle] !== undefined) {
    const str = values[cycle] * cycle;
    strengths.push(str);
    total += str;
    cycle += 40;
  }
  debug(`Strengths: ${strengths.join(", ")}`);
  debug(`Total: ${total}`);
}

function part2() {
  let spritePosition = 1;
  let cycle = 1;
  let crtLines = [];
  let crtLine = "";

  function incrCycle(value) {
    debug(`Cycle ${cycle}. Register: ${spritePosition}`);

    // Render crt pixel
    const cp = crtLine.length;
    const sp = spritePosition;
    crtLine += cp >= sp - 1 && cp <= sp + 1 ? "#" : ".";
    debug("CTR: ", crtLine);

    cycle++;

    // Move sprite
    spritePosition += value;
    debug(
      "Pos: " + ".".repeat(Math.max(0, spritePosition - 2)) + "###" + "..."
    );

    if (crtLine.length === 40) {
      crtLines.push(crtLine);
      crtLine = "";
    }
  }

  while (instructions.length > 0) {
    [command, value] = instructions.shift();
    if (command === "noop") {
      incrCycle(0);
    } else if (command === "addx") {
      incrCycle(0);
      incrCycle(value);
    } else {
      throw new Error("Unknown command");
    }
  }

  for (let line of crtLines) {
    console.log(line);
  }
}

part2();
