

with open("input.txt") as f:
    input = f.read().split("\n")

h = d = 0
for line in input:
    dir, dist = line.split(" ")
    if dir == "forward":
        h += int(dist)
    elif dir == "up":
        d -= int(dist)
    elif dir == "down":
        d += int(dist)
    else:
        raise ValueError(f"invalid dir {dir}")
print(h, d, h*d)



