# Input from the user
number = int(input("Enter a number: "))

# Store the original number to compare later
original_number = number

# Reverse the number
reversed_number = 0
while number > 0:
    digit = number % 10
    reversed_number = reversed_number * 10 + digit
    number = number // 10

# Check if the original number is equal to the reversed number
if original_number == reversed_number:
    print("it is a palindrome.",original_number)
else:
    print(" not a palindrome.",original_number)
