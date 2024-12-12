# Input from user
num = int(input("Enter a number: "))

# Initialize variables
factorial = 1
i = 1

# Calculate factorial using while loop
while i <= num:
    factorial *= i
    i += 1

# Output the result
print("The factorial of  is ",factorial)
