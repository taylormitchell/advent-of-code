with open("input.txt") as f:
    input = [int(x) for x in f.read().split("\n")]

count = 0

for i in range(len(input)-3):
    x = sum(input[i:i+3])
    y = sum(input[i+1:i+4])
    if y > x:
        count += 1
    print(x, y, count)
    
print(input[i:])
print(count)
