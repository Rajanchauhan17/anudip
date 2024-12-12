def hcf(x, y):
    if y == 0:  
        return x  
    return hcf(y, x % y)  

#  Take input
num1 = int(input("Enter the first number: "))
num2 = int(input("Enter the second number: "))

#  Call the function
HCF = hcf(num1, num2)

# Step 5: Print the result
print("The HCF is",HCF)
