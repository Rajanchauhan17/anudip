# Function to check if a number is prime
def is_prime(num):
    if num <= 1:
        return False  #NOT PRIMR 
    if num == 2:  #SMALLEST PRIME NUMBER
        return True
    if num % 2 == 0:  
        return False #CHECK CONDITION 
    for i in range(3, num, 2):
        if num % i == 0:
            return False   
    return True

# Input from the user
number = int(input("Enter a number: "))

# Check if the number is prime and print the result
if is_prime(number):
    print(f"{number} is a prime number.")
else:
    print(f"{number} is not a prime number.")
