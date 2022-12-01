import re
import numpy as np


class Line:
    def __init__(self, x1, y1, x2, y2):
        self.x1 = x1
        self.y1 = y1
        self.x2 = x2
        self.y2 = y2
        self.p1 = (self.x1, self.y1)
        self.p2 = (self.x2, self.y2)

    def get_covered_points(self):
        if self.x1 == self.x2:
            y_first, y_last = sorted([self.y1, self.y2])
            return np.array([(self.x1, y) for y in range(y_first, y_last + 1)])
        elif self.y1 == self.y2:
            x_first, x_last = sorted([self.x1, self.x2])
            return np.array([(x, self.y1) for x in range(x_first, x_last + 1)])
        else:
            x_range = range(self.x1, self.x2 - 1, -1) if self.x1 > self.x2 else range(self.x1, self.x2 + 1)
            y_range = range(self.y1, self.y2 - 1, -1) if self.y1 > self.y2 else range(self.y1, self.y2 + 1)
            return np.array([(x, y) for x,y in zip(x_range, y_range)])

    def is_hor_or_vert(self):
        return self.x1 == self.x2 or self.y1 == self.y2

    @classmethod
    def from_text(cls, line):
        coords = [int(p) for p in re.split(",| -> ", line)]
        return cls(*coords)

    def __repr__(self):
        return repr((self.p1, self.p2))


# load and create lines
with open("input.txt") as f:
    input = f.read().split("\n")
lines = [Line.from_text(text) for text in input]

# get all covered points
points = [line.get_covered_points() for line in lines]
all_points = np.concatenate(points, axis=0)

# count all point overlaps
max_x = all_points[:, 0].max() 
max_y = all_points[:, 1].max() 
counts = np.zeros(shape=(max_x+1, max_y+1))
for point in all_points:
    counts[point[0], point[1]] += 1
points_max_overlap = list(zip(*np.where(counts >= 2)))

print(points_max_overlap)
print(len(points_max_overlap))



