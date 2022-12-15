/**
 *
 * option 1: brute force
 * - store as an array of arrays
 * - step through, keeping an i,j pointer
 * - at each point, you step all the way to the left, right, up, and down
 *   and check if any of the numbers are larger than the current
 * - O(m*n*(m+n))
 *
 *
 *
 * option 2:
 * - step along the top row
 * - keep track of the max you've seen so far
 * - when you hit a number, check if it's larger than the max, and update it's
 *   corresponding left memo if it is
 *
 * how about the right side?
 * maybe you just have to go backwards?
 * 2*m*n + 2*n*m = 4*m*n
 * ^ much better
 *
 * [
 *   [{left: true, right, true}]
 *
 * ]
 *
 *
 *
 * example
 *
 * 1 2 3 5
 *
 * 1: {l: true, r: false }   max = 1
 * 2: {l: true, r: false } max = 2
 * 3: {l: true, r: false } max = 3
 * 5: {l: true, r: null } max = 5
 * 4: {l: false, r: null } max = 5
 * 3: {l: false, r: null } max = 5
 * 4: {l: false, r: null } max = 5
 *
 * keep a memo of the trees who's right visibility we're undecided on
 * { 5: [3], 4: [4], 3: [5]}
 * when I hit something that's larger than the previous tree, then I go
 * through the memo and update the right visibility of all the trees smaller
 * than the current one
 *
 * Now we don't *always* have to go backwards across the entire array,
 * but still sometimes we do, so it doesn't affect the worst case
 *
 *
 *
 *
 * if you run into something that's larget than the max,
 * you know everything to the left of it isn't visible
 *
 */

const fs = require("fs");

const input = fs.readFileSync("./input.txt", "utf8");
const trees = input.split("\r\n").map((line) => line.split("").map(Number));

function part1() {
  const vis = trees.map((row) => row.map(() => []));

  // rows
  for (let i = 0; i < trees.length; i++) {
    // left to right
    let max = -1;
    for (let j = 0; j < trees[i].length; j++) {
      const tree = trees[i][j];
      if (tree > max) {
        max = tree;
        vis[i][j].push(true);
      } else {
        vis[i][j].push(false);
      }
    }
    // right to left
    max = -1;
    for (let j = trees[i].length - 1; j >= 0; j--) {
      const tree = trees[i][j];
      if (tree > max) {
        max = tree;
        vis[i][j].push(true);
      } else {
        vis[i][j].push(false);
      }
    }
  }

  // columns
  for (let j = 0; j < trees[0].length; j++) {
    // top to bottom
    let max = -1;
    for (let i = 0; i < trees.length; i++) {
      const tree = trees[i][j];
      if (tree > max) {
        max = tree;
        vis[i][j].push(true);
      } else {
        vis[i][j].push(false);
      }
    }
    // bottom to top
    max = -1;
    for (let i = trees.length - 1; i >= 0; i--) {
      const tree = trees[i][j];
      if (tree > max) {
        max = tree;
        vis[i][j].push(true);
      } else {
        vis[i][j].push(false);
      }
    }
  }

  // count the number of trees that are visible from all 4 directions
  let count = 0;
  for (let i = 0; i < vis.length; i++) {
    for (let j = 0; j < vis[i].length; j++) {
      if (vis[i][j].some(Boolean)) {
        count++;
      }
    }
  }
  return count;
}

function part2() {
  const counts = trees.map((row) => row.map(() => []));
  let dir; // 0 = left, 1 = right, 2 = up, 3 = down

  // rows
  for (let i = 0; i < trees.length; i++) {
    // left to right
    dir = 0;
    for (let j = 0; j < trees[i].length; j++) {
      const prev = trees[i][j - 1];
      const curr = trees[i][j];
      let count = 0;
      if (prev === undefined) {
        count = 0;
      } else if (curr <= prev) {
        count = 1;
      } else {
        function getLeftCount(k) {
          const left_count = counts[i][k][dir];
          const lefts_last_tree = trees[i][k - left_count];
          if (left_count === 0) {
            return 0;
          } else if (curr <= lefts_last_tree) {
            return left_count;
          } else {
            return left_count + getLeftCount(k - left_count);
          }
        }
        count = getLeftCount(j - 1) + 1;
      }
      counts[i][j].push(count);
    }
    // right to left
    dir = 1;
    for (let j = trees[i].length - 1; j >= 0; j--) {
      const prev = trees[i][j + 1];
      const curr = trees[i][j];
      let count = 0;
      if (prev === undefined) {
        count = 0;
      } else if (curr <= prev) {
        count = 1;
      } else {
        function getRightCount(k) {
          const right_count = counts[i][k][dir];
          const rights_last_tree = trees[i][k + right_count];
          if (right_count === 0) {
            return 0;
          } else if (curr <= rights_last_tree) {
            return right_count;
          } else {
            return right_count + getRightCount(k + right_count);
          }
        }
        count = getRightCount(j + 1) + 1;
      }
      counts[i][j].push(count);
    }
  }

  // columns
  for (let j = 0; j < trees[0].length; j++) {
    // top to bottom
    dir = 2;
    for (let i = 0; i < trees.length; i++) {
      const prev = trees[i - 1]?.[j];
      const curr = trees[i][j];
      let count = 0;
      if (prev === undefined) {
        count = 0;
      } else if (curr <= prev) {
        count = 1;
      } else {
        function getUpCount(k) {
          const up_count = counts[k][j][dir];
          const ups_last_tree = trees[k - up_count]?.[j];
          if (up_count === 0) {
            return 0;
          } else if (curr <= ups_last_tree) {
            return up_count;
          } else {
            return up_count + getUpCount(k - up_count);
          }
        }
        count = getUpCount(i - 1) + 1;
      }
      counts[i][j].push(count);
    }
    // bottom to top
    dir = 3;
    for (let i = trees.length - 1; i >= 0; i--) {
      const prev = trees[i + 1]?.[j];
      const curr = trees[i][j];
      let count = 0;
      if (prev === undefined) {
        count = 0;
      } else if (curr <= prev) {
        count = 1;
      } else {
        function getDownCount(k) {
          const down_count = counts[k][j][dir];
          const downs_last_tree = trees[k + down_count]?.[j];
          if (down_count === 0) {
            return 0;
          } else if (curr <= downs_last_tree) {
            return down_count;
          } else {
            return down_count + getDownCount(k + down_count);
          }
        }
        count = getDownCount(i + 1) + 1;
      }
      counts[i][j].push(count);
    }
  }
  //   console.log(counts);

  // multiply the counts to get a scenic score
  let max = 0;
  for (let i = 0; i < counts.length; i++) {
    for (let j = 0; j < counts[i].length; j++) {
      const score = counts[i][j].reduce((a, b) => a * b, 1);
      if (score > max) {
        max = score;
      }
    }
  }
  return max;
}

console.log(part1());
console.log(part2());

/**
 * to the left, how many trees are there until you hit a tree that's equal to or taller?
 *
 * 5 4 [3]
 *
 * 8 7 1 2 [4]
 *
 * 0 +1 -6 +1 +2
 *
 * if the current is smaller or equal than the previous, then we can only see 1 tree
 * if the current is larger than the previous, then we can see 1 + the number of trees we could see from the previous
 *
 *
 * 4 3 1 2 [4]
 *
 * the left guy can see a dist of 2
 * jump to the last spot he can see
 * if that's equal or bigger, then we can see 1 + the number of trees we could see from the previous
 * if that's smaller, then continue
 *
 *
 *
 *
 */
