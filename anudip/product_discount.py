# Input from the user
product_code = int(input("Enter the product code (1 for Battery Based Toys, 2 for Key-based Toys, 3 for Electrical Charging Based Toys): "))
order_amount = float(input("Enter the order amount in Rs: "))

# Initialize the discount to 0
discount = 0

# Determine the discount based on the product code and order amount
if product_code == 1 and order_amount > 1000:
    discount = 0.10  # 10% discount for battery-based toys if order is more than Rs. 1000
elif product_code == 2 and order_amount > 100:
    discount = 0.05  # 5% discount for key-based toys if order is more than Rs. 100
elif product_code == 3 and order_amount > 500:
    discount = 0.10  # 10% discount for electrical charging based toys if order is more than Rs. 500

# Calculate the net amount after discount
net_amount = order_amount - (order_amount * discount)

print(f"The net amount to be paid after the discount is: Rs. {net_amount:.2f}")
