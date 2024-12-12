# List of numbers
numbers = [1, 2, 3, 4, 5, 2, 3, 4, 6, 7, 8, 5, 9, 1]

# Create an empty list to store duplicates
duplicates = []

# Iterate through the list to find duplicates
for i in range(len(numbers)):
    for j in range(i + 1, len(numbers)):
        if numbers[i] == numbers[j] and numbers[i] not in duplicates:
            duplicates.append(numbers[i])

print("Duplicate values in the list are:")
for duplicate in duplicates:
    print(duplicate)
