/**
 *
 *
 * keep track of the current path
 * ["/", "a", "b", "c"]
 *
 * build up the tree
 * {
 *  "/": {
 *     "a": {
 *          "b": {
 *             "c": {
 *        }
 *      }
 *     "f": 343
 *  }
 *
 * }
 *
 * do I need to built up the directory structure?
 * I could just keep track of the present path
 * and then when I ls while inside it, I take the sum and memorize it
 *
 *
 * is it possible to try to `cd` into a directory that doesn't exist?
 * cause in that case I can't just update my path on cd
 * I'm gonna assume no
 *
 * while (lineNum < lines.length) {
 * if ()
 * processCommand()
 * processOutput()
 *
 *
 * }
 *
 *
 */

const fs = require("fs");
const path = require("path");

// Load input
const input = fs.readFileSync(path.join(__dirname, "input.txt"), "utf8");
const lines = input.split("\r\n");

// Set up data structures
let pwd = [];
let tree = {};
let currDir = null;
function deepAccess(obj, path) {
  let curr = obj;
  for (let i = 0; i < path.length; i++) {
    curr = curr[path[i]];
  }
  return curr;
}
function cd(arg) {
  if (!arg) {
    throw new Error("cd needs an argument");
  }

  if (arg === "/") {
    pwd = [];
  } else if (arg === "..") {
    pwd = pwd.slice(0, -1);
  } else {
    pwd.push(arg);
  }
  currDir = deepAccess(tree, pwd);
}
function ls() {
  // do something
}

// Process lines and populate tree
let lineNum = 0;
while (lineNum < lines.length) {
  let line = lines[lineNum];
  if (line.startsWith("$")) {
    const [prompt, command, ...args] = line.split(" ");
    switch (command) {
      case "cd":
        cd(args[0]);
        break;
      case "ls":
        ls();
        break;
      default:
        throw new Error(`Unknown command ${command}`);
    }
    lineNum++;
  } else {
    while (line && !line.startsWith("$")) {
      const [info, name, ...args] = line.split(" ");
      if (info === "dir") {
        currDir[name] = currDir[name] || {};
      } else {
        currDir[name] = parseInt(info);
      }
      lineNum++;
      line = lines[lineNum];
    }
  }
}

// Calculate the size of each directory
const dirSizes = {};
function traverseTree(dir, path) {
  const pwd = "/" + path.join("/");
  dirSizes[pwd] = 0;
  for (let key in dir) {
    if (typeof dir[key] === "number") {
      dirSizes[pwd] += dir[key];
    } else {
      dirSizes[pwd] += traverseTree(dir[key], [...path, key]);
    }
  }
  return dirSizes[pwd];
}
traverseTree(tree, []);

console.log(tree);
console.log(dirSizes);

function part1() {
  // calculate the sum of sizes that are below 100000
  let total = 0;
  for (let key in dirSizes) {
    if (key !== "/" && dirSizes[key] < 100000) {
      total += dirSizes[key];
    }
  }
  return total;
}

function part2() {
  const disk_space = 70_000_000;
  const required_unused_space = 30_000_000;
  const disk_max = disk_space - required_unused_space;
  const current_used = dirSizes["/"];
  const space_to_clear = current_used - disk_max;

  console.log({
    disk_space,
    required_unused_space,
    disk_max,
    current_used,
    space_to_clear,
  });

  return Object.values(dirSizes)
    .sort((a, b) => a - b)
    .filter((v) => v > space_to_clear)[0];
}

console.log("Part 1: ", part1());
console.log("Part 2: ", part2());
