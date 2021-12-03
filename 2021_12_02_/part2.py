

with open("input.txt") as f:
    input = f.read().split("\n")

h = d = 0
aim = 0
for line in input:
    dir, dist = line.split(" ")
    if dir == "forward":
        h += int(dist)
        d +=  aim * int(dist)
    elif dir == "up":
        aim -= int(dist)
    elif dir == "down":
        aim += int(dist)
    else:
        raise ValueError(f"invalid dir {dir}")
print(h, d, h*d)



