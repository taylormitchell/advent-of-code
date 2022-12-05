const fs = require("fs");
const input = fs
  .readFileSync("input.txt", "utf-8")
  .trim()
  .split("\n")
  .map((line) => line.split(" "));

const ROCK = "A";
const PAPER = "B";
const SCISSOR = "C";

function part1(input) {
  const WIN_LEFT = -1;
  const TIE = 0;
  const WIN_RIGHT = 1;
  function decodeTheres(str) {
    return str;
  }

  function decodeMine(str) {
    return {
      X: "A",
      Y: "B",
      Z: "C",
    }[str];
  }

  function determineResult(left, right) {
    if (left === right) {
      return TIE;
    } else if (
      (left === ROCK && right === SCISSOR) |
      (left === SCISSOR && right === PAPER) |
      (left === PAPER && right === ROCK)
    ) {
      return WIN_LEFT;
    } else {
      return WIN_RIGHT;
    }
  }
  let scores = [];
  for (let [theres, mine] of input) {
    let score = 0;
    theres = decodeTheres(theres);
    mine = decodeMine(mine);

    if (mine === ROCK) {
      score += 1;
    } else if (mine === PAPER) {
      score += 2;
    } else if (mine === SCISSOR) {
      score += 3;
    }

    const result = determineResult(theres, mine);
    if (result === TIE) {
      score += 3;
    } else if (result === WIN_RIGHT) {
      score += 6;
    }
    scores.push(score);
  }
  return scores.reduce((a, b) => a + b, 0);
}

function part2(input) {
  const WIN = "win";
  const TIE = "tie";
  const LOSE = "lose";
  const THERE_CHOICE_AND_OUTCOME_TO_MY_CHOICE = {
    [ROCK]: { lose: SCISSOR, tie: ROCK, win: PAPER },
    [PAPER]: { lose: ROCK, tie: PAPER, win: SCISSOR },
    [SCISSOR]: { lose: PAPER, tie: SCISSOR, win: ROCK },
  };

  function decodeOutcome(str) {
    return {
      X: LOSE,
      Y: TIE,
      Z: WIN,
    }[str];
  }

  let scores = [];
  for (let [theres, outcome] of input) {
    let score = 0;
    theres = decodeTheres(theres);
    outcome = decodeOutcome(outcome);

    const mine = THERE_CHOICE_AND_OUTCOME_TO_MY_CHOICE[theres][outcome];

    if (mine === ROCK) {
      score += 1;
    } else if (mine === PAPER) {
      score += 2;
    } else if (mine === SCISSOR) {
      score += 3;
    }

    if (outcome === TIE) {
      score += 3;
    } else if (outcome === WIN) {
      score += 6;
    }
    scores.push(score);
  }
  //   return scores;
  return scores.reduce((a, b) => a + b, 0);
}

console.log(part1(input));
console.log(part2(input));
