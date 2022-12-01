with open("input.txt") as f:
    input = [int(x) for x in f.read().split("\n")]

count = 0
i = 0
for j in range(1, len(input)):
    if input[j] > input[i]:
        count += 1
    print(input[i], input[j], count)
    i += 1
    
print(count)
