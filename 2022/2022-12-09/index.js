const moves = require("fs")
  .readFileSync("input.txt", "utf8")
  .split("\r\n")
  .map((line) => line.split(" "))
  .map(([dir, steps]) => [dir, +steps]);

function part1() {
  const visited = new Set();
  function mark(pos) {
    visited.add(pos.join(","));
  }

  let posT = [0, 0];
  let posH = [0, 0];
  let minX = 0;
  let maxX = 0;
  let minY = 0;
  let maxY = 0;

  /**
   * - if H is 2 steps away on the same row or column as T, move T one step in the direction of H
   * - if H is one row/column over and one step away, move T to the row/column and then one step in the direction of H
   */
  function moveT(posH, posT) {
    const [xH, yH] = posH;
    const [xT, yT] = posT;

    // on top or adjacent
    if (Math.abs(xH - xT) < 2 && Math.abs(yH - yT) < 2) {
      return posT;
    }

    // same column and 2 steps apart
    if (xH === xT && Math.abs(yH - yT) === 2) {
      return [xT, yT + (yH > yT ? 1 : -1)];
    }

    // same row and 2 steps apart
    if (yH === yT && Math.abs(xH - xT) === 2) {
      return [xT + (xH > xT ? 1 : -1), yT];
    }

    // one column over and 2 steps apart
    if (Math.abs(xH - xT) === 1 && Math.abs(yH - yT) === 2) {
      return [xT + (xH > xT ? 1 : -1), yT + (yH > yT ? 1 : -1)];
    }

    // one row over and 2 steps apart
    if (Math.abs(yH - yT) === 1 && Math.abs(xH - xT) === 2) {
      return [xT + (xH > xT ? 1 : -1), yT + (yH > yT ? 1 : -1)];
    }

    throw new Error("should not happen");
  }

  function displayCurrentState() {
    minX = Math.min(minX, posH[0], posT[0]);
    maxX = Math.max(maxX, posH[0], posT[0]);
    minY = Math.min(minY, posH[1], posT[1]);
    maxY = Math.max(maxY, posH[1], posT[1]);

    for (let y = maxY; y >= minY; y--) {
      let line = "";
      for (let x = minX; x <= maxX; x++) {
        if (x === posH[0] && y === posH[1]) {
          line += "H";
        } else if (x === posT[0] && y === posT[1]) {
          line += "T";
        } else {
          line += visited.has([x, y].join(",")) ? "#" : ".";
        }
      }
      console.log(line);
    }
  }

  for (const [dir, steps] of moves) {
    const [dx, dy] =
      dir === "U"
        ? [0, 1]
        : dir === "D"
        ? [0, -1]
        : dir === "L"
        ? [-1, 0]
        : [1, 0];
    //   console.log("dir:", dir, "steps:", steps);
    for (let i = 0; i < +steps; i++) {
      posH[0] += dx;
      posH[1] += dy;
      // console.log("after H moves:");
      // displayCurrentState();
      posT = moveT(posH, posT);
      mark(posT);
      // console.log("after T moves:");
      // displayCurrentState();
      // console.log("");
    }
  }

  console.log(visited.size);
}

function part2() {
  const visited = new Set();
  function mark(pos) {
    visited.add(pos.join(","));
  }

  let rope = new Array(10).fill(null).map(() => [0, 0]);
  let minX = 0;
  let maxX = 0;
  let minY = 0;
  let maxY = 0;

  function moveSegment(posInFront, posBehind) {
    const [xH, yH] = posInFront;
    const [xT, yT] = posBehind;

    // on top or adjacent
    if (Math.abs(xH - xT) < 2 && Math.abs(yH - yT) < 2) {
      return posBehind;
    }

    // same column and 2 steps apart
    if (xH === xT && Math.abs(yH - yT) === 2) {
      return [xT, yT + (yH > yT ? 1 : -1)];
    }

    // same row and 2 steps apart
    if (yH === yT && Math.abs(xH - xT) === 2) {
      return [xT + (xH > xT ? 1 : -1), yT];
    }

    // diff column and row
    if (Math.abs(xH - xT) >= 1 && Math.abs(yH - yT) >= 1) {
      return [xT + (xH > xT ? 1 : -1), yT + (yH > yT ? 1 : -1)];
    }

    throw new Error("should not happen");
  }

  function displayCurrentState() {
    minX = Math.min(minX, ...rope.map(([x, y]) => x));
    maxX = Math.max(maxX, ...rope.map(([x, y]) => x));
    minY = Math.min(minY, ...rope.map(([x, y]) => y));
    maxY = Math.max(maxY, ...rope.map(([x, y]) => y));

    for (let y = maxY; y >= minY; y--) {
      let line = "";
      for (let x = minX; x <= maxX; x++) {
        let atRope = false;
        for (const [i, [xH, yH]] of rope.entries()) {
          if (x === xH && y === yH) {
            line += i;
            atRope = true;
            break;
          }
        }
        if (!atRope) {
          line += visited.has([x, y].join(",")) ? "#" : ".";
        }
      }
      console.log(line);
    }
  }

  for (const [dir, steps] of moves) {
    const [dx, dy] =
      dir === "U"
        ? [0, 1]
        : dir === "D"
        ? [0, -1]
        : dir === "L"
        ? [-1, 0]
        : [1, 0];
    // console.log("dir:", dir, "steps:", steps);
    for (let i = 0; i < +steps; i++) {
      // move head
      rope[0][0] += dx;
      rope[0][1] += dy;
      //   console.log("after H moves:");
      //   displayCurrentState();
      // move rest of rope
      for (let j = 1; j < rope.length; j++) {
        const posNew = moveSegment(rope[j - 1], rope[j]);
        if (posNew[0] === rope[j][0] && posNew[1] === rope[j][1]) {
          // if a segment didn't move, the rest won't either
          break;
        }
        rope[j] = posNew;
      }
      //   console.log("after rest moves:");
      //   displayCurrentState();
      mark(rope[rope.length - 1]);
    }
  }

  console.log(visited.size);
}

part2();
