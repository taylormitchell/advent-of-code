import numpy as np
import re

class Board:
    def __init__(self, values):
        self._values = np.array(values) 
        self._marks = np.zeros(self._values.shape)
        self.size = self._values.shape[0]

        self.row_counts = [0] * self._values.shape[0]
        self.col_counts = [0] * self._values.shape[1]
        self.diag_counts = [0, 0]

    def update(self, num):
        idxs = list(zip(*np.where(self._values == num)))
        for idx in idxs:
            self._marks[idx] = 1
            self._update_counts(idx)

    def _update_counts(self, idx):
        self.row_counts[idx[0]] += 1
        self.col_counts[idx[1]] += 1
        #if idx[0] == idx[1]:
        #    self.diag_counts[0] +=1
        #if idx[0] == self._invert_idx(idx[1]):
        #    self.diag_counts[1] +=1
    
    def _invert_idx(self, idx):
        return (self._values.shape[0] - 1) - idx

    @property
    def dir_counts(self):
        return self.row_counts, self.col_counts, self.diag_counts

    def check_win_condition(self):
        for dir_counts in self.dir_counts: 
            for count in dir_counts:
                if count >= self.size:
                 return True
        return False

    def score(self, last_num):
        res = sum(self._values[self._marks == 0])
        return res * last_num

    def __repr__(self):
        return repr(self._values)
        

def parse_input(input):
    nums = [int(n) for n in input[0].split(",")]
    boards = []
    rows = []
    for i in range(2, len(input)):
        line = input[i]
        if line == "":
            continue
        row = [int(n) for n in re.split("\s+", line.strip())]
        rows.append(row)
        if i == len(input) - 1 or input[i+1] == "":
            boards.append(rows)
            rows = [] 

    return nums, boards


def get_winning_board(nums, boards):
    for i, num in enumerate(nums):
        for board in boards:
            board.update(num)
            if board.check_win_condition():
                print(nums[:i])
                print(board._marks)
                score = board.score(num)
                return board, score


with open("input.txt") as f:
    input = f.read().split("\n")

nums, boards = parse_input(input)
boards = [Board(b) for b in boards]
board, score = get_winning_board(nums, boards)

print(score)
