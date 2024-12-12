# number=[]
# print("enter the 20 number:")
# for i in range(1,21):
#     num=int(input())
#     # inserting
#     number.append(num)
# print("---------------------------")
# for number in number:
#     if number%2==0:
#     print("even number",number)


# Get 20 numbers from the user
numbers = []
print("Enter 20 numbers:")
for _ in range(20):
    num = int(input())
    numbers.append(num)

# Filter and print even numbers
even_numbers = [num for num in numbers if num % 2 == 0]
print("Even numbe
