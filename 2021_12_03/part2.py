

def rating_bin_to_decimal(rating_bin):
    res = 0
    for i, bit in enumerate(rating_bin[::-1]):
        res += 2**i if bit == "1" else 0
    return res

with open("input.txt") as f:
    input = f.read().split("\n")

def eval_bit_criteria(bit_idx, row_idxs, criteria):
    ones, zeros = [], []
    ones_count = zeros_count = 0
    for row_idx in row_idxs:
        if input[row_idx][bit_idx] == "1":
            ones.append(row_idx)
            ones_count += 1
        elif input[row_idx][bit_idx] == "0":
            zeros.append(row_idx)
            zeros_count += 1
        else:
            raise ValueError("non 1/0 value")
    if criteria(ones_count, zeros_count):
        return ones
    else:
        return zeros


oxy_rating = co2_rating = None
oxy_row_idxs = list(range(len(input)))
co2_row_idxs = list(range(len(input)))

for bit_idx in range(len(input[0])):
    # Oxygen
    if oxy_rating is None:
        oxy_row_idxs = eval_bit_criteria(bit_idx, oxy_row_idxs, lambda o, z: o >= z)
    if len(oxy_row_idxs) == 1:
        oxy_rating = input[oxy_row_idxs[0]]
    # CO2
    if co2_rating is None:
        co2_row_idxs = eval_bit_criteria(bit_idx, co2_row_idxs, lambda o, z: o < z)
    if len(co2_row_idxs) == 1:
        co2_rating = input[co2_row_idxs[0]]

oxy_rating_dec = rating_bin_to_decimal(oxy_rating)
co2_rating_dec = rating_bin_to_decimal(co2_rating)
print(oxy_rating, oxy_rating_dec)
print(co2_rating, co2_rating_dec)
print(oxy_rating_dec * co2_rating_dec)

