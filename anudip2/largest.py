# List of numbers
numbers = [56, 92, 14, 63, 105, 82]

# Initialize the largest number to the first element of the list
largest = numbers[0]

# Iterate through the list to find the largest number
for num in numbers:
    if num > largest:
        largest = num

# Print the largest number
print("The largest number is:", largest)
