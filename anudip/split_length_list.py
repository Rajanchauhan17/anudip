# Original list
original_list = [1, 1, 2, 3, 4, 4, 5, 1]

# Length of the first part
length_of_first_part = 3

# Splitting the list into two parts
first_part = original_list[:length_of_first_part]
second_part = original_list[length_of_first_part:]

print("Original list:", original_list)
print(f"Length of the first part of the list: {length_of_first_part}")
print("Splitted the said list into two parts:", (first_part, second_part))
