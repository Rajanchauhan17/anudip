# List of numbers
numbers = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5]

# Initialize the largest and smallest variables
largest = numbers[0]
smallest = numbers[0]

# Iterate through the list to find the largest and smallest numbers
for number in numbers:
    if number > largest:
        largest = number
    if number < smallest:
        smallest = number

print(f"The largest number in the list is: {largest}")
print(f"The smallest number in the list is: {smallest}")
