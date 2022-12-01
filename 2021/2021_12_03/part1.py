

with open("input.txt") as f:
    input = f.read().split("\n")

counter = [0]*len(input[0])
for line in input:
    for i, bit in enumerate(line):
        if bit == "1":
            counter[i] += 1
        elif bit == "0":
            counter[i] -= 1
        else:
            raise ValueError("invalid bit char")
    # print(line, counter)

gamma = epsilon = 0
for i, count in enumerate(counter[::-1]):
    if count >= 0:
        gamma += 2**i
    else: 
        epsilon += 2**i
power = gamma * epsilon
        
print(f"{gamma} x {epsilon} = {power}")





