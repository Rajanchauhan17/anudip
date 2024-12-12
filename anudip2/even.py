# Given list of numbers
numbers = [12, 35, 47, 50, 56, 63, 80, 90, 101]

# Initialize an empty list to store even numbers
even_numbers = []

# Iterate through the list to find even numbers
for num in numbers:
    if num % 2 == 0:
        even_numbers.append(num)

# Print the list of even numbers
print("Even numbers in the list:", even_numbers)
