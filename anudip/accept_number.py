# Initialize sum variable
total_sum = 0

while True:
    # Accept input from the user
    num = int(input("Enter a number (enter 0 to stop): "))
    
    # Check if the input is 0
    if num == 0:
        break  # end of  the loop
    
    # Add the number to the total sum
    total_sum += num

# Output the result
print("The sum of all the numbers is .",total_sum)
